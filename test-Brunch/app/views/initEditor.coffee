
stopEvent = (e) ->
	e = window.event  unless e
	if e.stopPropagation
		e.stopPropagation()
	else
	e.cancelBubble = true
	
cancelEvent = (e) ->
	e = window.event  unless e
	if e.preventDefault
		e.preventDefault()
	else
		e.returnValue = false

findPrevLine = (b$) -> 
	#TODO : deal complex cases. For now we consider being in the same bloc...
	# b$ : should refer to a line, ie <p> or <h>
	if b$.attr("class").substr(0,2)=="Tu"
		b$=b$.parent()
	r = b$.prev()
	if r.length==0 then r=undefined
	r

increaseDepth = (b$) ->
	

indent_bloc = (b$) ->
	prevl$ = findPrevLine( b$ )
	if prevl$
		cl = prevl$.attr("class")
		prevlDepth = cl.substr(cl.length-2,2)
		bCl = b$.attr("class")
		bDepth = bCl.substr(bCl.length-2,2)
		if prevlDepth == bDepth
			b$.parent().wrap("<ul class='Lu-02' />")
			increaseDepth(b$.parent())
		t=2

MPKeyPressListener = (e) ->
	keyCode = undefined
	# e interesting attributes : 
	#   .which : added by jquery : number of the caracter (not of the key)
	#   .altKey
	#   .ctrlKey
	#   .metaKey
	#   .shiftKey
	#   .keyCode
	
	# definition of a shortcut : 
	#   a combination alt,ctrl,shift,meta
	#   + one caracter(.which) 
	#     or 
	#     arrow (.keyCode=dghb:) or return(keyCode:13) or bckspace (which:8) or tab(keyCode:9)
	metaKeyStrokesCode = `(e.altKey ? "Alt" : "") + (e.ctrlKey ? "Ctrl" : "") + (e.shiftKey ? "Shift" : "")`
	# test if key is an arrow(.keyCode=dghb:)
	switch e.keyCode
		when 13 then keyStrokesCode = "return"
		when 37 then keyStrokesCode = "left"
		when 39 then keyStrokesCode = "up"
		when 40 then keyStrokesCode = "right"
		when 41 then keyStrokesCode = "down"
		when 9  then keyStrokesCode = "tab"
		else
			switch e.which
				when 32 then keyStrokesCode = "space"
				when 8  then keyStrokesCode = "backspace"
				else  keyStrokesCode += "_" + e.which
	
	# for tests and check the key and caracter numbers :
	# console.clear()
	# console.log "ctrl #{e.ctrlKey}; Alt #{e.altKey}; Shift #{e.shiftKey}; which #{e.which}; keyCode #{e.keyCode}"
	# console.log keyStrokesCode

	# ################################# #
	if keyStrokesCode == "return"
		# TODO : for now we assume the selection to be on a single line
		# to implement a multi line selection return, we just have to :
		#   1- delete the selection
		#   2- deal with the return
		
		# 1- range and selection properties
		sel                = rangy.getSelection()
		range              = sel.getRangeAt(0)
		initialStartOffset = range.startOffset
		initialEndOffset   = range.endOffset
		

		# 2- information from the source line
		# source$ refers a Tu, To, Th or l
		# source_p$ ref to the parent
		source  = range.startContainer
		source$ = $(source) 
		if source.nodeType == 3
			source$ = source$.parent()          # in case source = textNode : get the parent
		sourceClass   = source$[0].className    # ref to p.Pt or p.L or hx.H
		source_p$     = source$.parent()        # ref to <li>
		source_pClass = source_p$[0].className  # ref to li.class
		# 3- detection if selection ends at the end of the line
		rangeIsEndLine = false
		if range.endContainer.nodeType == 3     # 3<=> TextNode
			if initialEndOffset == source$.text().length
				rangeIsEndLine = true
		else
			rangeIsEndLine = true
		# 4- detection if selection starts at beginning of the line
		rangeIsStartLine = false
		if range.startContainer.nodeType == 3  # 3<=> TextNode
			if initialStartOffset == 0
				rangeIsStartLine = true
		else                                   # startcontainer refer to <p>
			if initialStartOffset == 0
				rangeIsStartLine = true
			else
				rangeIsStartLine = false
		# 5- clone the <li>
		clone_p$ = source_p$.clone()
		range_clone = rangy.createRange()
		# 6- deletion of the end of the original line
		if rangeIsStartLine
			source$.html("<br>") # otherwise it is possible to go 
		else
			range.setStart( source,initialStartOffset)
			range.setEndAfter( source )
			range.deleteContents()
		# 7- deletion of the first part of the string of the clone
		tnc =clone_p$[0].firstElementChild.firstChild # tn refers to the TextNode of the clone of <p>
		if rangeIsEndLine  # the selection goes up to the end of line : the clone is deleted and replaced by a <br>
			clone_p$.children().html("<br>") 
		else # the selection doesn't go up to the end of the line, no need to add a <br>
			range_clone.selectNode(tnc)
			range_clone.setStart(tnc,0)
			range_clone.setEnd(tnc, initialEndOffset)
			range_clone.deleteContents()
		# 8- insertion of the clone after original <li>
		source_p$.after(clone_p$)
		# 9- position caret 
		range.collapseToPoint(clone_p$[0].firstElementChild,0)
		# 10- refrain browser to make an insert by itself
		e.preventDefault()

	# ################################# #
	if keyStrokesCode == "backspace"
		# 1- range and selection
		sel                = rangy.getSelection()
		range              = sel.getRangeAt(0)
		initialStartOffset = range.startOffset
		initialEndOffset   = range.endOffset
		# 2- detection if selection starts at beginning of the line
		rangeIsStartLine = false
		if range.startContainer.nodeType == 3  # 3<=> TextNode
			if initialStartOffset == 0
				rangeIsStartLine = true
		else                                   # startcontainer refer to <p>
			if initialStartOffset == 0
				rangeIsStartLine = true
			else
				rangeIsStartLine = false
		# 3- if carret is at beginning of line
		if rangeIsStartLine and initialEndOffset == 0
			# 3.1- get reference to previous line
			source$ = $(range.startContainer) # <p class="pt-xx" ...
			if source$[0].nodeType == 3
				source$=source$.parent()      # in case source = textNode : get the parent
			source_p$   = source$.parent()    # ref to <li ...
			prevLine_p$ = source_p$.prev()
			# 3.2- test whether this is the first line or not.
			if prevLine_p$.length # there is a previous line
				# get text of source line and a ref to 
				# move cursor
				prevline$ = prevLine_p$.children()
				range.collapseAfter(prevline$[0])
				# append the content to the previous line
				newTxt = prevline$.text()+source$.text()
				if newTxt
					prevline$.text(newTxt)
				else
					prevline$.html("<br>")
				# delete line
				source_p$.remove()
				# refrain browser to make deletion by itself
				e.preventDefault()
			else    # this is the first line - nothing to do
				
	# ################################# #
	if keyStrokesCode == "tab"
		# 1- range and selection
		sel                = rangy.getSelection()
		range              = sel.getRangeAt(0)
		initialStartOffset = range.startOffset
		initialEndOffset   = range.endOffset
		# 2- stack the blocs to indent
		# TODO : for now we suppose that there is only one line selected
		source  = range.startContainer
		source$ = $(source)
		if source.nodeType == 3
			source  = source$.parent()
			source$ = $(source)
		source_p$ = source$.parent()
		blocs$ = [source$]
		# 3- indent each block
		indent_bloc b for b in blocs$

	# test if key is return (keyCode:13)
	# test if key is bckspace (which:8)


	# if e.keyCode
	# 	keyCode = e.keyCode
	# else
	# 	keyCode = ""
	# if keyCode is 9
	# 	e.stopEvent e
	# 	e.cancelEvent e
	# 	ed.execCommand "bold", false
	# 	nod = ed.selection.getNode()
	# 	ed.selection.select nod
	# # return Key
	# if keyCode is 13
	# 	stopEvent e
	# 	cancelEvent e
	# 	rng         = ed.selection.getRng()
	# 	sourceNode  = ed.selection.getNode()
	# 	sourceClass = $(sourceNode).attr("class")
	# 	# Case 1 : return at the end of a TitrePu_XX alone
	# 	targetClass = sourceClass
	# 	$(sourceNode).parent().after "<li><p class='" + targetClass + "'>&nbsp;</p></li>" # value='0'
	# 	$(sourceNode).parent().val ""
	# 	newNode     = $(sourceNode).parent().next()[0]
	# 	rng         = ed.dom.createRng()
	# 	rng.setStart newNode.firstChild, 0
	# 	ed.selection.setRng rng
		# Case 2 : return at the end of a TitrePu_XX with a line after
		# Case 3 : return at the middle of a TitrePu_XX alone 
		# Case 4 : return at the middle of a TitrePu_XX with a line after
	

exports.MP = 
	create: (editorDivID) ->
		$(editorDivID).bind( 'keypress' , MPKeyPressListener )

