# Objectifs de la launch barre, périmètre.

Suggestions de noms :
  - cerebro
  - cortex

Pouvoir rapidement ouvrir :
  - un répertoire
  - un fichier
  - une application
  - un album photo
  - une recherche plein texte avec des tags
  - lancer une recherche sur le web (Qwant...)
  - Plus tard :
    - un contact, un compte en banque, initier la création d'une entrée dans l'agenda, ouvrir la page d'un de ses compte de sa vault à mots de passe, lancer un album de musique ...
    - rendre possible l'invocation de la bar depuis une app pour récupérer une référence à un object. Par exemple dans une note pouvoir insérer une référence à un fichier, insérer un emoji, une référence à un rdv, à un album photo...

Avec les points d'attention suivant :
  - Et ce depuis le browser, l'app mobile et l'app desktop, idéalement en **offline** et en **online**.
      - Du coup la barre devient en soit un launcher sur le device, pas simplement dans la cozy barre.
      - il faut penser à l'**intégration avec les siri, cortana et autres spotlight**
  - La **consommation de ressource** côté serveur est à minimiser tout en maximisant la vitesse côté client. Avoir les data et algo dans un **worker** permettrait d'éviter les chargements et calculs à chaque changement d'app.
  - On affichera une **preview** quand l'utilisateur a son select sur un document le permettant (image, pdf...).
  - On attend de notre launcher qu'il se "souvienne" de nos précédentes requêtes et actions associée retenues pour nous les proposer en haut. Ce degrés de priorité doit tenir compte de la fréquence de l'utilisation de cette requêtes et de leur ancienneté, comme le fait la barre de Firefox qui trie celon la ["Frecency" (frequency & recency), cf cet article intéressant](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/Places/Frecency_algorithm).

Il faut bien faire la différence entre :
- l'**autocomplete** qui propose de lancer une action : ouvrir un répertoire, un fichier, une application... en fonction de ce que l'utilisateur a saisi.  
- et un résultat de **recherche** qui est en lui même une action que l'utilisateur choisira de lancer depuis la search barre. (faire la comparaison avec l'autocomplete dans Google)

De manière plus détaillée, la launch bar fonctionne de la manière suivante :
  - sur la base de sa saisie, on propose à l'utilisateur une liste de **suggestion** qui correspondent à des **action**.
  - quand l'utilisateur en choisi une, l'action sera exécutée : ouvrir le répertoire, l'album, créer une entrée dans l'agenda, lancer une recherche, faire un calcul...
  - On devra à terme proposer que plusieurs actions sur un document soit possible.
      - Par exemple une photo pourrait être ouverte dans Drive ou bien éditée dans une application d'édition de photos, ou bien envoyée par mail.
      - on y accéderait en tapant sur la touche "flèche droite" ou cliquant sur une petite flèche à droite de la suggestion.
  - les suggestions sont proposées par des adds-on que typiquement des apps peuvent apporter en les installant.
      - des suggestions de l'add-on de l'app en cours pourraient être prévilégier.
  - la recherche est une action à proprement parler :
      - l'utilisateur à saisi du texte, des tags, éventuellement d'autres critères de recherche mais ne choisi aucune suggestion et valide (enter key) : dans ce cas on lance une recherche avec ces paramètres.
      - A noter que l'on pourrait mettre une suggestion du type "lancer la recherche" toujours en premier...

Divers :
  - Une question importante d'UX avec impact technique est de savoir si on mélange dans la liste des suggestions les différentes natures de suggestions. Listary ne les mélange pas, Alfred les mélange... Fonctionnement optionnel ?
  - Il faudra rendre le raccourcis clavier paramétrable et en trouve un astucieux : ctrl-ctrl ? shift-space ?

