const numeral    = require('numeral')        // to format the numbers
const fuzzaldrin = require('fuzzaldrin')
const Helpers    = require('./helpers')
const markdown   = require('marked')
var list, MAX_RESULTS

basiqueBolderify = Helpers.basiqueBolderify

const comments = `Fuzzaldrin is the fuzzy search used in Atom (the text editor).
The problem is that it is ok with 'this i**s**/tw**o**/fi**le**s' for the query 'soles' whereas the caractes are in different words and directory names. `

// ------------------------------------------------------------------
// Fuzzaldrin

module.exports = {
  init : (newList, max_results)=>{
    list = newList.slice() // duplicate the array to modify it with a full path
    for (let file of list) {
      file.fullPath = file.path + '/' + file.name
    }
    MAX_RESULTS = max_results
    return markdown(comments)
  },
  search: function (query) {
    const t0       = performance.now()
    const results  = fuzzaldrin.filter(list, query, {key: 'fullPath'})
    const t1       = performance.now()
    const duration = numeral((t1 - t0)/1000).format('0.000')
    var resultsStr = ''
    var n = 1
    for (res of results) {
      resultsStr += `<p>${basiqueBolderify(query, res.fullPath)}</p>`
      if (MAX_RESULTS<++n) { break}
    }
    return `<p>Search in ${duration}ms</p>${resultsStr}`
  }
}
