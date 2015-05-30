
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    body = document.querySelector('body')
    body.innerHTML = require('body')()

    container = body.querySelector('.resizedContainer')
    container.innerHTML = require('resized-content')()

    container2 = body.querySelector('.resizedContainer2')
    container2.innerHTML = require('resized-content2')()

    container3 = body.querySelector('.resizedContainer3')
    container3.innerHTML = require('resized-content3')()

    container4 = body.querySelector('.resizedContainer4')
    container4.innerHTML = require('resized-content3')()

    container5 = body.querySelector('.resizedContainer5')
    container5.innerHTML = require('resized-content5')()

    container6 = body.querySelector('.resizedContainer6')
    container6.innerHTML = require('resized-content6')()



