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

# put focus on button
btnEl.focus()

prosemirror = require("prosemirror")
schema = require("prosemirror/dist/schema-basic").schema
container_01El = document.getElementById('editor01_container')
editor = new prosemirror.ProseMirror({
    place:  container_01El,
    schema: schema
    doc:    schema.parseDOM(container_01El)
    # menuBar   : {float: true}
})
