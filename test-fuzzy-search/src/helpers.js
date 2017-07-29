const removeDiacritics = require('diacritics').remove
const RangeList = require('./lib/range-list')

const wordBolderify = function (query, path){
  const normalizedPath = removeDiacritics(path.toLowerCase())
  const words = removeDiacritics(query.replace(/\//g, " ").toLowerCase()).split(' ').filter(Boolean)
  var boldRanges = new RangeList()
  for (let word of words) {
    let i = 0
    while (i != -1) {
      i = normalizedPath.indexOf(word,i)
      if (i != -1){
        boldRanges.addRange(i,i+word.length-1)
        i++
      }
    }
  }
  const ranges = boldRanges.ranges()
  if (ranges.length == 0) {
      return path
  }
  var html = ''
  var previousStop = 0
  for (let range of ranges) {
    html += path.slice(previousStop,range[0])
    previousStop = range[1]+1
    html += `<b>${path.slice(range[0], previousStop)}</b>`
  }
  return html + path.slice(previousStop)
}


//
const basiqueBolderify = function (query, path) {
  words = query.toLowerCase().split(' ').filter(Boolean)
  startIndex = 0
  var html = ''
  lastIndex = path.length
  while (startIndex<lastIndex) {
    nextWordOccurence = _nextWord(path, words, startIndex)
    if (!nextWordOccurence) {
      break
    }
    html += `${path.slice(startIndex, nextWordOccurence.start)}<b>${nextWordOccurence.word}</b>`
    startIndex = nextWordOccurence.end
  }
  html += path.slice(startIndex)
  return html
}

const _nextWord = function (path, words, startIndex) {
  path = path.toLowerCase()
  var I = path.length
  var W=''
  var i = -1
  for (let w of words) {
    i = path.indexOf(w,startIndex)
    if (i<I && -1<i) {
      I = i
      W = w
    }
  }
  if (i == -1) {
    return undefined
  }else {
    return {word:W, start:I, end:I+W.length}
  }
}


const debounce = function debounce(func, wait, immediate) {
	var timeout
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

module.exports = {debounce:debounce, basiqueBolderify:basiqueBolderify, wordBolderify:wordBolderify}
