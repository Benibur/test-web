const Fuse    = require("fuse.js")
const numeral = require('numeral')        // to format the numbers

var fuse
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

module.exports = {
  init : (newList, max_results)=>{
    MAX_RESULTS = max_results
    const fuseList = newList.slice() // duplicate the array to modify it with a full path
    for (let file of fuseList) {
      file.fullPath = file.path + '/' + file.name
    }
    fuse = new Fuse(fuseList, options)
    return "Fuse is a fuzzy search which prepare an index based on the occurences of sequences of 3 caracters."
  },

  search: function(input){
    const t0       = performance.now()
    const results  = fuse.search(input);
    const t1       = performance.now()
    const duration = numeral((t1 - t0)/1000).format('0.000')
    var output     = ''
    var n          = 1
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
      // limit the output size
      n++
      if (MAX_RESULTS < n){
        break
      }
    }
    return `<p>Search in ${duration}ms</p>${output}`
  }
}
