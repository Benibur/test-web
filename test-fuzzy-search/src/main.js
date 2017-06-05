var numeral = require('numeral')   // to format the numbers
const Fuse  = require("fuse.js")
var fuse

// 1] init html
require("./style.styl")
const htmlbody = require("./my-jade.jade")()
document.body.innerHTML = htmlbody
const btnEl    = document.getElementById('btn')
const input1El = document.getElementById('input1')
const outputEl = document.getElementById('output_container')
input1El.select()
input1El.focus()


// 2] prepare the Search options
const options = {
  shouldSort: true,
  tokenize: true,
  matchAllTokens: true,
  includeScore: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["path"]
};

search = function(input){
  const startTime = performance.now()
  const results   = fuse.search(input);
  const endTime   = performance.now()
  const duration  = numeral((endTime - startTime)/1000).format('0.000')
  var output      = ''
  var roundScore
  for (res of results){
    roundScore
    output += `<p> <span class="score">${ numeral(res.score).format('0.000')}</span><span class="path"> ${res.item.path}</span></p>`
  }
  outputEl.innerHTML = `<p>Search in ${duration}ms</p>${output}`
  }

input1El.addEventListener('input', (e)=>{
  search(e.target.value)}
)

// triger an imediate a search to ease debug
function autoTrigerSearch(query) {
  input1El.value = query
  input1El.dispatchEvent(new Event('input'))
}


// 3] Prepare the list where to search and trigger one
list_type = 'long list'
list_type = 'small'
list_type = 'pathes'
if (list_type == 'small') {
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
  fuse = new Fuse(list, options)
  autoTrigerSearch('mik')

}else if (list_type == 'pathes') {
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
  fuse = new Fuse(list, options)
  autoTrigerSearch('admin edf fact')

}else if (list_type == 'long list') {
  // get data from the the json file (/tools/path-list.json)
  let url = 'path-list.json';
  fetch(url)
  .then(res => res.json())
  .then((out) => {
    console.log('Checkout this JSON! ', out);
    list = out
    fuse = new Fuse(list, options) // "list" is the item array
    autoTrigerSearch('ordonnance')
  })
  .catch(err => console.error(err));
}
