const
  numeral          = require('numeral'),                 // to format the numbers
  myFuse           = require('./search-fuse'),
  myFuzzaldrin     = require('./search-fuzzaldrin'),
  myFuzzaldrinPlus = require('./search-fuzzaldrin-plus'),
  myFuzzyWords     = require('./search-fuzzy-words'),
  Cookies          = require('js-cookie'),
  debounce         = require('./helpers').debounce,
  wordBolderify    = require('./helpers').wordBolderify

var initSearches = function () {}

const
  MAX_RESULTS       = 10,
  DEBOUNCE_DURATION = 250,   // in ms
  DEFAULT_SEARCH    = 'capitalisation valo'

// ------------------------------------------------------------------
// init html
require("./style.styl")
document.body.innerHTML = require("./my-jade.jade")()
const btnEl    = document.getElementById('btn')
const searchInput = document.getElementById('search-input')
const realTimeSearchChkbx = document.getElementById('search-realtime-chckbox')
searchInput.select()
searchInput.focus()


// ------------------------------------------------------------------
// manage checkboxes states and actions
var defaultActivatedSearches = Cookies.getJSON('defaultActivatedSearches')
if (!defaultActivatedSearches){
  defaultActivatedSearches = {
    "search-realtime-chckbox":  false,
    "fuse-checkbox":            true,
    "fuzzaldrin-checkbox":      true,
    "fuzzaldrin-plus-checkbox": true,
    "listTypeRadio":            'short-list-radio'
  }
}

document.getElementById('search-btn').addEventListener('click',  function(ev){
  runAllSearches(true)
})

// add listeners to save the states of all checkboxes
for (let chkbx of document.querySelectorAll('[type=checkbox]')) {
  chkbx.addEventListener('change', (ev)=>{
    const checked = ev.target.checked
    defaultActivatedSearches[ev.target.id] = checked
    Cookies.set('defaultActivatedSearches', defaultActivatedSearches)
  })
}

// add listeners to the activation checkboxes to handle active searches
for (let chkbx of document.querySelectorAll('.activation-checkbox')) {
  chkbx.onchange = (ev)=>{
    const checked = ev.target.checked
    if (!checked) {
      ev.target.parentElement.parentElement.parentElement.classList.add("unactivated")
    }else{
      ev.target.parentElement.parentElement.parentElement.classList.remove("unactivated")
    }
    initSearches()
  }
}

// add listeners to toggle comments
for (let chkbx of document.querySelectorAll('.comment-toggler')) {
  chkbx.addEventListener('click', (ev)=>{
    ev.target.parentElement.querySelectorAll('.comments')[0].classList.toggle('expanded')
    ev.target.classList.toggle('expanded')
    })
}

// restore checkbox state
for (chkbx of document.querySelectorAll('[type=checkbox]')) {
  if (defaultActivatedSearches[chkbx.id]) {
    chkbx.checked = true
  }else {
    chkbx.checked = false
  }
  chkbx.dispatchEvent(new Event('change'))
}

// add listeners to the radio for lists to save state and choose the correct list
for (radio of document.querySelectorAll('[name=listTypeRadio]')) {
  radio.onchange = (ev)=>{
    let checked = ev.target.checked
    defaultActivatedSearches['listTypeRadio'] = ev.target.id
    Cookies.set('defaultActivatedSearches', defaultActivatedSearches)
    if (ev.target.id=='long-list-radio') {
      currentList = 'long'
    }else {
      currentList = 'short'
    }
    initSearches()
  }
}

// restore radio state
currentList = 'short'
if (defaultActivatedSearches['listTypeRadio']) {
  let radio = document.getElementById(defaultActivatedSearches['listTypeRadio'])
  radio.checked = true
  radio.dispatchEvent(new Event('change'))
}


