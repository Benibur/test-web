// init html
require("./style.styl")
const htmlbody = require("./my-jade.jade")()
document.body.innerHTML = htmlbody

// get html elements references
const btnEl    = document.getElementById('btn')
const input1El = document.getElementById('input1')
const outputEl = document.getElementById('output_container')

// get form data
const username = input1El.value

// put focus on input
input1El.select()
input1El.focus()

// prepare the Search
const Fuse    = require("fuse.js")
var fuse
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

// for quick tests
// list = [{"type":"file","path":"atom-amd64.deb"},
// {"type":"file","path":"awesomplete-gh-pages.zip"},
// {"type":"file","path":"google-chrome-stable_current_amd64.deb"},
// {"type":"file","path":"jquery-3.1.1.js"},
// {"type":"file","path":"jquery-ui-1.12.1.custom (1).zip"},
// {"type":"file","path":"jquery-ui-1.12.1.custom.zip"},
// {"type":"file","path":"mikogo (1).tar.gz"},
// {"type":"file","path":"mikogo-starter.exe"},
// {"type":"file","path":"mikogo.tar.gz"},
// {"type":"file","path":"mikogo4.5/mikogo"}]


// get data from the the json file (/tools/path-list.json)
let url = 'path-list.json';
fetch(url)
.then(res => res.json())
.then((out) => {
  console.log('Checkout this JSON! ', out);
  list = out
  fuse = new Fuse(list, options) // "list" is the item array
  autoTrigerSearch()
})
.catch(err => console.error(err));

// var fuse = new Fuse(list, options) // "list" is the item array
var numeral = require('numeral')   // to format the numbers

//
input1El.addEventListener('input', (e)=>{

  const startTime = performance.now()
  const results   = fuse.search(e.target.value);
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
)

// triger an imediate a search to ease debug
function autoTrigerSearch() {
  input1El.value = 'atom'
  input1El.value = 'mikog'
  input1El.dispatchEvent(new Event('input'))
}
// autoTrigerSearch()
