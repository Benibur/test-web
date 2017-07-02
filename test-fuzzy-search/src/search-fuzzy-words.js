const
  fuzzyWordsSearch = require('./lib/fuzzy-words-search-for-paths')
  numeral          = require('numeral'),          // to format the numbers,
  wordBolderify    = require('./helpers').wordBolderify,
  markdown         = require('marked')

let
 list,
 currentQuery=[],
 previousSuggestions=[],
 MAX_RESULTS

const comments = `
### Description
Search for words occurences in paths of files.
Occurence can occure in any order, but the closer from the filename is the occurence, the more it is considered relevant.
Results are ranked by order of relevance.

### Usage
- \`fuzzyWordsSearch = require('fuzzy-words-search-for-paths')\`
- \`fuzzyWordsSearch.init(itemList)\`
- \`fuzzyWordsSearch.search(query)\`
where :
- itemList : an array of item of the form of : \`{"path":"/Administratif/Bank statements/", "name":"bank-statement-01-2017.pdf"}\` (can include ofther properties, only path and name are required)
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
- develop in asmjs :-)

`


// ------------------------------------------------------------------
//

module.exports = {
  init : (newList, max_results)=>{
    const t0       = performance.now()
    fuzzyWordsSearch.init(newList)
    const t1       = performance.now()
    MAX_RESULTS = max_results
    return numeral((t1 - t0)/1000).format('0.000')

  },

  getComments : () => {
    return markdown(comments)
  },

  search: function (query) {
    const t0       = performance.now()
    const results  = fuzzyWordsSearch.search(query,MAX_RESULTS)
    const t1       = performance.now()
    const duration = numeral((t1 - t0)/1000).format('0.000')
    let resultsStr = ''
    for (let res of results) {
      resultsStr += `<p><span class="score">${numeral(res.score).format('00.00')}</span> ${wordBolderify(query, res.path)}/${wordBolderify(query, res.name)}</p>`
    }
    const t2 = performance.now()
    const duration2 = numeral((t2 - t1)/1000).format('0.000')
    return `<p>Search in ${duration}ms, bolderify in ${duration2}</p>${resultsStr}`
  }
}
