################################################################################
# -- USAGE --
#
#   # creation :
#
#       onLinesMovedCB = (nMoved, firstRank, nToStart, direction, rows)->
#           # nMoved    : number of lines moved (==rows.length)
#           # firstRank : integer, lowest rank of the moved rows ( note that
#           #             lastRank == firstRank + nMoved - 1)
#           # rows      : Array of rows elements in the DOM, sorted in order for
#           #             refresh (the most usefull to refresh is the first one)
#
#       viewPortElement = $('.longListViewPort')[0] # the viewport element
#
#       options =
#           # unit used for the dimensions (px,em or rem)
#           DIMENSIONS_UNIT : 'em'
#
#           # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
#           LINE_HEIGHT     : 2
#
#           # number of "screens" before and after the viewport
#           # (ex : 1.5 => 1+2*1.5=4 screens always ready)
#           COEF_SECURITY   : 3
#
#           # minimum duration between two refresh after scroll (ms)
#           THROTTLE        : 450
#
#           # n = max number of viewport height by seconds : beyond this speed the
#           # refresh is delayed to the nex throttle
#           MAX_SPEED       : 1.5
#
#       longList = new LongList(viewPortElement, options, onLinesMovedCB)
#       doActions() ...
#
#
#   # if the the viewPortElement is not initialy attached in the DOM, then call
#   resizeHandler when the viewPortElement is attached :
#       longList.resizeHandler()
#
#   # USELESS SO FAR : if geometry changes : longList.removeAll() and then
#   # create a new LongList()
#   # when the geometry of the parent changes (height of viewPortElement) :
#       longList.resizeHandler()
#
#   # to add initial new lines
#   # if some are already in, they will be removed
#       longList.initLines(nToAdd)
#
#   # to add lines
#       longList.add(fromRank, nToAdd)
#
#   # to remove some lines
#       longList.remove(fromRank, nToRemove)
#
#   # to remove all lines
#       longList.removeAll()


module.exports = class LongListItems

