LongListRows = require('./libs/long-list-rows.coffee')
LinkedList   = require('./libs/linked-list.coffee')
expect       = require('chai').expect



module.exports = class RowControler

    constructor : (viewportElement) ->

        ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * INITIALISATION OF THE LONG LIST
        ###

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
            BUFFER_COEF       : 3

            # number of "screens" before and after the viewport corresponding to
            # the safe zone. The Safe Zone is the rows where viewport can go
            # without trigering the movement of the buffer.
            # Must be smaller than BUFFER_COEF
            SAFE_ZONE_COEF    : 2

            # minimum duration between two refresh after scroll (ms)
            THROTTLE          : 20

            # max number of viewport height by seconds : beyond this speed the
            # refresh is delayed to the nex throttle
            MAX_SPEED         : 1.5

            # call back in charge of the creation of the content of a row.
            # You can keep some references on the element to some of its
            # children in order to have a direct access to them when onRowsMovedCB
            # will be called on the element.
            onRowsCreatedCB   : (rowsToCreate)=>
                rowsList = @rowsList
                for row in rowsToCreate
                    rowTxt = rowsList.at(row.rank).data
                    row.el.innerHTML = """<div class="largest-col">#{rowTxt}</div><div class="constant-col">current rank: #{row.rank}</div>"""
                    row.el.components =
                        rowTxt : row.el.firstChild
                        rowRk  : row.el.lastChild
                    checkIfSelected(row.el)
                return true

            # the call back in charge of decorating the rows when they are moved
            # in the long list.
            # rowsToDecorate = [{rank:Integer,el:Element}...]
            onRowsMovedCB     : (rowsToDecorate)=>
                rowsList = @rowsList
                for row in rowsToDecorate
                    rowTxt = rowsList.at(row.rank).data # expensive
                    #
                    # option 1 : recreate the full content of the row :
                    # row.el.innerHTML = """<div class="largest-col">#{rowTxt}</div><div class="constant-col">current rank: #{row.rank}</div>"""
                    #
                    # option 2 : use the references to its children to modify what
                    # must be redecorated. The more complex is your row, the more
                    # usefull it will be. Here the gain of speed is around 3%, not
                    # huge.
                    components = row.el.components
                    components.rowTxt.textContent = rowTxt
                    components.rowRk.textContent  = "current rank: #{row.rank}"

                    checkIfSelected(row.el)
                return true

        ###*
         * longList creation and initialization
        ###
        @longList = new LongListRows(viewportElement, options)
        @_test = @longList._test



        ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * listeners of rows clicks
        ###

        @selectedRows = {}

        onRowClick = (e) =>
            row$ = $(e.target).parent('.long-list-row')[0]
            if row$ == undefined
                return
            @toggleRow$(row$)

        @toggleRow$ = (row$)->
            row = @rowsList.at(row$.dataset.rank)
            rowID = row.id
            if @selectedRows[rowID]
                row$.classList.remove('selected')
                @selectedRows[rowID] = false
            else
                row$.classList.add('selected')
                @selectedRows[rowID] = row

        checkIfSelected = (row$) =>
            rowID = @rowsList.at(row$.dataset.rank).id
            if @selectedRows[rowID]
                row$.classList.add('selected')
            else
                row$.classList.remove('selected')

        viewportElement.addEventListener('click', onRowClick)




    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * PUBLIC METHODS
     * In charge of manipulating data and the longList
    ###

    ###*
     * Prepare the list of data for each row (for tests)
     * It is a double linked list
    ###
    init: (nbRowsToIni)->
        @selectedRows = {}
        @_initRowsList(nbRowsToIni)
        @longList.initRows(nbRowsToIni)


    _initRowsList: (nRows) ->
        rowsList = new LinkedList()
        for rk in [0..nRows-1] by 1
            row = rowsList.append ''
            row.data = "row: id_#{row.id}"
        @rowsList = rowsList


    resize: () ->
        @longList.resizeHandler()


    goDownHalfBuffer: (coef)->
        @longList._test.goDownHalfBuffer(coef)


    goUpHalfBuffer: (coef)->
        @longList._test.goUpHalfBuffer(coef)


    addRow : (rankToAdd)->
        # 1- add the row from the data
        # ! note : data must be updated before acting on the long list
        # because the data must be uptodate when redecoration will occur.
        row = @rowsList.insert(rankToAdd, '')
        row.data = "row: id_#{row.id}"
        # 2- delete the row from the long list
        @longList.addRow(rankToAdd)
        # 3- update the rows rank. In deed, the rows redecorated are not the
        # only ones to be impacted. All the raws after the first added
        # have their rank modified. If their state depends on the rank,
        # it must then be adapted.
        rowsToReRanked = @longList.getRowsAfter(rankToAdd)
        for row in rowsToReRanked
            row.el.lastChild.innerHTML = "current rank: #{row.rank}"


    removeRows: (rankToDelete, nToDelete) ->
        # 1- remove the row from the data
        # ! note : data must be updated before acting on the long list
        # because the data must be uptodate when redecoration will occur.
        index = nToDelete
        while index--
            @rowsList.remove(rankToDelete)
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
            row.el.lastChild.innerHTML = "current rank: #{row.rank}"


    removeAllRows: () ->
        # 1- reinit data
        # ! note : data must be updated before acting on the long list
        # because the data must be uptodate when redecoration will occur.
        @rowsList = new LinkedList()
        @selectedRows = {}
        # 2- delete all the rows from the long list
        @longList.removeAllRows()


    addRowAfterSelected: ()->
        selectedRows = @selectedRows
        rowsList = @rowsList
        rows = []
        # 1- get an array of the selected rows
        for rowID, row of selectedRows
            rowID = parseInt(rowID)
            continue if !selectedRows[rowID]
            rows.push row

        # 2- add each row
        smallestRank = Infinity
        for row in rows
            rank = rowsList.rank(row)
            smallestRank = Math.min(smallestRank, rank)
            # a- update the data (always before the longList)
            # ! note : data must be updated before acting on the long list
            # because the data must be uptodate when redecoration will occur.
            newRow = rowsList.insert(rank+1,'')
            newRow.data = "row: id_#{newRow.id}"
            # b- modify the longList
            @longList.addRow(rank+1)
            # c- update the rows rank. In deed, the rows redecorated are not the
            # only ones to be impacted. All the raws after the first deleted have
            # their rank modified. If their state depends on the rank, it must then
            # be adapted.
            rowsToReRanked = @longList.getRowsAfter(smallestRank+1)
            for row in rowsToReRanked
                row.el.lastChild.innerHTML = "current rank: #{row.rank}"
        return


    addRowAtRk: (rank)->
        # a- update the data (always before the longList)
        # ! note : data must be updated before acting on the long list
        # because the data must be uptodate when redecoration will occur.
        newRow = @rowsList.insert(rank,'')
        newRow.data = "row: id_#{newRow.id}"
        # b- modify the longList
        @longList.addRow(rank)
        # c- update the rows rank. In deed, the rows redecorated are not the
        # only ones to be impacted. All the raws after the first deleted have
        # their rank modified. If their state depends on the rank, it must then
        # be adapted.
        rowsToReRanked = @longList.getRowsAfter(rank)
        for row in rowsToReRanked
            row.el.lastChild.innerHTML = "current rank: #{row.rank}"

        return


    getDataAtRank: (rank)->
        return @rowsList.at(rank).data


    getRowElementAt: (rank)->
        return @longList.getRowElementAt(rank)


    deleteSelected: ()->
        selectedRows = @selectedRows
        rowsList = @rowsList
        console.log selectedRows
        smallestRank = Infinity
        for rowID, row of selectedRows
            rowID = parseInt(rowID)
            console.log row
            continue if !selectedRows[rowID]
            # update data (always before to modify the longList)
            rank = rowsList.rank(row)
            rowsList.removeID(row.id)
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
            row.el.lastChild.innerHTML = "current rank: #{row.rank}"

        return


    deleteAll: ()->
        @rowsList = new LinkedList()
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
        longList     = @longList
        rowsList     = @rowsList
        selectedRows = @selectedRows

        state = longList._test.getState()
        {buffer, rows$, viewport$} = longList._test.getInternals()

        ##
        # Test the number of elements in rows$
        nElements = rows$.children.length
        expectedLength = rowsList.size()
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
        expect(dim.height)
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
        dataRow   = rowsList.at(currentRk)
        domRow$   = rows$.firstChild
        rowID     = dataRow.id
        loop
            expect(bufferRow.rank)
                .to.eql(currentRk)
            expect(parseInt(domRow$.dataset.rank))
                .to.eql(currentRk)
            expect(domRow$)
                .to.eql(bufferRow.el)
            expect(parseInt(domRow$.dataset.rank))
                .to.eql(bufferRow.rank)
            expect(dataRow.data)
                .to.eql(domRow$.firstChild.textContent)
            expect('row: id_' + dataRow.id)
                .to.eql(domRow$.firstChild.textContent)
            expect('current rank: ' + currentRk)
                .to.eql(domRow$.lastChild.textContent)
            if domRow$.classList.contains('selected')
                selRow = selectedRows[rowID]
                expect(selRow).to.not.be.undefined
                expect(selRow.id).to.eql(parseInt(domRow$.dataset.rank))
            else
                expect(selectedRows[rowID]?).to.eql(false)
            # go to to next row
            bufferRow  = bufferRow.prev
            break if bufferRow == buffer.first
            currentRk += 1
            dataRow    = rowsList.at(currentRk)
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
        idDecoration = row$.firstChild.textContent
        rkDecoration = row$.lastChild.textContent
        row = @rowsList.at(rank)
        expect(idDecoration).to.eql(row.data)
        expect(rkDecoration).to.eql("current rank: #{rank}")
