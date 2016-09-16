Template d'un projet webpack avec coffee, stylus & jade


Prérequis :
    . node avec une version récente
    . sudo npm install webpack -g
    . sudo npm install webpack-dev-server -g

Utilisation :
    . npm install
    . puis :
        . npm run build
        . npm run w      : lance le serveur en watch sur http://localhost:8080/webpack-dev-server

Organisation :
    . les sources sont dans src
    . l'output dans bin
    . npm run w : lance le webpack-dev-server sert les fichiers de bin
