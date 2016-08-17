require("./style.styl")
htmlbody = require("./my-jade.jade")()
document.body.innerHTML = htmlbody

# get html elements references
btnEl      = document.getElementById('btn')
usernameEl = document.getElementById('username')
passwordEl = document.getElementById('password')

# get login password
username = usernameEl.value
password = passwordEl.value

# put focus on button
btnEl.focus()
