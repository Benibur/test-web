{beautify} = require 'views/beautify'
{MP} = require 'views/initEditor'

retrieveFile = (fichier, dest) ->
  $.ajax
    url:fichier,
    success: (data)->
      
      dest.append data.documentElement
      beautify()

exports.initPage =  ->

  $("body").html require('./templates/editor')

  # boutons events bindings
  $("#resultBtnBar_coller").bind "click", beautify

  $("#glBtnBar_EmptyText").bind "click", ->
    window.fillDefaultContent()

  $("#EmptyTextBtn").bind "click", ->
    retrieveFile( "ContentEmpty.txt" , $("#editorTextContent") )

  $("#SimpleTextBtn").bind "click", ->
    retrieveFile( "ContentSimple.html", $("#editorTextContent") )

  $("#FullTextBtn").bind "click", ->
    retrieveFile( "ContentFull.txt" , $("#editorTextContent") )

  $("#printRangeBtn").bind "click", ->
    sel                = rangy.getSelection()
    range              = sel.getRangeAt(0)
    console.log "-- range --"
    console.log range
    console.log "startOffset : " + range.startOffset
    console.log "endOffset   : " + range.endOffset
    console.log "startContainer :"
    console.log range.startContainer
    console.log "endContainer   :"
    console.log range.endContainer

  #----------------------------#
  # TODO : ne fonctionne pas "
  # logKeyStrokesHdlr = (e) =>
  #   console.log "ctrl #{e.ctrlKey}; Alt #{e.altKey}; Shift #{e.shiftKey}; which #{e.which}; keyCode #{e.keyCode}"
  #   alert "toto"

  # logKeysBtn = $("#logKeysBtn")
  # doLogKeystrokes = false
  # target = $("#logKeysBtn")
  # $("#logKeysBtn").bind "click", ->
  #   if doLogKeystrokes == false
  #     # ce bind ne fonctionne pas. si on passe sur jquerry plus récent 
  #     # avec .on() on casse l'import de fichiers et de toute manière
  #     # ne fonctionne pas plus.
  #     $("#FullTextBtn").bind "keyup", logKeyStrokesHdlr
  #     doLogKeystrokes = true
  #     this.firstChild.data = "Unlog KeyStrokes"
  #   else
  #     $("#FullTextBtn").unbind "keyup", logKeyStrokesHdlr
  #     doLogKeystrokes = false
  #     this.firstChild.data = "Log KeyStrokes"
  #----------------------------#
      
  

  # initialisation of the editor content
  retrieveFile("ContentSimple.html", $("#editorTextContent"))
  
  # refresh of the beautified html result on each keystoke
  $("#editorTextContent").bind 'keyup' , ->
    beautify()
    t=1 # ?? rajouté pour que la ligne précédente fonctionne ?? si abscent : ça plante ??
  
  # initialisation of the editor
  MP.create( '#editorTextContent' )

