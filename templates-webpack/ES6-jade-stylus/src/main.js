require("./style.styl")
const htmlbody = require("./my-jade.jade")()
document.body.innerHTML = htmlbody

// get html elements references
const btnEl    = document.getElementById('btn')
const input1El = document.getElementById('input1')
const input2El = document.getElementById('input2')

// get form data
const username = input1El.value
const password = input2El.value
console.log('trotro')

// put focus on button
btnEl.focus()
