// a lib to deal more easily the filesystem than the standard API on node
// https://www.npmjs.com/package/file-system
var fs = require('file-system')

var START_PATH, OUTPUT_FILE_PATH

START_PATH = '/home/ben/Dev/test-web/test-fuzzy-search'
START_PATH = '/home/ben/Dev/test-web/test-fuzzy-search'
START_PATH = '/home/ben/Téléchargements'
START_PATH = '/media/ben/Windows/Users/Ben/Documents/Dropbox'
START_PATH = "/home/ben/Dev/cozy-v3/ACH/data-ben/répertoires isabelles"
OUTPUT_FILE_PATH = './path-list.json'

var n_file = 0
var n_dir  = 0
var path_list = '['
fs.recurseSync(START_PATH, function(filepath, relative, filename) {
  if (filename) {
    console.log("file  ", relative);
    path_list += `{"type":"file","path":"/${relative}"},\n`
    n_file++
  } else {
    console.log("folder", relative);
    path_list += `{"type":"folder","path":/"${relative}"},\n`
    n_dir++
  }
})
fs.writeFile(OUTPUT_FILE_PATH, path_list.slice(0,-2)+']')
console.log(n_dir, n_file);
