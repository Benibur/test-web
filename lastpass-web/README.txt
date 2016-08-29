__CLIENT LASTPASS DANS UNE APPLICATION WEB__

Prérequis :
    . node avec une version récente
    . sudo npm install webpack -g
    . sudo npm install webpack-dev-server -g

Utilisation :
    . npm install
    . puis :
        . npm run build # pour builder dans "bin"
        . npm run w      : lance le serveur en watch sur http://localhost:8080/

Organisation :
    . les sources sont dans src
    . l'output dans bin
    . npm run w : lance le webpack-dev-server sert les fichiers de bin


__ANALYSE TECHNIQUE__

LES CLIENTS EXISTANT :
    . le cli officiel : https://github.com/lastpass/lastpass-cli
    . en C# https://github.com/detunized/lastpass-sharp
    . en ruby: https://github.com/detunized/lastpass-ruby
    . en python : https://github.com/konomae/lastpass-python
    . en go : https://github.com/mattn/lastpass-go

STRATÉGIE
    . répliquer les appels du client python (qui réplique celle du client mobile)
    . porter ça en js pour browser
        . **principal pb** : la same origin policy : l'API de lastpass n'a pas mis en place CORS... : il faut donc passer par un proxy. Question : comment gérer un proxy dans cozy ?
                . piste 1 : un module 'request-cozy-browserify' permet dans le browser de faire des requêtes avec la meme API que request.js dans Node. Les paramètres de ces requêtes sont stringifiées, passées à la home via les intent, qui les envoie au serveur Cozy, qui génère alors les "vraies" requêtes au serveur cible. Et retour, avec la bonne gestion des call backs dans le browser.
                . piste 2 : variante de la précédante : au lieu d'utiliser l'api de request.js, on utilise l'API de la lib HTTP de node.js (cf la lib http-browserify)
                . pb pour les 2 approches précédantes : les données passent en clair sur le serveur Cozy, alors que justmeent le but est de faire les traitements côté browser.
                . piste 3 : un vrai proxy côté serveur Cozy qui tunelle les requêtes du browser : pas simple et pas pérenne avec la réécriture de cozy.
                . stratégie :
                    . on démarre avec piste 1 en simulant l'intent mais en envoyant bien un objet sérialisé pour les param des requêtes.
                    . **Grosse question** : est ce qu'un proxy ne risque pas de transmettre la politique CORS de lastpass dans sa réponse, ou en tout cas que lastpass voit le proxy comme le browser : faut il que le proxy modifie quelque chose dans la requête ? dans le header ?
                    . voici un proxy qui rajoute cors à toutes les requêtes et semble résoudre le pb :
                        . https://www.npmjs.com/package/cors-anywhere
                        . avec ce proxy toutes les requêtes du browser doivent marcher, ça semble top, reste à sécurité (https : qu'est ce qui passe en clair sur le proxy
                        . pourrait être un bon candidat pour un proxy côté Cozy
                    . le proxy le plus classique sur node semble être : https://github.com/nodejitsu/node-http-proxy

                    .
    . voire à utiliser les appels du cli si en effet le cli évite la confirmation par mail du device
    . gérer les exeptions et erreurs
    . gérer la validation du device.

GÉNÉRALITÉS
    . lastpass gère des autorisation par "device" : il est probable que le cli soit vu comme un device, mais je ne l'ai pas constaté car je ne l'ai utilisé que sur des pc qui ont été enregistrés comme device, il faudrait tester sur un pc jamais enregistré.
    . lastpass refuse les requêtes CORS : pas de client web possible sans passer par un proxy...

DÉCRYPTAGE DU CLI OFFICIEL :
    . en c, compliqué, il faut quelqu'un de callé en c.
    . le format du fichier est sans doute assez stable car le chiffrement ayant lieu côté client, les mises à jours du format doivent être fait côté client (donc difficulté à gérer la compatibilité avec des clients pas à jour)
    . les appels :
        . signature : http_post_lastpass(page, session, final_len, ...)
        . le serveur : LASTPASS_SERVER	"lastpass.com"
        . Pour créer la session, l'appel est
            https://lastpass.com/login.php?xml=2&username=ben%40sonadresse.com&hash=c9a49ef0bc4f49076c9dd764c47a7f19adc2b73665d894107bb6be14968ceb90&iterations=5000&includeprivatekeyenc=1&method=cli&outofbandsupported=1&
            on trouve cet appel ici : endpoint-login.c : ordinary_login() puis dans http.c fonction : http_post_lastpass_v_noexit() (ligne 270 env)

    . login page : login.php
        . http_post_lastpass_v(login_server, "login.php", NULL, NULL, args)
        . signature http_post_lastpass_v(server, page, session,final_len, argv)
    . trust.php

DÉCRYPTAGE DU CLIENT PYTHON NON OFFICIEL:
    . Méthode : utilise l'api pour mobile, assez simple.
    . pour installer le paquer python : python setup.py install


    .
