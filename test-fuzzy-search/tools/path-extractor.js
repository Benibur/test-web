// a lib to deal more easily the filesystem than the standard API on node
// https://www.npmjs.com/package/file-system
var fs = require('file-system')

var start_path, output_file_path

start_path = '/home/ben/Dev/test-web/test-fuzzy-search'
start_path = '/home/ben/Dev/test-web/test-fuzzy-search'
start_path = '/home/ben/Téléchargements'
start_path = '/media/ben/Windows/Users/Ben/Documents/Dropbox'
output_file_path = './path-list.json'

var n_file = 0
var n_dir  = 0
var path_list = '['
fs.recurseSync(start_path, function(filepath, relative, filename) {
  if (filename) {
    console.log("file  ", relative);
    path_list += `{"type":"file","path":"${relative}"},\n`
    n_file++
  } else {
    console.log("folder", relative);
    path_list += `{"type":"folder","path":"${relative}"},\n`
    n_dir++
  }
})
fs.writeFile(output_file_path, path_list.slice(0,-2)+']')
console.log(n_dir, n_file);
