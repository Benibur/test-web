
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    body = document.querySelector('body')
    body.innerHTML = require('body')()
    container = body.querySelector('#resizable-container')
    docFrag = document.createDocumentFragment()
    docFrag.innerHTML = require('resized-content')()
    container.appendChild(docFrag)

