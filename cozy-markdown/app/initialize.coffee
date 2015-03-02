
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    
    document.getElementsByTagName('body')[0].innerHTML = require('body')()

    cozyShowdownExt = require('./cozy-showdown/cy-showdown-ext')
    # githShowdownExt = require('cozy-showdown/github')

    Showdown        = new require('./cozy-showdown/showdown')
    # converter       = new Showdown.converter( extensions : [cozyShowdownExt] )
    # converter       = new Showdown.converter( )
    converter       = new Showdown.converter( extensions : [cozyShowdownExt] )

    txtArea = document.getElementById('md-content'  )
    htmlDiv = document.getElementById('html-content')


    MD2HTML = () ->
        htmlDiv.innerHTML = converter.makeHtml(txtArea.value)

    MD2HTML()

    document.getElementById('MD2HTML-btn').addEventListener('click', MD2HTML)
    txtArea.addEventListener('keyup', MD2HTML)

