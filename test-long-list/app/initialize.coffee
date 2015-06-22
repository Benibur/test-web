LongListRows = require('long-list-rows')
LinkedList   = require('linked-list')

mocha.setup('bdd')
expect = chai.expect

###*
 * PARAMETERS
###
LONG_LIST_LENGTH = 100000

###*
 * prepare the list of data for each row (for tests)
 * It is a double linked list
###

rowsList = null
initRowsList = (nRows) ->
    rowsList = new LinkedList()
    for rk in [0..nRows-1] by 1
        row = rowsList.append ''
        row.data = "row: id_#{row.id}"




# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    body = document.querySelector('body')
    body.innerHTML = require('body')()
    container = body.querySelector('.resizedContainer')


    ###*
     * the element in the dom in which the long list will be.
     * This element must be sized (here the element has a position:absolute and
     * its top, bottom, right and left are fixed in the css)
    ###
    viewportElement = $('.longListViewport')[0] # the viewport element


    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * listeners of rows clicks
    ###

    selectedRows = {}

    onRowClick = (e) ->
        row$ = $(e.target).parent('.long-list-row')[0]
        if row$ == undefined
            return
        toggleRow$(row$)

    toggleRow$ = (row$)->
        row = rowsList.at(row$.dataset.rank)
        rowID = row.id
        if selectedRows[rowID]
            row$.classList.remove('selected')
            selectedRows[rowID] = false
        else
            row$.classList.add('selected')
            selectedRows[rowID] = row

    checkIfSelected = (row$) ->
        rowID = rowsList.at(row$.dataset.rank).id
        if selectedRows[rowID]
            row$.classList.add('selected')
        else
            row$.classList.remove('selected')


    viewportElement.addEventListener('click', onRowClick)


    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * initialization of the long list
    ###

    ###*
     * the call back in charge of decorating the rows when they are moved in the
     * long list.
     * rowsToDecorate = [{rank:Integer,el:Element}...]
    ###
    onRowsMovedCB = (rowsToDecorate)->
        for row in rowsToDecorate
            rowTxt = rowsList.at(row.rank).data
            row.el.innerHTML = """<div class="largest-col">#{rowTxt}</div><div class="constant-col">current rank: #{row.rank}</div>"""
            checkIfSelected(row.el)
        return true


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

        onRowsMovedCB    : onRowsMovedCB

        # onRanksModifiedCB : (rowsToRanked)->
        #     for row in rowsToRanked
        #         row.el.lastChild.innerHTML = "current rank: #{row.rank}"
        #     return true

    ###*
     * longList creation and initialization
    ###
    longList = new LongListRows(viewportElement, options)






    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * helpers for tests and debug
    ###

    ###*
     * boutons
    ###

    document.querySelector('.initBtn')
    .addEventListener 'click', () ->
        nbRowsToIni = parseInt(document.querySelector('.nbRowsToIni').value)
        initRowsList(nbRowsToIni)
        longList.initRows(nbRowsToIni)

    document.querySelector('.goDownBtn')
    .addEventListener 'click', () ->
        longList._test.goDownHalfBuffer(1.5)


    document.querySelector('.goUpBtn')
    .addEventListener 'click', () ->
        longList._test.goUpHalfBuffer(1.5)


    document.querySelector('.deleteBtn')
    .addEventListener 'click', () ->
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
            longList.removeRows(rank,1)
        # update the rows rank. In deed, the rows redecorated are not the
        # only ones to be impacted. All the raws after the first deleted have
        # their rank modified. If their state depends on the rank, it must then
        # be adapted.
        rowsToReRanked = longList.getRowsAfter(smallestRank)
        for row in rowsToReRanked
            row.el.lastChild.innerHTML = "current rank: #{row.rank}"

        return


    document.querySelector('.deleteAllBtn')
    .addEventListener 'click', () ->
        rowsList = new LinkedList()
        longList.removeAllRows()


    document.querySelector('.unActivateBtn')
    .addEventListener 'click', () ->
        longList._test.unActivateScrollListener()


    consistencyResult$ = document.querySelector('.consistencyResult')
    document.querySelector('.testLongListBtn')
    .addEventListener 'click', () ->
        isOk = true
        try
            testLongList()
        catch err
            isOk = false
            console.log err
        if isOk
            consistencyResult$.textContent = 'Consistency OK'
            consistencyResult$.classList.remove('alert')
        else
            consistencyResult$.textContent = 'Consistency NOK'
            consistencyResult$.classList.add('alert')




    # setTimeout( () ->
    #     longList._test.goDownHalfBuffer(0.7)
    # , 20  )

    # setTimeout( () ->
    #     longList._test.goUpHalfBuffer(0.7)
    # , 1000  )

    # setTimeout( () ->
    #     longList._test.goDownHalfBuffer(0.7)
    # , 2000  )

    testLongList = () ->
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
                expect(selectedRows[rowID]).to.eql(domRow$)
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
     * var for tests wich need to have the same number of rows as the buffer.
    ###
    BUFFER_LIST_LENGTH = 105
    SHORT_LIST_LENGTH  = 103

    describe '4 - Long list tests (100 000 rows) - addRows()', () ->


        describe '4.1 - add a row, in the buffer, in viewport.', () ->

            # variables
            nRows4Test = nToAdd = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                initRowsList(nRows4Test)
                longList.initRows(nRows4Test)
                selectedRows = {}
                # 1- goDown but not enought to have rows above the buffer
                longList._test.goDownHalfBuffer(0)
                # 2- get initial state
                stateInitial = longList._test.getState()
                initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
                # 3- set the row to add
                rankToAdd = 2
                nToAdd    = 1
                # 4- add the row(s) from the data
                # ! note : data must be updated before acting on the long list
                # because the data must be uptodate when redecoration will occur.
                row = rowsList.insert(rankToAdd, '')
                row.data = "row: id_#{row.id}"
                # 5- delete the row from the long list
                longList.addRows(rankToAdd, nToAdd)
                # 6- update the rows rank. In deed, the rows redecorated are not the
                # only ones to be impacted. All the raws after the first added
                # have their rank modified. If their state depends on the rank,
                # it must then be adapted.
                rowsToReRanked = longList.getRowsAfter(rankToAdd)
                for row in rowsToReRanked
                    row.el.lastChild.innerHTML = "current rank: #{row.rank}"
                # 7- tests
                stateFinal = longList._test.getState()

            it 'the initial state should be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.true

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.true

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + nToAdd)

            it 'the bufffer should start at rank 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have the same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows )
                    .to.eql(stateInitial.buffer.nRows )

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test-nToAdd))

            it 'the final state should be consistant', () ->
                testLongList()


    # describe '1 - Long list tests (100 000 rows) - removeRow()', () ->

    #     describe '1.1 - Single deletion of a row before buffer', () ->
    #         # variables
    #         stateFinal = stateInitial = initialFirstVisibleRow = null
    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- select the third row
    #             rankToDelete = 2
    #             row$ = longList.getRowElementAt(rankToDelete)
    #             toggleRow$(row$)
    #             # 2- goDown so that the row is before the buffer
    #             longList._test.goDownHalfBuffer(1.7)
    #             # 3- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 4- remove the row from the data
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete] = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, 1)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()
    #             return

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-1)

    #         it 'the bufffer should start one rank earlier', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk - 1)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-1))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.2 - Deletion of two rows before the buffer', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- select the third row
    #             rankToDelete = 2
    #             nToDelete    = 2
    #             row$ = longList.getRowElementAt(rankToDelete)
    #             toggleRow$(row$)
    #             # 2- goDown so that the row is before the buffer
    #             longList._test.goDownHalfBuffer(1.7)
    #             # 3- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete] = false
    #             if selectedRows[rankToDelete+1]
    #                 selectedRows[rankToDelete+1] = false
    #             # 5- delete the 2 rows from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have two rows less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start two ranks earlier', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 2 rows\' height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.3 - Single row deletion in the buffer, before viewport', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown to have some rows above the buffer
    #             longList._test.goDownHalfBuffer(1.7)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.buffer.firstRk + 2
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start one rank earlier', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.4 - Single row deletion in the buffer, first row of the buffer.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown to have some rows above the buffer
    #             longList._test.goDownHalfBuffer(1.7)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.buffer.firstRk + 0
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start one rank earlier', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.4.1 - Single row deletion in the buffer, first row of the viewport.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown to have some rows above the buffer
    #             longList._test.goDownHalfBuffer(1.7)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.viewport.firstRk
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start one rank earlier', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should not be the same after deletion
    #         (visible rows should remain the same, except the deleted one...)', () ->
    #             finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).not.to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.5 - Single row deletion in the buffer, last row of the buffer.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown to have some rows above the buffer
    #             longList._test.goDownHalfBuffer(1.7)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.buffer.lastRk
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start one rank earlier', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.6 - Single row deletion in the buffer, but with no row before the buffer, but some after it.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = 2
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start at the same rank', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.7 - Deletion of the first row, with no row before the buffer
    #     , but some after it.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = 0
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start at the same rank', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.8 - Deletion of the last row of the buffer, with no row
    #      before the buffer, but some after it.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.buffer.lastRk
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start at the same rank', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.9 - Single row deletion in the buffer, in the viewport.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             BUFFER_LIST_LENGTH = stateInitial.nMaxRowsInBufr
    #             SHORT_LIST_LENGTH = BUFFER_LIST_LENGTH - 2
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.viewport.firstRk + 2
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(LONG_LIST_LENGTH-nToDelete)

    #         it 'the bufffer should start at the same rank', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.firstRk)

    #         it 'the bufffer should be the same length', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '1.10 - Deletion of all rows.', () ->

    #         # variables
    #         nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             initRowsList(LONG_LIST_LENGTH)
    #             longList.initRows(LONG_LIST_LENGTH)
    #             selectedRows = {}
    #             # 1- goDown
    #             longList._test.goDownHalfBuffer(1.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             BUFFER_LIST_LENGTH = stateInitial.nMaxRowsInBufr
    #             SHORT_LIST_LENGTH = BUFFER_LIST_LENGTH - 2
    #             # 3- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList = new LinkedList()
    #             selectedRows = {}
    #             # 4- delete the row from the long list
    #             longList.removeAllRows()
    #             # 5- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(0)

    #         it 'the bufffer should start at -1', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(-1)

    #         it 'the bufffer should be empty', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(0)

    #         it 'the height of the list should 0', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(0)

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    # describe '2 - Short list tests (less than in the buffer)', () ->

    #     describe '2.1 - nRows < nMaxRowsInBufr : Single row deletion in the middle of the buffer.', () ->

    #         # variables
    #         nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             nRows4Test = SHORT_LIST_LENGTH
    #             initRowsList(nRows4Test)
    #             longList.initRows(nRows4Test)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.viewport.firstRk + 2
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(nRows4Test-nToDelete)

    #         it 'the bufffer should start at rank 0', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(0)

    #         it 'the bufffer should have one row less', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk - 1 )

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '2.2 - nRows < nMaxRowsInBufr : deletion of the first row of the buffer.', () ->

    #         # variables
    #         nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             nRows4Test = SHORT_LIST_LENGTH
    #             initRowsList(nRows4Test)
    #             longList.initRows(nRows4Test)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = 0
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(nRows4Test-nToDelete)

    #         it 'the bufffer should start at rank 0', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(0)

    #         it 'the bufffer should have one row less', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk - 1 )

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '2.3 - nRows < nMaxRowsInBufr : deletion of the last row of the buffer.', () ->

    #         # variables
    #         nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             nRows4Test = SHORT_LIST_LENGTH
    #             initRowsList(nRows4Test)
    #             longList.initRows(nRows4Test)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = nRows4Test - 1
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the initial state should not be dynamic', () ->
    #             expect(stateInitial.isDynamic).to.not.be.true

    #         it 'the final state should be static', () ->
    #             expect(stateFinal.isDynamic).to.not.be.true

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(nRows4Test-nToDelete)

    #         it 'the bufffer should start at rank 0', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(0)

    #         it 'the bufffer should have one row less', () ->
    #             expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #                 .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk - 1 )

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    # describe '3 - List with on more row than in the buffer (remove one => isDynamic == false)', () ->

    #     describe '3.1 -  nRows = nMaxRowsInBufr + 1 : Single row deletion, in the buffer.', () ->

    #         # variables
    #         nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             nRows4Test = BUFFER_LIST_LENGTH + 1
    #             initRowsList(nRows4Test)
    #             longList.initRows(nRows4Test)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = stateInitial.viewport.firstRk + 2
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the initial state should be dynamic', () ->
    #             expect(stateInitial.isDynamic).to.be.true

    #         it 'the final state should be static', () ->
    #             expect(stateFinal.isDynamic).to.not.be.true

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(nRows4Test-nToDelete)

    #         it 'the bufffer should start at rank 0', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(0)

    #         it 'the bufffer should have the same length', () ->
    #             final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
    #             expect(final_nRows )
    #                 .to.eql(stateInitial.buffer.nRows )

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()



    #     describe '3.2 - nMaxRowsInBufr + 1 = nRows : last row deletion, out of the buffer.', () ->

    #         # variables
    #         nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #         # actions to test
    #         before () ->
    #             # 0- init the long list and its data
    #             nRows4Test = BUFFER_LIST_LENGTH + 1
    #             initRowsList(nRows4Test)
    #             longList.initRows(nRows4Test)
    #             selectedRows = {}
    #             # 1- goDown but not enought to have rows above the buffer
    #             longList._test.goDownHalfBuffer(0.1)
    #             # 2- get initial state
    #             stateInitial = longList._test.getState()
    #             initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #             # 3- set the row to delete
    #             rankToDelete = nRows4Test - 1
    #             nToDelete    = 1
    #             # 4- remove the row from the data
    #             # ! note : data must be updated before acting on the long list
    #             # because the data must be uptodate when redecoration will occur.
    #             rowsList.remove(rankToDelete)
    #             if selectedRows[rankToDelete]
    #                 selectedRows[rankToDelete]   = false
    #             # 5- delete the row from the long list
    #             longList.removeRows(rankToDelete, nToDelete)
    #             # 6- update the rows rank. In deed, the rows redecorated are not the
    #             # only ones to be impacted. All the raws after the first deleted
    #             # have their rank modified. If their state depends on the rank, it
    #             # must then be adapted.
    #             rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #             for row in rowsToReRanked
    #                 row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #             # 7- tests
    #             stateFinal = longList._test.getState()

    #         it 'the initial state should be dynamic', () ->
    #             expect(stateInitial.isDynamic).to.be.true

    #         it 'the final state should be static', () ->
    #             expect(stateFinal.isDynamic).to.not.be.true

    #         it 'the longList should have one row less', () ->
    #             expect(stateFinal.nRows)
    #                 .to.eql(nRows4Test-nToDelete)

    #         it 'the bufffer should start at rank 0', () ->
    #             expect(stateFinal.buffer.firstRk )
    #                 .to.eql(0)

    #         it 'the bufffer should have the same length', () ->
    #             final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
    #             expect(final_nRows )
    #                 .to.eql(stateInitial.buffer.nRows )

    #         it 'the first visible row should be the same after deletion
    #         (visible rows should remain the same)', () ->
    #             finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
    #             expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #         it 'the height of the list should be 1 row\'s height less', () ->
    #             expect(stateFinal.height)
    #                 .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

    #         it 'the final state should be consistant', () ->
    #             testLongList()




    # run tests
    mocha.run()


    # init long list for manual tests
    # nRows = 10
    # initRowsList(nRows)
    # longList.initRows(nRows)
    # selectedRows = {}




