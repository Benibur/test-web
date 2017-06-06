var numeral = require('numeral')   // to format the numbers
const Fuse  = require("fuse.js")
var fuse
const fuzzaldrin = require('fuzzaldrin')
const fuzzaldrinPlus = require('fuzzaldrin-plus')
const autocompleteAlgolia = require('autocomplete.js')

MAX_RESULTS = 5
LIST_TYPE   = 'small'     // small set of data
LIST_TYPE   = 'pathes'    // small set of pathes
LIST_TYPE   = 'long list' // big list of pathes

// ------------------------------------------------------------------
// 1] init html
require("./style.styl")
const htmlbody = require("./my-jade.jade")()
document.body.innerHTML = htmlbody
const btnEl    = document.getElementById('btn')
const input1El = document.getElementById('input1')
const fuseOutputEl = document.getElementById('fuse')
const fuzzaldrinOutputEl = document.getElementById('fuzzaldrin')
const fuzzaldrinPlusOutputEl = document.getElementById('fuzzaldrin-plus')
input1El.select()
input1El.focus()


// ------------------------------------------------------------------
// 2] init the autocomplete.js (algolia https://github.com/algolia/autocomplete.js)
const autocompleteAlgoliaEL = document.getElementById('input2')
autocompleteAlgolia('#input2', { hint: true }, [
    {
      source: function (query, cb) {
        cb([{path:'p1', html:'<b>p1</b>'},{path:'p2', html:'<b>p2</b>'}])
      } ,
      displayKey: 'path',
      templates: {
        suggestion: function(suggestion) {
          console.log("dd", suggestion);
          return suggestion.html;
        }
      }
    }
  ]).on('autocomplete:selected', function(event, suggestion, dataset) {
    console.log(suggestion, dataset);
  });


// ------------------------------------------------------------------
// 2] prepare the Search options for fuzzaldrin

fuzzaldrinSearch = function (query) {
  const t0       = performance.now()
  const results  = fuzzaldrin.filter(list, query, {key: 'path'})
  const t1       = performance.now()
  const duration = numeral((t1 - t0)/1000).format('0.000')
  var resultsStr = ''
  var n = 0
  for (res of results) {
    resultsStr += `<p>${basiqueBolderify(query, res.path)}</p>`
    if (n++>MAX_RESULTS) { break}
  }
  fuzzaldrinOutputEl.innerHTML = `<p>Search in ${duration}ms</p>${resultsStr}`
}

basiqueBolderify = function (query, path) {
  words = query.split(' ')
  words = words.filter(function (item) { return (item !== '') })
  startIndex = 0
  var html = ''
  lastIndex = path.length
  while (startIndex<lastIndex) {
    nextWordOccurence = nextWord(path, words, startIndex)
    if (!nextWordOccurence) {
      break
    }
    html += `${path.slice(startIndex, nextWordOccurence.start)}<b>${nextWordOccurence.word}</b>`
    startIndex = nextWordOccurence.end
  }
  html += path.slice(startIndex)
  return html
}
nextWord = function (path, words, startIndex) {
  path = path.toLowerCase()
  var I = path.length
  var W=''
  var i = -1
  for (let w of words) {
    i = path.indexOf(w.toLowerCase(),startIndex)
    if (i<I && -1<i) {
      I = i
      W = w
    }
  }
  if (i == -1) {
    return undefined
  }else {
    return {word:W, start:I, end:I+W.length}
  }
}

// ------------------------------------------------------------------
// 3] prepare the Search options for fuzzaldrin

fuzzaldrinPlusSearch = function (query) {
  const t0       = performance.now()
  const results  = fuzzaldrinPlus.filter(list, query, {key: 'path'})
  const t1       = performance.now()
  const duration = numeral((t1 - t0)/1000).format('0.000')
  var resultsStr = ''
  var n = 0
  for (res of results) {
    resultsStr += `<p>${basiqueBolderify(query, res.path)}</p>`
    if (n++>MAX_RESULTS) { break}
  }
  fuzzaldrinPlusOutputEl.innerHTML = `<p>Search in ${duration}ms</p>${resultsStr}`
}



// With an array of strings
// candidates = ['Call', 'Me', 'Maybe']


// With an array of objects
// candidates = [
//   {name: 'Call', id: 1}
//   {name: 'Me', id: 2}
//   {name: 'Maybe', id: 3}
// ]
// results = fuzzaldrin(candidates, 'me', key: 'name')
// console.log(results) # [{name: 'Me', id: 2}, {name: 'Maybe', id: 3}]

// ------------------------------------------------------------------
// 3] prepare the Search options for fuse.js
const options = {
  shouldSort: true,
  tokenize: false,
  matchAllTokens: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["path"]
};

var prepareListeForFuse = (list)=>{
  const fuseList = []
  // test for tuning the path into an array of folders : results are
  // not good... neither in relevance nor in commodity (the indices are impossible to use)
  // for (item of list) {
  //   newItem = Object.assign({}, item)
  //   newItem.path = item.path.split('/')
  //   fuseList.push(newItem)
  // }
  // console.log(JSON.stringify(fuseList));
  // return fuseList
  return list
}

