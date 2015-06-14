################################################################################
# -- USAGE --
#
#   # creation :
#
#       onRowsMovedCB = (rows)->
#           # rows      : [ {rank:Integer, el:Element} , ... ]
#           Array of objects giving the rank and a reference to the element of
#           the moved row.
#           The array is sorted in order to optimize refresh (the most usefull
#           to refresh is the first one)
#
#       viewPortElement = $('.longListViewPort')[0] # the viewport element
#
#       options =
#           # unit used for the dimensions (px,em or rem)
#           DIMENSIONS_UNIT   : 'em'
#
#           # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
#           ROW_HEIGHT        : 2
#
#           # number of "screens" before and after the viewport in the buffer.
#           # (ex : 1.5 => 1+2*1.5=4 screens always ready)
#           BUFFER_COEF       : 3
#
#           # number of "screens" before and after the viewport corresponding to
#           # the safe zone. The Safe Zone is the rows where viewport can go
#           # without trigering the movement of the buffer.
#           # Must be smaller than BUFFER_COEF
#           SAFE_ZONE_COEF    : 2
#
#           # minimum duration between two refresh after scroll (ms)
#           THROTTLE          : 450
#
#           # max number of viewport height by seconds : beyond this speed the
#           # refresh is delayed to the next throttle
#           MAX_SPEED         : 1.5
#
#           # call back when a row of the buffer is moved and must be completly
#           # redecorated
#           onRowsMovedCB     : (rowsToDecorate)->
#
#       longList = new LongListRows(viewPortElement, options)
#       doActions() ...
#
#
#   # if the the viewPortElement is not initialy attached in the DOM, then call
#   resizeHandler when the viewPortElement is attached :
#       longList.resizeHandler()
#
#   # to add initial new rows
#   # if some are already in, they will be removed
#       longList.initRows(nToAdd)
#
#   # USELESS SO FAR : if geometry changes : longList.removeAll() and then
#   # create a new LongList()
#   # when the geometry of the parent changes (height of viewPortElement) :
#       longList.resizeHandler()
#
#   # to add rows
#       longList.addRows(fromRank, nToAdd)
#
#   # to remove some rows
#       longList.removeRows(fromRank, nToRemove)
#
#   # to remove all rows
#       longList.removeAllRows()
#
#   # to get the element corresponding to a rank (null if the rank is not in the
#   # DOM)
#       longList.getRowElementAt(rank)
#
#   # To get elements of rows of the buffer after a certain rank.
#   # Returns an empty array if the rank is after the buffer.
#       getRowsAfter(rank)


module.exports = class LongListRows

################################################################################
## PUBLIC SECTION ##
#

    constructor: (@externalViewPort$, @options ) ->
        @options.MAX_SPEED = @options.MAX_SPEED  * @options.THROTTLE / 1000
        @onRowsMovedCB     = @options.onRowsMovedCB
        ####
        # get elements (name ends with '$')
        @viewPort$ = document.createElement('div')
        @viewPort$.classList.add('viewport')
        @externalViewPort$.appendChild(@viewPort$)
        @rows$ = document.createElement('div')
        @rows$.classList.add('rows')
        @rows$.style.cssText = "padding-top: 0px; box-sizing: border-box;"
        @viewPort$.appendChild(@rows$)
        ####
        # set viewport style
        @externalViewPort$.style.display = 'flex'
        @viewPort$.style.cssText = "flex: 1 1 0%;
            position: relative;
            overflow-x: hidden;
            overflow-y: auto;"
        ####
        # adapt buffer to the initial geometry
        @_DOM_controlerInit()


    # if some are already in, they will be removed. Will call onRowsMovedCB.
    # ! note : your data describing rows state must be updated before calling
    # this method, because onRowsMovedCB might be called => the data must be
    # up to date when redecoration will occur.
    initRows: (nToAdd) ->
        ##
        # remove all rows of the buffer
        @_initBuffer()
        # the buffer is empty, initialise it
        @_firstPopulateBuffer(nToAdd)


    # to add new lines. Might call onRowsMovedCB.
    # ! note : your data describing rows state must be updated before calling
    # this method, because onRowsMovedCB might be called => the data must be
    # up to date when redecoration will occur.
    addRows: (fromRank, nToAdd) ->
        @_addRows(fromRank, nToAdd)


    # to remove some lines. Might call onRowsMovedCB.
    # ! note : your data describing rows state must be updated before calling
    # this method, because onRowsMovedCB might be called => the data must be
    # up to date when redecoration will occur.
    removeRows: (fromRank, nToRemove) ->
        @_removeRows(fromRank, nToRemove)

    # to remove all lines. Might call onRowsMovedCB.
    # ! note : your data describing rows state must be updated before calling
    # this method, because onRowsMovedCB might be called => the data must be
    # up to date when redecoration will occur.
    removeAllRows: () ->


    # retuns the element corresponding to the row of the given rank or null
    # if this row is outside the buffer.
    getRowElementAt: (rank) ->
        return @_getRowAt(rank).el

    ###*
         * return the current number of rows
     * @return {Number} Number of rows
    ###
    getLength: () ->


    ###*
     * get elements of rows of the buffer after a certain rank. Returns an empty
     * array if the rank is after the buffer.
     * @return {Array} [{rank:Integer, el:Element}, ...]
    ###
    getRowsAfter: () ->




    # for tests
    _test:
        goDownHalfBuffer:null