Les modèles  :
- [Alfred](https://www.alfredapp.com) : la référence, possède un écosystème de [plugins](https://www.alfredapp.com/workflows/), par exemple [celui ci permet d'interagir avec les comptes sur son LastPass](https://github.com/bachya/lp-vault-manager).
- [Listary](http://www.listary.com/) : sur windows
- [cerebro](https://github.com/KELiON/cerebro): en electron et React !
    - A de belles preview en cas de recherche de cartes, documents, bons plugin pour les calculs et conversions...
    - multiplateforme, architecture de plugins... à intégrer à Cozy ?? apporte des plugins par OS, très utile pour la version desktop.
    - par contre ne gère pas les tags dans la zone de saisie.
- [Synapse] : principale originalité : possibilité de faire des "filtres" par types d'objet recherché (fichier, photo, répertoire, application...) simplement avec la flèche droite et gauche qui a pour effet de déplacer vers la droite ou gauche le type de document souhaité ("tout" par défaut), mais pour conséquence de ne plus pouvoir faire bouger le curseur dans la zone de saisie.



# Types de composants identifiés pour rendre le service, cahier des charges

Différents composants techniques avec des roles bien précis sont nécessaires :
- L'**autocomplete** : composant gérant l'UI/UX.
- **DataSet** : La source des data, dans notre cas il y aura besoin de plusieurs dataset
- le **filtre** : sélectionne parmi les data du dataset ceux qui sont pertinents
- le **tri** : ordonne les résultats


## l'autocomplete

En charge de l'interaction utilisateur, clavier et souris. Doit être suffisamment customisable sans être trop lié à des fonctionnement de search ou tri qui ne nous conviennent pas.

Fonctions clés :
- pouvoir se choisir sa propre fonction de filtre et tri
- gestion des tags.
    - Tout "champs" saisi gagne a être vu comme un tag, qui au besoin n'a pas de style visuel particulier, c'est à dire qu'il ne se distinguerait pas.
    - ex :
      - [(text)compte rendu EDF]  [(htag)#sécurité]  [(text)offre commerciale]  [(date-range)octobre 2016]
      - Exemple : [selectize.js](http://selectize.github.io/selectize.js/) :le champion des tags (mais plugin jQuery...)
    - les tags doivent être éditable intelligemment : croix de suppression, caret qui peut éditer un tag et pas simplement le supprimer totalement (backspace devant un tag le remet en texte normal et on peut l'éditer avec un autocomplete), gestion de tags de différentes type #, @ et texte...
- gestion avancée du placeholder : quand on tape on complète à droite de la saisi, en gris claire, avec l'entrée qui correspond exactement à ce qui est tapé. Par exemple si on a tapé "fire" et que la première application suggérée est "firefox", alors dans l'input on voit en noir "fire", suivi de son curseur suivi de "fox" en gris. Si on valide on sait alors que ce sera firefox qui sera retenu.
- gestion de "sections de suggestions" pour afficher des regroupement par catégorie de suggestions (applications, fichiers, ...) : utile que si on fait le choix de ne pas mélanger les types de résultats.
- une bonne gestion des évênement (y compris ceux à la sourie et clavier, pas juste un "onselect").
- customisation possible de chaque suggestion (ligne), ne pas avoir qu'un seul template.

Les composants testés et remarqués :
- [Autocomplete.js](https://github.com/algolia/autocomplete.js/blob/master/README.md) : utilisé dans le hack pour la V3.
- [selectize.js](http://selectize.github.io/selectize.js/) :le champion des tags, mais plugin jquery,  
- [awesomplete](http://leaverou.github.io/awesomplete/) : vanilla js, vieux, bien modulaire, ne gère pas les tags, parfait pour une brique de base pour se faire son auto-complete home made ? gros soucis : ne gère pas la requête à une source de données extérieure : devra être implémanté. => vraiment a utiliser comme brique de base.
- [Select2](http://ivaynberg.github.com/select2/index.html) : le plus mieux ? par contre c'est un plugin jquery...
- [React Select](http://jedwatson.github.io/react-select/) : en react, mais semble complet et modulaire, gestion des tags ok mais ne gère pas la modification des tags ni la navigation entre les tags. Utilisé dans Cerebro.
- [Typeahead.js](https://github.com/twitter/typeahead.js) : très bien mais sans gestion tags (utilisé dans ben-demo sur cozy-V2) :
- le classique un peu plat : jquery

## DataSet

Un dataset et les actions ont des api du type :
  - dataset.init()
  - dataset.search(query, options) => suggestions[actions]
  - action.exec(action)
  - suggestion.toString() : pour persister une suggestion et pouvoir l'exécuter plus tard (typiquement pour l'historique perso)
  - suggestion.preview() => false or {html/string} : retourne une preview si elle existe pour l'afficher.

## le filtre : sélectionne parmi les data ceux qui sont pertinents


## le tri : ordonne les résultats

## l'historique perso
Idée :
