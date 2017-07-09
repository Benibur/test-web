/* A WEBPACK LOADER THE DUPLICATE THE FUZZY WORDS LIB, ONE WITH LOGS THE SECOND WITHOUT */

const removeDebugCode = require('./build-remove-debug-code.js')
const fs              = require('fs')

const sourcePath      = './src/lib/fuzzy-words-search-for-paths.js'

const startComment    = 'BLOCK:START'
const endComment      = 'BLOCK:END'


module.exports = function(source) {
  // 1] get the file fuzzy-words-search-for-paths.js
  data = fs.readFileSync(sourcePath, 'utf8')

  // 2] get the BLOCK in fuzzy-words-search-for-paths.js,
  let blockPattern = new RegExp(
    "[\\t ]*\\/\\* *"
    + startComment
    + " *\\*\\/[\\s\\S]*?\\/\\* ?"
    + endComment
    + " ?\\*\\/[\\t ]*\\n?"
    , "g"
  );
  var block = source.match(blockPattern)[0]

  // 3] duplicate, transform it (removal of the dev blocks),
  block = removeDebugCode(block)

  // 4] rename the function 'forDebugPackage' into 'forPerfPackage' and export this new
  //    function.
  block = block.replace(/forDebugPackage = function/,'forPerfPackage = function')
  block = source + block + 'exports.forPerfPackage = forPerfPackage()'

  return block
};
