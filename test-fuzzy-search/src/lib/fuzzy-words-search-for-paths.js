/**

### Description
Search for words occurences in paths of files.
Occurence can occure in any order, but the closer from the filename is the occurence, the more it is considered relevant.
Results are ranked by order of relevance.

### Usage
- \`fuzzyWordsSearch = require('fuzzy-words-search-for-paths')\`
- \`fuzzyWordsSearch.init(itemList)\`
- \`fuzzyWordsSearch.search(query)\`
where :
- itemList : an array of item of the form of : \`{"path":"/Administratif/Bank statements", "name":"bank-statement-01-2017.pdf"}\` (can include ofther properties, only path and name are required)
- query : the string with words to search for.

### Principles :
- the query string is divided intor "words", separator is space
- we test the exact occurence of a word in each directory name and filename.
- search is not fuzzy within a file or directory name : ie 'spa' is true in 'espace' but not in 'special'
- we test the occurence of words whatever there order
- the further the occurrence of a word from the "leaf", the more we penalise the score. For instance 'spa' has a score of 1 for 'one/two/three spaces' but only 0.8 for one space/after/the other
- at the start of a search, we chek is the new query is "an augmentation" of the previous (ie is just more selective). If yes, it means that instead of running the search against all the possible items, we just run it on the previous suggestions list to refine it. This means that the more you type a long query, the faster is the updates.
- not sensitive to diacritics

### Possible improvements :
- there is a lot of redundance in the paths : we could put the paths into a tree instead of having an array of the whole path for each file. This would lead to a smaller memory consumption and a faster search since occurences woud be tested only once for each directory (tree node)
- when a word from previous query is removed (for instance we search "atom ele" after "atom elect" : here "elect" has been removed), then we have to recompute all the scores because we don't know the contribution of the lost word in the scores : we could try to find a way to remove the contribution of a word (by storing it or dynamycaly removing it)
- when updating the lis of items : just send the modified item in order to not update the whole list for nothing
- put in a worker : advantage is not obvious, the aim is to be very fast so that you don't need a worker.
- develop in asmjs :-)

*/


const
  removeDiacritics = require('diacritics').remove

let
  list,
  currentQuery=[],
  previousSuggestions=[]


// ------------------------------------------------------------------
// Main object, two methods : init() and search()
module.exports = {

  init : (newItemsList)=>{
    list = newItemsList
    for (let file of list) {
      file.pathArray = removeDiacritics((file.path+'/'+file.name).toLowerCase()).split('/').filter(Boolean).reverse()
    }
  },

  search: function (query, max_results) {
    return _fuzzyWordsSearch(query, max_results)
  }
}


// ------------------------------------------------------------------
// Private methods

// The main method. query is a string.
const _fuzzyWordsSearch = function (query, max_results) {
  // extract words from query, compare them to the words of previous query and
  // launch a new search or refine the previous one.
  const Query = []
  if (query == '') return ''
  for (let w of removeDiacritics(query.trim().toLowerCase()).split(' ').filter(Boolean)) {
    Query.push({w:w, isAugmentedWord:false, isNewWord:true })
  }
  // console.log('\nprevious query :', _logQuery(currentQuery));
  // console.log('new query      :', _logQuery(Query));
  let {isQueryAugmented, priorizedWords} = _isAugmentingCurrentQuery(Query)
  if (isQueryAugmented && (previousSuggestions.length != 0)) {
    // the new query is just more selective than the previous one : refine the suggestions
    // console.log("we update the suggestions");
    // console.log('priorizedWords',_logQuery(priorizedWords));
    previousSuggestions = _filterAndScore(previousSuggestions, priorizedWords)
  }else {
    // the new query is too different : run a new search
    // console.log("we build a new suggestion")
    previousSuggestions = _filterAndScore(list, priorizedWords)
  }
  currentQuery = Query
  console.log('max_results', max_results);
  if (max_results) {
    return previousSuggestions.slice(0,max_results)
  }else {
    return previousSuggestions
  }
}

// returns a ranked array of [suggestions].
// suggestion items are objects : {score:[number], ... (all the properties
//   of an item given in init(newItemsList))}
const _filterAndScore = function (list_items, words) {
  // console.log('\n === _filterAndScore', _logQuery(words));
  // console.log(list_items);
  const suggestions = []
  itemLoop:
  for (let item of list_items) {
    let itemScore = 0
    for (let w of words) {
      let
        wordOccurenceValue = 1,
        wScore = 0
      for (let dirName of item.pathArray) {
        if (dirName.includes(w.w)){
          wScore += wordOccurenceValue
        }
        // the score of the occurence of a word decreases with distance from the leaf, but can not be too small
        wordOccurenceValue -= 0.4
        if(wordOccurenceValue===0) i=0.1
      }
      if (wScore === 0) {
        // w is not in the path : reject the item
        continue itemLoop
      }
      itemScore += wScore // increase the
      // console.log(`\npath: "${item.path}", \nword: "${w.w}", itemScore:${itemScore}`);
    }
    if (itemScore != 0) {
      item.score = itemScore
      // console.log("one found !", item);
      suggestions.push(item)
    }
  }
  // console.log('=== In the end, suggestions for query :', _logQuery(words))
  suggestions.sort((s1, s2)=>{
    return s2.score-s1.score
  })
  // _logSugggestions(suggestions)
  return suggestions
}

// in charge of checking if the query is augmented, ie there are only new words or
// more preciser words (for instance "atom ele" became "atom elect neutrinos").
// returns {isQueryAugmented, priorizedWords}
// where isQueryAugmented : Boolean
/// priorizedWords : [Array] : [{w:'word'}...]
const _isAugmentingCurrentQuery = function (query){
  var
    priorizedWords      = [],
    isFromPreviousQuery = []
  // check that each word of the previous query is included in a word
  // of the new query.
  // Included means : 'spa' is in 'backspace' : true, 'spa' is in 'separate' : false
  for (let W of currentQuery){
    let isIncluded = false
    for (let w of query) {
      if (w.w.includes(W.w)){
        isIncluded = true
        if(w.w.length !== W.w.length){
          w.isAugmentedWord = true
        }else {
          w.isNewWord = false
        }
      }
    }
    if (!isIncluded) {
      // console.log("query is reinitialized because of", W);
      priorizedWords = _sortQuerybyLength(query)
      const isQueryAugmented = false
      return {isQueryAugmented,priorizedWords}
    }
  }
  // list the words of the new query that have been augmented
  for (let w of query) {
    if (w.isNewWord || w.isAugmentedWord) {
      priorizedWords.push(w)
    }else{
      isFromPreviousQuery.push(w)
    }
  }
  // console.log("query is augmenting the previous one. Augmented words are :", _logQuery(priorizedWords))
  priorizedWords = _sortQuerybyLength(priorizedWords).concat(_sortQuerybyLength(isFromPreviousQuery))
  return {isQueryAugmented:true,priorizedWords}
}

const _sortQuerybyLength = function(query){
  query.sort(function(a,b){
    b.w.length - a.w.length
  })
  return query
}

const _logSugggestions = function(suggestions){
  const res = []
  for (let sugg of suggestions) {
    console.log(`score:${sugg.score} "${sugg.path}"`);
  }
}

const _logQuery = function (Query) {
  res = []
  for (let w of Query) {
    res.push(w.w)
  }
  return JSON.stringify(res);
}
