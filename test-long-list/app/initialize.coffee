LongListItems = require('long-list-rows')


# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    body = document.querySelector('body')
    body.innerHTML = require('body')()
    container = body.querySelector('.resizedContainer')
    # container.innerHTML = require('resized-content')()


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
          row.el.textContent = "row #{row.rank}"
      return true

    viewPortElement = $('.longListViewPort')[0] # the viewport element

    options =
        # unit used for the dimensions (px,em or rem)
        DIMENSIONS_UNIT : 'em'

        # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
        ROW_HEIGHT      : 2

        # number of "screens" before and after the viewport
        # (ex : 1.5 => 1+2*1.5=4 screens always ready)
        COEF_SECURITY   : 3

        # number of "screens" before and after the viewport corresponding to
        # the safe zone. The Safe Zone is the rows where viewport can go
        # without trigering the movement of the buffer.
        # Must be smaller than COEF_SECURITY
        SAFE_ZONE_COEF  : 2

        # minimum duration between two refresh after scroll (ms)
        THROTTLE        : 20

        # max number of viewport height by seconds : beyond this speed the
        # refresh is delayed to the nex throttle
        MAX_SPEED       : 1.5

    longList = new LongListItems(viewPortElement, options, onLinesMovedCB)
    longList.initRows(500000)

    ###*
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





