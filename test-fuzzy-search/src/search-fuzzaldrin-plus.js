const
  numeral        = require('numeral'),        // to format the numbers
  fuzzaldrinPlus = require('fuzzaldrin-plus'),
  wordBolderify  = require('./helpers').wordBolderify,
  markdown       = require('marked')
var
  list,
  MAX_RESULTS

const comments = `en __underlined__`

// ------------------------------------------------------------------
// FuzzaldrinPlus

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
    const results  = fuzzaldrinPlus.filter(list, query, {key: 'fullPath'})
    const t1       = performance.now()
    const duration = numeral((t1 - t0)/1000).format('0.000')
    var resultsStr = ''
    var n = 1
    for (res of results) {
      resultsStr += `<p>${wordBolderify(query, res.fullPath)}</p>`
      if (++n>MAX_RESULTS) { break}
    }
    return `<p>Search in ${duration}ms</p>${resultsStr}`
  }
}