// ------------------------------------------------------------------
// deal all triggers to run searches
runAllSearches = function (forced) {
  query = searchInput.value
  if ( query.length < 3 && !forced ) {
    return
  }
  if (defaultActivatedSearches['fuse-checkbox']) {
    fuseSearch(query)
  }
  if (defaultActivatedSearches['fuzzaldrin-checkbox']) {
    fuzzaldrinSearch(query)
  }
  if (defaultActivatedSearches['fuzzaldrin-plus-checkbox']) {
    fuzzaldrinPlusSearch(query)
  }
  if (defaultActivatedSearches['fuzzy-words-checkbox']) {
    fuzzyWordsSearch(query)
  }
}

runAllSearchesDebounced = debounce(function(){
  if (realTimeSearchChkbx.checked) {
    runAllSearches()
  }
},DEBOUNCE_DURATION)

searchInput.addEventListener('input', runAllSearchesDebounced)

searchInput.addEventListener('keypress', (e)=>{
  if (e.keyCode === 13) {
    runAllSearches(true)
  }
})


// ------------------------------------------------------------------
// prepare the Search for fuse.js
const fuseOutputEl = document.getElementById('fuse-results')
fuseSearch = function fuseSearch(query) {
  fuseOutputEl.innerHTML = myFuse.search(query)
}


// ------------------------------------------------------------------
// prepare the Search for fuzzaldrin
const fuzzaldrinOutputEl = document.getElementById('fuzzaldrin-results')
const fuzzaldrinSearch = function (query) {
  fuzzaldrinOutputEl.innerHTML = myFuzzaldrin.search(query)
}


// ------------------------------------------------------------------
// prepare the Search for fuzzaldrin-plus
const fuzzaldrinPlusOutputEl = document.getElementById('fuzzaldrin-plus-results')
const fuzzaldrinPlusSearch = function (query) {
  fuzzaldrinPlusOutputEl.innerHTML = myFuzzaldrinPlus.search(query)
}

// ------------------------------------------------------------------
// prepare the Search for fuzzy-words
const fuzzyWordsOutputEl = document.getElementById('fuzzy-words-results')
const fuzzyWordsSearch = function (query) {
  fuzzyWordsOutputEl.innerHTML = myFuzzyWords.search(query)
}


// ------------------------------------------------------------------
// Prepare the list where to search and trigger an automatic search
initSearches = function (query) {
  var initDuration
  searchInput.value = query
  if (lists[currentList]) {

    if (defaultActivatedSearches['fuse-checkbox']) {
      console.log('fuse init');
      document.getElementById('fuse-comments').innerHTML = myFuse.init(lists[currentList], MAX_RESULTS)
    }else{myFuse.init([],0)}

    if (defaultActivatedSearches['fuzzaldrin-checkbox']) {
      console.log('fuzzaldrin init');
      document.getElementById('fuzzaldrin-comments').innerHTML =myFuzzaldrin.init(lists[currentList], MAX_RESULTS)
    }else{myFuzzaldrin.init([],0)}

    if (defaultActivatedSearches['fuzzaldrin-plus-checkbox']) {
      console.log('fuzzaldrin-plus init');
      document.getElementById('fuzzaldrin-plus-comments').innerHTML =myFuzzaldrinPlus.init(lists[currentList], MAX_RESULTS)
    }else{myFuzzaldrinPlus.init([],0)}

    if (defaultActivatedSearches['fuzzy-words-checkbox']) {
      initDuration = myFuzzyWords.init(lists[currentList], MAX_RESULTS)
      console.log(`fuzzy-words init (in ${initDuration}ms)`);
      document.getElementById('fuzzy-words-comments').innerHTML = `Init in ${initDuration}ms` + myFuzzyWords.getComments()
    }else{myFuzzyWords.init([],0)}
  }
  runAllSearches(true)
}
prepareLists = require('./lists-of-data')
prepareLists(function (preparedLists) {
  lists = preparedLists
  initSearches(DEFAULT_SEARCH)
  // tests TODO : "bank  adm"  and "bank adm" should scrore the same : it is not the case
})
