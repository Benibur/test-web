
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    $('body').html( require('body')() )

    startContainerSelect = $ '#startContainerSelect'
    endContainerSelect   = $ '#endContainerSelect'
    startOffSetInput     = $ '#startOffSetInput'
    endOffSetInput       = $ '#endOffSetInput'
    setStartContainerBtn = $ '#setStartContainerBtn'
    setEndContainerBtn   = $ '#setEndContainerBtn'
    testChromeBtn        = $ '#testChromeBtn'
    setSelectionBtn      = $ '#setSelection'
    setRange             = $ '#setRange'
    printRangeBtn        = $ '#printRange'
    printSelBtn          = $ '#printSel'
    normBtn              = $ '#normBtn'
    getLineDivBtn        = $ '#getLineDivBtn'
    logs                 = $ '#logs'

    selection = {}
    selection.range = document.createRange()

    getRange = () ->
        if selection.range?
            return selection.range
        else
            return null

    getSelection = () ->
        return window.getSelection().getRangeAt(0)

    setStartContainerBtn.on 'click', (e) ->
        startNodeSelector = startContainerSelect.val()
        startNode = _getNodeFromSelector(startNodeSelector)
        startOffset = startOffSetInput.val() * 1
        range  = getRange()
        range.setStart(startNode,startOffset)
        setSelection()

    setEndContainerBtn.on 'click', (e) ->
        endNodeSelector = endContainerSelect.val()
        endNode = _getNodeFromSelector(endNodeSelector)
        endOffset = endOffSetInput.val() * 1
        range  = getRange()
        range.setEnd(endNode,endOffset)
        setSelection()

    _getNodeFromSelector = (selector) ->
        if selector.slice(0,5) == "#text"
            spanId = "span" + selector.slice(5,6) 
            node = document.getElementById(spanId).firstChild
        else
            node   = $(selector)[0]
        return node

    setSelection = (e) ->
        sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(getRange())
        $('#main-div').focus()

    setSelectionBtn.on 'click', setSelection

    setRange.on 'click', (e) ->
        sel = window.getSelection()
        selection.range = sel.getRangeAt(0)
        $('#main-div').focus()

    logifyRange = (range) ->
        startContainer = range.startContainer
        if startContainer.id
            startContainerId = startContainer.id
        else
            startContainerId = startContainer.parentElement.id + '/nodeText'

        endContainer = range.endContainer
        if endContainer.id
            endContainerId = endContainer.id
        else
            endContainerId = endContainer.parentElement.id + '/nodeText'

        txt  = 'start : ' + startContainerId
        txt += ' - ' + range.startOffset + '</br>'

        txt += 'end  : ' + endContainerId 
        txt += ' - ' + range.endOffset + '</br>'

    # put bp of the range in a text node
    normalize = (range) ->
        isCollapsed = range.collapsed
        newStartBP = normalizeBP(range.startContainer, range.startOffset)
        range.setStart(newStartBP.cont,newStartBP.offset)
        if isCollapsed
            range.collapse(true)
        else
            newEndBP = normalizeBP(range.endContainer, range.endOffset)
            range.setEnd(newEndBP.cont,newEndBP.offset)

    normalizeBP = (cont, offset) ->

        if cont.nodeName == '#text'
            # nothing to do
            res = {cont:cont,offset:offset}

        else if cont.nodeName == 'SPAN'
            # search a text node before and put bp in it
            # if none, search a text node after and put bp in it
            # if none create one and put bp in it
            if offset > 0
                newCont   = cont.childNodes[offset-1]
                newOffset = newCont.length
            else if cont.childNodes.length > 0
                newCont   = cont.firstChild
                newOffset = 0
            else
                newCont   = document.createTextNode('')
                cont.appendChild(newCont)
                newOffset = 0

        else if cont.nodeName == 'DIV' and cont.id != "main-div"
            # <div>|<span>...</span>|<any>...</span>|</br>|</div>
            #     BP7              BP8             BP9    BP10
            # if offset = 0 put bp in 1st child
            # if offset in middle, put bp at the end of previous element
            # if offset before or after </br> put bp at the end of element
            # before </br>
            if offset == 0
                res = normalizeBP(cont.firstChild,0)
            else if offset < cont.children.length-1
                newCont   = cont.children[offset-1]
                newOffset = newCont.childNodes.length
                res       = normalizeBP(newCont, newOffset)
            else
                newCont   = cont.children[cont.children.length-2]
                newOffset = newCont.childNodes.length
                res       = normalizeBP(newCont, newOffset)

        else if cont.nodeName ==  'DIV' and cont.id == "main-div"
            # if offset==0 put bp at begin of first node
            if offset == 0
                newCont   = cont.firstChild
                newOffset = 0
                res       = normalizeBP(newCont, newOffset)
            # if bp is at end of container, put bp at end of last node
            else if offset == cont.childNodes.length
                newCont   = cont.lastChild
                newOffset = newCont.childNodes.length
                res       = normalizeBP(newCont, newOffset)
            # if bp is in the middle of container, put bp at end of the node 
            # before current bp
            else
                newCont   = cont.children[offset-1]
                newOffset = newCont.childNodes.length
                res       = normalizeBP(newCont, newOffset)

        if !res
            res = {cont:newCont,offset:newOffset}

        return res
            

    normBtn.on 'click', (e) ->
        console.log "normalize :"
        txt    = 'selection before normalize :</br>'
        range  = window.getSelection().getRangeAt(0)
        txt   += logifyRange(range)
        normalize(range)
        txt   += '</br>'
        txt   += 'selection after normalize :</br>'
        txt   += logifyRange(range)
        logs.html( txt )
        $('#main-div').focus()

    printRange = () ->
        console.log "range :"
        console.log getRange()

        newHtml  = 'range = </br>' + logifyRange(getRange())
        
        newHtml += '</br>Rangy serialized range : ' 
        root = document.getElementById('main-div')
        newHtml += rangy.serializeRange(getRange(), true, root )

        newHtml += '</br>Home serialized range : ' 
        root = document.getElementById('main-div')
        newHtml += serializeRange(getRange(), root )
        
        logs.html( newHtml )
        $('#main-div').focus()
        return newHtml

    printSelection = () ->
        console.log "selection :"
        console.log getRange()
        range = window.getSelection().getRangeAt(0)

        newHtml  = 'selection = </br>' + logifyRange(range)
        
        newHtml += '</br>Rangy serialized selection : ' 
        root = document.getElementById('main-div')
        sel = rangy.getSelection()
        newHtml += rangy.serializeSelection(sel, true, root)

        newHtml += '</br>Home serialized selection : ' 
        root = document.getElementById('main-div')
        rg = (document.getSelection()).getRangeAt(0)
        newHtml += serializeRange(rg , root )

        logs.html(newHtml)
        $('#main-div').focus()
        return newHtml



    printRangeBtn.on 'click', (e) ->
        printRange()

    printSelBtn.on 'click', (e) ->
        printSelection()

    $('#getSeriSelectionBtn').on 'click', (e)->
        root = document.getElementById('main-div')
        rg = (document.getSelection()).getRangeAt(0)
        serial = serializeRange(rg , root )
        $("#serializeInput").val(serial)

    $('#deserializeBtn').on 'click', (e)->
        root = document.getElementById('main-div')
        serial = $("#serializeInput").val()

        range = deSerializeRange(serial , root )

        rg  = getRange()
        rg.setStart(range.startContainer,range.startOffset)
        rg.setEnd(range.endContainer,range.endOffset)
        setSelection()

    deSerializeRange = (serial, rootNode) ->
        if !rootNode
            rootNode = document.body
        range = rootNode.ownerDocument.createRange()
        serials = serial.split(',')
        startPath = serials[0].split('/')
        endPath   = serials[1].split('/')

        startCont = rootNode
        i = startPath.length
        while --i
            startCont = startCont.childNodes[ startPath[i] ]
        range.setStart(startCont,startPath[i])

        endCont = rootNode
        i = endPath.length
        while --i
            endCont = endCont.childNodes[ endPath[i] ]
        range.setEnd(endCont,endPath[i])

        return range

    # the breakpoint are strings separated by a comma.
    # Structure of a serialized bp : {offset}{/index}*
    # Global struct : {startOffset}{/index}*,{endOffset}{/index}*
    serializeRange = (range, rootNode) ->
        if !rootNode
            rootNode = range.startContainer.ownerDocument.body

        # serialise start breakpoint
        res  = range.startOffset
        node = range.startContainer
        while node != rootNode
            i = 0
            sib = node.previousSibling
            while sib != null
                i++
                sib = sib.previousSibling
            res += '/' + i
            node = node.parentNode
            
        # serialise end breakpoint
        res += ',' + range.endOffset
        node = range.endContainer
        while node != rootNode
            i = 0
            sib = node.previousSibling
            while sib != null
                i++
                sib = sib.previousSibling
            res += '/' + i
            node = node.parentNode
            
        return res


    ###*
     * return the div corresponding to an element inside a line and tells wheter
     * the breabk point is at the end or at the beginning of the line
     * @param  {element} cont   the container of the break point
     * @param  {number} offset offset of the break point
     * @return {object}        {div[element], isStart[bool], isEnd[bool]}
    ###
    getLineDivIsStartIsEnd = (cont, offset)->
        
        parent = cont
        isStart = true
        isEnd = true

        # 1- walk trew each parent of the container until reaching the div 
        # on each parent check if breakpoint is still at the end or start
        while !(parent.nodeName == 'DIV'              \
                and parent.id?                        \
              # and parent.id.substr(0,5) == 'CNID_') \
                and parent.id.substr(0,3) == 'div')   \
              and parent.parentNode != null

            # 1.1 check isStart isEnd
            isStart = isStart && (offset==0)
            if parent.length?
                isEnd = isEnd && (offset==parent.length)
            else
                isEnd = isEnd && (offset==parent.childNodes.length-1)
            # 1.2 prepare next loop :
            # 1.2.1 find offset of the current element among its siblings
            if parent.previousSibling == null
                offset = 0
            else if parent.nextSibling == null
                offset = parent.parentNode.childNodes.length - 1
            else if parent.nextSibling.nextSibling == null
                offset = parent.parentNode.childNodes.length - 2
            else
                # we are not at the beginning nor the end, we can set 1
                # to the parent offset because it is not important to know the
                # exact offset in this case
                offset = 1
            # 1.2.2 go up to the parent level
            parent = parent.parentNode

        # 2 check isStart isEnd for the div
        nodesNum = parent.childNodes.length
        isStart = isStart && (offset==0)
        if parent.textContent == '' # case : <div><span>|</br></div>
            isStart = true
        isEnd = isEnd && (offset==nodesNum-1 or offset==nodesNum-2)

        return div:parent, isStart:isStart, isEnd:isEnd


    getLineDivBtn.on 'click', (e) ->
        range = window.getSelection().getRangeAt(0)
        {div,isStart,isEnd} = getLineDivIsStartIsEnd range.startContainer, range.startOffset
        newHtml  = 'selection = </br>' + logifyRange(range)
        newHtml += '</br>'                                \
                 + 'div=' + div.id + '</br>'              \
                 + ' isStart:<b>' + isStart + '</b></br>' \ 
                 + ' isEnd:  <b>' + isEnd   + '</b>'
        logs.html(newHtml)
        console.log 'div', div.id, 'isStart', isStart, 'isEnd', isEnd
        $('#main-div').focus()

    testChromeBtn.on 'click', (e) ->
        # create a range with its start and end in span4
        startNode = document.getElementById('span4')
        startOffset = 0
        range  = document.createRange()
        range.setStart(startNode,startOffset)
        range.collapse(true)
        # put selection on the range
        sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
        # test where is the selection now :
        rangeOfSel = sel.getRangeAt(0)
        if rangeOfSel.startContainer == range.startContainer
            result = "<strong style='color:green'>There is no bug ! The selection IS realy in span4</strong>"
        else
            result = "<strong style='color:red'>There is a bug ! The selection is NOT in span4 !</strong>"

        logs.html( result )
        $('#main-div').focus()