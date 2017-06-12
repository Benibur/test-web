# Objectifs de la launch barre, périmètre.
Pouvoir rapidement ouvrir :
- un répertoire
- un fichier
- une application
- un album photo
- une recherche plein texte avec des tags
- lancer une recherche sur le web (Qwant...)
- Plus tard : un contact, un compte en banque, initier la création d'une entrée dans l'agenda, ouvrir la page d'un de ses compte de sa vault à mots de passe, lancer un album de musique ...

Et ce depuis depuis le browser, ou depuis l'app mobile, idéalement en offline et en online.

La consommation de ressource côté serveur est à minimiser tout en maximisant la vitesse côté client.

On affichera une preview quand l'utilisateur a son select sur un document le permettant (image, pdf...).

On attend de notre launcher qu'il se "souvienne" de nos précédentes requêtes et actions associée retenues pour nous les proposer en haut. Ce degrés de priorité doit tenir compte de la fréquence de l'utilisation de cette requêtes et de leur ancienneté, comme le fait la barre de Firefox qui trie celon la ["Frecency" (frequency & recency), cf cet article intéressant](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/Places/Frecency_algorithm).

Il faut bien faire la différence entre :
- l'autocomplete qui propose de lancer une action : ouvrir un répertoire, un fichier, une application... en fonction de ce que l'utilisateur a saisi.  
- et un résultat de recherche qui est en lui même une action que l'utilisateur choisira de lancer depuis la search barre. (faire la comparaison avec l'autocomplete dans Google)

