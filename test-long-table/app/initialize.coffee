LongTable = require('long-table')


# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    body = document.querySelector('body')
    body.innerHTML = require('body')()
    container = body.querySelector('.resizedContainer')



    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * initialization of the long list
    ###

    ###*
     * the call back in charge of decorating the rows when they are moved in the
     * long list.
    ###
    onLinesMovedCB = (rowsToDecorate)->
      # nMoved    : number of lines moved (==rows.length)
      # firstRank : integer, lowest rank of the moved rows ( note that
      #             lastRank == firstRank + nMoved - 1)
      # rows      : Array of rows elements in the DOM, sorted in order for
      #             refresh (the most usefull to refresh is the first one)
      # console.log ' rows: ', rowsToDecorate
      # rowsToDecorate : Arrray[{el:element, rank:rank},...]
      for row in rowsToDecorate
        if row.el
          # row.el.textContent = "row #{row.rank}"
          row.el.innerHTML = """<div class="largest-col">#{row.rank} suivi d'un text long, long, très très, très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très long...</div><div class="constant-col">div2</div>"""
      return true

    ###*
     * the element in the dom in which the long list will be.
     * This element must be sized (here the element has a position:absolute and
     * its top, bottom, right and left are fixed in the css)
    ###
    viewPortElement = $('.longTableViewPort')[0] # the viewport element

    ###*
     * Options for the long list
    ###
    options =
        # unit used for the dimensions (px,em or rem)
        DIMENSIONS_UNIT : 'em'

        # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
        ROW_HEIGHT      : 2

        # number of "screens" before and after the viewport
        # (ex : 1.5 => 1+2*1.5=4 screens always ready)
        BUFFER_COEF   : 3

        # number of "screens" before and after the viewport corresponding to
        # the safe zone. The Safe Zone is the rows where viewport can go
        # without trigering the movement of the buffer.
        # Must be smaller than BUFFER_COEF
        SAFE_ZONE_COEF  : 2

        # minimum duration between two refresh after scroll (ms)
        THROTTLE        : 20

        # max number of viewport height by seconds : beyond this speed the
        # refresh is delayed to the nex throttle
        MAX_SPEED       : 1.5

    ###*
     * longList creation and initialization
    ###
    longList = new LongTable(viewPortElement, options, onLinesMovedCB)
    longList.initRows(99110)




    ###* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * helpers for tests and debug
    ###

    setTimeout( () ->
        longList._test.goDownHalfBuffer(0.7)
    , 20  )

    setTimeout( () ->
        longList._test.goUpHalfBuffer(0.7)
    , 1000  )

    # setTimeout( () ->
    #     longList._test.goDownHalfBuffer(0.7)
    # , 2000  )


    document.querySelector('.goDownBtn')
    .addEventListener 'click', () ->
        longList._test.goDownHalfBuffer(1.5)

    document.querySelector('.goUpBtn')
    .addEventListener 'click', () ->
        longList._test.goUpHalfBuffer(1.5)

