Template de base d'un projet webpack:
    . javascript avec des modules common.js
    . css
    . et serveur avec mise à jour automatique
    .

Prérequis :
    . node avec une version récente
    . sudo npm install webpack -g
    . sudo npm install webpack-dev-server -g

Utilisation :
    . npm install  (installe les dépendances de package.json, à savoir les css et styles loader)
    . puis :
        . webpack : pour exécuter webpack.config.js
        . webpack-dev-server --progress --colors  : pour servir le tout sur http://localhost:8080/webpack-dev-server