fuse_search = function(input){
  const t0       = performance.now()
  const results  = fuse.search(input);
  const t1       = performance.now()
  const duration = numeral((t1 - t0)/1000).format('0.000')
  var output     = ''
  // compute the boldified html output
  for (res of results){
    path = res.item.path
    var lastIndex = 0
    var boldified = ''
    if (res.matches[0].indices) {
      for ( range of res.matches[0].indices) {
        boldified +=  path.slice(lastIndex,range[0]) + '<b>' + path.slice(range[0],range[1]+1) + '</b>'
        lastIndex = range[1]+1
      }
      boldified +=  path.slice(lastIndex)
    } else {
      boldified = path
    }
    output += `<p> <span class="score">${ numeral(res.score).format('0.000')}</span><span class="path"> ${boldified}</span></p>`
  }
  fuseOutputEl.innerHTML = `<p>Search in ${duration}ms</p>${output}`
  }



// ------------------------------------------------------------------
// 4] functions to run all searches
runSearches = function (query) {
  // fuse_search(query)
  fuzzaldrinSearch(query)
  fuzzaldrinPlusSearch(query)
  // results = fuzzaldrin(candidates, 'me')
}

input1El.addEventListener('input', (e)=>{
  runSearches(e.target.value)
})

// triger an imediate a search to ease debug
autoTrigerSearch = function(query) {
  input1El.value = query
  runSearches(query)
  // input1El.dispatchEvent(new Event('input'))
}

// ------------------------------------------------------------------
// 5] Prepare the list where to search and trigger one search
if (LIST_TYPE == 'small') {
  // for quick tests
  list = [{"type":"file","path":"atom-amd64.deb"},
  {"type":"file","path":"awesomplete-gh-pages.zip"},
  {"type":"file","path":"google-chrome-stable_current_amd64.deb"},
  {"type":"file","path":"jquery-3.1.1.js"},
  {"type":"file","path":"jquery-ui-1.12.1.custom (1).zip"},
  {"type":"file","path":"jquery-ui-1.12.1.custom.zip"},
  {"type":"file","path":"mikogo (1).tar.gz"},
  {"type":"file","path":"mikogo-starter.exe"},
  {"type":"file","path":"mikogo.tar.gz"},
  {"type":"file","path":"mikogo4.5/mikogo"}]
  fuse = new Fuse(prepareListeForFuse(list), options)
  autoTrigerSearch('mik')

}else if (LIST_TYPE == 'pathes') {
  // for tests on file pathes
  list = [{"type":"file","path":"/Administratif"},
  {"type":"file","path":"/Administratif/Bank statements"},
  {"type":"file","path":"/Administratif/Bank statements/Bank Of America"},
  {"type":"file","path":"/Administratif/Bank statements/Deutsche Bank"},
  {"type":"file","path":"/Administratif/Bank statements/Société Générale"},
  {"type":"file","path":"/Administratif/CPAM"},
  {"type":"file","path":"/Administratif/EDF"},
  {"type":"file","path":"/Administratif/EDF/Contrat"},
  {"type":"file","path":"/Administratif/EDF/Factures"},
  {"type":"file","path":"/Administratif/Emploi"},
  {"type":"file","path":"/Administratif/Impôts"},
  {"type":"file","path":"/Administratif/Logement"},
  {"type":"file","path":"/Administratif/Logement/Loyer 158 rue de Verdun"},
  {"type":"file","path":"/Administratif/Orange"},
  {"type":"file","path":"/Administratif/Pièces identité"},
  {"type":"file","path":"/Administratif/Pièces identité/Carte identité"},
  {"type":"file","path":"/Administratif/Pièces identité/Passeport"},
  {"type":"file","path":"/Administratif/Pièces identité/Permis de conduire"},
  {"type":"file","path":"/Appareils photo"},
  {"type":"file","path":"/Boulot"},
  {"type":"file","path":"/Cours ISEN"},
  {"type":"file","path":"/Cours ISEN/CIR"},
  {"type":"file","path":"/Cours ISEN/CIR/LINUX"},
  {"type":"file","path":"/Cours ISEN/CIR/MICROCONTROLEUR"},
  {"type":"file","path":"/Cours ISEN/CIR/RESEAUX"},
  {"type":"file","path":"/Cours ISEN/CIR/TRAITEMENT_SIGNAL"},
  {"type":"file","path":"/Divers photo"},
  {"type":"file","path":"/Divers photo/wallpapers"},
  {"type":"file","path":"/Films"},
  {"type":"file","path":"/Notes"},
  {"type":"file","path":"/Notes/Communication"},
  {"type":"file","path":"/Notes/Notes techniques"},
  {"type":"file","path":"/Notes/Recrutement"},
  {"type":"file","path":"/Projet appartement à Lyon"},
  {"type":"file","path":"/Vacances Périgord"}]

  fuse = new Fuse(prepareListeForFuse(list), options)
  autoTrigerSearch('admin con')

}else if (LIST_TYPE == 'long list') {
  // get data from the the json file (/tools/path-list.json)
  let url = 'path-list.json';
  fetch(url)
  .then(res => res.json())
  .then((out) => {
    console.log('Checkout this JSON! ', out);
    list = out
    fuse = new Fuse(prepareListeForFuse(list), options) // "list" is the item array
    autoTrigerSearch('ordonnance ben')
  })
  .catch(err => console.error(err));
}
