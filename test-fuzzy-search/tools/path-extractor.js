// a lib to deal more easily the filesystem than the standard API on node
// https://www.npmjs.com/package/file-system
const
  fs = require('file-system'),
  path = require('path')


var START_PATH, OUTPUT_FILE_PATH

START_PATH = '/home/ben/Dev/test-web/test-fuzzy-search'
START_PATH = '/home/ben/Dev/test-web/test-fuzzy-search'
START_PATH = "/home/ben/Dev/cozy-v3/ACH/data-ben/répertoires isabelles"
START_PATH = '/home/ben/Téléchargements'
START_PATH = '/media/ben/Windows/Users/Ben/Documents/Dropbox'
OUTPUT_FILE_PATH = './path-list.json'

var
  n_file = 0,
  n_dir  = 0,
  path_list = '['
fs.recurseSync(START_PATH, function(filepath, relative, filename) {
  var dirpath = ''
  dirpath = path.dirname(relative)
  if (dirpath == '.') {dirpath=''}
  if (filename) {
    console.log("file  ", relative);
    path_list += `{"type":"file","path":"/${dirpath}", "name":"${filename}"},\n`
    n_file++
  } else {
    console.log("folder", relative);
    path_list += `{"type":"folder","path":"/${dirpath}", "name":"${path.basename(relative)}"},\n`
    n_dir++
  }
})
fs.writeFile(OUTPUT_FILE_PATH, path_list.slice(0,-2)+']')
console.log('nbr de répertoires',n_dir,'\nnbr de fichiers :', n_file);