################################################################################
## PRIVATE SECTION ##




    ###*
     * This is the main procedure. Its scope contains all the functions used to
     * update the buffer and the shared variables between those functions. This
     * approach has been chosen for performance reasons (acces to scope
     * variables faster than to nested properties of objects). It's not an
     * obvious choice.
    ###
    _DOM_controlerInit: () ->
        #######################
        # global variables
        buffer                = null
        noScrollScheduled     = true
        previousHeight        = null
        rowHeight             = null
        nRowsInBufr           = null
        nRowsInBufrMargin     = null
        nRowsInSafeZoneMargin = null
        nRowsInSafeZone       = null
        nRowsInViewPort       = null
        VP_firstRk            = null
        VP_lastRk             = null
        isDynamic             = false # true if more rows than elemts in buffer
        viewPortHeight        = null
        lastOnScroll_Y        = null
        current_scrollTop     = null
        nRows                 = 0    # number of rows of the long list
        safeZone =
            startY         : null
            endY           : null
            firstVisibleRk : null
        # unit used for the dimensions (px,em or rem)
        DIMENSIONS_UNIT = @options.DIMENSIONS_UNIT
        # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
        ROW_HEIGHT     = @options.ROW_HEIGHT
        # number of "screens" before and after the viewport in the buffer.
        # (ex: 1.5 => 1+2*1.5=4 screens always ready)
        BUFFER_COEF   = @options.BUFFER_COEF
        # number of "screens" before and after the viewport corresponding to
        # the safe zone. The Safe Zone is the lines where viewport can go
        # without trigering the movement of the buffer.
        # Must be smaller than BUFFER_COEF
        SAFE_ZONE_COEF  = @options.SAFE_ZONE_COEF
        # minimum duration between two refresh after scroll (ms)
        THROTTLE        = @options.THROTTLE
        # n = max number of viewport height by seconds : beyond this speed the
        # refresh is delayed to the nex throttle
        MAX_SPEED       = @options.MAX_SPEED


        _scrollHandler = (e) =>
            if noScrollScheduled and isDynamic
                lastOnScroll_Y = @viewPort$.scrollTop
                setTimeout(_adaptBuffer,THROTTLE)
                noScrollScheduled = false


        @_scrollHandler = _scrollHandler


        ###*
         * returns the font-size in px of a given element (context) or of the
         * root element of the document if no context is provided.
         * @param  {element} context Optionnal: an elemment to get the font-size
         * @return {integer} the font-size
        ###
        _getElementFontSize = ( context )->
            # Returns a number of the computed font-size, so in px
            # for the given context
            # or the root <html> element
            return parseFloat(
                getComputedStyle( context or document.documentElement ).fontSize
            )


        _remToPixels=(value)->
            return _emToPixels(value)


        _emToPixels=(value, context)->
            return Math.round(value * _getElementFontSize(context))


        _getDimInPixels = (value)=>
            switch DIMENSIONS_UNIT
                when 'px'
                    return value
                when 'em'
                    return _emToPixels(value, @viewPort$)
                when 'rem'
                    return _remToPixels(value)


        ###*
         * called once for all during _DOM_controlerInit
         * computes the static parameters of the geometry
        ###
        _getStaticDimensions = () =>
            rowHeight         = _getDimInPixels(ROW_HEIGHT)


        ###*
         * Construct the buffer. It will be empty at the end, only ready to be
         * used).
         * The buffer lists all the created rows, keep a reference on the first
         * (top most) and the last (bottom most) line.
         * The buffer is a closed double linked chain.
         * Each element of the chain is a "line" with a previous (prev) and next
           (next) element.
         * "closed" means that buffer.last.prev == buffer.first
         * data structure :
             first   : {line}    # top most line
             firstRk : {integer} # y of the first line of the buffer
             last    : {line}    # bottom most line
             lastRk  : {integer} # y of the last line of the buffer
             nRows   : {integer} # number of rows in the buffer
        ###
        # _constructBuffer = ()=>

        #     row$ = document.createElement('li')
        #     row$.setAttribute('class', 'long-list-rows')
        #     row$.style.height = rowHeight + 'px'
        #     row$.style.width  = rowHeight + 'px'
        #     @rows$.appendChild(row$)

        #     row =
        #         prev : null
        #         next : null
        #         el   : row$
        #         rank : null
        #         id   : null
        #     row.prev = row
        #     row.next = row

        #     buffer =
        #             first   : row  # top most row
        #             firstRk : -1   # rank of the first row of the buffer
        #             last    : row  # bottom most row
        #             lastRk  : -1   # rank of the last row of the buffer
        #             nRows   :  1   # number of rows in the buffer
        #             getRow : (rank)->
        #                 first = this.first
        #                 row   = first
        #                 loop
        #                     if rank == row.rank
        #                         return row
        #                     row = row.prev
        #                     break if row == first
        #                 return null

        #     @buffer = buffer



        ###*
         * Compute all the geometry after a resize or when the list in inserted
         * in the DOM.
         * _adaptBuffer will be executed at the end except if the viewPort has
         * no height (if not inserted in the dom for instance) or there is no
         * row
        ###
        _resizeHandler= ()=>

            # get dimensions.
            viewPortHeight = @viewPort$.clientHeight

            # the viewPort has no height : geometry can not be computed
            # except if some initial width and height has been given
            if viewPortHeight <= 0
                if @initialHeight
                    viewPortHeight = @initialHeight
                else
                    return false

            # if the height of viewport has not change, we can directly adapt
            # buffer
            if viewPortHeight == previousHeight and nRows != 0
                _adaptBuffer()
                return
            previousHeight  = viewPortHeight

            # compute the theorical buffer (theorical because there might not
            # need of such a buffer if there is not many rows added)
            nRowsInViewPort   = Math.ceil(viewPortHeight/rowHeight)
            nRowsInBufrMargin = Math.round(BUFFER_COEF * nRowsInViewPort)
            nRowsInBufr       = nRowsInViewPort + nRowsInBufrMargin*2

            # compute the safe zone
            nRowsInSafeZoneMargin = Math.round(SAFE_ZONE_COEF * nRowsInViewPort)
            nRowsInSafeZone       = nRowsInViewPort + nRowsInSafeZoneMargin*2

            # check there are enough rows to fill the buffer
            if nRows <= nRowsInBufr
                isDynamic = false
            else
                isDynamic = true

            if nRows != 0
                _adaptBuffer()

        @resizeHandler = _resizeHandler


        ###*
         * Adapt the buffer when the viewport has moved out of the safe zone.
         * Launched by initRows and _scrollHandler
        ###
        _adaptBuffer = (force) =>
            noScrollScheduled  = true

            ##
            # 1/ test speed, if too high, relaunch a _scrollHandler
            current_scrollTop = @viewPort$.scrollTop
            speed = Math.abs(current_scrollTop - lastOnScroll_Y) / viewPortHeight
            if speed > MAX_SPEED and not force
                console.log "SPEED TO HIGH :-)"
                _scrollHandler()
                return

            ##
            # 2/ compute safeZone
            bufr = buffer
            VP_firstY  = current_scrollTop
            VP_firstRk = Math.floor(VP_firstY / rowHeight)
            VP_lastY   = current_scrollTop + viewPortHeight
            VP_lastRk  = Math.floor(VP_lastY / rowHeight)
            SZ_firstRk = Math.max(VP_firstRk - nRowsInSafeZoneMargin , 0)
            SZ_lastRk  = SZ_firstRk + nRowsInSafeZone - 1
            # if nRows <= SZ_lastRk
            #     SZ_lastRk = nRows - 1
            #     SZ_firstRk = SZ_lastRk - nRowsInSafeZone + 1 # can not be lower
            #     # than 0, because that would meand there are less rows than in
            #     # the buffer, and in this case the scroll handler don't call
            #     # _adaptBuffer

            ##
            # 3/ detect how the viewport is moving and how to adapt the buffer
            console.log '\n======_adaptBuffer, nRows=', nRows
            console.log 'viewPort firstRk', VP_firstRk, 'lastRk:', VP_lastRk
            console.log 'safeZone firstRk', SZ_firstRk, 'lastRk:', SZ_lastRk
            console.log 'initial buffer   firstRk', bufr.firstRk, 'lastRk:', bufr.lastRk

            nToMove = 0

            if bufr.lastRk < SZ_lastRk
                ##
                # 3.1/ the viewPort is going down and its last line is bellow
                # the last line of the safeZone.
                # => compute new buffer

                newBfr_firstRk = Math.max(VP_firstRk - nRowsInBufrMargin, 0)
                newBfr_lastRk  = newBfr_firstRk + nRowsInBufr - 1
                if nRows <= newBfr_lastRk
                    newBfr_lastRk = nRows - 1
                    newBfr_firstRk = newBfr_lastRk - nRowsInBufr + 1 # can not be
                    # lower than 0, because that would meand there are less rows
                    # than in the buffer, and in this case the scroll handler
                    # don't call _adaptBuffer

                # nToMove = number of rows to move by reusing rows from the top
                # of the buffer in order to fill its bottom
                nToMove = Math.min(newBfr_lastRk - bufr.lastRk, nRowsInBufr)
                targetRk  = Math.max(bufr.lastRk + 1, newBfr_firstRk)

                # console.log 'direction: DOWN',         \
                #             'nToMove:'   + nToMove,    \
                #             'targetRk:'  + targetRk
                # console.log 'new buffer firstRk', newBfr_firstRk, \
                #             'lastRk', newBfr_lastRk

                if nToMove > 0
                    # console.log "there are nToMove=", nToMove,
                    #             "rows to move down after targetRk=", targetRk
                    elemtsToDecorate = _moveBufferToBottom(nToMove, targetRk)
                    @rows$.style.paddingTop = (bufr.firstRk*rowHeight)+'px'
                    @onRowsMovedCB(elemtsToDecorate)
                # else
                #     console.log "viewport goind DOWN but remain in =", nToMove,
                #                 "rows to move down after targetRk=", targetRk


            else if SZ_firstRk < bufr.firstRk
                ##
                # 3.2/ the viewPort is going up and its last line is bellow
                # the last line of the safeZone.
                # => compute new buffer

                newBfr_firstRk = Math.max(VP_firstRk - nRowsInBufrMargin, 0)
                newBfr_lastRk  = newBfr_firstRk + nRowsInBufr - 1

                # nToMove = number of rows to move by reusing rows from the
                # bottom of the buffer in order to fill its top
                nToMove  = Math.min(bufr.firstRk - newBfr_firstRk, nRowsInBufr)
                targetRk = Math.min(bufr.firstRk - 1, newBfr_lastRk)

                # console.log 'direction: UO',           \
                #             'nToMove:'   + nToMove,    \
                #             'targetRk:'  + targetRk
                # console.log 'new buffer firstRk', newBfr_firstRk, \
                #             'lastRk', newBfr_lastRk

                if nToMove > 0
                    # console.log "there are nToMove=", nToMove,
                    #             "rows to move UP before targetRk=", targetRk
                    elemtsToDecorate = _moveBufferToTop(nToMove, targetRk)
                    @rows$.style.paddingTop = (bufr.firstRk*rowHeight)+'px'
                    @onRowsMovedCB(elemtsToDecorate)
                # else
                #     console.log "viewport goind DOWN but remain in =", nToMove,
                #                 "rows to move down after targetRk=", targetRk


            console.log 'moved rows', nToMove
            console.log 'final buffer   firstRk', bufr.firstRk, 'lastRk:', bufr.lastRk

        @_adaptBuffer = _adaptBuffer


        ###*
         * The buffer has been initialized, now we will create its rows elements
         * The buffer lists all the created rows, keep a reference on the first
         * (top most) and the last (bottom most) row.
         * The buffer is a closed double linked chain.
         * Each element of the chain is a "row" with a previous (prev) and next
           (next) element.
         * "closed" means that buffer.last.prev == buffer.first
         * data structure :
             first   : {row}    # top most row
             firstRk : {integer} # y of the first row of the buffer
             last    : {row}    # bottom most row
             lastRk  : {integer} # y of the last row of the buffer
             nRows   : {integer} # number of rows in the buffer
        ###
        _firstPopulateBuffer  = (nToAdd) =>
            # set nRows and init the height of the rows element
            nRows = nToAdd
            @rows$.style.setProperty('height', nRows*rowHeight + 'px')
            # create the rows elements of the buffer
            bufr = buffer
            nToCreate = Math.min(nRows, nRowsInBufr)
            firstCreatedRow = {}
            prevCreatedRow  = firstCreatedRow
            rowsToDecorate = []
            for n in [1..nToCreate] by 1
                row$ = document.createElement('li')
                row$.setAttribute('class', 'long-list-row')
                row$.dataset.rank = n-1
                row$.style.height = rowHeight + 'px'
                @rows$.appendChild(row$)
                row =
                    prev : null
                    next : prevCreatedRow
                    el   : row$
                    rank : n - 1
                prevCreatedRow.prev = row
                prevCreatedRow = row
                rowsToDecorate.push({rank:n-1;el:row$})

            bufr.first   = firstCreatedRow.prev
            bufr.firstRk = 0
            bufr.last    = row
            bufr.first.next = bufr.last
            bufr.last.prev  = bufr.first
            bufr.lastRk  = row.rank
            bufr.nRows   = nToCreate
            @onRowsMovedCB(rowsToDecorate)

        @_firstPopulateBuffer = _firstPopulateBuffer


        ###*
         * Add a bloc of new rows in the current long list.
         * If the insertion is before the buffer or into the buffer, the
         * impacted rows are modified (their rank is increased by nToAdd)
         * If some rows are inserted
         * @param {integer} fromRank first rank where a row will be added
         * @param {integer} nToAdd number of rows to add
        ###
        _addRows = (fromRank, nToAdd)->
            console.log 'LongList._addRows', fromRank, nToAdd
            nRows += nToAdd

            # check there are enough rows to fill the buffer
            if nRows <= nRowsInBufr
                isDynamic = false
            else
                isDynamic = true
            ##
            # case 1 : The insertion is before the buffer
            if fromRank < buffer.firstRk
                scrollTop = @viewPort$.scrollTop
                @rows$.style.setProperty('height', nRows*rowHeight + 'px')
                @viewPort$.scrollTop = scrollTop + nToAdd*rowHeight
                # adapt ranks of the rows of the buffer
                first = buffer.first
                row   = first
                currentRk = first.rank + 1
                loop
                    row.rank = currentRk
                    row.el.dataset.rank = currentRk
                    row = row.prev
                    currentRk += 1
                    break if row = first
                # adapt first & last rank of the buffer
                buffer.firstRk += nToAdd
                buffer.lastRk  += nToAdd
                return

            ##
            # case 2 : The insertion is into the buffer
            else if fromRank < buffer.lastRk
                scrollTop = @viewPort$.scrollTop
                viewport_startRk = Math.floor(scrollTop / rowHeight)

                ##
                # case 2.1 : The insertion is into the buffer but before
                # the viewport
                if fromRank < viewport_startRk
                    # increase rows$ height
                    @rows$.style.setProperty('height', nRows*rowHeight + 'px')
                    # move viewPort
                    @viewPort$.scrollTop = scrollTop + nToAdd*rowHeight
                    # compute the reusable rows
                    nReusableRows = Math.min(nToAdd, fromRank - buffer.firstRk)
                    nRowsToReuse = Math.min(nReusableRows, nToAdd)
                    # reuse the top rows elements
                    rowOfInsertion = buffer.getRow(fromRank)
                    for n in [1..nRowsToReuse] by 1
                        elToMove = buffer.first.el
                        @rows$.insertBefore(elToMove, rowOfInsertion.el)
                        row = buffer.first
                        loop
                            row.el = row.prev.el
                            row = row.prev
                            break if row == rowOfInsertion
                        row.el = elToMove
                        row.rank = fromRank + n - 1
                    # increase the rank of the rows in buffer after the fromRank
                    # row (included)
                    first = buffer.first
                    row = rowOfInsertion
                    loop
                        row.rank += nToAdd
                        row = row.prev
                        break if row.prev == buffer.last
                    buffer.lastRk += nToAdd
                    # adapt margin of the first element of the buffer
                    buffer.first.el.style.topMargin = buffer.first.rank * rowHeight


                ##
                # case 2.2 : The insertion is into the buffer but into
                # the start of the viewport
                else if fromRank < viewport_endRk
                    d
                    # TODO

            ##
            # case 3 : The insertion is after the buffer
            else if buffer.lastRk < fromRank
                @rows$.style.setProperty('height', nRows*rowHeight + 'px')


        @_addRows = _addRows


        ###*
         * Remove rows
         * @param  {Integer|Element} fromRank  Rank  of the first row to delete,
         *                           or reference to the element of the row.
         * @param  {Integer} nToRemove Number of rows to delete from fromRank
        ###
        _removeRows = (fromRank, nToRemove) ->
            if typeof fromRank != "number"
                fromRank = parseInt(fromRank.dataset.rank)
            toRank = fromRank + nToRemove - 1
            nRows -= nToRemove
            # check there are enough rows to fill the buffer
            if nRows <= nRowsInBufr
                isDynamic = false
            else
                isDynamic = true
            # delete rows one by one
            scrollTopDelta = 0
            for rk in [fromRank..toRank] by 1
                scrollTopDelta += _removeRow(rk)
            @viewPort$.scrollTop += scrollTopDelta


        ###*
         * prerequisite : nRows and isDynamic must have been updated before
         * _removeRow is called
         * @return  {number} scrollTopDelta : delta in px that the scrollTop of
         *                   the viewport should vary.
        ###
        _removeRow = (fromRank) =>

            ##
            # case 1 : The deletion is before the buffer
            if fromRank < buffer.firstRk
                @rows$.style.setProperty('height', nRows*rowHeight + 'px')
                # adapt ranks of the rows of the buffer
                first     = buffer.first
                row       = first
                currentRk = first.rank - 1
                buffer.firstRk = currentRk
                loop
                    row.rank = currentRk
                    row.el.dataset.rank = currentRk
                    row = row.prev
                    currentRk += 1
                    break if row == first
                # adapt last rank of the buffer
                buffer.lastRk  = currentRk - 1
                @rows$.style.paddingTop = (buffer.firstRk*rowHeight)+'px'
                # return the scrollTopDelta
                return - rowHeight

            ##
            # case 2 : The deletion is into the buffer
            else if fromRank <= buffer.lastRk
                scrollTop = @viewPort$.scrollTop
                viewport_startRk = Math.floor(scrollTop / rowHeight)
                viewport_endRk = viewport_startRk + nRowsInViewPort - 1

                ##
                # deletion is into the buffer but before the viewport
                # => adjust scrollTop in order not to move visible rows
                if fromRank < viewport_startRk
                    scrollTopDelta = - rowHeight
                # => otherwise don't change the scrollTop
                else
                    scrollTopDelta = 0

                # get row element
                row = _getRowAt(fromRank)
                # decrease rows$ height
                @rows$.style.setProperty('height', nRows*rowHeight + 'px')

                ##
                # case 2.1
                # test if the row element can be reused on top of the buffer (ie
                # if there are rows above the buffer)
                # If yes, the element will be moved on top of the buffer and
                # redecorated
                if 0 < buffer.firstRk
                    first = buffer.first
                    last  = buffer.last
                    if row == last
                        buffer.first = last
                        buffer.last = last.next
                        @rows$.insertBefore(row.el, first.el)
                    else if row != first
                        prev         = row.prev
                        next         = row.next
                        prev.next    = next
                        next.prev    = prev
                        row.prev     = first
                        row.next     = last
                        first.next   = row
                        last.prev    = row
                        buffer.first = row
                        @rows$.insertBefore(row.el, first.el)
                    # adapt ranks of the rows of the buffer
                    first      = row
                    currentRow = row
                    currentRk  = buffer.firstRk - 1
                    buffer.firstRk = currentRk
                    loop
                        currentRow.rank = currentRk
                        currentRow.el.dataset.rank = currentRk
                        currentRow = currentRow.prev
                        currentRk += 1
                        break if currentRow == first
                    # adapt last rank of the buffer
                    buffer.lastRk  = currentRk - 1
                    @rows$.style.paddingTop = (buffer.firstRk*rowHeight)+'px'
                    # redecorate the only element really modified
                    @onRowsMovedCB([{el:row.el,rank:row.rank}])
                    return scrollTopDelta

                ##
                # case 2.2
                # the row element can be reused on the bottom of the
                # buffer (ie there are rows under the buffer)
                # The element will be moved at the bottom of the buffer and
                # redecorated
                else if buffer.lastRk < nRows - 1
                    first = buffer.first
                    last  = buffer.last
                    if row == first
                        buffer.last  = first
                        buffer.first = first.prev
                        @rows$.appendChild(row.el)
                        firstImpactedRow = buffer.first
                    else if row != last
                        prev        = row.prev
                        next        = row.next
                        prev.next   = next
                        next.prev   = prev
                        row.prev    = first
                        row.next    = last
                        first.next  = row
                        last.prev   = row
                        buffer.last = row
                        @rows$.appendChild(row.el)
                        firstImpactedRow = prev
                    else # row == buffer.last
                        firstImpactedRow = row
                    # adapt ranks of the rows of the buffer
                    first      = buffer.first
                    currentRow = firstImpactedRow
                    currentRk  = fromRank
                    loop
                        currentRow.rank = currentRk
                        currentRow.el.dataset.rank = currentRk
                        currentRow = currentRow.prev
                        currentRk += 1
                        break if currentRow == first
                    # redecorate the only element really modified
                    @onRowsMovedCB([{el:row.el,rank:row.rank}])
                    return scrollTopDelta

                ##
                # case 2.3
                # There are no rows nor above nor under the buffer,
                # just destrop the row from the buffer.
                else
                    # the buffer is now smaller than the number of rows
                    # TODO
                    isDynamic = false
                    isReusable = false
                    return scrollTopDelta


            ##
            # case 3 : The insertion is after the buffer
            else if buffer.lastRk < fromRank
                @rows$.style.setProperty('height', nRows*rowHeight + 'px')




        @_removeRows = _removeRows


        ###*
         * move `nToMove` rows from top of the buffer to its bottom and will
         * have their rank starting at `newRk`
         * @param  {Integer} nToMove Nomber of rows to move
         * @param  {Integer} newRk rank of insertion of the first element at the
         *                         bottom of the buffer
        ###
        _moveBufferToBottom= (nToMove, newRk)=>
            bufr = buffer
            # TODO : enhancement : fill elemtsToDecorate in order of interest
            # of decoration (decorate first the row visible in the viewport,
            # usefull for images that will take time to download after
            # decoration)
            # idea :
            # rowsToDecorateLast = []
            # if bufr.lastRk < VP_firstRk
            #     rowsToDecorateLast
            # ...
            # elemtsToDecorate = rowsToDecorateLast.join(elementsToDecorate1st)
            elemtsToDecorate = []
            row  = bufr.first
            for rk in [newRk..newRk+nToMove-1] by 1
                row.rank = rk
                row.el.dataset.rank = rk
                @rows$.appendChild(row.el)
                elemtsToDecorate.push({el:row.el,rank:rk})
                row = row.prev
            bufr.first   = row
            bufr.last    = row.next
            bufr.firstRk = bufr.first.rank
            bufr.lastRk  = rk - 1
            return elemtsToDecorate


        ###*
         * move `nToMove` rows from bottom of the buffer to its top and will
         * have their rank starting at `newRk`
         * @param  {Integer} nToMove Nomber of rows to move
         * @param  {Integer} newRk rank of insertion of the first element at the
         *                         top of the buffer
        ###
        _moveBufferToTop = (nToMove, newRk)=>
            bufr = buffer
            elemtsToDecorate = []
            row  = bufr.last
            firstEl = bufr.first.el
            for rk in [newRk..newRk-nToMove+1] by -1
                row.rank = rk
                row.el.dataset.rank = rk
                @rows$.appendChild(row.el)
                @rows$.insertBefore(row.el, firstEl)
                elemtsToDecorate.push({el:row.el,rank:rk})
                firstEl = row.el
                row     = row.next
            bufr.last    = row
            bufr.first   = row.prev
            bufr.lastRk  = bufr.last.rank
            bufr.firstRk = rk + 1
            return elemtsToDecorate


        # construct the buffer
        @_initBuffer = () ->
            # if the buffer is not empty, remove all elements of rows$
            if buffer
                @rows$.innerHTML = ''
                @rows$.style.height = '0px'
                @rows$.style.paddingTop = '0px'
                @viewPort$.scrollTop = 0

            buffer =
                first   : null   # top most row
                firstRk : -1     # rank of the first row of the buffer
                last    : null   # bottom most row
                lastRk  : -1     # rank of the last row of the buffer
                nRows   : null   # number of rows in the buffer
                getRow  : (rank)->
                    first = this.first
                    row   = first
                    loop
                        if rank == row.rank
                            return row
                        row = row.prev
                        break if row == first
                    return null
        ####
        # Get the dimensions (rowHeight)
        _getStaticDimensions()
        ####
        # compute the geometry
        _resizeHandler()
        ####
        # bind events
        # @rows$.addEventListener(   'click'      , @_clickHandler    )
        # @rows$.addEventListener(   'dblclick'   , @_dblclickHandler )
        @viewPort$.addEventListener( 'scroll'     , _scrollHandler    )
        # @index$.addEventListener(    'click'      , _indexClickHandler)
        # @index$.addEventListener(    'mouseenter' , _indexMouseEnter  )
        # @index$.addEventListener(    'mouseleave' , _indexMouseLeave  )

        ###*
         * retuns the element corresponding to the row of the given rank or null
         * if this row is outside the buffer.
        ###
        _getRowAt = (rank)->
            if rank < buffer.firstRk
                return null
            else if rank <= buffer.lastRk
                row = buffer.first
                i   = rank - buffer.firstRk
                while i--
                    row = row.prev
                return row
            else
                return null
        @_getRowAt = _getRowAt


        @getLength = () ->
            return nRows

        ###*
         * get an array of the rows elements in the buffer after rank (included)
         * @param  {Integer} rank Rank of the first row
         * @return {Array}      [{rank:Integer, el:Element}, ...], [] if the
         *                      rank is not in the buffer.
        ###
        _getRowsAfter = (rank)->
            res = []
            # the row is after the buffer, return empty array.
            if rank > buffer.lastRk
                return res
            # get the row
            first = buffer.first
            row = _getRowAt(rank)
            # the row is above the buffer : return all buffer
            if row == null
                row = buffer.first
            # fetch all the rows after and return
            loop
                res.push({el:row.el, rank:row.rank})
                row = row.prev
                break if row == first
            return res

        @getRowsAfter = _getRowsAfter




