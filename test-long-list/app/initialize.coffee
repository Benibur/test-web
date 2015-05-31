LongListItems = require('long-list-items')


# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    body = document.querySelector('body')
    body.innerHTML = require('body')()
    container = body.querySelector('.resizedContainer')
    # container.innerHTML = require('resized-content')()


    onLinesMovedCB = (nMoved, firstRank, rows)->
      # nMoved    : number of lines moved (==rows.length)
      # firstRank : integer, lowest rank of the moved rows ( note that
      #             lastRank == firstRank + nMoved - 1)
      # rows      : Array of rows elements in the DOM, sorted in order for
      #             refresh (the most usefull to refresh is the first one)
      console.log 'nMoved: ', nMoved, ' firstRank: ',firstRank,  ' rows: ', rows

    viewPortElement = $('.longListViewPort')[0] # the viewport element

    options =
        # unit used for the dimensions (px,em or rem)
        DIMENSIONS_UNIT : 'em'

        # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
        LINE_HEIGHT     : 2

        # number of "screens" before and after the viewport
        # (ex : 1.5 => 1+2*1.5=4 screens always ready)
        COEF_SECURITY   : 3

        # minimum duration between two refresh after scroll (ms)
        THROTTLE        : 450

        # max number of viewport height by seconds : beyond this speed the
        # refresh is delayed to the nex throttle
        MAX_SPEED       : 1.5

    longList = new LongListItems(viewPortElement, options, onLinesMovedCB)





