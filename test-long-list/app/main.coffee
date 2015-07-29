RowControler = require('./RowControler')


# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    body = document.querySelector('body')
    body.innerHTML = require('./templates/body')()
    container = body.querySelector('.resizedContainer')


    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * initialization of the long list
    ###

    ###*
     * viewportElement : the element in the dom in which the long list will be.
     * This element must be sized (here the element has a position:absolute and
     * its top, bottom, right and left are fixed in the css)
    ###
    viewportElement = $('.longListViewport')[0] # the viewport element

    ###*
     * the controler wich will handle the data and the longList
    ###
    rowControler = new RowControler(viewportElement)


    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * boutons
    ###

    document.querySelector('.initBtn')
    .addEventListener 'click', () ->
        nbRowsToIni = parseInt(document.querySelector('.nbRowsToIni').value)
        rowControler.init(nbRowsToIni)


    document.querySelector('.nbRowsToIni')
    .addEventListener 'keyup', (e) ->
        if e.keyCode == 13
            nbRowsToIni = parseInt(this.value)
            rowControler.init(nbRowsToIni)


    document.querySelector('.goDownBtn')
    .addEventListener 'click', () ->
        rowControler.goDownHalfBuffer(0.5)


    document.querySelector('.goUpBtn')
    .addEventListener 'click', () ->
        rowControler.goUpHalfBuffer(0.5)


    document.querySelector('.addBtn')
    .addEventListener 'click', () ->
        rowControler.addRowAfterSelected()


    document.querySelector('.addAtRkBtn')
    .addEventListener 'click', () ->
        rk = parseInt(document.querySelector('.insertionRk').value)
        rowControler.addRowAtRk(rk)


    document.querySelector('.deleteBtn')
    .addEventListener 'click', () ->
        rowControler.deleteSelected()


    document.querySelector('.deleteAllBtn')
    .addEventListener 'click', () ->
        rowControler.deleteAll()


    document.querySelector('.unActivateBtn')
    .addEventListener 'click', () ->
        rowControler.unActivateScrollListener()


    document.querySelector('.activateBtn')
    .addEventListener 'click', () ->
        rowControler.activateScrollListener()


    consistencyResult$ = document.querySelector('.consistencyResult')
    document.querySelector('.testLongListBtn')
    .addEventListener 'click', () ->
        isOk = true
        try
            rowControler.testLongList()
        catch err
            isOk = false
            console.log err
        if isOk
            consistencyResult$.textContent = 'Consistency OK'
            consistencyResult$.classList.remove('alert')
        else
            consistencyResult$.textContent = 'Consistency NOK'
            consistencyResult$.classList.add('alert')


    previousHeight = null
    onMouseUp = () ->
        newHeight = viewportElement.clientHeight
        if newHeight != previousHeight
            rowControler.resize()
            previousHeight = newHeight
    onMouseUp()
    document.querySelector('#resizable-container')
        .addEventListener 'mouseup', (e) ->
            onMouseUp()



    ###*
     * compute SHORT_LIST_LENGTH and BUFFER_LIST_LENGTH
     * vars for tests wich need to have the same number of rows as the buffer.
    ###
    BUFFER_LIST_LENGTH = null
    SHORT_LIST_LENGTH  = null

    initVars = () ->
        rowControler.init(2)
        # 2- get initial state
        stateInitial = rowControler._test.getState()
        BUFFER_LIST_LENGTH = stateInitial.nMaxRowsInBufr
        SHORT_LIST_LENGTH = BUFFER_LIST_LENGTH - 2
        console.log 'BUFFER_LIST_LENGTH', BUFFER_LIST_LENGTH
        console.log 'SHORT_LIST_LENGTH',  SHORT_LIST_LENGTH
    # initVars()

    testOptions =
        rowControler       : rowControler
        BUFFER_LIST_LENGTH : BUFFER_LIST_LENGTH
        SHORT_LIST_LENGTH  : SHORT_LIST_LENGTH
        LONG_LIST_LENGTH   : 100000

    mocha.setup('bdd')
    require('./tests/test-main')(testOptions)


    # run tests
    # mocha.run()


