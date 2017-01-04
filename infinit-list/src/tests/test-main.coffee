expect = require('chai').expect


module.exports = (options) ->

    rowControler       = options.rowControler
    BUFFER_LIST_LENGTH = options.BUFFER_LIST_LENGTH
    SHORT_LIST_LENGTH  = options.SHORT_LIST_LENGTH
    LONG_LIST_LENGTH   = options.LONG_LIST_LENGTH




    describe '1 - Long list tests (100 000 rows) - removeRow()', () ->

        describe '1.1 - Single deletion of a row before buffer', () ->
            # variables
            stateFinal = stateInitial = initialFirstVisibleRow = null
            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- select the third row
                rankToDelete = 2
                nToDelete    = 1
                # 2- goDown so that the row is before the buffer
                rowControler._test.goDownHalfBuffer(1.7)
                # 3- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()
                return

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(LONG_LIST_LENGTH-1)

            it 'the bufffer should start one rank earlier', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk - 1)

            it 'the bufffer should be the same length', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow =  rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-1)
                expect(stateFinal.height)
                    .to.eql(theoricalHeight)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.2 - Deletion of two rows before the buffer', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- select the third row
                rankToDelete = 2
                nToDelete    = 2
                # 2- goDown so that the row is before the buffer
                rowControler._test.goDownHalfBuffer(1.7)
                # 3- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have two rows less', () ->
                expect(stateFinal.nRows)
                    .to.eql(LONG_LIST_LENGTH-nToDelete)

            it 'the bufffer should start two ranks earlier', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk - nToDelete)

            it 'the bufffer should be the same length', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow =  rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 2 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-4,theoricalHeight+4)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.3 - Single row deletion in the buffer, before viewport', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown to have some rows above the buffer
                rowControler._test.goDownHalfBuffer(1.7)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.buffer.firstRk + 2
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(LONG_LIST_LENGTH-nToDelete)

            it 'the bufffer should start one rank earlier', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk - nToDelete)

            it 'the bufffer should be the same length', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow =  rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-3,theoricalHeight+3)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.4 - Single row deletion in the buffer, first row of the buffer.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown to have some rows above the buffer
                rowControler._test.goDownHalfBuffer(1.7)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.buffer.firstRk + 0
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(LONG_LIST_LENGTH-nToDelete)

            it 'the bufffer should start one rank earlier', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk - nToDelete)

            it 'the bufffer should be the same length', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow =  rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-3,theoricalHeight+3)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.5 - Single row deletion in the buffer, first row of the viewport.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown to have some rows above the buffer
                rowControler._test.goDownHalfBuffer(1.7)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.viewport.firstRk
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(LONG_LIST_LENGTH-nToDelete)

            it 'the bufffer should start one rank earlier', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk - nToDelete)

            it 'the bufffer should be the same length', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

            it 'the first visible row should not be the same after deletion
            (visible rows should remain the same, except the deleted one...)', () ->
                finalFirstVisibleRow =  rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).not.to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-3,theoricalHeight+3)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.6 - Single row deletion in the buffer, last row of the buffer.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown to have some rows above the buffer
                rowControler._test.goDownHalfBuffer(1.7)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.buffer.lastRk
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(LONG_LIST_LENGTH-nToDelete)

            it 'the bufffer should start one rank earlier', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk - nToDelete)

            it 'the bufffer should be the same length', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk)

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow =  rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-3,theoricalHeight+3)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.7 - Single row deletion in the buffer, but with no row before the buffer, but some after it.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = 2
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

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
                finalFirstVisibleRow =  rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-3,theoricalHeight+3)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.8 - Deletion of the first row, with no row before the buffer
        , but some after it.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = 0
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

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
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-3,theoricalHeight+3)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.9 - Deletion of the last row of the buffer, with no row
         before the buffer, but some after it.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.buffer.lastRk
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

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
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-3,theoricalHeight+3)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.10 - Single row deletion in the buffer, in the viewport.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.viewport.firstRk + 2
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

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
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                theoricalHeight = stateFinal.rowHeight*(LONG_LIST_LENGTH-nToDelete)
                expect(stateFinal.height)
                    .to.be.within(theoricalHeight-4,theoricalHeight+4)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '1.11 - Deletion of all rows.', () ->

            # variables
            nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = LONG_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown
                rowControler._test.goDownHalfBuffer(1.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 4- delete all the rows from the long list
                rowControler.removeAllRows()
                # 5- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(0)

            it 'the bufffer should start at -1', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(-1)

            it 'the bufffer should be empty', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the height of the list should 0', () ->
                expect(stateFinal.height)
                    .to.eql(0)

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()










    describe '2 - Short list tests (less than in the buffer) - removeRows()', () ->

        describe '2.1 - nRows < nMaxRowsInBufr : Single row deletion in the middle of the buffer.', () ->

            # variables
            nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = SHORT_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.viewport.firstRk + 2
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test-nToDelete)

            it 'the bufffer should start at rank 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have one row less', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk - 1 )

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '2.2 - nRows < nMaxRowsInBufr : deletion of the first row of the buffer.', () ->

            # variables
            nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = SHORT_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = 0
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test-nToDelete)

            it 'the bufffer should start at rank 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have one row less', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk - 1 )

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '2.3 - nRows < nMaxRowsInBufr : deletion of the last row of the buffer.', () ->

            # variables
            nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = SHORT_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = nRows4Test - 1
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.not.be.true

            it 'the final state should be static', () ->
                expect(stateFinal.isDynamic).to.not.be.true

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test-nToDelete)

            it 'the bufffer should start at rank 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have one row less', () ->
                expect(stateFinal.buffer.lastRk - stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.lastRk - stateInitial.buffer.firstRk - 1 )

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()










    describe '3 - List with on more row than in the buffer (remove one => isDynamic == false)', () ->

        describe '3.1 -  nRows = nMaxRowsInBufr + 1 : Single row deletion, in the buffer.', () ->

            # variables
            nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = BUFFER_LIST_LENGTH + 1
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = stateInitial.viewport.firstRk + 2
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.true

            it 'the final state should be static', () ->
                expect(stateFinal.isDynamic).to.not.be.true

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test-nToDelete)

            it 'the bufffer should start at rank 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have the same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows )
                    .to.eql(stateInitial.buffer.nRows )

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()



        describe '3.2 - nMaxRowsInBufr + 1 = nRows : last row deletion, out of the buffer.', () ->

            # variables
            nRows4Test = nToDelete = stateFinal = stateInitial = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = BUFFER_LIST_LENGTH + 1
                rowControler.init(nRows4Test)
                # 1- goDown but not enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to delete
                rankToDelete = nRows4Test - 1
                nToDelete    = 1
                # 4- remove the row from the data
                rowControler.removeRows(rankToDelete, nToDelete)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.true

            it 'the final state should be static', () ->
                expect(stateFinal.isDynamic).to.not.be.true

            it 'the longList should have one row less', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test-nToDelete)

            it 'the bufffer should start at rank 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have the same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows )
                    .to.eql(stateInitial.buffer.nRows )

            it 'the first visible row should be the same after deletion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the height of the list should be 1 row\'s height less', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test-nToDelete))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()








    describe '4 - Long list tests (100 000 rows) - addRows()', () ->

        describe '4.1 - there are rows above the buffer', () ->

            describe '4.1.0 - add a row before the buffer.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = 2
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start one rank further', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk+1)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()


            describe '4.1.1 - add a row, in the buffer, before the viewport.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = 150
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start one rank further', () ->
                    3+3
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk+1)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the inserted row of the buffer should be decorated', () ->
                    rowControler.testDecorationOfRow(rankToAdd)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()


            describe '4.1.2 - add a row, in the buffer, on first row of the buffer.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = stateInitial.buffer.firstRk
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start one row further', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk+1)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()


            describe '4.1.3 - add a row, in the buffer, on second row of the buffer.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = stateInitial.buffer.firstRk + 1
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start one row further', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk+1)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the inserted row of the buffer should be decorated', () ->
                    rowControler.testDecorationOfRow(rankToAdd)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()



            describe '4.1.4 - add a row, in the buffer, in viewport.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = 212
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start at the same rank', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the inserted row of the buffer should be decorated', () ->
                    rowControler.testDecorationOfRow(rankToAdd)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()


            describe '4.1.5 - add a row, at the last row of the buffer.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = stateInitial.buffer.lastRk
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start at the same rank', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk )

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the last row of the buffer should be the new one', () ->
                    rowControler.testDecorationOfRow(stateInitial.buffer.lastRk)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()


            describe '4.1.6 - add a row after the buffer.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = stateInitial.buffer.lastRk + 1
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start at the same rank', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk )

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()



        describe '4.2 - there are no row above the buffer', () ->

            describe '4.2.1 - add a row, in the buffer, before the viewport.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the viewport
                    rowControler._test.goDownHalfBuffer(0.2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = 2
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start one rank further', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk+1)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the inserted row of the buffer should be decorated', () ->
                    rowControler.testDecorationOfRow(rankToAdd)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()


            describe '4.2.2 - add a row, in the buffer, on first row of the buffer.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(0.2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = 0
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start one row further', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk+1)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same    after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()



            describe '4.2.4 - add a row, in the buffer, in viewport.', () ->

                # variables
                rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
                = initialFirstVisibleRow = null

                # actions to test
                before () ->
                    # 0- init the long list and its data
                    nRows4Test = LONG_LIST_LENGTH
                    rowControler.init(nRows4Test)
                    # 1- goDown enought to have rows above the buffer
                    rowControler._test.goDownHalfBuffer(0.2)
                    # 2- get initial state
                    stateInitial = rowControler._test.getState()
                    initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                    # 3- set the row to add
                    rankToAdd = stateInitial.viewport.firstRk + 1
                    # 5- delete the row from the long list
                    rowControler.addRowAtRk(rankToAdd)
                    # 7- tests
                    stateFinal = rowControler._test.getState()

                it 'the initial state should be dynamic', () ->
                    expect(stateInitial.isDynamic).to.be.true

                it 'the final state should be dynamic', () ->
                    expect(stateFinal.isDynamic).to.be.true

                it 'the longList should have one more row', () ->
                    expect(stateFinal.nRows)
                        .to.eql(nRows4Test + 1)

                it 'the bufffer should start at the same rank', () ->
                    expect(stateFinal.buffer.firstRk )
                        .to.eql(stateInitial.buffer.firstRk)

                it 'the bufffer should have the same length', () ->
                    final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                    expect(final_nRows )
                        .to.eql(stateInitial.buffer.nRows )

                it 'the first visible row should be the same after insertion
                (visible rows should remain the same)', () ->
                    finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                    expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

                it 'the inserted row of the buffer should be decorated', () ->
                    rowControler.testDecorationOfRow(rankToAdd)

                it 'the height of the list should have more 1 row', () ->
                    theoricalHeight = stateFinal.rowHeight*(nRows4Test+1)
                    expect(stateFinal.height)
                        .to.be.within(theoricalHeight-4,theoricalHeight+4)

                it 'the final state should be consistant', () ->
                    rowControler.testLongListConsistency()










    describe '5 - Short list tests (less than in the buffer) - addRows()', () ->

        describe '5.1 - add a row at rank 0', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = 5
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = 0
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.false

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should still start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have one more row', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows + 1 )

            it 'the first visible row should not be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.not.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be decorated', () ->
                rowControler.testDecorationOfRow(rankToAdd)

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()

        describe '5.2 - add a row in the middle', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = 5
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = 3
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.false

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should still start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have one more row', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows + 1 )

            it 'the first visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be decorated', () ->
                rowControler.testDecorationOfRow(rankToAdd)

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()

        describe '5.3 - add a row at rank = buffer.lastRk', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = 5
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = stateInitial.buffer.lastRk
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.false

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should still start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have one more row', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows + 1 )

            it 'the first visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be decorated', () ->
                rowControler.testDecorationOfRow(rankToAdd)

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()


        describe '5.4 - add a row at rank = buffer.lastRk + 1', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = 5
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = stateInitial.buffer.lastRk + 1
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.false

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should still start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have one more row', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows + 1 )

            it 'the first visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be decorated', () ->
                rowControler.testDecorationOfRow(rankToAdd)

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()










    describe '6 - Short list tests : with nRows == nMaxRowsInBufr - addRows()', () ->

        describe '6.1 - add a row at rank 0', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = BUFFER_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = 0
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.true

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should be the same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows )

            it 'the second visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalSecondVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk+1)
                expect(finalSecondVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be in the buffer', () ->
                rowElement = rowControler.getRowElementAt(rankToAdd)
                expect(rowElement).to.not.be.undefined

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()


        describe '6.2 - add a row in the buffer, before viewport', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = BUFFER_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                rowControler._test.goDownHalfBuffer(0.1)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = 1
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.true

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should still start at 1', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk+1)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(1)

            it 'the bufffer should have same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows )

            it 'the first visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be decorated', () ->
                rowControler.testDecorationOfRow(rankToAdd)

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()


        describe '6.3 - add a row in the viewport', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = BUFFER_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = 5
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.true

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should be the same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows )

            it 'the first visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be in the buffer', () ->
                rowElement = rowControler.getRowElementAt(rankToAdd)
                expect(typeof rowElement).to.eql('object')

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()

        describe '6.4 - add a row at rank = buffer.lastRk', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = BUFFER_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = stateInitial.buffer.lastRk
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.true

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should still start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should have the same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows )

            it 'the first visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be decorated', () ->
                rowControler.testDecorationOfRow(rankToAdd)

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()


        describe '6.4 - add a row at rank = buffer.lastRk + 1', () ->

            # variables
            rankToAdd = nRows4Test = nToAdd = stateFinal = stateInitial \
            = initialFirstVisibleRow = null

            # actions to test
            before () ->
                # 0- init the long list and its data
                nRows4Test = BUFFER_LIST_LENGTH
                rowControler.init(nRows4Test)
                # 1- goDown enought to have rows above the buffer
                # rowControler._test.goDownHalfBuffer(2)
                # 2- get initial state
                stateInitial = rowControler._test.getState()
                initialFirstVisibleRow = rowControler.getDataAtRank(stateInitial.viewport.firstRk)
                # 3- set the row to add
                rankToAdd = stateInitial.buffer.lastRk + 1
                # 5- delete the row from the long list
                rowControler.addRowAtRk(rankToAdd)
                # 7- tests
                stateFinal = rowControler._test.getState()

            it 'the initial state should not be dynamic', () ->
                expect(stateInitial.isDynamic).to.be.false

            it 'the final state should be dynamic', () ->
                expect(stateFinal.isDynamic).to.be.true

            it 'the longList should have one more row', () ->
                expect(stateFinal.nRows)
                    .to.eql(nRows4Test + 1)

            it 'the bufffer should still start at 0', () ->
                expect(stateFinal.buffer.firstRk )
                    .to.eql(stateInitial.buffer.firstRk)
                expect(stateFinal.buffer.firstRk )
                    .to.eql(0)

            it 'the bufffer should be the same length', () ->
                final_nRows = stateFinal.buffer.lastRk - stateFinal.buffer.firstRk + 1
                expect(final_nRows)
                    .to.eql(stateInitial.buffer.nRows )

            it 'the first visible row should be the same after insertion
            (visible rows should remain the same)', () ->
                finalFirstVisibleRow = rowControler.getDataAtRank(stateFinal.viewport.firstRk)
                expect(finalFirstVisibleRow).to.eql(initialFirstVisibleRow)

            it 'the inserted row of the buffer should be outside the buffer', () ->
                rowElement = rowControler.getRowElementAt(rankToAdd)
                expect(rowElement).to.be.undefined

            it 'the height of the list should have more 1 row', () ->
                expect(stateFinal.height)
                    .to.eql(stateFinal.rowHeight*(nRows4Test+1))

            it 'the final state should be consistant', () ->
                rowControler.testLongListConsistency()
