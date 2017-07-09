/*
A simple build that removes the marked block of code and then
moves the result into /lib/fuzzy-words-search-for-paths.js

Exemple of a block marked for removal :*/
  /* devblock:start */
  // lines to remove
  // lines to remove
  /* devblock:end */

/*
Exemple of a line to remove :

 a line to remove qsfq $.0,;|:+-"''" df // devline

*/


const fs            = require('fs')
const removeDebugCode = require('./build-remove-debug-code.js')

const sourcePath      = './src/lib/fuzzy-words-search-for-paths.js'
const destinationPath = './build/fuzzy-words-search-for-paths.build.js'

fs.readFile(sourcePath, 'utf8', function (err, data) {
  data = removeDebugCode(data)
  data = data.replace(/exports\.forDebugPackage = forDebugPackage\(\)/,'module.exports = forDebugPackage()')
  fs.writeFileSync(destinationPath, data)
  console.log('==> build ok, file is in ' + destinationPath);
})
