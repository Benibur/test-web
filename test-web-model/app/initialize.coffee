
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
  $('body').html( require('body')() )
