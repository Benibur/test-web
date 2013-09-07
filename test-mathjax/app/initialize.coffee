
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    $('body').html( require('body')() )

    script      = document.createElement("script")
    script.type = "text/javascript"
    script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
    document.getElementsByTagName("head")[0].appendChild(script)

    mathIn  = document.getElementById('mathInput' )
    mathOut = document.getElementById('mathDiv')
    mathRes = document.getElementById('mathRes')

    HIDEBOX = () ->
        mathOut.style.visibility = "hidden"

    SHOWBOX = () ->
        mathOut.style.visibility = "visible"

    EXTRACTFORMULA = () ->
        mathRes.innerHTML = mathOut.children[1].innerHTML

    MATH = null

    MathJax.Hub.queue.Push ()->
        mathOut.textContent = '$${}$$'
        MathJax.Hub.Typeset(mathOut)

    MathJax.Hub.queue.Push ()->
        # MATH = MathJax.Hub.getAllJax("mathDivOutput")[0]
        MATH = MathJax.Hub.getJaxFor(mathOut)

    mathIn.addEventListener 'keyup', (e) ->
        # if e.which == 13
        MathJax.Hub.queue.Push(
            HIDEBOX,
            ["Text",MATH,"\\displaystyle{"+mathIn.textContent+"}"],
            SHOWBOX,
            EXTRACTFORMULA)
        if e.which == 13
            e.preventDefault()

    mathIn.addEventListener 'keypress', (e) ->
        if e.which == 13
            e.preventDefault()