De manière plus détaillée, la search bar fonctionne avec 3 modes :
- l'utilisateur choisi une suggestion qui correspond à un objet (un répertoire, un fichier, un album...) :
    - dans ce cas on déclanchera directement l'action associée (ouvrir le répertoire, l'album...).
    - On devra à terme proposer que plusieurs actions sur un document soit possible lorsque plusieurs apps sauront accepter un même type de document (par exemple une photo pourrait être ouverte dans Drive ou bien éditée dans une application d'édition de photos)
        - on y accéderait en tapant sur la touche "flèche droite" ou cliquant sur une petite flèche à droite de la suggestion.
    - les actions pourraient être augmentables non seulement via les apps qui savent "prendre" en entrée un doctype, mais aussi par des plugins qui permettraient de faire des actions variées : faire des calculs, intégration avec Slack, evernote...
- l'utilisateur saisi des critères pour une action (et non un objet) qui lui est suggérée :
    - faire un calcul, recherche dans l'historique du presse papier, écrire un mail, création rapide d'un rdv dans l'agenda...
    - dans ce cas l'utilisateur doit choisir la suggestion correspondant à son action. Par exemple "créer un évênement dans l'agenda" qui ouvrira l'agenda pré rempli avec les paramères saisis.
- et enfin la recherche à proprement parler :
    - l'utilisateur à saisi du texte, des tags, éventuellement d'autres critères de recherche mais ne choisi aucune suggestion et valide (enter key) : dans ce cas on lance une recherche avec ces paramètres.
    - A noter que l'on pourrait mettre une suggestion du type "lancer la recherche" toujours en premier...

Une question importante d'UX avec impact technique est de savoir si on mélange dans la liste des suggestion les différentes natures de suggestions. Listary ne les mélange pas, Alfred les mélange... Fonctionnement optionnel ?

Les modèles  :
- [Alfred](https://www.alfredapp.com) : la référence, possède un écosystème de [plugins](https://www.alfredapp.com/workflows/), par exemple [celui ci permet d'interagir avec les comptes sur son LastPass](https://github.com/bachya/lp-vault-manager).
- [Listary](http://www.listary.com/) : sur windows
- [Synapse] : principale originalité : possibilité de faire des "filtres" par types d'objet recherché (fichier, photo, répertoire, application...) simplement avec la flèche droite et gauche qui a pour effet de déplacer vers la droite ou gauche le type de document souhaité ("tout" par défaut), mais pour conséquence de ne plus pouvoir faire bouger le curseur dans la zone de saisie.



# Types de composants identifiés pour rendre le service, cahier des charges
Différents composants avec des roles bien précis sont nécessaires :
- L'autocomplete : composant gérant l'UI/UX.
- DataSet : La source des data, dans notre cas il y aura besoin de plusieurs dataset
- le filtre : sélectionne parmis les data ceux qui sont pertinents
- le tri : ordonne les résultats


## l'autocomplete

En charge de l'interaction utilisateur, clavier et souris. Doit être suffisamment customisable sans être trop lié à des fonctionnement de search ou tri qui ne nous conviennent pas.

Fonctions clés :
- pouvoir se choisir sa propre fonction de filtre et tri
- gestion des tags.
    - Tout "champs" saisi gagne a etre vu comme un tag, qui au besoin n'a pas de style visuel particulier, c'est à dire qu'il ne se distinguerait pas.
    - ex :
      - [(text)compte rendu EDF]  [(htag)#sécurité]  [(text)offre commerciale]  [(date-range)octobre 2016]
      - Exemple : [selectize.js](http://selectize.github.io/selectize.js/) :le champion des tags (mais plugin jQuery...)
    - les tags doivent être éditable intelligemment : croix de suppression, caret qui peut éditer un tag et pas simplement le supprimer totalement (backspace devant un tag le remet en texte normal et on peut l'éditer avec un autocomplete), gestion de tags de différentes type #, @ et texte...
- gestion avancée du placeholder : quand on tape on complète à droite de la saisi, en gris claire, avec l'entrée qui correspond exactement à ce qui est tapé. Par exemple si on a tapé "fire" et que la première application suggérée est "firefox", alors dans l'input on voit en noir "fire", suivi de son curseur suivi de "fox" en gris. Si on valide on sait alors que ce sera firefox qui sera retenu.
- gestion de "sections de suggestions" pour afficher des regroupement par catégorie de suggestions (applications, fichiers, ...) : utile que si on fait le choix de ne pas mélanger les types de résultats.
- une bonne gestion des évênement (y compris ceux à la sourie et clavier, pas juste un "onselect").
- customisation possible de chaque suggestion (ligne), ne pas avoir qu'un seul template.

Les composants testés et remarqués :
- selectize.js :le champion des tags, mais plugin jquery,  http://selectize.github.io/selectize.js/
- awesomplete : http://leaverou.github.io/awesomplete/ : vanilla js, vieux, bien modulaire, ne gère pas les tags, parfait pour une brique de base pour se faire son auto-complete home made ? gros soucis : ne gère pas la requête à une source de données extérieure : devra être implémanté. => vraiment a utiliser comme brique de base.
- Select2 : le plus mieux ? par contre c'est un plugin jquery... : http://ivaynberg.github.com/select2/index.html
- Typeahead.js : très bien mais sans gestion tags (utilisé dans ben-demo sur cozy-V2) : https://github.com/twitter/typeahead.js
- le classique un peu plat : jquery

## DataSet


## le filtre : sélectionne parmi les data ceux qui sont pertinents


## le tri : ordonne les résultats



Automated Cozy Hydrater (ACH *[ax]*) is a CLI that lets you **create and remove documents in your Cozy**.





## Install

Install ACH by cloning the repository and install dependencies:

```
git clone https://gitlab.cozycloud.cc/labs/ACH.git
yarn
```

Use it by running `yarn start` and let the help guide you:

```
$ yarn start

  Usage: index [options] [command]


  Commands:

    import [dataFile] [helpersFile]  The file containing the JSON data to import. Defaults to "example-data.json". Then the dummy helpers JS file (optional).
    importDir [directoryPath]        The path to the directory content to import. Defaults to "./DirectoriesToInject".
    drop <doctypes...>               Deletes all documents of the provided doctypes. For real.
    export [docTypes] [filename]     Exports data from the doctypes (separated by commas) to filename

  Options:

    -h, --help                                                                        output usage information
    -V, --version                                                                     output the version number
    -t --token                                                                        Generate a new token.
    -u --url <url>', 'URL of the cozy to use. Defaults to "http://cozy.tools:8080".'
```

## Import data

Files provided to the `import` command are parsed by [dummy-json](https://github.com/webroo/dummy-json), so you can pass a template file instead of a straight up JSON if you like.

Here is an example of data import:

```shell
yarn start -- -t import example-data.json # -t is used to generate a new cozy-client token
```

You can also use your [dummy custom helpers](https://github.com/webroo/dummy-json#writing-your-own-helpers) by following:

```shell
yarn start -- -t import example-data.json myDummyHelpers.js # the last optional argument is for dummy helpers
```

You can see an example of helpers [here](https://gitlab.cozycloud.cc/labs/ACH/blob/master/data/bank/helpers/bankDummyHelpers.js).

## Import repositories with files

You can also import a full repository content into a Cozy by using the command `importDir`:

```shell
yarn start -- -t importDir myDirectoryPath # default will be ./DirectoriesToInject
```

All your target directory content will be imported to the root of Cozy Drive following the correct repositories tree.

## GitIgnored templates

If you want, you can store your own template collection in the `templates` directory, which is git-ignored.
