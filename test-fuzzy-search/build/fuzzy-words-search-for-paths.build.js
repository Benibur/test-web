/**
TODO
- ajust scoring rules
  - impact of the distance from the filename on the score
  - impact of the path length : when searching 'D'  /D1 should be higher than /D1/D2
  - turn into a class
  - memory consumption : test and improvements

### Description
Search for words occurences in paths of files.
Occurence can occure in any order, but the closer from the filename is the occurence, the more it is considered relevant.
Results are ranked by order of relevance.
Perfomances :
  - tested with 40.000 paths (file of 6 Mo) :
    - Init in 0.251ms (when file is already loaded)
    - a single caracter search in 0.128ms
    - a 4 caracters search in 0.065ms
    - ...

### Usage
- \`fuzzyWordsSearch = require('fuzzy-words-search-for-paths')\`
- \`fuzzyWordsSearch.init(itemList, [max_results])\`
- \`fuzzyWordsSearch.search(query)\`
where :
- itemList : an array of item of the form of : \`{"path":"/Administratif/Bank statements", "name":"bank-statement-01-2017.pdf"}\` (can include ofther properties, only path and name are required)
- max_results : optionnal : an integer to limit the number of returned suggestions
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

// ------------------------------------------------------------------
// Main public object, two methods : init() and search()

/* BLOCK:START */
/* FOR DUPLICATION FOR DEBUG AND PERFORMANCE TESTS */
const forDebugPackage = function () {
  const removeDiacritics = require('diacritics').remove
  let list
  let previousQuery = []
  let previousSuggestions = []

  // ------------------------------------------------------------------
  // Private methods

  // The main method. query is a string.
  // extract words from query, compare them to the words of previous query and
  // launch a new search or refine the previous one.
  const _fuzzyWordsSearch = function (query, maxResults) {
    if (query === '') return []
    // 1 prepare the Query (array of words)
    const Query = _prepareQuery(query)
    // 2 check if the new query is an augmentation of the previous
    let [isQueryAugmented, priorizedWords] = _isAugmentingCurrentQuery(Query)
    // 3 launch adapted filters on list of previous suggestions
    if (isQueryAugmented && previousSuggestions.length !== 0) {
      // the new query is just more selective than the previous one : just refine the previous suggestions (if no previous suggestion : nothing to do)
      // console.log('we update the suggestions for priorizedWords', _logQuery(priorizedWords))
      previousSuggestions = _filterAndScore(previousSuggestions, priorizedWords)
    } else {
      // the new query is too different : run a new search
      // console.log('we build a new suggestions for priorizedWords', _logQuery(priorizedWords))
      previousSuggestions = _filterAndScore(list, priorizedWords)
    }
    if (maxResults) {
      return previousSuggestions.slice(0, maxResults)
    } else {
      return previousSuggestions
    }
  }

  // cut the query string into an array of words
  const _prepareQuery = function (query) {
    const Query = []
    for (let w of removeDiacritics(query.trim().toLowerCase()).split(' ').filter(Boolean)) {
      Query.push({ w: w, isAugmentedWord: false, isNewWord: true })
    }
    return Query
  }

  // SAVE THE SEARCH WITH 1RST LOGIC
  // // returns a ranked array of [suggestions].
  // // suggestion items are objects : {score:[number], ... (all the properties
  // //   of an item given in init(newItemsList))}
  // const _filterAndScore = function (listItems, words) {
  //   const suggestions = []
  //   // eslint-disable-next-line
  //   itemLoop:
  //   for (let item of listItems) {
  //     let itemScore = 0
  //     for (let w of words) {
  //       let wordOccurenceValue = 52428800 // 52 428 800 === 2^19 * 100
  //       let wScore = 0
  //       for (let dirName of item.pathArray) {
  //         if (dirName.includes(w.w)) {
  //           let delta = wordOccurenceValue / 5 * (1 + 5 * Math.pow(w.w.length / dirName.length, 2))
  //           // let delta = wordOccurenceValue  * Math.pow(w.w.length / dirName.length, 2)
  //           wScore += delta
  //         } else {
  //           wScore -= 10000
  //         }
  //         // the score of the occurence of a word decreases with distance from the leaf
  //         wordOccurenceValue = wordOccurenceValue / 2
  //       }
  //
  //  //
  //       if (wScore < 0) {
  //         // w is not in the path : reject the item
  //         // eslint-disable-next-line
  //         continue itemLoop
  //       }
  //       itemScore += wScore // increase the score
  //     }
  //
  //  //
  //     if (0 < itemScore) {
  //       item.score = itemScore
  //       suggestions.push(item)
  //     }
  //   }
  //   suggestions.sort((s1, s2) => {
  //       return s2.score - s1.score
  //   })
  //   return suggestions
  // }

  // returns a ranked array of [suggestions].
  // suggestion items are objects : {score:[number], ... (all the properties
  //   of an item given in init(newItemsList))}
  const _filterAndScore = function (listItems, words) {
    const suggestions = []
    // eslint-disable-next-line
    itemLoop:
    for (let item of listItems) {
      let itemScore = 0
      for (let w of words) {
        let wordOccurenceValue = 0 // 52 428 800 === 2^19 * 100
        let wScore = 0
        let hasAlreadyOccured = false
        for (let dirName of item.pathArray) {
          if (dirName.includes(w.w)) {
            // let delta = wordOccurenceValue  * Math.pow(w.w.length / dirName.length, 2)
            let delta
            if (hasAlreadyOccured) {
              delta = wordOccurenceValue * w.w.length / dirName.length
              wScore += delta
              wordOccurenceValue = wordOccurenceValue / 2
            } else {
              wordOccurenceValue = 52428800  // 52 428 800 === 2^19 * 100
              delta = wordOccurenceValue / 2 * (1 + w.w.length / dirName.length)
              wScore += delta
              wordOccurenceValue = wordOccurenceValue / 2
              hasAlreadyOccured = true
            }
          } else {
            wScore -= wordOccurenceValue
            wordOccurenceValue = wordOccurenceValue / 2
          }
          // the score of the occurence of a word decreases with distance from the leaf
          wordOccurenceValue = wordOccurenceValue / 2
        }

        if (wScore < 0) {
          // w is not in the path : reject the item
          // eslint-disable-next-line
          continue itemLoop
        }
        itemScore += wScore // increase the score
      }

      if (itemScore > 0) {
        item.score = itemScore
        suggestions.push(item)
      }
    }
    suggestions.sort((s1, s2) => {
      return s2.score - s1.score
    })
    return suggestions
  }

  // In charge of checking if the query is augmented.
  // If there are only new words or more preciser words (for
  // instance "atom ele" became "atom elect neutrinos").
  // returns {isQueryAugmented, priorizedWords}
  // where
  //     isQueryAugmented : Boolean
  //     priorizedWords   : [Array] : [{w:'word'}...]
  const _isAugmentingCurrentQuery = function (query) {
    var priorizedWords = []
    var isFromPreviousQuery = []
    // check that each word of the previous query is included in a word
    // of the new query.
    // Included means : 'spa' is in 'backspace' : true, 'spa' is in 'separate' : false
    for (let W of previousQuery) {
      let isIncluded = false
      for (let w of query) {
        if (w.w.includes(W.w)) {
          isIncluded = true
          if (w.w.length !== W.w.length) {
            w.isAugmentedWord = true
          } else {
            w.isNewWord = false
          }
        }
      }
      if (!isIncluded) {
        priorizedWords = _sortQuerybyLength(query)
        previousQuery = query
        const isQueryAugmented = false
        return [isQueryAugmented, priorizedWords]
      }
    }
    // list the words of the new query that have been augmented
    for (let w of query) {
      if (w.isNewWord || w.isAugmentedWord) {
        priorizedWords.push(w)
      } else {
        isFromPreviousQuery.push(w)
      }
    }
    priorizedWords = _sortQuerybyLength(priorizedWords).concat(_sortQuerybyLength(isFromPreviousQuery))
    previousQuery = query
    return [true, priorizedWords]
  }

  // sort by decreasing length
  const _sortQuerybyLength = function (query) {
    query.sort(function (a, b) {
      return (b.w.length - a.w.length)
    })
    return query
  }

  return {

    init: (newItemsList) => {
      list = newItemsList
      previousQuery = []
      previousSuggestions = newItemsList
      for (let file of list) {
        // file.pathArray = removeDiacritics((file.path + '/' + file.name).toLowerCase()).split('/').filter(Boolean).reverse()
        file.pathArray = removeDiacritics((file.path + '/' + file.name).toLowerCase()).split('/').filter(Boolean)
      }
    },

    search: function (query, maxResults) {
      return _fuzzyWordsSearch(query, maxResults)
    }

  }
}
/* BLOCK:END */
module.exports = forDebugPackage()
