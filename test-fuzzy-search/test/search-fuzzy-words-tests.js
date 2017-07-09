
const
  expect                    = require('chai').expect,
  search                    = require('../src/lib/fuzzy-words-search-for-paths').forDebugPackage,
  listItem                  = require('./lists-of-items.js'),
  art                       = require('ascii-art'),
  _fuzzyWordsSearch         = search._forTests._fuzzyWordsSearch,
  _prepareQuery             = search._forTests._prepareQuery,
  _isAugmentingCurrentQuery = search._forTests._isAugmentingCurrentQuery
let
  list,
  currentQuery=[],
  previousSuggestions=[],
  isQueryAugmented,
  priorizedWords

// init search
search.init(listItem)
try{
  // --------------------------------------------------
  // tests of new searches or augmented searches

  // test 1 : first search, words must be sorted by decreasing length
  let
    query = 'word1.1_short word1.2_long_long ',
    Query = _prepareQuery(query);
  [isQueryAugmented, priorizedWords] = _isAugmentingCurrentQuery(Query)
  // console.log('isQueryAugmented', isQueryAugmented)
  // console.log('priorizedWords', priorizedWords)
  expect(isQueryAugmented).to.be.true
  expect(priorizedWords).to.deep.equal(
    [ { w: 'word1.2_long_long', isAugmentedWord: false, isNewWord: true },
      { w: 'word1.1_short', isAugmentedWord: false, isNewWord: true }
    ]
  )

  // test 2 : narrow the search by precising a word
  query = 'word1.1_shorter word1.2_long_long ';
  Query = _prepareQuery(query); // ?? ; is compulsary here ??
  [isQueryAugmented, priorizedWords] = _isAugmentingCurrentQuery(Query)
  // console.log('isQueryAugmented', isQueryAugmented)
  // console.log('priorizedWords', priorizedWords)
  expect(isQueryAugmented).to.be.true
  expect(priorizedWords).to.deep.equal(
    [ { w: 'word1.1_shorter', isAugmentedWord: true, isNewWord: true },
      { w: 'word1.2_long_long', isAugmentedWord: false, isNewWord: false }
    ]
  )
  // test 3 : narrow the search by adding a word
  query = 'word1.1_shorter word1.2_long_long new_short new_long_long ';
  Query = _prepareQuery(query); // ?? ; is compulsary here ??
  [isQueryAugmented, priorizedWords] = _isAugmentingCurrentQuery(Query)
  // console.log('isQueryAugmented', isQueryAugmented)
  // console.log('priorizedWords', priorizedWords)
  expect(isQueryAugmented).to.be.true
  expect(priorizedWords).to.deep.equal(
    [
      { w: 'new_long_long', isAugmentedWord: false, isNewWord: true },
      { w: 'new_short', isAugmentedWord: false, isNewWord: true },
      { w: 'word1.2_long_long', isAugmentedWord: false, isNewWord: false },
      { w: 'word1.1_shorter', isAugmentedWord: false, isNewWord: false }
    ]
  )

  // test 4 : open the search by reducing a word
  query = 'word1.1_shorter word1.2_long_long new_sho new_long_long ';
  Query = _prepareQuery(query); // ?? ; is compulsary here ??
  [isQueryAugmented, priorizedWords] = _isAugmentingCurrentQuery(Query)
  // console.log('isQueryAugmented', isQueryAugmented)
  // console.log('priorizedWords', priorizedWords)
  expect(isQueryAugmented).to.be.false
  expect(priorizedWords).to.deep.equal(
    [
      { w: 'word1.2_long_long', isAugmentedWord: false, isNewWord: false },
      { w: 'word1.1_shorter', isAugmentedWord: false, isNewWord: false },
      { w: 'new_long_long', isAugmentedWord: false, isNewWord: true },
      { w: 'new_sho', isAugmentedWord: false, isNewWord: true }
    ]
  )

  // test 5 : open the search by removing a word
  query = 'word1.1_shorter word1.2_long_long new_long_long ';
  Query = _prepareQuery(query); // ?? ; is compulsary here ??
  [isQueryAugmented, priorizedWords] = _isAugmentingCurrentQuery(Query)
  // console.log('isQueryAugmented', isQueryAugmented)
  // console.log('priorizedWords', priorizedWords)
  expect(isQueryAugmented).to.be.false
  expect(priorizedWords).to.deep.equal(
    [
      { w: 'word1.2_long_long', isAugmentedWord: false, isNewWord: false },
      { w: 'word1.1_shorter', isAugmentedWord: false, isNewWord: false },
      { w: 'new_long_long', isAugmentedWord: false, isNewWord: false }
    ]
  )

  art.font('TESTS     OK  !', 'Doom', function(rendered){
      console.log(art.style(rendered, 'green'));
  });
}
catch(e){
  console.log(e)
  console.log('\n==> Tests failed !')
  art.font('TESTS     NOK     :-(', 'Doom', function(rendered){
      console.log(art.style(rendered, 'red'));
  });
}
