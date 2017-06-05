require("./style.styl")
LastpassClient = require('../lastpass-client/lastpass-client.coffee')

htmlbody = require("./my-jade.jade")()
document.body.innerHTML = htmlbody

# get html elements references
btnEl      = document.getElementById('btn')
usernameEl = document.getElementById('username')
passwordEl = document.getElementById('password')
resultEl   = document.getElementById('result')
logsEl     = document.getElementById('logs')


# get parameters
username             = usernameEl.value
password             = passwordEl.value
multifactor_password = null

# put focus on button
btnEl.focus()

# launch lastpass fetch on click
btn.onclick = () ->
    resultEl.innerText = "resultText"
    LastpassClient.open_remote username, password, multifactor_password, (vault)->
        resultText = 'finaly the vault is : ' + vault
        resultEl.innerText = resultText
