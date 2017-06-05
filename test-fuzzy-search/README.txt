TEMPLATE D'UN PROJET WEBPACK AVEC COFFEE, STYLUS & JADE avec du hot reload


Prérequis :
    . node avec une version récente
    . sudo npm install webpack -g
    . sudo npm install webpack-dev-server -g

Utilisation :
    . npm install
    . puis :
        . npm run w      : lance le serveur en watch sur http://localhost:3000/ avec du hotreloading
    . les sources sont dans src, le point d'entrée est main.js
    . sait compiler du js6 et coffee-script
    . l'output dans bin

RUNNING TESTS
    . pour générer une grosse liste de chemins : aller dans tools, modifier les paramètres de path-extractor.js puis `node path-extractor.js`
    . Pour les tests, ajuster le choix de la liste d'items
    
RESULTATS DES TESTS
    . fuse.js : avec 21 000 fichiers, (nombre de fichiers dans mon dropbox), ça rame...
    .

DOCUMENTATIONS
    . le serveur qui sert la page est browser-sync (via le plugin webpack)
    . webpack embarque également un serveur (webpack-dev-server), mais c'est moins bien :
        . http://webpack.github.io/docs/webpack-dev-server.html#inlined-mode
        . a un hot reload, soit dans une iframe (plein d'effets de bords), soit en injectant du js (mieux, c'est le mode "inline")
        .