################################################################################
## FUNCTIONS FOR TESTS AND DEBUG ##
#

        _goDownHalfBuffer = (ratio) =>
            if typeof(ratio) != 'number'
                ratio = 0.5
            scrollTop = @viewPort$.scrollTop
            bufferHeight = buffer.nRows * rowHeight
            @viewPort$.scrollTop = scrollTop + Math.round(bufferHeight*ratio)
            # force _adaptBuffer in order to remain sync (otherwise you have to
            # wait for the scroll event so that the buffer gets adapted)
            _adaptBuffer(true)
        @_test.goDownHalfBuffer = _goDownHalfBuffer


        _goUpHalfBuffer = (ratio) =>
            if typeof(ratio) != 'number'
                ratio = 0.5
            scrollTop = @viewPort$.scrollTop
            bufferHeight = buffer.nRows * rowHeight
            @viewPort$.scrollTop = scrollTop - Math.round(bufferHeight*ratio)
        @_test.goUpHalfBuffer = _goUpHalfBuffer


        _getState = () =>
            current_scrollTop = @viewPort$.scrollTop
            bufr = buffer
            VP_firstY  = current_scrollTop
            VP_firstRk = Math.floor(VP_firstY / rowHeight)
            VP_lastY   = current_scrollTop + viewPortHeight
            VP_lastRk  = Math.floor(VP_lastY / rowHeight)
            SZ_firstRk = Math.max(VP_firstRk - nRowsInSafeZoneMargin , 0)
            SZ_lastRk  = SZ_firstRk + nRowsInSafeZone - 1
            state =
                buffer:
                    firstRk : buffer.firstRk
                    lastRk  : buffer.lastRk
                viewport :
                    firstRk : VP_firstRk
                    lastRk  : VP_lastRk
                safeZone :
                    firstRk : SZ_firstRk
                    lastRk  : SZ_lastRk
                nRows    : nRows
                rowHeight: rowHeight
                height : parseInt(@rows$.style.height)
            return state
        @_test.getState = _getState

        @_test.unActivateScrollListener = () =>
            @viewPort$.removeEventListener( 'scroll', _scrollHandler )