################################################################################
## PUBLIC SECTION ##
#

    constructor: (@externalViewPort$, options, onLinesMovedCB) ->
        options.MAX_SPEED = options.MAX_SPEED  * options.THROTTLE / 1000

        ####
        # get elements (name ends with '$')
        @viewPort$ = document.createElement('div')
        @viewPort$.classList.add('viewport')
        @externalViewPort$.appendChild(@viewPort$)
        @thumbs$   = document.createElement('div')
        @thumbs$.classList.add('thumbs')
        @viewPort$.appendChild(@thumbs$)
        ####
        # set position
        @viewPort$.style.position = 'relative'
        ####
        # adapt buffer to the initial geometry
        @_DOM_controlerInit()


    # if some are already in, they will be removed
    initLines: (nToAdd) ->

    # to add new lines
    add: (fromRank, nToAdd) ->

    # to remove some lines
    remove: (fromRank, nToRemove) ->

    # to remove all lines
    removeAll: () ->

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
        buffer                 = null
        previousHeight         = null
        rowHeight              = null
        nRowsInSafeZoneMargin  = null
        nRowsInSafeZone        = null
        viewPortHeight         = null
        lastOnScroll_Y         = null
        current_scrollTop      = null
        safeZone =
            startY             : null
            endY               : null
            firstVisibleRk     : null


        _scrollHandler = (e) =>
            if @noScrollScheduled
                lastOnScroll_Y = @viewPort$.scrollTop
                setTimeout(_adaptBuffer,THROTTLE)
                @noScrollScheduled = false


        @_scrollHandler = _scrollHandler


        ###*
         * returns the font-size in px of a given element (context) or of the
         * root element of the document if no context is provided.
         * @param  {element} context Optionnal: an elemment to get the font-size
         * @return {integer}         the font-size
        ###
        getElementFontSize = ( context )->
            # Returns a number
            return parseFloat(
                # of the computed font-size, so in px
                    # for the given context
                    # or the root <html> element
                getComputedStyle( context or document.documentElement ).fontSize
            )


        remToPixels=(value)->
            return emToPixels(value)


        emToPixels=(value, context)->
            return Math.round(value * getElementFontSize(context))


        _getDimInPixels = (value)=>
            switch THUMB_DIM_UNIT
                when 'px'
                    return value
                when 'em'
                    return emToPixels(value, @viewPort$)
                when 'rem'
                    return remToPixels(value)


        ###*
         * called once for all during _DOM_controlerInit
         * computes the static parameters of the geometry
        ###
        _getStaticDimensions = () =>
            thumbHeight       = _getDimInPixels(THUMB_HEIGHT)
            cellPadding       = _getDimInPixels(CELL_PADDING)
            @thumbHeight      = thumbHeight
            thumbWidth        = thumbHeight
            colWidth          = thumbWidth  + cellPadding
            rowHeight         = thumbHeight + cellPadding
            monthHeaderHeight = _getDimInPixels(MONTH_HEADER_HEIGHT)
            monthTopPadding   = monthHeaderHeight + cellPadding
            monthLabelTop     = _getDimInPixels(MONTH_LABEL_TOP)
            @monthLabelTop    = monthLabelTop


        ###*
         * Initialize the buffer.
         * The buffer lists all the created lines, keep a reference on the first
         * (top most) and the last (bottom most) line.
         * The buffer is a closed double linked chain.
         * Each element of the chain is a "line" with a previous (prev) and next
           (next) element.
         * "closed" means that buffer.last.prev == buffer.first
         * data structure :
             first  : {line}    # top most line
             firstY : {integer} # y of the first line of the buffer
             last   : {line}    # bottom most line
             lastY  : {integer} # y of the last line of the buffer
             nlines : {integer} # number of lines in the buffer
        ###
        _initBuffer = ()=>

            line$ = document.createElement('li')
            line$.setAttribute('class', 'long-list-line')
            line$.style.height = lineHeight + 'px'
            line$.style.width  = lineHeight + 'px'
            @lines$.appendChild(line$)

            line =
                prev : line
                next : line
                el   : line$
                rank : null
                id   : null

            buffer =
                    first   : line  # top most line
                    firstY  : -1    # rank of the first image of the buffer
                    last    : line  # bottom most line
                    lastY  : -1     # rank of the last image of the buffer
                    nlines :  1     # number of lines in the buffer

            @buffer = buffer



        ###*
         * Compute all the geometry after a resize or when the list in inserted
         * in the DOM.
         * _adaptBuffer will be executed at the end except if the viewPort has
         * no height (if not inserted in the dom for instance)
        ###
        _resizeHandler= ()=>
            ##
            # 1/ GET DIMENSIONS.
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
            if viewPortHeight == previousHeight
                _adaptBuffer()
                return
            previousHeight  = VP_width

            # compute the safe zone margin
            nRowsInViewPort       = Math.ceil(viewPortHeight/rowHeight)
            nRowsInSafeZoneMargin = Math.round(COEF_SECURITY * nRowsInViewPort)
            nThumbsInSZ_Margin    = nRowsInSafeZoneMargin * nThumbsPerRow
            nThumbsInViewPort     = nRowsInViewPort * nThumbsPerRow
            nThumbsInSafeZone     = nThumbsInSZ_Margin*2 + nThumbsInViewPort
            _adaptBuffer()

        @resizeHandler = _resizeHandler


        ###*
         * Adapt the buffer when the viewport has moved.
         * Launched at init and by _scrollHandler
         * Steps :
        ###
        _adaptBuffer = () =>
            @noScrollScheduled      = true
            ##
            # 1/ test speed, if too high, relaunch a _scrollHandler
            current_scrollTop = @viewPort$.scrollTop
            speed = Math.abs(current_scrollTop - lastOnScroll_Y) / viewPortHeight
            if speed > MAX_SPEED
                _scrollHandler()
                return

            ##
            # 2/ compute safeZone
            bufr = buffer
            safeZone =
                firstY         : null
                firstRk        : null
                lastY          : null
                lastRk         : null
                firstVisibleRk : null
            _computeSafeZone()


            console.log '\n======_adaptBuffer==beginning======='
            console.log 'safeZone', JSON.stringify(safeZone,2)
            console.log 'bufr', bufr
            VP_endY = current_scrollTop + viewPortHeight
            VP_endRk = Math.floor(VP_endY / rowHeight)
            if VP_endRk > safeZone.lastRk
                # 3.1/ the viewPort is going down and its last line is bellow
                # the last line of the safeZone
                #
                # nToFind = number of thumbs to find (by reusing thumbs from the
                # buffer or by creation new ones) in order to fill the bottom of
                # the safeZone
                nToFind = \
                    Math.min(safeZone.lastRk - VP_endRk, nThumbsInSafeZone)
                # the  available thumbs are the ones in the buffer and above
                # the safeZone
                # (rank greater than buffer.firstRk but lower
                # than safeZone.firstRk)
                nAvailable = safeZone.firstRk - bufr.firstRk
                if nAvailable < 0
                    nAvailable = 0
                if nAvailable > bufr.nThumbs
                    nAvailable = bufr.nThumbs

                nToCreate = Math.max(nToFind - nAvailable, 0)
                nToMove   = nToFind - nToCreate

                if safeZone.firstRk <= bufr.lastRk
                    # part of the buffer is in the safe zone : add thumbs after
                    # the last thumb of the buffer
                    _getBufferNextLast()
                    targetRk      = bufr.nextLastRk
                    targetMonthRk = bufr.nextLastMonthRk
                    targetCol     = bufr.nextLastCol
                    targetY       = bufr.nextLastY

                else
                    # the safeZone is completely bellow the buffer : add thumbs
                    # bellow the top of the safeZone.
                    targetRk      = safeZone.firstRk
                    targetMonthRk = safeZone.firstMonthRk
                    targetCol     = safeZone.firstCol
                    targetY       = safeZone.firstY

                # console.log 'direction: DOWN',         \
                #             'nToFind:'   + nToFind,    \
                #             'nAvailable:'+ nAvailable, \
                #             'nToCreate:' + nToCreate,  \
                #             'nToMove:'   + nToMove,    \
                #             'targetRk:'  + targetRk,   \
                #             'targetCol'  + targetCol,  \
                #             'targetY'    + targetY

                if nToFind > 0
                    Photo.listFromFiles targetRk, nToFind, (error, res) ->
                        if error
                            console.log error
                        _updateThumb(res.files, res.firstRank)

                if nToCreate > 0
                    [targetY, targetCol, targetMonthRk] =
                        _createThumbsBottom( nToCreate     ,
                                              targetRk     ,
                                              targetCol    ,
                                              targetY      ,
                                              targetMonthRk  )
                    targetRk += nToCreate

                if nToMove > 0
                    # console.log "nToMove",nToMove
                    # console.log "targetRk",targetRk
                    # Photo.listFromFiles targetRk, nToMove, (error, res) ->
                    #     _updateThumb(res.files, res.firstRank)
                    _moveBufferToBottom( nToMove        ,
                                          targetRk      ,
                                          targetCol     ,
                                          targetY       ,
                                          targetMonthRk  )

            else if safeZone.firstRk < bufr.firstRk
                # 2/ the safeZone is going up and the top of the safeZone is
                # above the buffer
                #
                # nToFind = number of thumbs to find (by reusing thumbs from the
                # buffer or by creation new ones) in order to fill the top of
                # the safeZone
                nToFind = Math.min(bufr.firstRk - safeZone.firstRk, nThumbsInSafeZone)
                # the  available thumbs are the ones in the buffer and under
                # the safeZone
                # (rank smaller than buffer.lastRk but higher
                # than safeZone.lastRk)
                nAvailable = bufr.lastRk - safeZone.lastRk
                if nAvailable < 0
                    nAvailable = 0
                if nAvailable > bufr.nThumbs
                    nAvailable = bufr.nThumbs

                nToCreate = Math.max(nToFind - nAvailable, 0)
                nToMove   = nToFind - nToCreate

                if safeZone.lastRk >= bufr.firstRk
                    # part of the buffer is in the safe zone : add thumbs above
                    # the first thumb of the buffer
                    _getBufferNextFirst()
                    targetRk      = bufr.nextFirstRk
                    targetMonthRk = bufr.nextFirstMonthRk
                    targetCol     = bufr.nextFirstCol
                    targetY       = bufr.nextFirstY

                else
                    # the safeZone is completely above the buffer : add thumbs
                    # above the bottom of the safeZone.
                    targetRk      = safeZone.lastRk
                    targetCol     = safeZone.endCol
                    targetMonthRk = safeZone.endMonthRk
                    targetY       = safeZone.endY

                # console.log 'direction: UP',           \
                #             'nToFind:'   + nToFind,    \
                #             'nAvailable:'+ nAvailable, \
                #             'nToCreate:' + nToCreate,  \
                #             'nToMove:'   + nToMove,    \
                #             'targetRk:'  + targetRk,   \
                #             'targetCol'  + targetCol,  \
                #             'targetY'    + targetY

                if nToFind > 0
                    Photo.listFromFiles targetRk - nToFind + 1 , nToFind, (error, res) ->
                        if error
                            console.log error
                        _updateThumb(res.files, res.firstRank)

                if nToCreate > 0
                    throw new Error('It should not be used in the
                        current implementation')
                    [targetY, targetCol, targetMonthRk] =
                        _createThumbsTop(  nToCreate    ,
                                           targetRk     ,
                                           targetCol    ,
                                           targetY      ,
                                           targetMonthRk  )
                    targetRk += nToCreate

                if nToMove > 0
                    _moveBufferToTop( nToMove       ,
                                      targetRk      ,
                                      targetCol     ,
                                      targetY       ,
                                      targetMonthRk  )
            if !nToFind?
                # The buffer was inside the safe zone, there was no modification
                # of the buffer
                safeZone.firstThumbToUpdate   = previous_firstThumbToUpdate

            # console.log '======_adaptBuffer==ending='
            # console.log 'bufr', bufr
            # console.log '======_adaptBuffer==ended======='


        ###*
         * Called when we get from the server the ids of the thumbs that have
         * been created or moved
         * @param  {Array} files     [{id},..,{id}] in chronological order
         * @param  {Integer} fstFileRk The rank of the first file of files
        ###
        _updateThumb = (files, fstFileRk)=>
            # console.log '\n======_updateThumb started ================='
            lstFileRk = fstFileRk + files.length - 1
            bufr      = buffer
            thumb     = bufr.first
            firstThumbToUpdate   = safeZone.firstThumbToUpdate
            firstThumbRkToUpdate = firstThumbToUpdate.rank
            last  = bufr.last
            first = bufr.first
            ##
            # 1/ if firstThumbRkToUpdate is not in the files range (can happen
            # if the safeZone has been updated while waiting for the list of
            # files from the server), then move firstThumbRkToUpdate to the
            # thumb corresponding to first or last file of files.
            if firstThumbRkToUpdate < fstFileRk
                th = firstThumbToUpdate.prev
                while true
                    if th == bufr.first
                        return
                    if th.rank == fstFileRk
                        firstThumbToUpdate   = th
                        firstThumbRkToUpdate = th.rank
                        break
                    th = th.prev
            if lstFileRk < firstThumbRkToUpdate
                th = firstThumbToUpdate.next
                while true
                    if th == bufr.last
                        return
                    if th.rank == lstFileRk
                        firstThumbToUpdate   = th
                        firstThumbRkToUpdate = th.rank
                        break
                    th = th.next
            ##
            # 2/ update src of thumbs that are after the firstThumbRkToUpdate
            # if firstThumbRkToUpdate <= lstFileRk
            #     console.log " update forward: #{firstThumbRkToUpdate}->
            #         #{lstFileRk}"
            #     console.log '   firstThumbRkToUpdate', firstThumbRkToUpdate,   \
            #                    'nFiles', files.length,                         \
            #                    'fstFileRk', fstFileRk,                         \
            #                    'lstFileRk',lstFileRk
            # else
            #     console.log ' update forward: none'
            thumb = firstThumbToUpdate
            for file_i in [firstThumbRkToUpdate-fstFileRk..files.length-1] by 1
                file    = files[file_i]
                fileId = file.id
                thumb$            = thumb.el
                thumb$.file       = file
                thumb$.src        = "files/photo/thumbs/#{fileId}.jpg"
                # thumb$.src        = 'files/photo/thumbs/fast/#{fileId}'
                thumb$.dataset.id = fileId
                thumb.id          = fileId
                thumb             = thumb.prev
                if @state.selected[fileId]
                    thumb$.classList.add('selectedThumb')
                    @state.selected[fileId] = thumb$
                else
                    thumb$.classList.remove('selectedThumb')
            ##
            # 3/ update src of thumbs that are before the firstThumbRkToUpdate
            # if firstThumbRkToUpdate > fstFileRk
            #     console.log " update backward #{firstThumbRkToUpdate-1}->
            #         #{fstFileRk}"
            #     console.log '   firstThumbRkToUpdate', firstThumbRkToUpdate,
            #                    'nFiles', files.length,
            #                    'fstFileRk', fstFileRk,
            #                    'lstFileRk',lstFileRk
            # else
            #     console.log ' update backward: none'
            thumb = firstThumbToUpdate.next
            for file_i in [firstThumbRkToUpdate-fstFileRk-1..0] by -1
                file   = files[file_i]
                fileId = file.id
                thumb$            = thumb.el
                thumb$.file       = file
                thumb$.src        = "files/photo/thumbs/#{fileId}.jpg"
                # thumb$.src        = "files/photo/thumbs/fast/#{fileId}"
                thumb$.dataset.id = fileId
                thumb.id          = fileId
                thumb             = thumb.next
                if @state.selected[fileId]
                    thumb$.classList.add('selectedThumb')
                    @state.selected[fileId] = thumb$
                else
                    thumb$.classList.remove('selectedThumb')
            ##
            # 3/ default selection management : can not be done befor the id of
            # the first thumb is given by the server, that's why it is done here
            if isDefaultToSelect
                @_toggleOnThumb$(bufr.first.el)
                isDefaultToSelect = false

            # console.log '======_updateThumb finished ================='


        _getBufferNextFirst = ()=>
            bufr = buffer
            nextFirstRk     = bufr.firstRk - 1
            if nextFirstRk == -1
                return
            bufr.nextFirstRk     = nextFirstRk

            initMonthRk = safeZone.endMonthRk
            for monthRk in [initMonthRk..0] by -1
                month = months[monthRk]
                if month.firstRk <= nextFirstRk
                    break
            bufr.nextFirstMonthRk = monthRk
            localRk               = nextFirstRk - month.firstRk
            inMonthRow            = Math.floor(localRk/nThumbsPerRow)
            bufr.nextFirstY       = month.y + monthTopPadding + inMonthRow*rowHeight
            bufr.nextFirstCol     = localRk % nThumbsPerRow


        _getBufferNextLast = ()=>
            bufr = buffer
            nextLastRk     = bufr.lastRk + 1
            if nextLastRk == @nPhotos
                return
            bufr.nextLastRk = nextLastRk

            initMonthRk = safeZone.firstMonthRk
            for monthRk in [initMonthRk..months.length-1] by 1
                month = months[monthRk]
                if nextLastRk <= month.lastRk
                    break
            bufr.nextLastMonthRk = monthRk
            localRk              = nextLastRk - month.firstRk
            inMonthRow           = Math.floor(localRk/nThumbsPerRow)
            bufr.nextLastY       = month.y + monthTopPadding + inMonthRow*rowHeight
            bufr.nextLastCol     = localRk % nThumbsPerRow

        ###*
         * after a scroll throttle, will compute the safe zone
        ###
        _computeSafeZone = () =>
            # 1/ init the start of the safe zone at the start of the viewport
            _SZ_initStartPoint()
            # 2/ move the start of the safe zone in order to have a margin
            _SZ_setMarginAtStart()
            # 3/ init the end of the safe zone: start of SZ + nb of thumbs in SZ
            hasReachedLastPhoto = _SZ_initEndPoint()
            # 4/ if the end of SZ is at the last photo, move up the start of the
            # SZ in order to have if possible nThumbsInSafeZone
            if hasReachedLastPhoto
                _SZ_bottomCase()


        _SZ_initStartPoint = ()=>
            SZ = safeZone
            Y = @viewPort$.scrollTop
            for month, monthRk in @months
                if month.yBottom > Y
                    break
            inMonthRow = Math.floor((Y-month.y-monthTopPadding)/rowHeight)
            if inMonthRow < 0
                # happens if the viewport is in the header of a month
                inMonthRow = 0
            SZ.firstRk            = month.firstRk + inMonthRow * nThumbsPerRow
            SZ.firstY             = month.y + monthTopPadding + inMonthRow * rowHeight
            SZ.firstMonthRk       = monthRk
            SZ.firstCol           = 0
            SZ.firstThumbToUpdate = null
            SZ.firstInMonthRow    = inMonthRow
            SZ.firstVisibleRk     = SZ.firstRk # true because it is the init of SZ
            _selectCurrentIndex(monthRk)


        _SZ_setMarginAtStart= () =>
            SZ = safeZone
            inMonthRow = SZ.firstInMonthRow - nRowsInSafeZoneMargin

            if inMonthRow >= 0
                # the row that we are looking for is in the current month
                # (monthRk and col are not changed then)
                month = @months[SZ.firstMonthRk]
                SZ.firstRk = month.firstRk + inMonthRow * nThumbsPerRow
                SZ.firstY  = month.y + monthTopPadding + inMonthRow*rowHeight
                SZ.firstInMonthRow = inMonthRow
                return

            else
                # the row that we are looking for is before the current month
                # (col remains 0)
                rowsSeen = SZ.firstInMonthRow
                for j in [SZ.firstMonthRk-1..0] by -1
                    month = @months[j]
                    if rowsSeen + month.nRows >= nRowsInSafeZoneMargin
                        inMonthRow         = month.nRows - nRowsInSafeZoneMargin + rowsSeen
                        SZ.firstRk         = month.firstRk + inMonthRow * nThumbsPerRow
                        SZ.firstY          = month.y + monthTopPadding + inMonthRow*rowHeight
                        SZ.firstInMonthRow = inMonthRow
                        SZ.firstMonthRk    = j
                        return

                    else
                        rowsSeen += month.nRows

            SZ.firstRk         = 0
            SZ.firstMonthRk    = 0
            SZ.firstInMonthRow = 0
            SZ.firstCol        = 0
            SZ.firstY          = monthTopPadding


        ###*
         * Finds the end point of the safeZone.
         * Returns true if the safeZone end pointer should be after the last
         * thumb
        ###
        _SZ_initEndPoint = () =>
            SZ = safeZone
            lastRk = SZ.firstRk + nThumbsInSafeZone - 1
            # 1/ check if end of safeZone should be after the last thumb
            if lastRk >= @nPhotos
                lastRk = @nPhotos - 1
                safeZone.lastRk = lastRk
                # other safeZone end info are useless (safeZone is going down)
                return true
            # 2/ otherwise find the month containing the last thumb of the SZ
            for monthRk in [SZ.firstMonthRk..months.length-1]
                month = months[monthRk]
                if lastRk <= month.lastRk
                    break
            # 3/ update safeZoone data
            inMonthRk  = lastRk - month.firstRk
            inMonthRow = Math.floor(inMonthRk/nThumbsPerRow)
            safeZone.lastRk     = lastRk
            safeZone.endMonthRk = monthRk
            safeZone.endCol     = inMonthRk % nThumbsPerRow
            safeZone.endY       = month.y         +
                                  monthTopPadding +
                                  inMonthRow*rowHeight
            return false


        _SZ_bottomCase = ()=>
            SZ = safeZone
            months       = @months
            monthRk      = months.length - 1
            thumbsSeen   = 0
            thumbsTarget = nThumbsInSafeZone
            for monthRk in [monthRk..0] by -1
                month = months[monthRk]
                thumbsSeen += month.nPhotos
                if thumbsSeen >= thumbsTarget
                    break
            if thumbsSeen < thumbsTarget
                # happens if the number of photo is smaller than the number
                # in safezone (nThumbsInSafeZone), it means that safe zone
                # begins at the first photo
                SZ.firstMonthRk    = 0
                SZ.firstInMonthRow = 0
                SZ.firstRk         = 0
                SZ.firstY          = month.y + cellPadding + monthHeaderHeight
            else
                rk         = @nPhotos - thumbsTarget
                inMonthRk  = rk - month.firstRk
                inMonthRow = Math.floor(inMonthRk / nThumbsPerRow)

                SZ.firstMonthRk    = monthRk
                SZ.firstInMonthRow = inMonthRow
                SZ.firstCol        = inMonthRk % nThumbsPerRow
                SZ.firstRk         = rk
                SZ.firstY          = month.y           +
                                     cellPadding       +
                                     monthHeaderHeight +
                                     inMonthRow * rowHeight


        _createThumbsBottom = (nToCreate, startRk, startCol, startY, monthRk) =>
            bufr     = buffer
            rowY     = startY
            col      = startCol
            month    = @months[monthRk]
            localRk  = startRk - month.firstRk
            lastLast = bufr.last
            for rk in [startRk..startRk+nToCreate-1] by 1
                if localRk == 0 then _insertMonthLabel(month)
                thumb$ = document.createElement('img')
                thumb$.dataset.rank = rk
                thumb$.setAttribute('class', 'long-list-thumb')
                thumb =
                    next    : bufr.last
                    prev    : bufr.first
                    el      : thumb$
                    rank    : rk
                    monthRk : monthRk
                    id      : null
                if rk == safeZone.firstVisibleRk
                    safeZone.firstThumbToUpdate = thumb
                bufr.first.next = thumb
                bufr.last.prev  = thumb
                bufr.last       = thumb
                style        = thumb$.style
                style.top    = rowY + 'px'
                style.left   = (marginLeft + col*colWidth) + 'px'
                style.height = thumbHeight + 'px'
                style.width  = thumbHeight + 'px'

                @thumbs$.appendChild(thumb$)
                localRk += 1
                if localRk == month.nPhotos
                    # jump to a new month
                    monthRk += 1
                    month    = @months[monthRk]
                    localRk  = 0
                    col      = 0
                    rowY    += rowHeight + monthTopPadding
                else
                    # go to next column or to a new row if we are at last column
                    col  += 1
                    if col is nThumbsPerRow
                        rowY += rowHeight
                        col   = 0
            bufr.lastRk   = rk - 1
            bufr.nThumbs += nToCreate
            # if the first visible thumb has not bee created, then the first
            # thumb to update will be the first created thumb (lastLast.prev :-)
            if safeZone.firstThumbToUpdate == null
                safeZone.firstThumbToUpdate = lastLast.prev
            # store the parameters of the thumb that is just after the last one
            bufr.nextLastRk      = rk
            bufr.nextLastCol     = col
            bufr.nextLastY       = rowY
            bufr.nextLastMonthRk = monthRk

            return [rowY, col, monthRk]


        _moveBufferToBottom= (nToMove, startRk, startCol, startY, monthRk)=>
            monthRk_initial = monthRk
            rowY    = startY
            col     = startCol
            month   = @months[monthRk]
            localRk = startRk - month.firstRk

            # by default the firstThumbToUpdate will be the first moved down
            # (ie buffer.first :-)
            if safeZone.firstThumbToUpdate == null
                safeZone.firstThumbToUpdate = buffer.first

            for rk in [startRk..startRk+nToMove-1] by 1
                if localRk == 0
                    _insertMonthLabel(month)
                thumb = buffer.first
                thumb$              = thumb.el
                thumb$.dataset.rank = rk
                thumb.rank          = rk
                thumb.monthRk       = monthRk
                thumb$.src          = ''
                thumb$.dataset.id   = ''
                style      = thumb$.style
                style.top  = rowY + 'px'
                style.left = (marginLeft + col*colWidth) + 'px'
                # if during the move of the thumbs we meet the thumb with the
                # firstVisibleRk, then this thumb is the firstThumbToUpdate
                if rk == safeZone.firstVisibleRk
                    safeZone.firstThumbToUpdate = thumb
                buffer.last      = buffer.first
                buffer.first     = buffer.first.prev
                buffer.firstRk   = buffer.first.rank
                buffer.last.rank = rk
                localRk += 1
                if localRk == month.nPhotos
                    # jump to a new month
                    monthRk += 1
                    month    = @months[monthRk]
                    localRk  = 0
                    col      = 0
                    rowY    += rowHeight + monthTopPadding
                else
                    # go to next column or to a new row if we are at last column
                    col  += 1
                    if col is nThumbsPerRow
                        rowY += rowHeight
                        col   = 0

            # console.log 'firstThumbToUpdate (_moveBufferToBottom)', safeZone.firstThumbToUpdate.el
            buffer.lastRk  = rk - 1
            buffer.firstRk = buffer.first.rank
            # store the parameters of the thumb that is just after the last one
            buffer.nextLastRk      = rk
            buffer.nextLastCol     = col
            buffer.nextLastY       = rowY
            buffer.nextLastMonthRk = monthRk


        _moveBufferToTop= (nToMove, startRk, startCol, startY, monthRk)=>
            rowY    = startY
            col     = startCol
            month   = @months[monthRk]
            localRk = startRk - month.firstRk

            # by default the firstThumbToUpdate will be the first moved down
            # (ie buffer.first :-)
            if safeZone.firstThumbToUpdate == null
                safeZone.firstThumbToUpdate = buffer.last

            for rk in [startRk..startRk-nToMove+1] by -1
                thumb               = buffer.last
                thumb$              = thumb.el
                thumb$.dataset.rank = rk
                thumb.rank          = rk
                thumb.monthRk       = monthRk
                thumb$.src          = ''
                thumb$.dataset.id   = ''
                style               = thumb$.style
                style.top           = rowY + 'px'
                style.left          = (marginLeft + col*colWidth) + 'px'
                # if during the move of the thumbs we meet the thumb with the
                # firstVisibleRk, then this thumb is the firstThumbToUpdate
                if rk == safeZone.firstVisibleRk
                    safeZone.firstThumbToUpdate = thumb
                buffer.first      = buffer.last
                buffer.last       = buffer.last.next
                buffer.lastRk     = buffer.last.rank
                buffer.first.rank = rk
                localRk          -= 1
                if localRk == -1
                    if rk == 0
                        rk = -1
                        break
                    # jump to a new month
                    _insertMonthLabel(month)
                    monthRk -= 1
                    month    = @months[monthRk]
                    localRk  = month.nPhotos - 1
                    col      = month.lastThumbCol
                    rowY    -= cellPadding + monthHeaderHeight + rowHeight
                else
                    # go to next column or to a new row if we are at last column
                    col  -= 1
                    if col is -1
                        rowY -= rowHeight
                        col   = nThumbsPerRow - 1

            # console.log 'firstThumbToUpdate (_moveBufferToTop)',
            #             safeZone.firstThumbToUpdate.el
            buffer.firstRk = rk + 1
            buffer.lastRk  = buffer.last.rank


        _insertMonthLabel = (month)=>
            if month.label$
                label$ = month.label$
            else
                label$ = document.createElement('div')
                label$.classList.add('long-list-month-label')
                @thumbs$.appendChild(label$)
                month.label$ = label$
            label$.textContent = month.date.format('MMMM YYYY')
            label$.style.top   = (month.y + monthLabelTop) + 'px'
            label$.style.left  = Math.round(marginLeft/2) + 'px'


        _indexClickHandler = (e) =>
            monthRk = e.target.dataset.monthRk
            if monthRk
                @viewPort$.scrollTop = @months[monthRk].y
                _adaptIndex()


        _indexMouseEnter = () =>
            @index$.classList.add('hardVisible')
            indexVisible = false


        _indexMouseLeave = () =>
            @index$.classList.add('visible')
            @index$.classList.remove('hardVisible')
            lazyHideIndex()

        ####
        # Get the geometry
        _getStaticDimensions()
        _initBuffer()
        _resizeHandler()
        isDefaultToSelect = true

        ####
        # bind events
        @thumbs$.addEventListener(   'click'      , @_clickHandler    )
        @thumbs$.addEventListener(   'dblclick'   , @_dblclickHandler )
        @viewPort$.addEventListener( 'scroll'     , _scrollHandler    )
        @index$.addEventListener(    'click'      , _indexClickHandler)
        @index$.addEventListener(    'mouseenter' , _indexMouseEnter  )
        @index$.addEventListener(    'mouseleave' , _indexMouseLeave  )
