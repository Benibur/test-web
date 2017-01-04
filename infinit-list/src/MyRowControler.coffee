LongListRows = require('./libs/long-list-rows.coffee')
LinkedList   = require('./libs/linked-list.coffee')
require('chai')
expect       = require('chai').expect



################################################################################
# This class controls the data of the long list of rows
# The data are stored in
#    - a linked list : rowsModelsList
#    - composed of rowModels {id, data}
#    - a dictionnary for selected rows : selectedRows {rowID : row}
# We store the selected rows no directly in the data of the rowModel because :
#    - this data is a context that would not be stored
#    - it is quicker to ckeck if a row is selected or not.
# but we could have stored this context in the rowModels of the linkedlist.
#
################################################################################

module.exports = class MyRowControler

    constructor : (viewportElement) ->

        ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * INITIALISATION OF THE LONG LIST
        ###

        # Call back in charge of the creation of the content of a row.
        # @param
        #    rowsToCreate : [ {rank:Integer, el:Element} , ... ]
        onRowsCreatedCB  = (rowsToCreate)=>
            rowsModelsList = @rowsModelsList
            for row in rowsToCreate
                rowIdTxt = rowsModelsList.at(row.rank).data
                row.el.innerHTML = """
                    <input type='checkbox'>
                    <span class='rank-col'></span>
                    <span class='id-col'></span>
                    <input type="text" class='input-col'></input>
                    <span class='status'></span>
                    """
                # in the row html element we keep some references to the inner
                # elements in order to update them more quickly .
                components = {}
                children = row.el.children
                components.checkbox = children[0]
                components.rowRk    = children[1]
                components.rowIdTxt = children[2]
                components.rowInput= children[3]
                components.rowStatus= children[4]
                row.el.components = components
                updateRowDecoration(row.el)
            return true

        # Call back in charge of decorating the rows when they are moved
        # in the long list.
        # rowsToDecorate = [{rank:Integer,el:Element}...]
        onRowsMovedCB = (rowsToDecorate) =>
            for row in rowsToDecorate
                rowIdTxt = @rowsModelsList.at(row.rank).data # expensive
                #
                # option 1 : recreate the full content of the row :
                updateRowDecoration(row.el)

                # option 2 : use the references to its children to modify what
                # must be redecorated. The more complex is your row, the more
                # usefull it will be. Here the gain of speed is around 3%, not
                # huge.
                # updateRowRankDecoration(row.el)

            return true

        # in charge to rederocate a row that has been moved when scrolling
        # the long (row reuse) or when a data has changed
        # @param
        #    row$ : {HTML element} : the element of the row where row$.dataset.rank
        #           is always uptodate (that is the way to know)
        updateRowDecoration = (row$) =>
            rank = row$.dataset.rank
            rowModel = @rowsModelsList.at(rank)
            id = rowModel.id
            components = row$.components
            if @selectedRows[id]
                row$.classList.add('selected')
                components.checkbox.checked = true
                components.rowStatus.textContent = 'Selected'
            else
                row$.classList.remove('selected')
                components.checkbox.checked = false
                components.rowStatus.textContent = ''
            if rank%2 == 0
                row$.classList.add('even')
            else
                row$.classList.remove('even')
            components.rowRk.textContent = 'rank: ' + rank
            components.rowIdTxt.textContent = 'ID: ' + id
            components.rowInput.value = rowModel.data


        @updateRowDecoration = updateRowDecoration


        ###*
         * Options for the long list
        ###
        options =
            # unit used for the dimensions (px,em or rem)
            DIMENSIONS_UNIT   : 'em'

            # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
            ROW_HEIGHT        : 2

            # number of "screens" before and after the viewport
            # (ex : 1.5 => 1+2*1.5=4 screens always ready)
            BUFFER_COEF       : 0.2

            # number of "screens" before and after the viewport corresponding to
            # the safe zone. The Safe Zone is the rows where viewport can go
            # without trigering the movement of the buffer.
            # Must be smaller than BUFFER_COEF
            SAFE_ZONE_COEF    : 2

            # minimum duration between two refresh after scroll (ms)
            THROTTLE          : 20

            # max number of viewport height by seconds : beyond this speed the
            # refresh is delayed to the nex throttle
            MAX_SPEED         : 2

            # call back in charge of the creation of the content of a row.
            onRowsCreatedCB   : onRowsCreatedCB

            # the call back in charge of decorating the rows when they are moved
            # in the long list.
            onRowsMovedCB     : onRowsMovedCB

        ###*
         * longList creation and initialization
        ###
        @longList = new LongListRows(viewportElement, options)
        @_test = @longList._test



        ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Listeners of rows events
        ###

        onRowChange = (e) =>
            console.log 'onRowChange'
            row$ = $(e.target).parent('.long-list-row')[0]
            if row$ == undefined # click outside a row
                return
            if e.target.type == 'checkbox'
                @toggleRow$(row$)
            else if e.target.type == 'text'
                @updateRowModel(row$, e.target.value)

        @toggleRow$ = (row$)->
            rowModel = @rowsModelsList.at(row$.dataset.rank)
            rowID = rowModel.id
            if @selectedRows[rowID]
                @selectedRows[rowID] = false
                updateRowDecoration(row$)
            else
                @selectedRows[rowID] = rowModel
                updateRowDecoration(row$)

        @updateRowModel = (row$, val) ->
            rowModel = @rowsModelsList.at(row$.dataset.rank)
            rowModel.data = val

        # click events are catched at the viewportElement level instead of doing it at the level of each row, it is more efficient that attaching a listener on each row
        viewportElement.addEventListener('change', onRowChange)




    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * PUBLIC METHODS
     * In charge of manipulating data and the longList
    ###

    ###*
     * Prepare the list of data for each row (for tests)
     * It is a double linked list
    ###
    init: (nbRowsToInit)->
        @selectedRows = {}
        rowsModelsList = new LinkedList()
        for rk in [0..nbRowsToInit-1] by 1
            rowModel = rowsModelsList.append ''
            rowModel.data = "row: id_#{rowModel.id}"
        @rowsModelsList = rowsModelsList
        @longList.initRows(nbRowsToInit)


    resize: () ->
        @longList.resizeHandler()


    goDownHalfBuffer: (coef)->
        @longList._test.goDownHalfBuffer(coef)


    goUpHalfBuffer: (coef)->
        @longList._test.goUpHalfBuffer(coef)


    removeRows: (rankToDelete, nToDelete) ->
        # 1- remove the row from the data
        # ! note : data must be updated before acting on the long list
        # because the data must be uptodate when redecoration will occur.
        index = nToDelete
        while index--
            @rowsModelsList.remove(rankToDelete)
        index = nToDelete
        while index--
            if @selectedRows[rankToDelete+index]
                @selectedRows[rankToDelete+index] = false
        # 2- delete the rows from the long list
        @longList.removeRows(rankToDelete, nToDelete)
        # 3- update the rows rank. In deed, the rows redecorated are not the
        # only ones to be impacted. All the raws after the first deleted
        # have their rank modified. If their state depends on the rank, it
        # must then be adapted.
        rowsToReRanked = @longList.getRowsAfter(rankToDelete)
        for row in rowsToReRanked
            @updateRowDecoration(row.el)


    removeAllRows: () ->
        # 1- reinit data
        # ! note : data must be updated before acting on the long list
        # because the data must be uptodate when redecoration will occur.
        @rowsModelsList = new LinkedList()
        @selectedRows = {}
        # 2- delete all the rows from the long list
        @longList.removeAllRows()


    addRowAfterSelected: ()->
        selectedRows = @selectedRows
        rowsModelsList = @rowsModelsList
        rows = []
        # 1- get an array of the selected rows
        for rowID, row of selectedRows
            rowID = parseInt(rowID)
            continue if !selectedRows[rowID]
            rows.push row

        # 2- add each row
        smallestRank = Infinity
        for row in rows
            rank = rowsModelsList.rank(row)
            smallestRank = Math.min(smallestRank, rank)
            # a- update the data (always before the longList)
            # ! note : data must be updated before acting on the long list
            # because the data must be uptodate when redecoration will occur.
            newRowModel = rowsModelsList.insert(rank+1,'')
            newRowModel.data = "row: id_#{newRowModel.id}"
            # b- modify the longList
            @longList.addRow(rank+1)
            # c- update the rows rank. In deed, the rows redecorated are not the
            # only ones to be impacted. All the raws after the first deleted have
            # their rank modified. If their state depends on the rank, it must then
            # be adapted.
            rowsToReRanked = @longList.getRowsAfter(smallestRank+2)
            for row in rowsToReRanked
                @updateRowDecoration(row.el)
        return


    addRowAtRk: (rank)->
        # a- update the data (always before the longList)
        # ! note : data must be updated before acting on the long list
        # because the data must be uptodate when redecoration will occur.
        newRowModel = @rowsModelsList.insert(rank,'')
        newRowModel.data = "row: id_#{newRowModel.id}"
        # b- modify the longList
        @longList.addRow(rank)
        # c- update the rows rank. In deed, the rows redecorated are not the
        # only ones to be impacted. All the raws after the first deleted have
        # their rank modified. If their state depends on the rank, it must then
        # be adapted.
        rowsToReRanked = @longList.getRowsAfter(rank+1)
        for row in rowsToReRanked
            @updateRowDecoration(row.el)

        return


    getDataAtRank: (rank)->
        return @rowsModelsList.at(rank).data


    getRowElementAt: (rank)->
        return @longList.getRowElementAt(rank)


    deleteSelected: ()->
        selectedRows = @selectedRows
        rowsModelsList = @rowsModelsList
        console.log selectedRows
        smallestRank = Infinity
        for rowID, rowModel of selectedRows
            rowID = parseInt(rowID)
            console.log 'row to delete = ' + rowModel
            continue if !selectedRows[rowID]
            # update data (always before to modify the longList)
            rank = rowsModelsList.rank(rowModel)
            rowsModelsList.removeID(rowModel.id)
            row$ = selectedRows[rowID]
            smallestRank = Math.min(smallestRank, rank)
            selectedRows[rowID] = false
            # modify the longList
            @longList.removeRows(rank,1)
        # update the rows rank. In deed, the rows redecorated are not the
        # only ones to be impacted. All the raws after the first deleted have
        # their rank modified. If their state depends on the rank, it must then
        # be adapted.
        rowsToReRanked = @longList.getRowsAfter(smallestRank)
        for row in rowsToReRanked
            @updateRowDecoration(row.el)

        return


    deleteAll: ()->
        @rowsModelsList = new LinkedList()
        @longList.removeAllRows()
        @selectedRows = {}


    unActivateScrollListener: ()->
        @longList._test.unActivateScrollListener()


    activateScrollListener: ()->
        @longList._test.activateScrollListener()




    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * helpers for tests and debug
    ###

    ###*
        Will check that the state of the longList (buffer, nRows,
        positions...) is consistent.
    ###
    testLongListConsistency : () ->
        longList       = @longList
        rowsModelsList = @rowsModelsList
        selectedRows   = @selectedRows

        state = longList._test.getState()
        {buffer, rows$, viewport$} = longList._test.getInternals()

        ##
        # Test the number of elements in rows$
        nElements = rows$.children.length
        expectedLength = rowsModelsList.size()
        expect(expectedLength)
            .to.eql(state.nRows)
        if state.nMaxRowsInBufr < expectedLength
            expect(rows$.children.length)
                .to.eql(state.nMaxRowsInBufr)
        else
            expect(rows$.children.length)
                .to.eql(expectedLength)

        ##
        # Test the height of rows$
        dim = rows$.getBoundingClientRect()
        expect(Math.round(dim.height))
            .to.eql(expectedLength * state.rowHeight)

        ##
        # test the position of the first row of the buffer
        if expectedLength == 0
            expect(parseInt(rows$.style.paddingTop))
                .to.eql(0)
        else
            expect(parseInt(rows$.style.paddingTop))
                .to.eql(buffer.firstRk * state.rowHeight)

        ##
        # test the buffer if there is no row
        if expectedLength == 0
            expect(buffer.firstRk)
                .to.eql(-1)
            expect(buffer.lastRk)
                .to.eql(-1)
            expect(buffer.first)
                .to.eql(null)
            expect(buffer.last)
                .to.eql(null)
            return

        ##
        # Otherwise test each row of the buffer
        currentRk = buffer.firstRk
        bufferRow = buffer.first
        dataRow   = rowsModelsList.at(currentRk)
        domRow$   = rows$.firstChild
        rowID     = dataRow.id
        loop
            @testDecorationOfRow(currentRk)
            expect(bufferRow.rank)
                .to.eql(currentRk)
            expect(parseInt(domRow$.dataset.rank))
                .to.eql(currentRk)
            expect(domRow$)
                .to.eql(bufferRow.el)
            expect(parseInt(domRow$.dataset.rank))
                .to.eql(bufferRow.rank)
            expect(dataRow.data)
                .to.eql(domRow$.children[3].value)
            expect('row: id_' + dataRow.id)
                .to.eql(domRow$.children[3].value)
            expect('rank: ' + currentRk)
                .to.eql(domRow$.children[1].textContent)
            if domRow$.classList.contains('selected')
                selRow = selectedRows[rowID]
                expect(selRow).to.not.be.undefined
                rowModel = rowsModelsList.at(parseInt(domRow$.dataset.rank))
                expect(selRow).to.equal(rowModel) # BJA BUG
            else
                expect(selectedRows[rowID]?).to.eql(false)
            # go to to next row
            bufferRow  = bufferRow.prev
            break if bufferRow == buffer.first
            currentRk += 1
            dataRow    = rowsModelsList.at(currentRk)
            domRow$    = domRow$.nextElementSibling
            rowID      = dataRow.id
        expect(buffer.lastRk).to.eql(currentRk)
        expect(buffer.lastRk - buffer.firstRk + 1)
            .to.eql(buffer.nRows)

    ###*
        Test that the element of a row displays what it should
    ###
    testDecorationOfRow : (rank)->
        row$ = @longList.getRowElementAt(rank)
        idDecoration = row$.components.rowIdTxt.textContent
        rkDecoration = row$.components.rowRk.textContent
        rowModel = @rowsModelsList.at(rank)
        expect(rkDecoration).to.eql("rank: #{rank}")
        expect(idDecoration).to.eql("ID: #{rowModel.id}")
        isChecked = @selectedRows[rowModel.id]
        if isChecked
            expect(row$.firstChild.checked).to.eql(true)
            expect(row$.classList.contains('selected')).to.eql(true)
        else
            expect(row$.firstChild.checked).to.eql(false)
            expect(row$.classList.contains('selected')).to.eql(false)
        inputDecoration = row$.components.rowInput.value
        expect(rowModel.data).to.eql(inputDecoration)
