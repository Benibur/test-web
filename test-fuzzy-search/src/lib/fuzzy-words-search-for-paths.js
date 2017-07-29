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
- query : the string with words to search for. Words' separators are ' ' (space) and '/'

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
  /* devblock:start */
  // just for debug
  const numeral = require('numeral')
  numeral.locale('fr')

  const scoreLogger = function (width, strBlack,strBlue,strRed,strGreen) {
    let cssBlue = 'color:blue;font-family:"Courier New", Courier, monospace'
    let cssRed = 'color:red;font-family:"Courier New", Courier, monospace'
    let cssBlack = 'color:black;font-family:"Courier New", Courier, monospace'
    let cssGreen = 'color:green;font-family:"Courier New", Courier, monospace'
    let spacesNb = width - strBlack.length - strBlue.length
    if (spacesNb<1) spacesNb = 2
    console.log('%c'+ strBlack + Array(spacesNb).join(' ') +'%c' + strBlue  + '%c' + strRed +'%c'+ strGreen, cssBlack,cssBlue,cssRed,cssGreen )
  }
  /* devblock:end */
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
    console.log('')                                    // devline
    console.log('%c=== New query', 'font-weight:bold') // devline
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
    console.log('')                                     // devline
    console.log('%cSuggestions : ', 'font-weight:bold') // devline
    _logSugggestions(previousSuggestions)               // devline
    if (maxResults) {
      return previousSuggestions.slice(0, maxResults)
    } else {
      return previousSuggestions
    }
  }

  // cut the query string into an array of words
  const _prepareQuery = function (query) {
    const Query = []
    for (let w of removeDiacritics(query.replace(/\//g, " ").trim().toLowerCase()).split(' ').filter(Boolean)) {
      Query.push({ w: w, isAugmentedWord: false, isNewWord: true })
    }
    return Query
  }

  /* devblock:start */
  // returns a ranked array of [suggestions].
  // suggestion items are objects : {score:[number], ... (all the properties
  //   of an item given in init(newItemsList))}
  const _filterAndScore0 = function (listItems, words) {
    // console.log('\n === _filterAndScore', _logQuery(words));
    // console.log(listItems);
    const suggestions = []
    // eslint-disable-next-line
    itemLoop:
    for (let item of listItems) {
      let itemScore = 0
      for (let w of words) {
        let wordOccurenceValue = 1
        let wScore = 0
        for (let dirName of item.pathArray) {
          if (dirName.includes(w.w)) {
            wScore += wordOccurenceValue
          }
          // the score of the occurence of a word decreases with distance from the leaf, but can not be too small
          wordOccurenceValue -= 0.4
          if (wordOccurenceValue === 0) wordOccurenceValue = 0.1
        }
        if (wScore === 0) {
          // w is not in the path : reject the item
          // eslint-disable-next-line
          continue itemLoop
        }
        itemScore += wScore // increase the
        // console.log(`\npath: "${item.path}", \nword: "${w.w}", itemScore:${itemScore}`);
      }
      if (itemScore !== 0) {
        item.score = itemScore
        // console.log("one found !", item);
        suggestions.push(item)
      }
    }
    suggestions.sort((s1, s2) => {
      return s2.score - s1.score
    })
    return suggestions
  }
  /* devblock:end */
  // SAVE THE SEARCH WITH 1RST LOGIC
  // // returns a ranked array of [suggestions].
  // // suggestion items are objects : {score:[number], ... (all the properties
  // //   of an item given in init(newItemsList))}
  // const _filterAndScore = function (listItems, words) {
  //   _logQuery('_filterAndScore with : ', words,'') // devline
  //   const suggestions = []
  //   // eslint-disable-next-line
  //   itemLoop:
  //   for (let item of listItems) {
  //     let itemScore = 0
  //     console.log('') // devline
  //     console.log('%cscoring-->%c' + item.path + '/' + item.name, 'color:black;font-weight: bold', 'color:red') // devline
  //     for (let w of words) {
  //       let wordOccurenceValue = 52428800 // 52 428 800 === 2^19 * 100
  //       let wScore = 0
  //       let distance = 0  // devline
  //       for (let dirName of item.pathArray) {
  //         if (dirName.includes(w.w)) {
  //           let delta = wordOccurenceValue / 5 * (1 + 5 * Math.pow(w.w.length / dirName.length, 2))
  //           // let delta = wordOccurenceValue  * Math.pow(w.w.length / dirName.length, 2)
  //           wScore += delta
  //           let str1 = 'D'+distance+'- '                // devline
  //           let str2 = numeral(delta).format('+0,0.')   // devline
  //           scoreLogger(27, str1,str2,' - '+dirName,'') // devline
  //         } else {
  //           let str1 = 'D'+distance+'- '                 // devline
  //           let str2 = numeral(-10000).format('+0,0.')   // devline
  //           scoreLogger(27, str1,str2,' - '+dirName,'')  // devline
  //           wScore -= 10000
  //         }
  //         // the score of the occurence of a word decreases with distance from the leaf
  //         distance++ // devline
  //         wordOccurenceValue = wordOccurenceValue / 2
  //       }
  //
  //       /* devblock:start */
  //       scoreLogger(27,
  //                   'word score',
  //                   numeral(wScore).format('+0,0.'),
  //                   '',
  //                   ' - '+w.w
  //                 )
  //       /* devblock:end */
  //
  //       if (wScore < 0) {
  //         // w is not in the path : reject the item
  //         // eslint-disable-next-line
  //         continue itemLoop
  //       }
  //       itemScore += wScore // increase the score
  //     }
  //
  //     /* devblock:start */
  //     scoreLogger(27,
  //                 'path score =',
  //                 numeral(itemScore).format('+0,0.'),
  //                 '',
  //                 ''
  //               )
  //     /* devblock:end */
  //
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
    _logQuery('_filterAndScore with : ', words,'') // devline
    const suggestions = []
    // eslint-disable-next-line
    itemLoop:
    for (let item of listItems) {
      let itemScore = 0
      console.log('') // devline
      console.log('%cscoring-->%c' + item.path + '/' + item.name, 'color:black;font-weight: bold', 'color:red') // devline
      for (let w of words) {
        let wordOccurenceValue = 10000 // 52 428 800 === 2^19 * 100
        let wScore = 0
        let distance = 0  // devline
        let hasAlreadyOccured = false
        let depth = item.pathArray.length
        for (let d =0; d < depth; d++) {
          let dirName = item.pathArray[d]
          if (dirName.includes(w.w)) {
            let delta
            if (hasAlreadyOccured) {
              delta = wordOccurenceValue * (1 - w.w.length / dirName.length)
              wScore -= delta
              wordOccurenceValue = wordOccurenceValue / 2
            } else {
              wordOccurenceValue = 52428800  // 52 428 800 === 2^19 * 100
              delta = wordOccurenceValue / 2 * (1 + w.w.length / dirName.length)
              wScore += delta
              wordOccurenceValue = wordOccurenceValue / 2
              hasAlreadyOccured = true
            }
            let str1 = 'D'+distance+'- '                // devline
            let str2 = numeral(delta).format('+0,0.')   // devline
            scoreLogger(27, str1,str2,' - '+dirName,'') // devline
          } else {
            let str1 = 'D'+distance+'- '                 // devline
            let str2 = numeral(-10000).format('+0,0.')   // devline
            scoreLogger(27, str1,str2,' - '+dirName,'')  // devline
            wScore -= wordOccurenceValue
            wordOccurenceValue = wordOccurenceValue / 2
            if (d === depth - 1) {
              // if on the leaf there is no occuernce of word : apply a big penalty
              // TODO : the penalty could be depending on the number of parents without occurence before the leaf.
              wScore = wScore / 2
            }
          }

          distance++ // devline
          wordOccurenceValue = wordOccurenceValue / 2
        }

        /* devblock:start */
        scoreLogger(27,
                    'word score',
                    numeral(wScore).format('+0,0.'),
                    '',
                    ' - '+w.w
                  )
        /* devblock:end */
        if (wScore < 0) {
          // w is not in the path : reject the item
          // eslint-disable-next-line
          continue itemLoop
        }
        itemScore += wScore // increase the score
      }

      /* devblock:start */
      scoreLogger(27,
                  'path score =',
                  numeral(itemScore).format('+0,0.'),
                  '',
                  ''
                )
      /* devblock:end */
      if (itemScore > 0) {
        item.score = itemScore
        suggestions.push(item)
      }
    }
    suggestions.sort((s1, s2) => {
      let score = s2.score - s1.score
      if (score === 0) {
        return s1.path.localeCompare(s2.path)
      } else {
        return score
      }
      return
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
        console.log('query is reinitialized because of', W) // devline
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
    _logQuery('query is augmenting the previous one. Augmented words are : ', priorizedWords, '')   // devline
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

  /* devblock:start */
  /* LOG HELPERS FOR DEV */

  const _logSugggestions = function (suggestions) {
    for (let sugg of suggestions) {
      let score = numeral(sugg.score).format('+0,0.')
      score = Array(15 - score.length).join(' ') + score

      console.log(`%c${score}  %c${sugg.path}/${sugg.name}"`, 'color:blue', 'color:red')
      // txt += `score:${sugg.score} "${sugg.path}/${sugg.name}"`
    }
  }

  const _logQuery = function (beforeTxt, Query, afterText) {
    let txt = beforeTxt
    let csss = []
    for (let w of Query) {
      txt += '"%c' + w.w + '%c"  '
      csss.push('color:black')
      csss.push('color:green')
    }
    txt += afterText
    csss.push(txt)
    csss.reverse()
    console.log.apply(null,csss)
  }
  /* devblock:end */
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

    /* devblock:start */
    // expose some funtions for the tests
    ,_forTests: {
      _fuzzyWordsSearch, _prepareQuery, _isAugmentingCurrentQuery
    }
    /* devblock:end */
  }
}
/* BLOCK:END */
exports.forDebugPackage = forDebugPackage()
