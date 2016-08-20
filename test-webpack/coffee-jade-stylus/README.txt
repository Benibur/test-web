TEMPLATE D'UN PROJET WEBPACK AVEC COFFEE, STYLUS & JADE


Prérequis :
    . node avec une version récente
    . sudo npm install webpack -g
    . sudo npm install webpack-dev-server -g

Utilisation :
    . npm install
    . puis :
        . npm run build : build les src dans bin
        . npm run w      : lance le serveur en watch sur http://localhost:8080/ avec du hotreloading
    . les sources sont dans src
    . l'output dans bin
    . npm run w : lance le webpack-dev-server sert les fichiers de bin

DOCUMENTATIONS
    . le webpack-dev-server :
        . http://webpack.github.io/docs/webpack-dev-server.html#inlined-mode
        . a un hot reload, soit dans une iframe (plein d'effets de bords), soit en injectant du js (mieux, c'est le mode "inline")
        .
