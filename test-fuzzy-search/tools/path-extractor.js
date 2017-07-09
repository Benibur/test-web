// this script is in charge of producing a json of real paths by walking through the filesystem
// the number of paths and the root of the fs are parameters

/* PARAMETERS *****************************/
var START_PATH, OUTPUT_FILE_PATH,NUMBER_OF_PATHS, rootStr
OUTPUT_FILE_PATH = './path-list.json'
START_PATH = '/home/ben/Dev/test-web/test-fuzzy-search'
START_PATH = '/home/ben/Dev/test-web/test-fuzzy-search'
START_PATH = "/home/ben/Dev/cozy-v3/ACH/data-ben/répertoires isabelles"
START_PATH = '/home/ben/Téléchargements/imagescan-bundle-ubuntu-16.04-1.3.20.x64.deb.'
START_PATH = '/home/ben/Téléchargements'
START_PATH = '/home/ben/tmp'
START_PATH = '/media/ben/Windows/Users/Ben/Documents/Dropbox'
// NUMBER_OF_PATHS = 100000  // optionnal : go through the whole fs from START_PATH if omited 
/***************************** PARAMETERS */

const
  fs = require('file-system'), // https://www.npmjs.com/package/file-system
  path = require('path')


var
  n_file = 0,
  n_dir  = 0,
  path_list = '[',
  onlyOneLoop = NUMBER_OF_PATHS ? false : true
  if (onlyOneLoop) {
    NUMBER_OF_PATHS =  Number.POSITIVE_INFINITY
  }
  moreLoops = NUMBER_OF_PATHS || false,

pathFiler = function(filepath, relative, filename) {
  // relative = {/dirname}*  ex /toto.txt : relative = ""
  // fullPath = {relative}/{filename}
  var dirpath = ''
  dirpath = path.dirname(relative)
  if (dirpath == '.' || dirpath == '/') {
    dirpath = rootStr
  }else{
    dirpath = rootStr + dirpath
  }
  if (filename) {
    // console.log("file  ", relative);
    path_list += `{"type":"file","path":"${dirpath}", "name":"${filename}"},\n`
    n_file++
  } else {
    // console.log("folder", relative);
    path_list += `{"type":"folder","path":"${dirpath}", "name":"${path.basename(relative)}"},\n`
    n_dir++
  }
}

// add paths from real filesystem
try {
  let nLoops = 0
  rootStr = ''
  while (moreLoops) {
    if (0<nLoops) {
      rootStr = '/loop_n°' + nLoops
    }
    fs.recurseSync(START_PATH, function(filepath, relative, filename){
      pathFiler(filepath, '/'+relative, filename)
      if (NUMBER_OF_PATHS<(n_dir+n_file+1)){
        throw('enough paths')
      }
    })
    if (onlyOneLoop) {
      moreLoops = false
    }
    nLoops++
  }

} catch (e) {
  console.log(e);
} finally {
  fs.writeFile(OUTPUT_FILE_PATH, path_list.slice(0,-2)+']' )
  console.log('nbr de répertoires',n_dir,'\nnbr de fichiers :', n_file);
}
