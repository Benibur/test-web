LongListRows = require('long-list-rows')
LinkedList   = require('doubly-linked-list')

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
        rowsList.append "Initial rank: #{rk}"

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
    viewPortElement = $('.longListViewPort')[0] # the viewport element


    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * listeners of rows clicks
    ###

    selectedRows = {}

    onRowClick = (e) ->
        row$ = $(e.target).parent('.long-list-row')[0]
        toggleRow$(row$)

    toggleRow$ = (row$)->
        rowID = rowsList.at(row$.dataset.rank).id
        if selectedRows[rowID]
            row$.classList.remove('seleted')
            selectedRows[rowID] = false
        else
            row$.classList.add('seleted')
            selectedRows[rowID] = row$

    checkIfSelected = (row$) ->
        rowID = rowsList.at(row$.dataset.rank).id
        if selectedRows[rowID]
            row$.classList.add('seleted')
        else
            row$.classList.remove('seleted')


    viewPortElement.addEventListener('click', onRowClick)


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


    onRanksModifiedCB = (rowsToRanked)->
        for row in rowsToRanked
            row.el.lastChild.innerHTML = "current rank: #{row.rank}"
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

        onRowsMovedCB    : (rowsToDecorate)->
            for row in rowsToDecorate
                rowTxt = rowsList.at(row.rank).data
                row.el.innerHTML = """<div class="largest-col">#{rowTxt}</div><div class="constant-col">current rank: #{row.rank}</div>"""
                checkIfSelected(row.el)
            return true

        # onRanksModifiedCB : (rowsToRanked)->
        #     for row in rowsToRanked
        #         row.el.lastChild.innerHTML = "current rank: #{row.rank}"
        #     return true

    ###*
     * longList creation and initialization
    ###
    longList = new LongListRows(viewPortElement, options)
    # longList.initRows(LONG_LIST_LENGTH)






    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * helpers for tests and debug
    ###

    ###*
     * boutons
    ###

    document.querySelector('.initBtn')
    .addEventListener 'click', () ->
        nbRowsToIni = document.querySelector('.nbRowsToIni').value
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
        for rowID of selectedRows
            console.log rowID
            continue if !selectedRows[rowID]
            # update data (always before to modify the longList)
            rowsList.removeID(rowID)
            row$ = selectedRows[rowID]
            smallestRank = Math.min(smallestRank, parseInt(row$.dataset.rank))
            selectedRows[rowID] = false
            # modify the longList
            longList.removeRows(row$,1)
        # update the rows rank. In deed, the rows redecorated are not the
        # only ones to be impacted. All the raws after the first deleted have
        # their rank modified. If their state depends on the rank, it must then
        # be adapted.
        rowsToReRanked = longList.getRowsAfter(smallestRank)
        for row in rowsToReRanked
            row.el.lastChild.innerHTML = "current rank: #{row.rank}"

        return


    document.querySelector('.unActivateBtn')
    .addEventListener 'click', () ->
        longList._test.unActivateScrollListener()


    # setTimeout( () ->
    #     longList._test.goDownHalfBuffer(0.7)
    # , 20  )

    # setTimeout( () ->
    #     longList._test.goUpHalfBuffer(0.7)
    # , 1000  )

    # setTimeout( () ->
    #     longList._test.goDownHalfBuffer(0.7)
    # , 2000  )




    # describe 'TEST 1 - Single deletion of a row before buffer', () ->
    #     # variables
    #     stateFinal = stateInitial = initialFirstVisibleRow = null
    #     # actions to test
    #     before () ->
    #         # 0- init the long list and its data
    #         initRowsList(LONG_LIST_LENGTH)
    #         longList.initRows(LONG_LIST_LENGTH)

    #         # 1- select the third row
    #         rankToDelete = 2
    #         row$ = longList.getRowElementAt(rankToDelete)
    #         toggleRow$(row$)
    #         # 2- goDown so that the row is before the buffer
    #         longList._test.goDownHalfBuffer(1.7)
    #         # 3- get initial state
    #         stateInitial = longList._test.getState()
    #         initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #         # 4- remove the row from the data
    #         rowsList.remove(rankToDelete)
    #         if selectedRows[rankToDelete]
    #             selectedRows[rankToDelete] = false
    #         # 5- delete the row from the long list
    #         longList.removeRows(rankToDelete, 1)
    #         # 6- update the rows rank. In deed, the rows redecorated are not the
    #         # only ones to be impacted. All the raws after the first deleted
    #         # have their rank modified. If their state depends on the rank, it
    #         # must then be adapted.
    #         rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #         for row in rowsToReRanked
    #             row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #         # 7- tests
    #         stateFinal = longList._test.getState()
    #         return

    #     it 'the longList should have one row less', () ->
    #         expect(stateFinal.nRows)
    #             .to.eql(LONG_LIST_LENGTH-1)

    #     it 'the bufffer should start one rank earlier', () ->
    #         expect(stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.firstRk - 1)

    #     it 'the bufffer should be the same length', () ->
    #         expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #     it 'the first visible row should be the same after deletion
    #     (visible rows should remain the same)', () ->
    #         finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #         expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #     it 'the height of the list should be 1 row\'s height less', () ->
    #         expect(stateFinal.height)
    #             .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-1))



    # describe 'TEST 2 - Deletion of two rows before the buffer', () ->

    #     # variables
    #     nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #     # actions to test
    #     before () ->
    #         # 0- init the long list and its data
    #         initRowsList(LONG_LIST_LENGTH)
    #         longList.initRows(LONG_LIST_LENGTH)
    #         # 1- select the third row
    #         rankToDelete = 2
    #         nToDelete    = 2
    #         row$ = longList.getRowElementAt(rankToDelete)
    #         toggleRow$(row$)
    #         # 2- goDown so that the row is before the buffer
    #         longList._test.goDownHalfBuffer(1.7)
    #         # 3- get initial state
    #         stateInitial = longList._test.getState()
    #         initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #         # 4- remove the row from the data
    #         # ! note : data must be updated before acting on the long list
    #         # because the data must be uptodate when redecoration will occur.
    #         rowsList.remove(rankToDelete)
    #         rowsList.remove(rankToDelete)
    #         if selectedRows[rankToDelete]
    #             selectedRows[rankToDelete] = false
    #         if selectedRows[rankToDelete+1]
    #             selectedRows[rankToDelete+1] = false
    #         # 5- delete the 2 rows from the long list
    #         longList.removeRows(rankToDelete, nToDelete)
    #         # 6- update the rows rank. In deed, the rows redecorated are not the
    #         # only ones to be impacted. All the raws after the first deleted
    #         # have their rank modified. If their state depends on the rank, it
    #         # must then be adapted.
    #         rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #         for row in rowsToReRanked
    #             row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #         # 7- tests
    #         stateFinal = longList._test.getState()

    #     it 'the longList should have two rows less', () ->
    #         expect(stateFinal.nRows)
    #             .to.eql(LONG_LIST_LENGTH-nToDelete)

    #     it 'the bufffer should start two ranks earlier', () ->
    #         expect(stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #     it 'the bufffer should be the same length', () ->
    #         expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #     it 'the first visible row should be the same after deletion
    #     (visible rows should remain the same)', () ->
    #         finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #         expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #     it 'the height of the list should be 2 rows\' height less', () ->
    #         expect(stateFinal.height)
    #             .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))



    # describe 'TEST 3 - Single row deletion in the buffer, before viewport', () ->

    #     # variables
    #     nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #     # actions to test
    #     before () ->
    #         # 0- init the long list and its data
    #         initRowsList(LONG_LIST_LENGTH)
    #         longList.initRows(LONG_LIST_LENGTH)
    #         # 1- goDown to have some rows above the buffer
    #         longList._test.goDownHalfBuffer(1.7)
    #         # 2- get initial state
    #         stateInitial = longList._test.getState()
    #         initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #         # 3- set the row to delete
    #         rankToDelete = stateInitial.buffer.firstRk + 2
    #         nToDelete    = 1
    #         # 4- remove the row from the data
    #         # ! note : data must be updated before acting on the long list
    #         # because the data must be uptodate when redecoration will occur.
    #         rowsList.remove(rankToDelete)
    #         if selectedRows[rankToDelete]
    #             selectedRows[rankToDelete]   = false
    #         # 5- delete the row from the long list
    #         longList.removeRows(rankToDelete, nToDelete)
    #         # 6- update the rows rank. In deed, the rows redecorated are not the
    #         # only ones to be impacted. All the raws after the first deleted
    #         # have their rank modified. If their state depends on the rank, it
    #         # must then be adapted.
    #         rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #         for row in rowsToReRanked
    #             row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #         # 7- tests
    #         stateFinal = longList._test.getState()

    #     it 'the longList should have one row less', () ->
    #         expect(stateFinal.nRows)
    #             .to.eql(LONG_LIST_LENGTH-nToDelete)

    #     it 'the bufffer should start one rank earlier', () ->
    #         expect(stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #     it 'the bufffer should be the same length', () ->
    #         expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #     it 'the first visible row should be the same after deletion
    #     (visible rows should remain the same)', () ->
    #         finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #         expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #     it 'the height of the list should be 1 row\'s height less', () ->
    #         expect(stateFinal.height)
    #             .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))



    # describe 'TEST 4 - Single row deletion in the buffer, first row of the buffer.', () ->

    #     # variables
    #     nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #     # actions to test
    #     before () ->
    #         # 0- init the long list and its data
    #         initRowsList(LONG_LIST_LENGTH)
    #         longList.initRows(LONG_LIST_LENGTH)
    #         # 1- goDown to have some rows above the buffer
    #         longList._test.goDownHalfBuffer(1.7)
    #         # 2- get initial state
    #         stateInitial = longList._test.getState()
    #         initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #         # 3- set the row to delete
    #         rankToDelete = stateInitial.buffer.firstRk + 0
    #         nToDelete    = 1
    #         # 4- remove the row from the data
    #         # ! note : data must be updated before acting on the long list
    #         # because the data must be uptodate when redecoration will occur.
    #         rowsList.remove(rankToDelete)
    #         if selectedRows[rankToDelete]
    #             selectedRows[rankToDelete]   = false
    #         # 5- delete the row from the long list
    #         longList.removeRows(rankToDelete, nToDelete)
    #         # 6- update the rows rank. In deed, the rows redecorated are not the
    #         # only ones to be impacted. All the raws after the first deleted
    #         # have their rank modified. If their state depends on the rank, it
    #         # must then be adapted.
    #         rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #         for row in rowsToReRanked
    #             row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #         # 7- tests
    #         stateFinal = longList._test.getState()

    #     it 'the longList should have one row less', () ->
    #         expect(stateFinal.nRows)
    #             .to.eql(LONG_LIST_LENGTH-nToDelete)

    #     it 'the bufffer should start one rank earlier', () ->
    #         expect(stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #     it 'the bufffer should be the same length', () ->
    #         expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #     it 'the first visible row should be the same after deletion
    #     (visible rows should remain the same)', () ->
    #         finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #         expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #     it 'the height of the list should be 1 row\'s height less', () ->
    #         expect(stateFinal.height)
    #             .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))



    # describe 'TEST 5 - Single row deletion in the buffer, last row of the buffer.', () ->

    #     # variables
    #     nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #     # actions to test
    #     before () ->
    #         # 0- init the long list and its data
    #         initRowsList(LONG_LIST_LENGTH)
    #         longList.initRows(LONG_LIST_LENGTH)
    #         # 1- goDown to have some rows above the buffer
    #         longList._test.goDownHalfBuffer(1.7)
    #         # 2- get initial state
    #         stateInitial = longList._test.getState()
    #         initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #         # 3- set the row to delete
    #         rankToDelete = stateInitial.buffer.lastRk
    #         nToDelete    = 1
    #         # 4- remove the row from the data
    #         # ! note : data must be updated before acting on the long list
    #         # because the data must be uptodate when redecoration will occur.
    #         rowsList.remove(rankToDelete)
    #         if selectedRows[rankToDelete]
    #             selectedRows[rankToDelete]   = false
    #         # 5- delete the row from the long list
    #         longList.removeRows(rankToDelete, nToDelete)
    #         # 6- update the rows rank. In deed, the rows redecorated are not the
    #         # only ones to be impacted. All the raws after the first deleted
    #         # have their rank modified. If their state depends on the rank, it
    #         # must then be adapted.
    #         rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #         for row in rowsToReRanked
    #             row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #         # 7- tests
    #         stateFinal = longList._test.getState()

    #     it 'the longList should have one row less', () ->
    #         expect(stateFinal.nRows)
    #             .to.eql(LONG_LIST_LENGTH-nToDelete)

    #     it 'the bufffer should start one rank earlier', () ->
    #         expect(stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.firstRk - nToDelete)

    #     it 'the bufffer should be the same length', () ->
    #         expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #     it 'the first visible row should be the same after deletion
    #     (visible rows should remain the same)', () ->
    #         finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #         expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #     it 'the height of the list should be 1 row\'s height less', () ->
    #         expect(stateFinal.height)
    #             .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))



    # describe 'TEST 6 - Single row deletion in the buffer, but with no row before the buffer, but some after it.', () ->

    #     # variables
    #     nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #     # actions to test
    #     before () ->
    #         # 0- init the long list and its data
    #         initRowsList(LONG_LIST_LENGTH)
    #         longList.initRows(LONG_LIST_LENGTH)
    #         # 1- goDown but not enought to have rows above the buffer
    #         longList._test.goDownHalfBuffer(0.1)
    #         # 2- get initial state
    #         stateInitial = longList._test.getState()
    #         initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #         # 3- set the row to delete
    #         rankToDelete = 2
    #         nToDelete    = 1
    #         # 4- remove the row from the data
    #         # ! note : data must be updated before acting on the long list
    #         # because the data must be uptodate when redecoration will occur.
    #         rowsList.remove(rankToDelete)
    #         if selectedRows[rankToDelete]
    #             selectedRows[rankToDelete]   = false
    #         # 5- delete the row from the long list
    #         longList.removeRows(rankToDelete, nToDelete)
    #         # 6- update the rows rank. In deed, the rows redecorated are not the
    #         # only ones to be impacted. All the raws after the first deleted
    #         # have their rank modified. If their state depends on the rank, it
    #         # must then be adapted.
    #         rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #         for row in rowsToReRanked
    #             row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #         # 7- tests
    #         stateFinal = longList._test.getState()

    #     it 'the longList should have one row less', () ->
    #         expect(stateFinal.nRows)
    #             .to.eql(LONG_LIST_LENGTH-nToDelete)

    #     it 'the bufffer should start at the same rank', () ->
    #         expect(stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.firstRk)

    #     it 'the bufffer should be the same length', () ->
    #         expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #     it 'the first visible row should be the same after deletion
    #     (visible rows should remain the same)', () ->
    #         finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #         expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #     it 'the height of the list should be 1 row\'s height less', () ->
    #         expect(stateFinal.height)
    #             .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))



    describe 'TEST 7 - Deletion of the first row, with no row before the buffer
    , but some after it.', () ->

        # variables
        nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

        # actions to test
        before () ->
            # 0- init the long list and its data
            initRowsList(LONG_LIST_LENGTH)
            longList.initRows(LONG_LIST_LENGTH)
            # 1- goDown but not enought to have rows above the buffer
            longList._test.goDownHalfBuffer(0.1)
            # 2- get initial state
            stateInitial = longList._test.getState()
            initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
            # 3- set the row to delete
            rankToDelete = 0
            nToDelete    = 1
            # 4- remove the row from the data
            # ! note : data must be updated before acting on the long list
            # because the data must be uptodate when redecoration will occur.
            rowsList.remove(rankToDelete)
            if selectedRows[rankToDelete]
                selectedRows[rankToDelete]   = false
            # 5- delete the row from the long list
            longList.removeRows(rankToDelete, nToDelete)
            # 6- update the rows rank. In deed, the rows redecorated are not the
            # only ones to be impacted. All the raws after the first deleted
            # have their rank modified. If their state depends on the rank, it
            # must then be adapted.
            rowsToReRanked = longList.getRowsAfter(rankToDelete)
            for row in rowsToReRanked
                row.el.lastChild.innerHTML = "current rank: #{row.rank}"
            # 7- tests
            stateFinal = longList._test.getState()

        it 'the longList should have one row less', () ->
            expect(stateFinal.nRows)
                .to.eql(LONG_LIST_LENGTH-nToDelete)

        it 'the bufffer should start at the same rank', () ->
            expect(stateFinal.buffer.firstRk )
                .to.eql(stateInitial.buffer.firstRk)

        it 'the bufffer should be the same length', () ->
            expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

        it 'the first visible row should be the same after deletion
        (visible rows should remain the same)', () ->
            finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
            expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

        it 'the height of the list should be 1 row\'s height less', () ->
            expect(stateFinal.height)
                .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))



    describe 'TEST 8 - Deletion of the last row of the buffer, with no row
     before the buffer, but some after it.', () ->

        # variables
        nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

        # actions to test
        before () ->
            # 0- init the long list and its data
            initRowsList(LONG_LIST_LENGTH)
            longList.initRows(LONG_LIST_LENGTH)
            # 1- goDown but not enought to have rows above the buffer
            longList._test.goDownHalfBuffer(0.1)
            # 2- get initial state
            stateInitial = longList._test.getState()
            initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
            # 3- set the row to delete
            rankToDelete = stateInitial.buffer.lastRk
            nToDelete    = 1
            # 4- remove the row from the data
            # ! note : data must be updated before acting on the long list
            # because the data must be uptodate when redecoration will occur.
            rowsList.remove(rankToDelete)
            if selectedRows[rankToDelete]
                selectedRows[rankToDelete]   = false
            # 5- delete the row from the long list
            longList.removeRows(rankToDelete, nToDelete)
            # 6- update the rows rank. In deed, the rows redecorated are not the
            # only ones to be impacted. All the raws after the first deleted
            # have their rank modified. If their state depends on the rank, it
            # must then be adapted.
            rowsToReRanked = longList.getRowsAfter(rankToDelete)
            for row in rowsToReRanked
                row.el.lastChild.innerHTML = "current rank: #{row.rank}"
            # 7- tests
            stateFinal = longList._test.getState()

        it 'the longList should have one row less', () ->
            expect(stateFinal.nRows)
                .to.eql(LONG_LIST_LENGTH-nToDelete)

        it 'the bufffer should start at the same rank', () ->
            expect(stateFinal.buffer.firstRk )
                .to.eql(stateInitial.buffer.firstRk)

        it 'the bufffer should be the same length', () ->
            expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

        it 'the first visible row should be the same after deletion
        (visible rows should remain the same)', () ->
            finalFirstVisibleRow = rowsList.at(stateFinal.viewport.firstRk).data
            expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

        it 'the height of the list should be 1 row\'s height less', () ->
            expect(stateFinal.height)
                .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))



    # describe 'TEST 6 - Single row deletion in the buffer, but with no row before nor after the buffer.', () ->
    #     it 'nok', () ->
    #         expect(false).to.be.ok()



    # describe 'TEST 7 - Single row deletion, in the buffer when the buffer is only one row smaller than the total number of rows.', () ->
    #     it 'nok', () ->
    #         expect(false).to.be.ok()



    # describe 'TEST 8 - Single row deletion, after the buffer when the buffer is only one row smaller than the total number of rows.', () ->
    #     it 'nok', () ->
    #         expect(false).to.be.ok()



    # describe 'TEST 9 - Single row deletion in the buffer, in the viewport.', () ->

    #     # variables
    #     nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

    #     # actions to test
    #     before () ->
    #         # 0- init the long list and its data
    #         initRowsList(LONG_LIST_LENGTH)
    #         longList.initRows(LONG_LIST_LENGTH)
    #         # 1- goDown to have some rows above the buffer
    #         longList._test.goDownHalfBuffer(1.7)
    #         # 2- get initial state
    #         stateInitial = longList._test.getState()
    #         initialFirstVisibleRow =  rowsList.at(stateInitial.viewport.firstRk).data
    #         # 3- set the row to delete
    #         rankToDelete = stateInitial.viewport.firstRk + 3
    #         nToDelete    = 1
    #         # 4- remove the row from the data
    #         # ! note : data must be updated before acting on the long list
    #         # because the data must be uptodate when redecoration will occur.
    #         rowsList.remove(rankToDelete)
    #         if selectedRows[rankToDelete]
    #             selectedRows[rankToDelete]   = false
    #         # 5- delete the row from the long list
    #         longList.removeRows(rankToDelete, nToDelete)
    #         # 6- update the rows rank. In deed, the rows redecorated are not the
    #         # only ones to be impacted. All the raws after the first deleted
    #         # have their rank modified. If their state depends on the rank, it
    #         # must then be adapted.
    #         rowsToReRanked = longList.getRowsAfter(rankToDelete)
    #         for row in rowsToReRanked
    #             row.el.lastChild.innerHTML = "current rank: #{row.rank}"
    #         # 7- tests
    #         stateFinal = longList._test.getState()

    #     it 'the longList should have one row less', () ->
    #         expect(stateFinal.nRows)
    #             .to.eql(LONG_LIST_LENGTH-nToDelete)

    #     it 'the bufffer should be the same length', () ->
    #         expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
    #             .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

    #     it 'the first visible row should be the same after deletion
    #     (visible rows should remain the same)', () ->
    #         finalFirstVisibleRow =  rowsList.at(stateFinal.viewport.firstRk).data
    #         expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

    #     it 'the height of the list should be 1 row\'s height less', () ->
    #         expect(stateFinal.height)
    #             .to.eql(stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete))

    ###*
     * test of a a single rows deletion in the buffer, before viewport
    ###
    # rankToDelete = 2
    # nToDelete    = 2
    # # 1- select the third and fifth row
    # row$ = longList.getRowElementAt(rankToDelete)
    # toggleRow$(row$)
    # # 2- goDown so that the row is before the buffer
    # longList._test.goDownHalfBuffer(0.3)
    # # 3- remove the rows from the data (must be done before modifying the
    # # longList)
    # rowsList.remove(rankToDelete)
    # if selectedRows[rankToDelete]
    #     selectedRows[rankToDelete] = false
    # # 4- delete the row from the long list
    # longList.removeRows(rankToDelete, nToDelete)

    mocha.run()



