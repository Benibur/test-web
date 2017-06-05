require("./style.styl")
htmlbody = require("./my-jade.jade")()
document.body.innerHTML = htmlbody

# get html elements references
btnEl    = document.getElementById('btn')
input1El = document.getElementById('input1')
input2El = document.getElementById('input2')

# get form data
username = input1El.value
password = input2El.value
console.log 'toto'

# put focus on button
btnEl.focus()
