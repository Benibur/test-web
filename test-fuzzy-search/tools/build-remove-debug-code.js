
/*
A simple function that removes the marked block of code.

Exemple of a block marked for removal :*/
  /* devblock:start */
  // lines to remove
  // lines to remove
  /* devblock:end */

/*
ExempleS of a line to remove (ends with "// devline" ) :
    a line to remove qsfq $.0,;|:+-"''" df // devline
*/

/* VARIABLES */
const sourcePath = './src/lib/fuzzy-words-search-for-paths.js'
const destinationPath = './build/fuzzy-words-search-for-paths.build.js'

const startComment = 'devblock:start'
const endComment   = 'devblock:end'
const lineComment = 'devline'

const blockPattern = new RegExp(
  "[\\t ]*\\/\\* *"
  + startComment
  + " *\\*\\/[\\s\\S]*?\\/\\* ?"
  + endComment
  + " ?\\*\\/[\\t ]*\\n?"
  , "g"
);

const linePattern = new RegExp(".*[\\t ]*\\/\\/ *" + lineComment + " *.*\\n?", "g");

/* MAIN MEHTOD */
module.exports = function (data) {
  data = data.replace(blockPattern, '')
  data = data.replace(linePattern, '')
  return data
}
