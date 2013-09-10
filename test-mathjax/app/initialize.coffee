
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
        # mathOut.style.visibility = "hidden"

    SHOWBOX = () ->
        mathOut.style.visibility = "visible"

    EXTRACTFORMULA = () ->
        mathRes.innerHTML = mathOut.children[1].innerHTML

    MATH = null

    initMath = ()->

        # MathJax.Hub.queue.Push ()->
        mathOut.textContent = '$${}$$'
        MathJax.Hub.Typeset(mathOut)
        # fonctionne mais si plusieurs jax sur la page, pb
        # MATH = MathJax.Hub.getAllJax()[0]
        MATH = MathJax.Hub.getJaxFor(mathOut.children[2])
        window.MATH = MATH

        # MathJax.Hub.queue.Push ()->
            # MATH = MathJax.Hub.getAllJax("mathDivOutput")[0]

        null

    mathIn.addEventListener 'keyup', (e) ->
        # if e.which == 13
        if !MATH
            initMath()

        # MathJax.Hub.queue.Push( ["Text",MATH,"\\displaystyle{"+mathIn.textContent+"}"] )
        MATH.Text( "\\displaystyle{"+mathIn.textContent+"}" )
        EXTRACTFORMULA()

        # Rq : si MathJax est chargé dynamiquement, la queue ne s'exécute plus
        # (seulement pour le premier ds initMath, pourquoi ?)
        # et mettre des actions dedans est sans effet. Il doit y avoir une
        # solution pour traiter la queue, mais pas trouver.
        # Contournement : ne pas passer par le queue et traiter en direct,
        # semble fonctionner dans notre cas de figure (pas de conflit avec le
        # démarrage ni avec d'autres actions qui seraient en cours)
        # MathJax.Hub.queue.Push(
        #     HIDEBOX,
        #     ["Text",MATH,"\\displaystyle{"+mathIn.textContent+"}"],
        #     SHOWBOX,
        #     EXTRACTFORMULA)

        if e.which == 13
            e.preventDefault()

    mathIn.addEventListener 'keypress', (e) ->
        if e.which == 13
            e.preventDefault()


