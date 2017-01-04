MyRowControler = require('./MyRowControler.coffee')
require('mocha/mocha.js')
require('mocha/mocha.css')

# jQuery initialisation
$ = require('jquery')
window.$ = $
require('jquery-ui/themes/base/core.css')
require('jquery-ui/themes/base/resizable.css')
require('jquery-ui/themes/base/theme.css')
require('jquery-ui/ui/widgets/resizable')

# Application css
require('./style.styl')

# Initialize the application on DOM ready event.
document.addEventListener 'DOMContentLoaded',  () ->

    body = document.querySelector('body')
    body.innerHTML = require('./templates/body.jade')()
    $('.resizable-div').resizable()
    document.querySelector('.ui-resizable-se').style.right = '-13px'
    document.querySelector('.ui-resizable-se').style.bottom = '-13px'



    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * initialization of the long list
    ###

    ###*
     * viewportElement : the element in the dom in which the long list will be.
     * This element must be sized (here the element has a position:absolute and
     * its top, bottom, right and left are fixed in the css)
    ###
    viewportElement = document.querySelector('.longListViewport') # the viewport element

    ###*
     * the controler wich will handle the data and the longList
    ###
    rowControler = new MyRowControler(viewportElement)


    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * butons
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

    document.querySelector('.setHeightBtn')
    .addEventListener 'click', () ->
        height = parseInt(document.querySelector('.viewportHeight').value) + "px"
        document.querySelector('.resizable-div').style.height = height
        rowControler.resize()


    document.querySelector('.viewportHeight')
    .addEventListener 'keyup', (e) ->
        if e.keyCode == 13
            height = parseInt(document.querySelector('.viewportHeight').value) + "px"
            document.querySelector('.resizable-div').style.height = height
            rowControler.resize()



    consistencyResult$ = document.querySelector('.consistencyResult')
    document.querySelector('.testLongListBtn')
    .addEventListener 'click', () ->
        # document.querySelector('.tests').textContent = 'bhuunhgtysoooiuuuuuef'
        isOk = true
        try
            rowControler.testLongListConsistency()
        catch err
            isOk = false
            console.log err
        if isOk
            consistencyResult$.textContent = 'Consistency OK'
            consistencyResult$.classList.remove('nok')
        else
            consistencyResult$.textContent = 'Consistency NOK'
            consistencyResult$.classList.add('nok')

    document.querySelector('.autoTestsBtn')
    .addEventListener 'click', () ->
        runTest()


    previousHeight = null
    $('.resizable-div').on 'resize', (e) ->
        newHeight = viewportElement.clientHeight
        if newHeight != previousHeight
            rowControler.resize()
            previousHeight = newHeight


    ###*
     * compute SHORT_LIST_LENGTH and BUFFER_LIST_LENGTH
     * vars for tests wich need to have the same number of rows as the buffer.
    ###
    BUFFER_LIST_LENGTH = null
    SHORT_LIST_LENGTH  = null

    initVars = () ->
        rowControler.init(10000)
        # 2- get initial state
        stateInitial = rowControler._test.getState()
        BUFFER_LIST_LENGTH = stateInitial.nMaxRowsInBufr
        SHORT_LIST_LENGTH = BUFFER_LIST_LENGTH - 2
        console.log 'BUFFER_LIST_LENGTH', BUFFER_LIST_LENGTH
        console.log 'SHORT_LIST_LENGTH',  SHORT_LIST_LENGTH
    initVars()

    testOptions =
        rowControler       : rowControler
        BUFFER_LIST_LENGTH : BUFFER_LIST_LENGTH
        SHORT_LIST_LENGTH  : SHORT_LIST_LENGTH
        LONG_LIST_LENGTH   : 100000

    runTest = () ->
        mocha.setup('bdd')
        require('./tests/test-main.coffee')(testOptions)
        mochaRunner = mocha.run()
        mochaRunner.on 'end', (res) ->
            resultDisplay$ = document.querySelector('.failures')
            if this.failures > 0
                resultDisplay$.classList.add('failed')
            else
                resultDisplay$.classList.remove('failed')
    # runTest()
