TESTS OF DIFFERENT SEARCHES


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
    . fuse.js :
      . avec 21 000 fichiers, (nombre de fichiers dans mon dropbox), ça rame...
      . le retour des "matches" (plages qui collent) est strange.
      . pour aller plus loin il faudrait s'assurer qu'il cherque sur chaque nom de répertoire : on pourrait splitter le chemin en un tableau de strings.
    . fuzzaldrin :  /!\ fuzzaldrin-plus est sorti ! très très prometteur
      . ne distingue pas les mots de la query ni les noms des répertoires (traite le path comme une seule string)
      . calcule un score sur la base de la compacité de ce qui est trouvé dans la chaine pour une query et du ratio longueur query / longueur path, ce qui est plutot pas mal
      . l'algo est relativement simpel et lisible, peut être repris.
      . ne donne pas ce qui est à mettre en gras.
      . impose que les occurences soient dans le meme ordre que dans la query : ça c'est nul
      . quand des caractères sont trop espacés l'algo devrait interrompre sa recherche (ou plutôt revenir au caractère précédant et voir s'il y en a une occurence plus loin). Perso je limiterai à au plus 3 caractères d'écart (mais ça ne vaut que si on cherche mot par mot de la query)
      . optimisable au niveau de l'accès aux caractères ()



DOCUMENTATIONS
    . le serveur qui sert la page est browser-sync (via le plugin webpack)
    . webpack embarque également un serveur (webpack-dev-server), mais c'est moins bien :
        . http://webpack.github.io/docs/webpack-dev-server.html#inlined-mode
        . a un hot reload, soit dans une iframe (plein d'effets de bords), soit en injectant du js (mieux, c'est le mode "inline")
        .
