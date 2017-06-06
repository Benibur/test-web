/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var numeral = __webpack_require__(1)   // to format the numbers
	const Fuse  = __webpack_require__(2)
	var fuse
	const fuzzaldrin = __webpack_require__(3)
	const fuzzaldrinPlus = __webpack_require__(9)
	const autocompleteAlgolia = __webpack_require__(15)
	
	MAX_RESULTS = 5
	LIST_TYPE   = 'small'     // small set of data
	LIST_TYPE   = 'pathes'    // small set of pathes
	LIST_TYPE   = 'long list' // big list of pathes
	
	// ------------------------------------------------------------------
	// 1] init html
	__webpack_require__(39)
	const htmlbody = __webpack_require__(40)()
	document.body.innerHTML = htmlbody
	const btnEl    = document.getElementById('btn')
	const input1El = document.getElementById('input1')
	const fuseOutputEl = document.getElementById('fuse')
	const fuzzaldrinOutputEl = document.getElementById('fuzzaldrin')
	const fuzzaldrinPlusOutputEl = document.getElementById('fuzzaldrin-plus')
	input1El.select()
	input1El.focus()
	
	
	// ------------------------------------------------------------------
	// 2] init the autocomplete.js (algolia https://github.com/algolia/autocomplete.js)
	const autocompleteAlgoliaEL = document.getElementById('input2')
	autocompleteAlgolia('#input2', { hint: true }, [
	    {
	      source: function (query, cb) {
	        cb([{path:'p1', html:'<b>p1</b>'},{path:'p2', html:'<b>p2</b>'}])
	      } ,
	      displayKey: 'path',
	      templates: {
	        suggestion: function(suggestion) {
	          console.log("dd", suggestion);
	          return suggestion.html;
	        }
	      }
	    }
	  ]).on('autocomplete:selected', function(event, suggestion, dataset) {
	    console.log(suggestion, dataset);
	  });
	
	
	// ------------------------------------------------------------------
	// 2] prepare the Search options for fuzzaldrin
	
	fuzzaldrinSearch = function (query) {
	  const t0       = performance.now()
	  const results  = fuzzaldrin.filter(list, query, {key: 'path'})
	  const t1       = performance.now()
	  const duration = numeral((t1 - t0)/1000).format('0.000')
	  var resultsStr = ''
	  var n = 0
	  for (res of results) {
	    resultsStr += `<p>${basiqueBolderify(query, res.path)}</p>`
	    if (n++>MAX_RESULTS) { break}
	  }
	  fuzzaldrinOutputEl.innerHTML = `<p>Search in ${duration}ms</p>${resultsStr}`
	}
	
	basiqueBolderify = function (query, path) {
	  words = query.split(' ')
	  words = words.filter(function (item) { return (item !== '') })
	  startIndex = 0
	  var html = ''
	  lastIndex = path.length
	  while (startIndex<lastIndex) {
	    nextWordOccurence = nextWord(path, words, startIndex)
	    if (!nextWordOccurence) {
	      break
	    }
	    html += `${path.slice(startIndex, nextWordOccurence.start)}<b>${nextWordOccurence.word}</b>`
	    startIndex = nextWordOccurence.end
	  }
	  html += path.slice(startIndex)
	  return html
	}
	nextWord = function (path, words, startIndex) {
	  path = path.toLowerCase()
	  var I = path.length
	  var W=''
	  var i = -1
	  for (let w of words) {
	    i = path.indexOf(w.toLowerCase(),startIndex)
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
	
	// ------------------------------------------------------------------
	// 3] prepare the Search options for fuzzaldrin
	
	fuzzaldrinPlusSearch = function (query) {
	  const t0       = performance.now()
	  const results  = fuzzaldrinPlus.filter(list, query, {key: 'path'})
	  const t1       = performance.now()
	  const duration = numeral((t1 - t0)/1000).format('0.000')
	  var resultsStr = ''
	  var n = 0
	  for (res of results) {
	    resultsStr += `<p>${basiqueBolderify(query, res.path)}</p>`
	    if (n++>MAX_RESULTS) { break}
	  }
	  fuzzaldrinPlusOutputEl.innerHTML = `<p>Search in ${duration}ms</p>${resultsStr}`
	}
	
	
	
	// With an array of strings
	// candidates = ['Call', 'Me', 'Maybe']
	
	
	// With an array of objects
	// candidates = [
	//   {name: 'Call', id: 1}
	//   {name: 'Me', id: 2}
	//   {name: 'Maybe', id: 3}
	// ]
	// results = fuzzaldrin(candidates, 'me', key: 'name')
	// console.log(results) # [{name: 'Me', id: 2}, {name: 'Maybe', id: 3}]
	
	// ------------------------------------------------------------------
	// 3] prepare the Search options for fuse.js
	const options = {
	  shouldSort: true,
	  tokenize: false,
	  matchAllTokens: true,
	  includeScore: true,
	  includeMatches: true,
	  threshold: 0.5,
	  location: 0,
	  distance: 100,
	  maxPatternLength: 32,
	  minMatchCharLength: 2,
	  keys: ["path"]
	};
	
	var prepareListeForFuse = (list)=>{
	  const fuseList = []
	  // test for tuning the path into an array of folders : results are
	  // not good... neither in relevance nor in commodity (the indices are impossible to use)
	  // for (item of list) {
	  //   newItem = Object.assign({}, item)
	  //   newItem.path = item.path.split('/')
	  //   fuseList.push(newItem)
	  // }
	  // console.log(JSON.stringify(fuseList));
	  // return fuseList
	  return list
	}
	
	fuse_search = function(input){
	  const t0       = performance.now()
	  const results  = fuse.search(input);
	  const t1       = performance.now()
	  const duration = numeral((t1 - t0)/1000).format('0.000')
	  var output     = ''
	  // compute the boldified html output
	  for (res of results){
	    path = res.item.path
	    var lastIndex = 0
	    var boldified = ''
	    if (res.matches[0].indices) {
	      for ( range of res.matches[0].indices) {
	        boldified +=  path.slice(lastIndex,range[0]) + '<b>' + path.slice(range[0],range[1]+1) + '</b>'
	        lastIndex = range[1]+1
	      }
	      boldified +=  path.slice(lastIndex)
	    } else {
	      boldified = path
	    }
	    output += `<p> <span class="score">${ numeral(res.score).format('0.000')}</span><span class="path"> ${boldified}</span></p>`
	  }
	  fuseOutputEl.innerHTML = `<p>Search in ${duration}ms</p>${output}`
	  }
	
	
	
	// ------------------------------------------------------------------
	// 4] functions to run all searches
	runSearches = function (query) {
	  // fuse_search(query)
	  fuzzaldrinSearch(query)
	  fuzzaldrinPlusSearch(query)
	  // results = fuzzaldrin(candidates, 'me')
	}
	
	input1El.addEventListener('input', (e)=>{
	  runSearches(e.target.value)
	})
	
	// triger an imediate a search to ease debug
	autoTrigerSearch = function(query) {
	  input1El.value = query
	  runSearches(query)
	  // input1El.dispatchEvent(new Event('input'))
	}
	
	// ------------------------------------------------------------------
	// 5] Prepare the list where to search and trigger one search
	if (LIST_TYPE == 'small') {
	  // for quick tests
	  list = [{"type":"file","path":"atom-amd64.deb"},
	  {"type":"file","path":"awesomplete-gh-pages.zip"},
	  {"type":"file","path":"google-chrome-stable_current_amd64.deb"},
	  {"type":"file","path":"jquery-3.1.1.js"},
	  {"type":"file","path":"jquery-ui-1.12.1.custom (1).zip"},
	  {"type":"file","path":"jquery-ui-1.12.1.custom.zip"},
	  {"type":"file","path":"mikogo (1).tar.gz"},
	  {"type":"file","path":"mikogo-starter.exe"},
	  {"type":"file","path":"mikogo.tar.gz"},
	  {"type":"file","path":"mikogo4.5/mikogo"}]
	  fuse = new Fuse(prepareListeForFuse(list), options)
	  autoTrigerSearch('mik')
	
	}else if (LIST_TYPE == 'pathes') {
	  // for tests on file pathes
	  list = [{"type":"file","path":"/Administratif"},
	  {"type":"file","path":"/Administratif/Bank statements"},
	  {"type":"file","path":"/Administratif/Bank statements/Bank Of America"},
	  {"type":"file","path":"/Administratif/Bank statements/Deutsche Bank"},
	  {"type":"file","path":"/Administratif/Bank statements/Société Générale"},
	  {"type":"file","path":"/Administratif/CPAM"},
	  {"type":"file","path":"/Administratif/EDF"},
	  {"type":"file","path":"/Administratif/EDF/Contrat"},
	  {"type":"file","path":"/Administratif/EDF/Factures"},
	  {"type":"file","path":"/Administratif/Emploi"},
	  {"type":"file","path":"/Administratif/Impôts"},
	  {"type":"file","path":"/Administratif/Logement"},
	  {"type":"file","path":"/Administratif/Logement/Loyer 158 rue de Verdun"},
	  {"type":"file","path":"/Administratif/Orange"},
	  {"type":"file","path":"/Administratif/Pièces identité"},
	  {"type":"file","path":"/Administratif/Pièces identité/Carte identité"},
	  {"type":"file","path":"/Administratif/Pièces identité/Passeport"},
	  {"type":"file","path":"/Administratif/Pièces identité/Permis de conduire"},
	  {"type":"file","path":"/Appareils photo"},
	  {"type":"file","path":"/Boulot"},
	  {"type":"file","path":"/Cours ISEN"},
	  {"type":"file","path":"/Cours ISEN/CIR"},
	  {"type":"file","path":"/Cours ISEN/CIR/LINUX"},
	  {"type":"file","path":"/Cours ISEN/CIR/MICROCONTROLEUR"},
	  {"type":"file","path":"/Cours ISEN/CIR/RESEAUX"},
	  {"type":"file","path":"/Cours ISEN/CIR/TRAITEMENT_SIGNAL"},
	  {"type":"file","path":"/Divers photo"},
	  {"type":"file","path":"/Divers photo/wallpapers"},
	  {"type":"file","path":"/Films"},
	  {"type":"file","path":"/Notes"},
	  {"type":"file","path":"/Notes/Communication"},
	  {"type":"file","path":"/Notes/Notes techniques"},
	  {"type":"file","path":"/Notes/Recrutement"},
	  {"type":"file","path":"/Projet appartement à Lyon"},
	  {"type":"file","path":"/Vacances Périgord"}]
	
	  fuse = new Fuse(prepareListeForFuse(list), options)
	  autoTrigerSearch('admin con')
	
	}else if (LIST_TYPE == 'long list') {
	  // get data from the the json file (/tools/path-list.json)
	  let url = 'path-list.json';
	  fetch(url)
	  .then(res => res.json())
	  .then((out) => {
	    console.log('Checkout this JSON! ', out);
	    list = out
	    fuse = new Fuse(prepareListeForFuse(list), options) // "list" is the item array
	    autoTrigerSearch('ordonnance ben')
	  })
	  .catch(err => console.error(err));
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! @preserve
	 * numeral.js
	 * version : 2.0.6
	 * author : Adam Draper
	 * license : MIT
	 * http://adamwdraper.github.com/Numeral-js/
	 */
	
	(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module === 'object' && module.exports) {
	        module.exports = factory();
	    } else {
	        global.numeral = factory();
	    }
	}(this, function () {
	    /************************************
	        Variables
	    ************************************/
	
	    var numeral,
	        _,
	        VERSION = '2.0.6',
	        formats = {},
	        locales = {},
	        defaults = {
	            currentLocale: 'en',
	            zeroFormat: null,
	            nullFormat: null,
	            defaultFormat: '0,0',
	            scalePercentBy100: true
	        },
	        options = {
	            currentLocale: defaults.currentLocale,
	            zeroFormat: defaults.zeroFormat,
	            nullFormat: defaults.nullFormat,
	            defaultFormat: defaults.defaultFormat,
	            scalePercentBy100: defaults.scalePercentBy100
	        };
	
	
	    /************************************
	        Constructors
	    ************************************/
	
	    // Numeral prototype object
	    function Numeral(input, number) {
	        this._input = input;
	
	        this._value = number;
	    }
	
	    numeral = function(input) {
	        var value,
	            kind,
	            unformatFunction,
	            regexp;
	
	        if (numeral.isNumeral(input)) {
	            value = input.value();
	        } else if (input === 0 || typeof input === 'undefined') {
	            value = 0;
	        } else if (input === null || _.isNaN(input)) {
	            value = null;
	        } else if (typeof input === 'string') {
	            if (options.zeroFormat && input === options.zeroFormat) {
	                value = 0;
	            } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
	                value = null;
	            } else {
	                for (kind in formats) {
	                    regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;
	
	                    if (regexp && input.match(regexp)) {
	                        unformatFunction = formats[kind].unformat;
	
	                        break;
	                    }
	                }
	
	                unformatFunction = unformatFunction || numeral._.stringToNumber;
	
	                value = unformatFunction(input);
	            }
	        } else {
	            value = Number(input)|| null;
	        }
	
	        return new Numeral(input, value);
	    };
	
	    // version number
	    numeral.version = VERSION;
	
	    // compare numeral object
	    numeral.isNumeral = function(obj) {
	        return obj instanceof Numeral;
	    };
	
	    // helper functions
	    numeral._ = _ = {
	        // formats numbers separators, decimals places, signs, abbreviations
	        numberToFormat: function(value, format, roundingFunction) {
	            var locale = locales[numeral.options.currentLocale],
	                negP = false,
	                optDec = false,
	                leadingCount = 0,
	                abbr = '',
	                trillion = 1000000000000,
	                billion = 1000000000,
	                million = 1000000,
	                thousand = 1000,
	                decimal = '',
	                neg = false,
	                abbrForce, // force abbreviation
	                abs,
	                min,
	                max,
	                power,
	                int,
	                precision,
	                signed,
	                thousands,
	                output;
	
	            // make sure we never format a null value
	            value = value || 0;
	
	            abs = Math.abs(value);
	
	            // see if we should use parentheses for negative number or if we should prefix with a sign
	            // if both are present we default to parentheses
	            if (numeral._.includes(format, '(')) {
	                negP = true;
	                format = format.replace(/[\(|\)]/g, '');
	            } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
	                signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
	                format = format.replace(/[\+|\-]/g, '');
	            }
	
	            // see if abbreviation is wanted
	            if (numeral._.includes(format, 'a')) {
	                abbrForce = format.match(/a(k|m|b|t)?/);
	
	                abbrForce = abbrForce ? abbrForce[1] : false;
	
	                // check for space before abbreviation
	                if (numeral._.includes(format, ' a')) {
	                    abbr = ' ';
	                }
	
	                format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');
	
	                if (abs >= trillion && !abbrForce || abbrForce === 't') {
	                    // trillion
	                    abbr += locale.abbreviations.trillion;
	                    value = value / trillion;
	                } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
	                    // billion
	                    abbr += locale.abbreviations.billion;
	                    value = value / billion;
	                } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
	                    // million
	                    abbr += locale.abbreviations.million;
	                    value = value / million;
	                } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
	                    // thousand
	                    abbr += locale.abbreviations.thousand;
	                    value = value / thousand;
	                }
	            }
	
	            // check for optional decimals
	            if (numeral._.includes(format, '[.]')) {
	                optDec = true;
	                format = format.replace('[.]', '.');
	            }
	
	            // break number and format
	            int = value.toString().split('.')[0];
	            precision = format.split('.')[1];
	            thousands = format.indexOf(',');
	            leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;
	
	            if (precision) {
	                if (numeral._.includes(precision, '[')) {
	                    precision = precision.replace(']', '');
	                    precision = precision.split('[');
	                    decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
	                } else {
	                    decimal = numeral._.toFixed(value, precision.length, roundingFunction);
	                }
	
	                int = decimal.split('.')[0];
	
	                if (numeral._.includes(decimal, '.')) {
	                    decimal = locale.delimiters.decimal + decimal.split('.')[1];
	                } else {
	                    decimal = '';
	                }
	
	                if (optDec && Number(decimal.slice(1)) === 0) {
	                    decimal = '';
	                }
	            } else {
	                int = numeral._.toFixed(value, 0, roundingFunction);
	            }
	
	            // check abbreviation again after rounding
	            if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
	                int = String(Number(int) / 1000);
	
	                switch (abbr) {
	                    case locale.abbreviations.thousand:
	                        abbr = locale.abbreviations.million;
	                        break;
	                    case locale.abbreviations.million:
	                        abbr = locale.abbreviations.billion;
	                        break;
	                    case locale.abbreviations.billion:
	                        abbr = locale.abbreviations.trillion;
	                        break;
	                }
	            }
	
	
	            // format number
	            if (numeral._.includes(int, '-')) {
	                int = int.slice(1);
	                neg = true;
	            }
	
	            if (int.length < leadingCount) {
	                for (var i = leadingCount - int.length; i > 0; i--) {
	                    int = '0' + int;
	                }
	            }
	
	            if (thousands > -1) {
	                int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
	            }
	
	            if (format.indexOf('.') === 0) {
	                int = '';
	            }
	
	            output = int + decimal + (abbr ? abbr : '');
	
	            if (negP) {
	                output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
	            } else {
	                if (signed >= 0) {
	                    output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
	                } else if (neg) {
	                    output = '-' + output;
	                }
	            }
	
	            return output;
	        },
	        // unformats numbers separators, decimals places, signs, abbreviations
	        stringToNumber: function(string) {
	            var locale = locales[options.currentLocale],
	                stringOriginal = string,
	                abbreviations = {
	                    thousand: 3,
	                    million: 6,
	                    billion: 9,
	                    trillion: 12
	                },
	                abbreviation,
	                value,
	                i,
	                regexp;
	
	            if (options.zeroFormat && string === options.zeroFormat) {
	                value = 0;
	            } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
	                value = null;
	            } else {
	                value = 1;
	
	                if (locale.delimiters.decimal !== '.') {
	                    string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
	                }
	
	                for (abbreviation in abbreviations) {
	                    regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');
	
	                    if (stringOriginal.match(regexp)) {
	                        value *= Math.pow(10, abbreviations[abbreviation]);
	                        break;
	                    }
	                }
	
	                // check for negative number
	                value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;
	
	                // remove non numbers
	                string = string.replace(/[^0-9\.]+/g, '');
	
	                value *= Number(string);
	            }
	
	            return value;
	        },
	        isNaN: function(value) {
	            return typeof value === 'number' && isNaN(value);
	        },
	        includes: function(string, search) {
	            return string.indexOf(search) !== -1;
	        },
	        insert: function(string, subString, start) {
	            return string.slice(0, start) + subString + string.slice(start);
	        },
	        reduce: function(array, callback /*, initialValue*/) {
	            if (this === null) {
	                throw new TypeError('Array.prototype.reduce called on null or undefined');
	            }
	
	            if (typeof callback !== 'function') {
	                throw new TypeError(callback + ' is not a function');
	            }
	
	            var t = Object(array),
	                len = t.length >>> 0,
	                k = 0,
	                value;
	
	            if (arguments.length === 3) {
	                value = arguments[2];
	            } else {
	                while (k < len && !(k in t)) {
	                    k++;
	                }
	
	                if (k >= len) {
	                    throw new TypeError('Reduce of empty array with no initial value');
	                }
	
	                value = t[k++];
	            }
	            for (; k < len; k++) {
	                if (k in t) {
	                    value = callback(value, t[k], k, t);
	                }
	            }
	            return value;
	        },
	        /**
	         * Computes the multiplier necessary to make x >= 1,
	         * effectively eliminating miscalculations caused by
	         * finite precision.
	         */
	        multiplier: function (x) {
	            var parts = x.toString().split('.');
	
	            return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
	        },
	        /**
	         * Given a variable number of arguments, returns the maximum
	         * multiplier that must be used to normalize an operation involving
	         * all of them.
	         */
	        correctionFactor: function () {
	            var args = Array.prototype.slice.call(arguments);
	
	            return args.reduce(function(accum, next) {
	                var mn = _.multiplier(next);
	                return accum > mn ? accum : mn;
	            }, 1);
	        },
	        /**
	         * Implementation of toFixed() that treats floats more like decimals
	         *
	         * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
	         * problems for accounting- and finance-related software.
	         */
	        toFixed: function(value, maxDecimals, roundingFunction, optionals) {
	            var splitValue = value.toString().split('.'),
	                minDecimals = maxDecimals - (optionals || 0),
	                boundedPrecision,
	                optionalsRegExp,
	                power,
	                output;
	
	            // Use the smallest precision value possible to avoid errors from floating point representation
	            if (splitValue.length === 2) {
	              boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
	            } else {
	              boundedPrecision = minDecimals;
	            }
	
	            power = Math.pow(10, boundedPrecision);
	
	            // Multiply up by precision, round accurately, then divide and use native toFixed():
	            output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);
	
	            if (optionals > maxDecimals - boundedPrecision) {
	                optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
	                output = output.replace(optionalsRegExp, '');
	            }
	
	            return output;
	        }
	    };
	
	    // avaliable options
	    numeral.options = options;
	
	    // avaliable formats
	    numeral.formats = formats;
	
	    // avaliable formats
	    numeral.locales = locales;
	
	    // This function sets the current locale.  If
	    // no arguments are passed in, it will simply return the current global
	    // locale key.
	    numeral.locale = function(key) {
	        if (key) {
	            options.currentLocale = key.toLowerCase();
	        }
	
	        return options.currentLocale;
	    };
	
	    // This function provides access to the loaded locale data.  If
	    // no arguments are passed in, it will simply return the current
	    // global locale object.
	    numeral.localeData = function(key) {
	        if (!key) {
	            return locales[options.currentLocale];
	        }
	
	        key = key.toLowerCase();
	
	        if (!locales[key]) {
	            throw new Error('Unknown locale : ' + key);
	        }
	
	        return locales[key];
	    };
	
	    numeral.reset = function() {
	        for (var property in defaults) {
	            options[property] = defaults[property];
	        }
	    };
	
	    numeral.zeroFormat = function(format) {
	        options.zeroFormat = typeof(format) === 'string' ? format : null;
	    };
	
	    numeral.nullFormat = function (format) {
	        options.nullFormat = typeof(format) === 'string' ? format : null;
	    };
	
	    numeral.defaultFormat = function(format) {
	        options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
	    };
	
	    numeral.register = function(type, name, format) {
	        name = name.toLowerCase();
	
	        if (this[type + 's'][name]) {
	            throw new TypeError(name + ' ' + type + ' already registered.');
	        }
	
	        this[type + 's'][name] = format;
	
	        return format;
	    };
	
	
	    numeral.validate = function(val, culture) {
	        var _decimalSep,
	            _thousandSep,
	            _currSymbol,
	            _valArray,
	            _abbrObj,
	            _thousandRegEx,
	            localeData,
	            temp;
	
	        //coerce val to string
	        if (typeof val !== 'string') {
	            val += '';
	
	            if (console.warn) {
	                console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
	            }
	        }
	
	        //trim whitespaces from either sides
	        val = val.trim();
	
	        //if val is just digits return true
	        if (!!val.match(/^\d+$/)) {
	            return true;
	        }
	
	        //if val is empty return false
	        if (val === '') {
	            return false;
	        }
	
	        //get the decimal and thousands separator from numeral.localeData
	        try {
	            //check if the culture is understood by numeral. if not, default it to current locale
	            localeData = numeral.localeData(culture);
	        } catch (e) {
	            localeData = numeral.localeData(numeral.locale());
	        }
	
	        //setup the delimiters and currency symbol based on culture/locale
	        _currSymbol = localeData.currency.symbol;
	        _abbrObj = localeData.abbreviations;
	        _decimalSep = localeData.delimiters.decimal;
	        if (localeData.delimiters.thousands === '.') {
	            _thousandSep = '\\.';
	        } else {
	            _thousandSep = localeData.delimiters.thousands;
	        }
	
	        // validating currency symbol
	        temp = val.match(/^[^\d]+/);
	        if (temp !== null) {
	            val = val.substr(1);
	            if (temp[0] !== _currSymbol) {
	                return false;
	            }
	        }
	
	        //validating abbreviation symbol
	        temp = val.match(/[^\d]+$/);
	        if (temp !== null) {
	            val = val.slice(0, -1);
	            if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
	                return false;
	            }
	        }
	
	        _thousandRegEx = new RegExp(_thousandSep + '{2}');
	
	        if (!val.match(/[^\d.,]/g)) {
	            _valArray = val.split(_decimalSep);
	            if (_valArray.length > 2) {
	                return false;
	            } else {
	                if (_valArray.length < 2) {
	                    return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
	                } else {
	                    if (_valArray[0].length === 1) {
	                        return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
	                    } else {
	                        return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
	                    }
	                }
	            }
	        }
	
	        return false;
	    };
	
	
	    /************************************
	        Numeral Prototype
	    ************************************/
	
	    numeral.fn = Numeral.prototype = {
	        clone: function() {
	            return numeral(this);
	        },
	        format: function(inputString, roundingFunction) {
	            var value = this._value,
	                format = inputString || options.defaultFormat,
	                kind,
	                output,
	                formatFunction;
	
	            // make sure we have a roundingFunction
	            roundingFunction = roundingFunction || Math.round;
	
	            // format based on value
	            if (value === 0 && options.zeroFormat !== null) {
	                output = options.zeroFormat;
	            } else if (value === null && options.nullFormat !== null) {
	                output = options.nullFormat;
	            } else {
	                for (kind in formats) {
	                    if (format.match(formats[kind].regexps.format)) {
	                        formatFunction = formats[kind].format;
	
	                        break;
	                    }
	                }
	
	                formatFunction = formatFunction || numeral._.numberToFormat;
	
	                output = formatFunction(value, format, roundingFunction);
	            }
	
	            return output;
	        },
	        value: function() {
	            return this._value;
	        },
	        input: function() {
	            return this._input;
	        },
	        set: function(value) {
	            this._value = Number(value);
	
	            return this;
	        },
	        add: function(value) {
	            var corrFactor = _.correctionFactor.call(null, this._value, value);
	
	            function cback(accum, curr, currI, O) {
	                return accum + Math.round(corrFactor * curr);
	            }
	
	            this._value = _.reduce([this._value, value], cback, 0) / corrFactor;
	
	            return this;
	        },
	        subtract: function(value) {
	            var corrFactor = _.correctionFactor.call(null, this._value, value);
	
	            function cback(accum, curr, currI, O) {
	                return accum - Math.round(corrFactor * curr);
	            }
	
	            this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;
	
	            return this;
	        },
	        multiply: function(value) {
	            function cback(accum, curr, currI, O) {
	                var corrFactor = _.correctionFactor(accum, curr);
	                return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
	            }
	
	            this._value = _.reduce([this._value, value], cback, 1);
	
	            return this;
	        },
	        divide: function(value) {
	            function cback(accum, curr, currI, O) {
	                var corrFactor = _.correctionFactor(accum, curr);
	                return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
	            }
	
	            this._value = _.reduce([this._value, value], cback);
	
	            return this;
	        },
	        difference: function(value) {
	            return Math.abs(numeral(this._value).subtract(value).value());
	        }
	    };
	
	    /************************************
	        Default Locale && Format
	    ************************************/
	
	    numeral.register('locale', 'en', {
	        delimiters: {
	            thousands: ',',
	            decimal: '.'
	        },
	        abbreviations: {
	            thousand: 'k',
	            million: 'm',
	            billion: 'b',
	            trillion: 't'
	        },
	        ordinal: function(number) {
	            var b = number % 10;
	            return (~~(number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	        },
	        currency: {
	            symbol: '$'
	        }
	    });
	
	    
	
	(function() {
	        numeral.register('format', 'bps', {
	            regexps: {
	                format: /(BPS)/,
	                unformat: /(BPS)/
	            },
	            format: function(value, format, roundingFunction) {
	                var space = numeral._.includes(format, ' BPS') ? ' ' : '',
	                    output;
	
	                value = value * 10000;
	
	                // check for space before BPS
	                format = format.replace(/\s?BPS/, '');
	
	                output = numeral._.numberToFormat(value, format, roundingFunction);
	
	                if (numeral._.includes(output, ')')) {
	                    output = output.split('');
	
	                    output.splice(-1, 0, space + 'BPS');
	
	                    output = output.join('');
	                } else {
	                    output = output + space + 'BPS';
	                }
	
	                return output;
	            },
	            unformat: function(string) {
	                return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
	            }
	        });
	})();
	
	
	(function() {
	        var decimal = {
	            base: 1000,
	            suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	        },
	        binary = {
	            base: 1024,
	            suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
	        };
	
	    var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
	            return decimal.suffixes.indexOf(item) < 0;
	        }));
	        var unformatRegex = allSuffixes.join('|');
	        // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
	        unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';
	
	    numeral.register('format', 'bytes', {
	        regexps: {
	            format: /([0\s]i?b)/,
	            unformat: new RegExp(unformatRegex)
	        },
	        format: function(value, format, roundingFunction) {
	            var output,
	                bytes = numeral._.includes(format, 'ib') ? binary : decimal,
	                suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
	                power,
	                min,
	                max;
	
	            // check for space before
	            format = format.replace(/\s?i?b/, '');
	
	            for (power = 0; power <= bytes.suffixes.length; power++) {
	                min = Math.pow(bytes.base, power);
	                max = Math.pow(bytes.base, power + 1);
	
	                if (value === null || value === 0 || value >= min && value < max) {
	                    suffix += bytes.suffixes[power];
	
	                    if (min > 0) {
	                        value = value / min;
	                    }
	
	                    break;
	                }
	            }
	
	            output = numeral._.numberToFormat(value, format, roundingFunction);
	
	            return output + suffix;
	        },
	        unformat: function(string) {
	            var value = numeral._.stringToNumber(string),
	                power,
	                bytesMultiplier;
	
	            if (value) {
	                for (power = decimal.suffixes.length - 1; power >= 0; power--) {
	                    if (numeral._.includes(string, decimal.suffixes[power])) {
	                        bytesMultiplier = Math.pow(decimal.base, power);
	
	                        break;
	                    }
	
	                    if (numeral._.includes(string, binary.suffixes[power])) {
	                        bytesMultiplier = Math.pow(binary.base, power);
	
	                        break;
	                    }
	                }
	
	                value *= (bytesMultiplier || 1);
	            }
	
	            return value;
	        }
	    });
	})();
	
	
	(function() {
	        numeral.register('format', 'currency', {
	        regexps: {
	            format: /(\$)/
	        },
	        format: function(value, format, roundingFunction) {
	            var locale = numeral.locales[numeral.options.currentLocale],
	                symbols = {
	                    before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
	                    after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
	                },
	                output,
	                symbol,
	                i;
	
	            // strip format of spaces and $
	            format = format.replace(/\s?\$\s?/, '');
	
	            // format the number
	            output = numeral._.numberToFormat(value, format, roundingFunction);
	
	            // update the before and after based on value
	            if (value >= 0) {
	                symbols.before = symbols.before.replace(/[\-\(]/, '');
	                symbols.after = symbols.after.replace(/[\-\)]/, '');
	            } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
	                symbols.before = '-' + symbols.before;
	            }
	
	            // loop through each before symbol
	            for (i = 0; i < symbols.before.length; i++) {
	                symbol = symbols.before[i];
	
	                switch (symbol) {
	                    case '$':
	                        output = numeral._.insert(output, locale.currency.symbol, i);
	                        break;
	                    case ' ':
	                        output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
	                        break;
	                }
	            }
	
	            // loop through each after symbol
	            for (i = symbols.after.length - 1; i >= 0; i--) {
	                symbol = symbols.after[i];
	
	                switch (symbol) {
	                    case '$':
	                        output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
	                        break;
	                    case ' ':
	                        output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
	                        break;
	                }
	            }
	
	
	            return output;
	        }
	    });
	})();
	
	
	(function() {
	        numeral.register('format', 'exponential', {
	        regexps: {
	            format: /(e\+|e-)/,
	            unformat: /(e\+|e-)/
	        },
	        format: function(value, format, roundingFunction) {
	            var output,
	                exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
	                parts = exponential.split('e');
	
	            format = format.replace(/e[\+|\-]{1}0/, '');
	
	            output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);
	
	            return output + 'e' + parts[1];
	        },
	        unformat: function(string) {
	            var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
	                value = Number(parts[0]),
	                power = Number(parts[1]);
	
	            power = numeral._.includes(string, 'e-') ? power *= -1 : power;
	
	            function cback(accum, curr, currI, O) {
	                var corrFactor = numeral._.correctionFactor(accum, curr),
	                    num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
	                return num;
	            }
	
	            return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
	        }
	    });
	})();
	
	
	(function() {
	        numeral.register('format', 'ordinal', {
	        regexps: {
	            format: /(o)/
	        },
	        format: function(value, format, roundingFunction) {
	            var locale = numeral.locales[numeral.options.currentLocale],
	                output,
	                ordinal = numeral._.includes(format, ' o') ? ' ' : '';
	
	            // check for space before
	            format = format.replace(/\s?o/, '');
	
	            ordinal += locale.ordinal(value);
	
	            output = numeral._.numberToFormat(value, format, roundingFunction);
	
	            return output + ordinal;
	        }
	    });
	})();
	
	
	(function() {
	        numeral.register('format', 'percentage', {
	        regexps: {
	            format: /(%)/,
	            unformat: /(%)/
	        },
	        format: function(value, format, roundingFunction) {
	            var space = numeral._.includes(format, ' %') ? ' ' : '',
	                output;
	
	            if (numeral.options.scalePercentBy100) {
	                value = value * 100;
	            }
	
	            // check for space before %
	            format = format.replace(/\s?\%/, '');
	
	            output = numeral._.numberToFormat(value, format, roundingFunction);
	
	            if (numeral._.includes(output, ')')) {
	                output = output.split('');
	
	                output.splice(-1, 0, space + '%');
	
	                output = output.join('');
	            } else {
	                output = output + space + '%';
	            }
	
	            return output;
	        },
	        unformat: function(string) {
	            var number = numeral._.stringToNumber(string);
	            if (numeral.options.scalePercentBy100) {
	                return number * 0.01;
	            }
	            return number;
	        }
	    });
	})();
	
	
	(function() {
	        numeral.register('format', 'time', {
	        regexps: {
	            format: /(:)/,
	            unformat: /(:)/
	        },
	        format: function(value, format, roundingFunction) {
	            var hours = Math.floor(value / 60 / 60),
	                minutes = Math.floor((value - (hours * 60 * 60)) / 60),
	                seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));
	
	            return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
	        },
	        unformat: function(string) {
	            var timeArray = string.split(':'),
	                seconds = 0;
	
	            // turn hours and minutes into seconds and add them all up
	            if (timeArray.length === 3) {
	                // hours
	                seconds = seconds + (Number(timeArray[0]) * 60 * 60);
	                // minutes
	                seconds = seconds + (Number(timeArray[1]) * 60);
	                // seconds
	                seconds = seconds + Number(timeArray[2]);
	            } else if (timeArray.length === 2) {
	                // minutes
	                seconds = seconds + (Number(timeArray[0]) * 60);
	                // seconds
	                seconds = seconds + Number(timeArray[1]);
	            }
	            return Number(seconds);
	        }
	    });
	})();
	
	return numeral;
	}));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Fuse.js v3.0.4 - Lightweight fuzzy-search (http://fusejs.io)
	 * 
	 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
	 * All Rights Reserved. Apache Software License 2.0
	 * 
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define("Fuse", [], factory);
		else if(typeof exports === 'object')
			exports["Fuse"] = factory();
		else
			root["Fuse"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId]) {
	/******/ 			return installedModules[moduleId].exports;
	/******/ 		}
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			i: moduleId,
	/******/ 			l: false,
	/******/ 			exports: {}
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.l = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// identity function for calling harmony imports with the correct context
	/******/ 	__webpack_require__.i = function(value) { return value; };
	/******/
	/******/ 	// define getter function for harmony exports
	/******/ 	__webpack_require__.d = function(exports, name, getter) {
	/******/ 		if(!__webpack_require__.o(exports, name)) {
	/******/ 			Object.defineProperty(exports, name, {
	/******/ 				configurable: false,
	/******/ 				enumerable: true,
	/******/ 				get: getter
	/******/ 			});
	/******/ 		}
	/******/ 	};
	/******/
	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__webpack_require__.n = function(module) {
	/******/ 		var getter = module && module.__esModule ?
	/******/ 			function getDefault() { return module['default']; } :
	/******/ 			function getModuleExports() { return module; };
	/******/ 		__webpack_require__.d(getter, 'a', getter);
	/******/ 		return getter;
	/******/ 	};
	/******/
	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = 8);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	module.exports = function (obj) {
	  return Object.prototype.toString.call(obj) === '[object Array]';
	};
	
	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var bitapRegexSearch = __webpack_require__(5);
	var bitapSearch = __webpack_require__(7);
	var patternAlphabet = __webpack_require__(4);
	
	var Bitap = function () {
	  function Bitap(pattern, _ref) {
	    var _ref$location = _ref.location,
	        location = _ref$location === undefined ? 0 : _ref$location,
	        _ref$distance = _ref.distance,
	        distance = _ref$distance === undefined ? 100 : _ref$distance,
	        _ref$threshold = _ref.threshold,
	        threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,
	        _ref$maxPatternLength = _ref.maxPatternLength,
	        maxPatternLength = _ref$maxPatternLength === undefined ? 32 : _ref$maxPatternLength,
	        _ref$isCaseSensitive = _ref.isCaseSensitive,
	        isCaseSensitive = _ref$isCaseSensitive === undefined ? false : _ref$isCaseSensitive,
	        _ref$tokenSeparator = _ref.tokenSeparator,
	        tokenSeparator = _ref$tokenSeparator === undefined ? / +/g : _ref$tokenSeparator,
	        _ref$findAllMatches = _ref.findAllMatches,
	        findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,
	        _ref$minMatchCharLeng = _ref.minMatchCharLength,
	        minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng;
	
	    _classCallCheck(this, Bitap);
	
	    this.options = {
	      location: location,
	      distance: distance,
	      threshold: threshold,
	      maxPatternLength: maxPatternLength,
	      isCaseSensitive: isCaseSensitive,
	      tokenSeparator: tokenSeparator,
	      findAllMatches: findAllMatches,
	      minMatchCharLength: minMatchCharLength
	    };
	
	    this.pattern = this.options.isCaseSensitive ? pattern : pattern.toLowerCase();
	
	    if (this.pattern.length <= maxPatternLength) {
	      this.patternAlphabet = patternAlphabet(this.pattern);
	    }
	  }
	
	  _createClass(Bitap, [{
	    key: 'search',
	    value: function search(text) {
	      if (!this.options.isCaseSensitive) {
	        text = text.toLowerCase();
	      }
	
	      // Exact match
	      if (this.pattern === text) {
	        return {
	          isMatch: true,
	          score: 0,
	          matchedIndices: [[0, text.length - 1]]
	        };
	      }
	
	      // When pattern length is greater than the machine word length, just do a a regex comparison
	      var _options = this.options,
	          maxPatternLength = _options.maxPatternLength,
	          tokenSeparator = _options.tokenSeparator;
	
	      if (this.pattern.length > maxPatternLength) {
	        return bitapRegexSearch(text, this.pattern, tokenSeparator);
	      }
	
	      // Otherwise, use Bitap algorithm
	      var _options2 = this.options,
	          location = _options2.location,
	          distance = _options2.distance,
	          threshold = _options2.threshold,
	          findAllMatches = _options2.findAllMatches,
	          minMatchCharLength = _options2.minMatchCharLength;
	
	      return bitapSearch(text, this.pattern, this.patternAlphabet, {
	        location: location,
	        distance: distance,
	        threshold: threshold,
	        findAllMatches: findAllMatches,
	        minMatchCharLength: minMatchCharLength
	      });
	    }
	  }]);
	
	  return Bitap;
	}();
	
	// let x = new Bitap("od mn war", {})
	// let result = x.search("Old Man's War")
	// console.log(result)
	
	module.exports = Bitap;
	
	/***/ }),
	/* 2 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	var isArray = __webpack_require__(0);
	
	var deepValue = function deepValue(obj, path, list) {
	  if (!path) {
	    // If there's no path left, we've gotten to the object we care about.
	    list.push(obj);
	  } else {
	    var dotIndex = path.indexOf('.');
	    var firstSegment = path;
	    var remaining = null;
	
	    if (dotIndex !== -1) {
	      firstSegment = path.slice(0, dotIndex);
	      remaining = path.slice(dotIndex + 1);
	    }
	
	    var value = obj[firstSegment];
	
	    if (value !== null && value !== undefined) {
	      if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
	        list.push(value);
	      } else if (isArray(value)) {
	        // Search each item in the array.
	        for (var i = 0, len = value.length; i < len; i += 1) {
	          deepValue(value[i], remaining, list);
	        }
	      } else if (remaining) {
	        // An object. Recurse further.
	        deepValue(value, remaining, list);
	      }
	    }
	  }
	
	  return list;
	};
	
	module.exports = function (obj, path) {
	  return deepValue(obj, path, []);
	};
	
	/***/ }),
	/* 3 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	module.exports = function () {
	  var matchmask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	  var minMatchCharLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	  var matchedIndices = [];
	  var start = -1;
	  var end = -1;
	  var i = 0;
	
	  for (var len = matchmask.length; i < len; i += 1) {
	    var match = matchmask[i];
	    if (match && start === -1) {
	      start = i;
	    } else if (!match && start !== -1) {
	      end = i - 1;
	      if (end - start + 1 >= minMatchCharLength) {
	        matchedIndices.push([start, end]);
	      }
	      start = -1;
	    }
	  }
	
	  // (i-1 - start) + 1 => i - start
	  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
	    matchedIndices.push([start, i - 1]);
	  }
	
	  return matchedIndices;
	};
	
	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	module.exports = function (pattern) {
	  var mask = {};
	  var len = pattern.length;
	
	  for (var i = 0; i < len; i += 1) {
	    mask[pattern.charAt(i)] = 0;
	  }
	
	  for (var _i = 0; _i < len; _i += 1) {
	    mask[pattern.charAt(_i)] |= 1 << len - _i - 1;
	  }
	
	  return mask;
	};
	
	/***/ }),
	/* 5 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	module.exports = function (text, pattern) {
	  var tokenSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : / +/g;
	
	  var matches = text.match(new RegExp(pattern.replace(tokenSeparator, '|')));
	  var isMatch = !!matches;
	  var matchedIndices = [];
	
	  if (isMatch) {
	    for (var i = 0, matchesLen = matches.length; i < matchesLen; i += 1) {
	      var match = matches[i];
	      matchedIndices.push([text.indexOf(match), match.length - 1]);
	    }
	  }
	
	  return {
	    // TODO: revisit this score
	    score: isMatch ? 0.5 : 1,
	    isMatch: isMatch,
	    matchedIndices: matchedIndices
	  };
	};
	
	/***/ }),
	/* 6 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	module.exports = function (pattern, _ref) {
	  var _ref$errors = _ref.errors,
	      errors = _ref$errors === undefined ? 0 : _ref$errors,
	      _ref$currentLocation = _ref.currentLocation,
	      currentLocation = _ref$currentLocation === undefined ? 0 : _ref$currentLocation,
	      _ref$expectedLocation = _ref.expectedLocation,
	      expectedLocation = _ref$expectedLocation === undefined ? 0 : _ref$expectedLocation,
	      _ref$distance = _ref.distance,
	      distance = _ref$distance === undefined ? 100 : _ref$distance;
	
	  var accuracy = errors / pattern.length;
	  var proximity = Math.abs(expectedLocation - currentLocation);
	
	  if (!distance) {
	    // Dodge divide by zero error.
	    return proximity ? 1.0 : accuracy;
	  }
	
	  return accuracy + proximity / distance;
	};
	
	/***/ }),
	/* 7 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	var bitapScore = __webpack_require__(6);
	var matchedIndices = __webpack_require__(3);
	
	module.exports = function (text, pattern, patternAlphabet, _ref) {
	  var _ref$location = _ref.location,
	      location = _ref$location === undefined ? 0 : _ref$location,
	      _ref$distance = _ref.distance,
	      distance = _ref$distance === undefined ? 100 : _ref$distance,
	      _ref$threshold = _ref.threshold,
	      threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,
	      _ref$findAllMatches = _ref.findAllMatches,
	      findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,
	      _ref$minMatchCharLeng = _ref.minMatchCharLength,
	      minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng;
	
	  var expectedLocation = location;
	  // Set starting location at beginning text and initialize the alphabet.
	  var textLen = text.length;
	  // Highest score beyond which we give up.
	  var currentThreshold = threshold;
	  // Is there a nearby exact match? (speedup)
	  var bestLocation = text.indexOf(pattern, expectedLocation);
	
	  var patternLen = pattern.length;
	
	  // a mask of the matches
	  var matchMask = [];
	  for (var i = 0; i < textLen; i += 1) {
	    matchMask[i] = 0;
	  }
	
	  if (bestLocation != -1) {
	    var score = bitapScore(pattern, {
	      errors: 0,
	      currentLocation: bestLocation,
	      expectedLocation: expectedLocation,
	      distance: distance
	    });
	    currentThreshold = Math.min(score, currentThreshold);
	
	    // What about in the other direction? (speed up)
	    bestLocation = text.lastIndexOf(pattern, expectedLocation + patternLen);
	
	    if (bestLocation != -1) {
	      var _score = bitapScore(pattern, {
	        errors: 0,
	        currentLocation: bestLocation,
	        expectedLocation: expectedLocation,
	        distance: distance
	      });
	      currentThreshold = Math.min(_score, currentThreshold);
	    }
	  }
	
	  // Reset the best location
	  bestLocation = -1;
	
	  var lastBitArr = [];
	  var finalScore = 1;
	  var binMax = patternLen + textLen;
	
	  var mask = 1 << patternLen - 1;
	
	  for (var _i = 0; _i < patternLen; _i += 1) {
	    // Scan for the best match; each iteration allows for one more error.
	    // Run a binary search to determine how far from the match location we can stray
	    // at this error level.
	    var binMin = 0;
	    var binMid = binMax;
	
	    while (binMin < binMid) {
	      var _score3 = bitapScore(pattern, {
	        errors: _i,
	        currentLocation: expectedLocation + binMid,
	        expectedLocation: expectedLocation,
	        distance: distance
	      });
	
	      if (_score3 <= currentThreshold) {
	        binMin = binMid;
	      } else {
	        binMax = binMid;
	      }
	
	      binMid = Math.floor((binMax - binMin) / 2 + binMin);
	    }
	
	    // Use the result from this iteration as the maximum for the next.
	    binMax = binMid;
	
	    var start = Math.max(1, expectedLocation - binMid + 1);
	    var finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
	
	    // Initialize the bit array
	    var bitArr = Array(finish + 2);
	
	    bitArr[finish + 1] = (1 << _i) - 1;
	
	    for (var j = finish; j >= start; j -= 1) {
	      var currentLocation = j - 1;
	      var charMatch = patternAlphabet[text.charAt(currentLocation)];
	
	      if (charMatch) {
	        matchMask[currentLocation] = 1;
	      }
	
	      // First pass: exact match
	      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
	
	      // Subsequent passes: fuzzy match
	      if (_i !== 0) {
	        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
	      }
	
	      if (bitArr[j] & mask) {
	        finalScore = bitapScore(pattern, {
	          errors: _i,
	          currentLocation: currentLocation,
	          expectedLocation: expectedLocation,
	          distance: distance
	        });
	
	        // This match will almost certainly be better than any existing match.
	        // But check anyway.
	        if (finalScore <= currentThreshold) {
	          // Indeed it is
	          currentThreshold = finalScore;
	          bestLocation = currentLocation;
	
	          // Already passed `loc`, downhill from here on in.
	          if (bestLocation <= expectedLocation) {
	            break;
	          }
	
	          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
	          start = Math.max(1, 2 * expectedLocation - bestLocation);
	        }
	      }
	    }
	
	    // No hope for a (better) match at greater error levels.  
	    var _score2 = bitapScore(pattern, {
	      errors: _i + 1,
	      currentLocation: expectedLocation,
	      expectedLocation: expectedLocation,
	      distance: distance
	    });
	
	    if (_score2 > currentThreshold) {
	      break;
	    }
	
	    lastBitArr = bitArr;
	  }
	
	  // Count exact matches (those with a score of 0) to be "almost" exact
	  return {
	    isMatch: bestLocation >= 0,
	    score: finalScore === 0 ? 0.001 : finalScore,
	    matchedIndices: matchedIndices(matchMask, minMatchCharLength)
	  };
	};
	
	/***/ }),
	/* 8 */
	/***/ (function(module, exports, __webpack_require__) {
	
	"use strict";
	
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Bitap = __webpack_require__(1);
	var deepValue = __webpack_require__(2);
	var isArray = __webpack_require__(0);
	
	var Fuse = function () {
	  function Fuse(list, _ref) {
	    var _ref$location = _ref.location,
	        location = _ref$location === undefined ? 0 : _ref$location,
	        _ref$distance = _ref.distance,
	        distance = _ref$distance === undefined ? 100 : _ref$distance,
	        _ref$threshold = _ref.threshold,
	        threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,
	        _ref$maxPatternLength = _ref.maxPatternLength,
	        maxPatternLength = _ref$maxPatternLength === undefined ? 32 : _ref$maxPatternLength,
	        _ref$caseSensitive = _ref.caseSensitive,
	        caseSensitive = _ref$caseSensitive === undefined ? false : _ref$caseSensitive,
	        _ref$tokenSeparator = _ref.tokenSeparator,
	        tokenSeparator = _ref$tokenSeparator === undefined ? / +/g : _ref$tokenSeparator,
	        _ref$findAllMatches = _ref.findAllMatches,
	        findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,
	        _ref$minMatchCharLeng = _ref.minMatchCharLength,
	        minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng,
	        _ref$id = _ref.id,
	        id = _ref$id === undefined ? null : _ref$id,
	        _ref$keys = _ref.keys,
	        keys = _ref$keys === undefined ? [] : _ref$keys,
	        _ref$shouldSort = _ref.shouldSort,
	        shouldSort = _ref$shouldSort === undefined ? true : _ref$shouldSort,
	        _ref$getFn = _ref.getFn,
	        getFn = _ref$getFn === undefined ? deepValue : _ref$getFn,
	        _ref$sortFn = _ref.sortFn,
	        sortFn = _ref$sortFn === undefined ? function (a, b) {
	      return a.score - b.score;
	    } : _ref$sortFn,
	        _ref$tokenize = _ref.tokenize,
	        tokenize = _ref$tokenize === undefined ? false : _ref$tokenize,
	        _ref$matchAllTokens = _ref.matchAllTokens,
	        matchAllTokens = _ref$matchAllTokens === undefined ? false : _ref$matchAllTokens,
	        _ref$includeMatches = _ref.includeMatches,
	        includeMatches = _ref$includeMatches === undefined ? false : _ref$includeMatches,
	        _ref$includeScore = _ref.includeScore,
	        includeScore = _ref$includeScore === undefined ? false : _ref$includeScore,
	        _ref$verbose = _ref.verbose,
	        verbose = _ref$verbose === undefined ? false : _ref$verbose;
	
	    _classCallCheck(this, Fuse);
	
	    this.options = {
	      location: location,
	      distance: distance,
	      threshold: threshold,
	      maxPatternLength: maxPatternLength,
	      isCaseSensitive: caseSensitive,
	      tokenSeparator: tokenSeparator,
	      findAllMatches: findAllMatches,
	      minMatchCharLength: minMatchCharLength,
	      id: id,
	      keys: keys,
	      includeMatches: includeMatches,
	      includeScore: includeScore,
	      shouldSort: shouldSort,
	      getFn: getFn,
	      sortFn: sortFn,
	      verbose: verbose,
	      tokenize: tokenize,
	      matchAllTokens: matchAllTokens
	    };
	
	    this.setCollection(list);
	  }
	
	  _createClass(Fuse, [{
	    key: 'setCollection',
	    value: function setCollection(list) {
	      this.list = list;
	      return list;
	    }
	  }, {
	    key: 'search',
	    value: function search(pattern) {
	      this._log('---------\nSearch pattern: "' + pattern + '"');
	
	      var _prepareSearchers2 = this._prepareSearchers(pattern),
	          tokenSearchers = _prepareSearchers2.tokenSearchers,
	          fullSearcher = _prepareSearchers2.fullSearcher;
	
	      var _search2 = this._search(tokenSearchers, fullSearcher),
	          weights = _search2.weights,
	          results = _search2.results;
	
	      this._computeScore(weights, results);
	
	      if (this.options.shouldSort) {
	        this._sort(results);
	      }
	
	      return this._format(results);
	    }
	  }, {
	    key: '_prepareSearchers',
	    value: function _prepareSearchers() {
	      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	      var tokenSearchers = [];
	
	      if (this.options.tokenize) {
	        // Tokenize on the separator
	        var tokens = pattern.split(this.options.tokenSeparator);
	        for (var i = 0, len = tokens.length; i < len; i += 1) {
	          tokenSearchers.push(new Bitap(tokens[i], this.options));
	        }
	      }
	
	      var fullSearcher = new Bitap(pattern, this.options);
	
	      return { tokenSearchers: tokenSearchers, fullSearcher: fullSearcher };
	    }
	  }, {
	    key: '_search',
	    value: function _search() {
	      var tokenSearchers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	      var fullSearcher = arguments[1];
	
	      var list = this.list;
	      var resultMap = {};
	      var results = [];
	
	      // Check the first item in the list, if it's a string, then we assume
	      // that every item in the list is also a string, and thus it's a flattened array.
	      if (typeof list[0] === 'string') {
	        // Iterate over every item
	        for (var i = 0, len = list.length; i < len; i += 1) {
	          this._analyze({
	            key: '',
	            value: list[i],
	            record: i,
	            index: i
	          }, {
	            resultMap: resultMap,
	            results: results,
	            tokenSearchers: tokenSearchers,
	            fullSearcher: fullSearcher
	          });
	        }
	
	        return { weights: null, results: results };
	      }
	
	      // Otherwise, the first item is an Object (hopefully), and thus the searching
	      // is done on the values of the keys of each item.
	      var weights = {};
	      for (var _i = 0, _len = list.length; _i < _len; _i += 1) {
	        var item = list[_i];
	        // Iterate over every key
	        for (var j = 0, keysLen = this.options.keys.length; j < keysLen; j += 1) {
	          var key = this.options.keys[j];
	          if (typeof key !== 'string') {
	            weights[key.name] = {
	              weight: 1 - key.weight || 1
	            };
	            if (key.weight <= 0 || key.weight > 1) {
	              throw new Error('Key weight has to be > 0 and <= 1');
	            }
	            key = key.name;
	          } else {
	            weights[key] = {
	              weight: 1
	            };
	          }
	
	          this._analyze({
	            key: key,
	            value: this.options.getFn(item, key),
	            record: item,
	            index: _i
	          }, {
	            resultMap: resultMap,
	            results: results,
	            tokenSearchers: tokenSearchers,
	            fullSearcher: fullSearcher
	          });
	        }
	      }
	
	      return { weights: weights, results: results };
	    }
	  }, {
	    key: '_analyze',
	    value: function _analyze(_ref2, _ref3) {
	      var key = _ref2.key,
	          value = _ref2.value,
	          record = _ref2.record,
	          index = _ref2.index;
	      var _ref3$tokenSearchers = _ref3.tokenSearchers,
	          tokenSearchers = _ref3$tokenSearchers === undefined ? [] : _ref3$tokenSearchers,
	          _ref3$fullSearcher = _ref3.fullSearcher,
	          fullSearcher = _ref3$fullSearcher === undefined ? [] : _ref3$fullSearcher,
	          _ref3$resultMap = _ref3.resultMap,
	          resultMap = _ref3$resultMap === undefined ? {} : _ref3$resultMap,
	          _ref3$results = _ref3.results,
	          results = _ref3$results === undefined ? [] : _ref3$results;
	
	      // Check if the texvaluet can be searched
	      if (value === undefined || value === null) {
	        return;
	      }
	
	      var exists = false;
	      var averageScore = -1;
	      var numTextMatches = 0;
	
	      if (typeof value === 'string') {
	        this._log('\nKey: ' + (key === '' ? '-' : key));
	
	        var mainSearchResult = fullSearcher.search(value);
	        this._log('Full text: "' + value + '", score: ' + mainSearchResult.score);
	
	        if (this.options.tokenize) {
	          var words = value.split(this.options.tokenSeparator);
	          var scores = [];
	
	          for (var i = 0; i < tokenSearchers.length; i += 1) {
	            var tokenSearcher = tokenSearchers[i];
	
	            this._log('\nPattern: "' + tokenSearcher.pattern + '"');
	
	            // let tokenScores = []
	            var hasMatchInText = false;
	
	            for (var j = 0; j < words.length; j += 1) {
	              var word = words[j];
	              var tokenSearchResult = tokenSearcher.search(word);
	              var obj = {};
	              if (tokenSearchResult.isMatch) {
	                obj[word] = tokenSearchResult.score;
	                exists = true;
	                hasMatchInText = true;
	                scores.push(tokenSearchResult.score);
	              } else {
	                obj[word] = 1;
	                if (!this.options.matchAllTokens) {
	                  scores.push(1);
	                }
	              }
	              this._log('Token: "' + word + '", score: ' + obj[word]);
	              // tokenScores.push(obj)
	            }
	
	            if (hasMatchInText) {
	              numTextMatches += 1;
	            }
	          }
	
	          averageScore = scores[0];
	          var scoresLen = scores.length;
	          for (var _i2 = 1; _i2 < scoresLen; _i2 += 1) {
	            averageScore += scores[_i2];
	          }
	          averageScore = averageScore / scoresLen;
	
	          this._log('Token score average:', averageScore);
	        }
	
	        var finalScore = mainSearchResult.score;
	        if (averageScore > -1) {
	          finalScore = (finalScore + averageScore) / 2;
	        }
	
	        this._log('Score average:', finalScore);
	
	        var checkTextMatches = this.options.tokenize && this.options.matchAllTokens ? numTextMatches >= tokenSearchers.length : true;
	
	        this._log('\nCheck Matches: ' + checkTextMatches);
	
	        // If a match is found, add the item to <rawResults>, including its score
	        if ((exists || mainSearchResult.isMatch) && checkTextMatches) {
	          // Check if the item already exists in our results
	          var existingResult = resultMap[index];
	
	          if (existingResult) {
	            // Use the lowest score
	            // existingResult.score, bitapResult.score
	            existingResult.output.push({
	              key: key,
	              score: finalScore,
	              matchedIndices: mainSearchResult.matchedIndices
	            });
	          } else {
	            // Add it to the raw result list
	            resultMap[index] = {
	              item: record,
	              output: [{
	                key: key,
	                score: finalScore,
	                matchedIndices: mainSearchResult.matchedIndices
	              }]
	            };
	
	            results.push(resultMap[index]);
	          }
	        }
	      } else if (isArray(value)) {
	        for (var _i3 = 0, len = value.length; _i3 < len; _i3 += 1) {
	          this._analyze({
	            key: key,
	            value: value[_i3],
	            record: record,
	            index: index
	          }, {
	            resultMap: resultMap,
	            results: results,
	            tokenSearchers: tokenSearchers,
	            fullSearcher: fullSearcher
	          });
	        }
	      }
	    }
	  }, {
	    key: '_computeScore',
	    value: function _computeScore(weights, results) {
	      this._log('\n\nComputing score:\n');
	
	      for (var i = 0, len = results.length; i < len; i += 1) {
	        var output = results[i].output;
	        var scoreLen = output.length;
	
	        var totalScore = 0;
	        var bestScore = 1;
	
	        for (var j = 0; j < scoreLen; j += 1) {
	          var score = output[j].score;
	          var weight = weights ? weights[output[j].key].weight : 1;
	          var nScore = score * weight;
	
	          if (weight !== 1) {
	            bestScore = Math.min(bestScore, nScore);
	          } else {
	            output[j].nScore = nScore;
	            totalScore += nScore;
	          }
	        }
	
	        results[i].score = bestScore === 1 ? totalScore / scoreLen : bestScore;
	
	        this._log(results[i]);
	      }
	    }
	  }, {
	    key: '_sort',
	    value: function _sort(results) {
	      this._log('\n\nSorting....');
	      results.sort(this.options.sortFn);
	    }
	  }, {
	    key: '_format',
	    value: function _format(results) {
	      var finalOutput = [];
	
	      this._log('\n\nOutput:\n\n', results);
	
	      var transformers = [];
	
	      if (this.options.includeMatches) {
	        transformers.push(function (result, data) {
	          var output = result.output;
	          data.matches = [];
	
	          for (var i = 0, len = output.length; i < len; i += 1) {
	            var item = output[i];
	            var obj = {
	              indices: item.matchedIndices
	            };
	            if (item.key) {
	              obj.key = item.key;
	            }
	            data.matches.push(obj);
	          }
	        });
	      }
	
	      if (this.options.includeScore) {
	        transformers.push(function (result, data) {
	          data.score = result.score;
	        });
	      }
	
	      for (var i = 0, len = results.length; i < len; i += 1) {
	        var result = results[i];
	
	        if (this.options.id) {
	          result.item = this.options.getFn(result.item, this.options.id)[0];
	        }
	
	        if (!transformers.length) {
	          finalOutput.push(result.item);
	          continue;
	        }
	
	        var data = {
	          item: result.item
	        };
	
	        for (var j = 0, _len2 = transformers.length; j < _len2; j += 1) {
	          transformers[j](result, data);
	        }
	
	        finalOutput.push(data);
	      }
	
	      return finalOutput;
	    }
	  }, {
	    key: '_log',
	    value: function _log() {
	      if (this.options.verbose) {
	        var _console;
	
	        (_console = console).log.apply(_console, arguments);
	      }
	    }
	  }]);
	
	  return Fuse;
	}();
	
	module.exports = Fuse;
	
	/***/ })
	/******/ ]);
	});
	//# sourceMappingURL=fuse.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var PathSeparator, SpaceRegex, filter, matcher, scorer;
	
	  scorer = __webpack_require__(4);
	
	  filter = __webpack_require__(7);
	
	  matcher = __webpack_require__(8);
	
	  PathSeparator = __webpack_require__(5).sep;
	
	  SpaceRegex = /\ /g;
	
	  module.exports = {
	    filter: function(candidates, query, options) {
	      var queryHasSlashes;
	      if (query) {
	        queryHasSlashes = query.indexOf(PathSeparator) !== -1;
	        query = query.replace(SpaceRegex, '');
	      }
	      return filter(candidates, query, queryHasSlashes, options);
	    },
	    score: function(string, query) {
	      var queryHasSlashes, score;
	      if (!string) {
	        return 0;
	      }
	      if (!query) {
	        return 0;
	      }
	      if (string === query) {
	        return 2;
	      }
	      queryHasSlashes = query.indexOf(PathSeparator) !== -1;
	      query = query.replace(SpaceRegex, '');
	      score = scorer.score(string, query);
	      if (!queryHasSlashes) {
	        score = scorer.basenameScore(string, query, score);
	      }
	      return score;
	    },
	    match: function(string, query) {
	      var baseMatches, index, matches, queryHasSlashes, seen, _i, _ref, _results;
	      if (!string) {
	        return [];
	      }
	      if (!query) {
	        return [];
	      }
	      if (string === query) {
	        return (function() {
	          _results = [];
	          for (var _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
	          return _results;
	        }).apply(this);
	      }
	      queryHasSlashes = query.indexOf(PathSeparator) !== -1;
	      query = query.replace(SpaceRegex, '');
	      matches = matcher.match(string, query);
	      if (!queryHasSlashes) {
	        baseMatches = matcher.basenameMatch(string, query);
	        matches = matches.concat(baseMatches).sort(function(a, b) {
	          return a - b;
	        });
	        seen = null;
	        index = 0;
	        while (index < matches.length) {
	          if (index && seen === matches[index]) {
	            matches.splice(index, 1);
	          } else {
	            seen = matches[index];
	            index++;
	          }
	        }
	      }
	      return matches;
	    }
	  };
	
	}).call(this);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var PathSeparator, queryIsLastPathSegment;
	
	  PathSeparator = __webpack_require__(5).sep;
	
	  exports.basenameScore = function(string, query, score) {
	    var base, depth, index, lastCharacter, segmentCount, slashCount;
	    index = string.length - 1;
	    while (string[index] === PathSeparator) {
	      index--;
	    }
	    slashCount = 0;
	    lastCharacter = index;
	    base = null;
	    while (index >= 0) {
	      if (string[index] === PathSeparator) {
	        slashCount++;
	        if (base == null) {
	          base = string.substring(index + 1, lastCharacter + 1);
	        }
	      } else if (index === 0) {
	        if (lastCharacter < string.length - 1) {
	          if (base == null) {
	            base = string.substring(0, lastCharacter + 1);
	          }
	        } else {
	          if (base == null) {
	            base = string;
	          }
	        }
	      }
	      index--;
	    }
	    if (base === string) {
	      score *= 2;
	    } else if (base) {
	      score += exports.score(base, query);
	    }
	    segmentCount = slashCount + 1;
	    depth = Math.max(1, 10 - segmentCount);
	    score *= depth * 0.01;
	    return score;
	  };
	
	  exports.score = function(string, query) {
	    var character, characterScore, indexInQuery, indexInString, lowerCaseIndex, minIndex, queryLength, queryScore, stringLength, totalCharacterScore, upperCaseIndex, _ref;
	    if (string === query) {
	      return 1;
	    }
	    if (queryIsLastPathSegment(string, query)) {
	      return 1;
	    }
	    totalCharacterScore = 0;
	    queryLength = query.length;
	    stringLength = string.length;
	    indexInQuery = 0;
	    indexInString = 0;
	    while (indexInQuery < queryLength) {
	      character = query[indexInQuery++];
	      lowerCaseIndex = string.indexOf(character.toLowerCase());
	      upperCaseIndex = string.indexOf(character.toUpperCase());
	      minIndex = Math.min(lowerCaseIndex, upperCaseIndex);
	      if (minIndex === -1) {
	        minIndex = Math.max(lowerCaseIndex, upperCaseIndex);
	      }
	      indexInString = minIndex;
	      if (indexInString === -1) {
	        return 0;
	      }
	      characterScore = 0.1;
	      if (string[indexInString] === character) {
	        characterScore += 0.1;
	      }
	      if (indexInString === 0 || string[indexInString - 1] === PathSeparator) {
	        characterScore += 0.8;
	      } else if ((_ref = string[indexInString - 1]) === '-' || _ref === '_' || _ref === ' ') {
	        characterScore += 0.7;
	      }
	      string = string.substring(indexInString + 1, stringLength);
	      totalCharacterScore += characterScore;
	    }
	    queryScore = totalCharacterScore / queryLength;
	    return ((queryScore * (queryLength / stringLength)) + queryScore) / 2;
	  };
	
	  queryIsLastPathSegment = function(string, query) {
	    if (string[string.length - query.length - 1] === PathSeparator) {
	      return string.lastIndexOf(query) === string.length - query.length;
	    }
	  };
	
	}).call(this);


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	
	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	
	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	
	exports.extname = function(path) {
	  return splitPath(path)[3];
	};
	
	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var pluckCandidates, scorer, sortCandidates;
	
	  scorer = __webpack_require__(4);
	
	  pluckCandidates = function(a) {
	    return a.candidate;
	  };
	
	  sortCandidates = function(a, b) {
	    return b.score - a.score;
	  };
	
	  module.exports = function(candidates, query, queryHasSlashes, _arg) {
	    var candidate, key, maxResults, score, scoredCandidates, string, _i, _len, _ref;
	    _ref = _arg != null ? _arg : {}, key = _ref.key, maxResults = _ref.maxResults;
	    if (query) {
	      scoredCandidates = [];
	      for (_i = 0, _len = candidates.length; _i < _len; _i++) {
	        candidate = candidates[_i];
	        string = key != null ? candidate[key] : candidate;
	        if (!string) {
	          continue;
	        }
	        score = scorer.score(string, query, queryHasSlashes);
	        if (!queryHasSlashes) {
	          score = scorer.basenameScore(string, query, score);
	        }
	        if (score > 0) {
	          scoredCandidates.push({
	            candidate: candidate,
	            score: score
	          });
	        }
	      }
	      scoredCandidates.sort(sortCandidates);
	      candidates = scoredCandidates.map(pluckCandidates);
	    }
	    if (maxResults != null) {
	      candidates = candidates.slice(0, maxResults);
	    }
	    return candidates;
	  };
	
	}).call(this);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var PathSeparator;
	
	  PathSeparator = __webpack_require__(5).sep;
	
	  exports.basenameMatch = function(string, query) {
	    var base, index, lastCharacter, slashCount;
	    index = string.length - 1;
	    while (string[index] === PathSeparator) {
	      index--;
	    }
	    slashCount = 0;
	    lastCharacter = index;
	    base = null;
	    while (index >= 0) {
	      if (string[index] === PathSeparator) {
	        slashCount++;
	        if (base == null) {
	          base = string.substring(index + 1, lastCharacter + 1);
	        }
	      } else if (index === 0) {
	        if (lastCharacter < string.length - 1) {
	          if (base == null) {
	            base = string.substring(0, lastCharacter + 1);
	          }
	        } else {
	          if (base == null) {
	            base = string;
	          }
	        }
	      }
	      index--;
	    }
	    return exports.match(base, query, string.length - base.length);
	  };
	
	  exports.match = function(string, query, stringOffset) {
	    var character, indexInQuery, indexInString, lowerCaseIndex, matches, minIndex, queryLength, stringLength, upperCaseIndex, _i, _ref, _results;
	    if (stringOffset == null) {
	      stringOffset = 0;
	    }
	    if (string === query) {
	      return (function() {
	        _results = [];
	        for (var _i = stringOffset, _ref = stringOffset + string.length; stringOffset <= _ref ? _i < _ref : _i > _ref; stringOffset <= _ref ? _i++ : _i--){ _results.push(_i); }
	        return _results;
	      }).apply(this);
	    }
	    queryLength = query.length;
	    stringLength = string.length;
	    indexInQuery = 0;
	    indexInString = 0;
	    matches = [];
	    while (indexInQuery < queryLength) {
	      character = query[indexInQuery++];
	      lowerCaseIndex = string.indexOf(character.toLowerCase());
	      upperCaseIndex = string.indexOf(character.toUpperCase());
	      minIndex = Math.min(lowerCaseIndex, upperCaseIndex);
	      if (minIndex === -1) {
	        minIndex = Math.max(lowerCaseIndex, upperCaseIndex);
	      }
	      indexInString = minIndex;
	      if (indexInString === -1) {
	        return [];
	      }
	      matches.push(stringOffset + indexInString);
	      stringOffset += indexInString + 1;
	      string = string.substring(indexInString + 1, stringLength);
	    }
	    return matches;
	  };
	
	}).call(this);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  var Query, defaultPathSeparator, filter, matcher, parseOptions, pathScorer, preparedQueryCache, scorer;
	
	  filter = __webpack_require__(10);
	
	  matcher = __webpack_require__(14);
	
	  scorer = __webpack_require__(11);
	
	  pathScorer = __webpack_require__(12);
	
	  Query = __webpack_require__(13);
	
	  preparedQueryCache = null;
	
	  defaultPathSeparator = (typeof process !== "undefined" && process !== null ? process.platform : void 0) === "win32" ? '\\' : '/';
	
	  module.exports = {
	    filter: function(candidates, query, options) {
	      if (options == null) {
	        options = {};
	      }
	      if (!((query != null ? query.length : void 0) && (candidates != null ? candidates.length : void 0))) {
	        return [];
	      }
	      options = parseOptions(options, query);
	      return filter(candidates, query, options);
	    },
	    score: function(string, query, options) {
	      if (options == null) {
	        options = {};
	      }
	      if (!((string != null ? string.length : void 0) && (query != null ? query.length : void 0))) {
	        return 0;
	      }
	      options = parseOptions(options, query);
	      if (options.usePathScoring) {
	        return pathScorer.score(string, query, options);
	      } else {
	        return scorer.score(string, query, options);
	      }
	    },
	    match: function(string, query, options) {
	      var _i, _ref, _results;
	      if (options == null) {
	        options = {};
	      }
	      if (!string) {
	        return [];
	      }
	      if (!query) {
	        return [];
	      }
	      if (string === query) {
	        return (function() {
	          _results = [];
	          for (var _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
	          return _results;
	        }).apply(this);
	      }
	      options = parseOptions(options, query);
	      return matcher.match(string, query, options);
	    },
	    wrap: function(string, query, options) {
	      if (options == null) {
	        options = {};
	      }
	      if (!string) {
	        return [];
	      }
	      if (!query) {
	        return [];
	      }
	      options = parseOptions(options, query);
	      return matcher.wrap(string, query, options);
	    },
	    prepareQuery: function(query, options) {
	      if (options == null) {
	        options = {};
	      }
	      options = parseOptions(options, query);
	      return options.preparedQuery;
	    }
	  };
	
	  parseOptions = function(options, query) {
	    if (options.allowErrors == null) {
	      options.allowErrors = false;
	    }
	    if (options.usePathScoring == null) {
	      options.usePathScoring = true;
	    }
	    if (options.useExtensionBonus == null) {
	      options.useExtensionBonus = false;
	    }
	    if (options.pathSeparator == null) {
	      options.pathSeparator = defaultPathSeparator;
	    }
	    if (options.optCharRegEx == null) {
	      options.optCharRegEx = null;
	    }
	    if (options.wrap == null) {
	      options.wrap = null;
	    }
	    if (options.preparedQuery == null) {
	      options.preparedQuery = preparedQueryCache && preparedQueryCache.query === query ? preparedQueryCache : (preparedQueryCache = new Query(query, options));
	    }
	    return options;
	  };
	
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var Query, pathScorer, pluckCandidates, scorer, sortCandidates;
	
	  scorer = __webpack_require__(11);
	
	  pathScorer = __webpack_require__(12);
	
	  Query = __webpack_require__(13);
	
	  pluckCandidates = function(a) {
	    return a.candidate;
	  };
	
	  sortCandidates = function(a, b) {
	    return b.score - a.score;
	  };
	
	  module.exports = function(candidates, query, options) {
	    var bKey, candidate, key, maxInners, maxResults, score, scoreProvider, scoredCandidates, spotLeft, string, usePathScoring, _i, _len;
	    scoredCandidates = [];
	    key = options.key, maxResults = options.maxResults, maxInners = options.maxInners, usePathScoring = options.usePathScoring;
	    spotLeft = (maxInners != null) && maxInners > 0 ? maxInners : candidates.length + 1;
	    bKey = key != null;
	    scoreProvider = usePathScoring ? pathScorer : scorer;
	    for (_i = 0, _len = candidates.length; _i < _len; _i++) {
	      candidate = candidates[_i];
	      string = bKey ? candidate[key] : candidate;
	      if (!string) {
	        continue;
	      }
	      score = scoreProvider.score(string, query, options);
	      if (score > 0) {
	        scoredCandidates.push({
	          candidate: candidate,
	          score: score
	        });
	        if (!--spotLeft) {
	          break;
	        }
	      }
	    }
	    scoredCandidates.sort(sortCandidates);
	    candidates = scoredCandidates.map(pluckCandidates);
	    if (maxResults != null) {
	      candidates = candidates.slice(0, maxResults);
	    }
	    return candidates;
	  };
	
	}).call(this);


/***/ },
/* 11 */
/***/ function(module, exports) {

	(function() {
	  var AcronymResult, computeScore, emptyAcronymResult, isAcronymFullWord, isMatch, isSeparator, isWordEnd, isWordStart, miss_coeff, pos_bonus, scoreAcronyms, scoreCharacter, scoreConsecutives, scoreExact, scoreExactMatch, scorePattern, scorePosition, scoreSize, tau_size, wm;
	
	  wm = 150;
	
	  pos_bonus = 20;
	
	  tau_size = 85;
	
	  miss_coeff = 0.75;
	
	  exports.score = function(string, query, options) {
	    var allowErrors, preparedQuery, score, string_lw;
	    preparedQuery = options.preparedQuery, allowErrors = options.allowErrors;
	    if (!(allowErrors || isMatch(string, preparedQuery.core_lw, preparedQuery.core_up))) {
	      return 0;
	    }
	    string_lw = string.toLowerCase();
	    score = computeScore(string, string_lw, preparedQuery);
	    return Math.ceil(score);
	  };
	
	  exports.isMatch = isMatch = function(subject, query_lw, query_up) {
	    var i, j, m, n, qj_lw, qj_up, si;
	    m = subject.length;
	    n = query_lw.length;
	    if (!m || n > m) {
	      return false;
	    }
	    i = -1;
	    j = -1;
	    while (++j < n) {
	      qj_lw = query_lw.charCodeAt(j);
	      qj_up = query_up.charCodeAt(j);
	      while (++i < m) {
	        si = subject.charCodeAt(i);
	        if (si === qj_lw || si === qj_up) {
	          break;
	        }
	      }
	      if (i === m) {
	        return false;
	      }
	    }
	    return true;
	  };
	
	  exports.computeScore = computeScore = function(subject, subject_lw, preparedQuery) {
	    var acro, acro_score, align, csc_diag, csc_invalid, csc_row, csc_score, i, j, m, miss_budget, miss_left, mm, n, pos, query, query_lw, record_miss, score, score_diag, score_row, score_up, si_lw, start, sz;
	    query = preparedQuery.query;
	    query_lw = preparedQuery.query_lw;
	    m = subject.length;
	    n = query.length;
	    acro = scoreAcronyms(subject, subject_lw, query, query_lw);
	    acro_score = acro.score;
	    if (acro.count === n) {
	      return scoreExact(n, m, acro_score, acro.pos);
	    }
	    pos = subject_lw.indexOf(query_lw);
	    if (pos > -1) {
	      return scoreExactMatch(subject, subject_lw, query, query_lw, pos, n, m);
	    }
	    score_row = new Array(n);
	    csc_row = new Array(n);
	    sz = scoreSize(n, m);
	    miss_budget = Math.ceil(miss_coeff * n) + 5;
	    miss_left = miss_budget;
	    j = -1;
	    while (++j < n) {
	      score_row[j] = 0;
	      csc_row[j] = 0;
	    }
	    i = subject_lw.indexOf(query_lw[0]);
	    if (i > -1) {
	      i--;
	    }
	    mm = subject_lw.lastIndexOf(query_lw[n - 1], m);
	    if (mm > i) {
	      m = mm + 1;
	    }
	    csc_invalid = true;
	    while (++i < m) {
	      si_lw = subject_lw[i];
	      if (preparedQuery.charCodes[si_lw.charCodeAt(0)] == null) {
	        if (csc_invalid !== true) {
	          j = -1;
	          while (++j < n) {
	            csc_row[j] = 0;
	          }
	          csc_invalid = true;
	        }
	        continue;
	      }
	      score = 0;
	      score_diag = 0;
	      csc_diag = 0;
	      record_miss = true;
	      csc_invalid = false;
	      j = -1;
	      while (++j < n) {
	        score_up = score_row[j];
	        if (score_up > score) {
	          score = score_up;
	        }
	        csc_score = 0;
	        if (query_lw[j] === si_lw) {
	          start = isWordStart(i, subject, subject_lw);
	          csc_score = csc_diag > 0 ? csc_diag : scoreConsecutives(subject, subject_lw, query, query_lw, i, j, start);
	          align = score_diag + scoreCharacter(i, j, start, acro_score, csc_score);
	          if (align > score) {
	            score = align;
	            miss_left = miss_budget;
	          } else {
	            if (record_miss && --miss_left <= 0) {
	              return score_row[n - 1] * sz;
	            }
	            record_miss = false;
	          }
	        }
	        score_diag = score_up;
	        csc_diag = csc_row[j];
	        csc_row[j] = csc_score;
	        score_row[j] = score;
	      }
	    }
	    score = score_row[n - 1];
	    return score * sz;
	  };
	
	  exports.isWordStart = isWordStart = function(pos, subject, subject_lw) {
	    var curr_s, prev_s;
	    if (pos === 0) {
	      return true;
	    }
	    curr_s = subject[pos];
	    prev_s = subject[pos - 1];
	    return isSeparator(prev_s) || (curr_s !== subject_lw[pos] && prev_s === subject_lw[pos - 1]);
	  };
	
	  exports.isWordEnd = isWordEnd = function(pos, subject, subject_lw, len) {
	    var curr_s, next_s;
	    if (pos === len - 1) {
	      return true;
	    }
	    curr_s = subject[pos];
	    next_s = subject[pos + 1];
	    return isSeparator(next_s) || (curr_s === subject_lw[pos] && next_s !== subject_lw[pos + 1]);
	  };
	
	  isSeparator = function(c) {
	    return c === ' ' || c === '.' || c === '-' || c === '_' || c === '/' || c === '\\';
	  };
	
	  scorePosition = function(pos) {
	    var sc;
	    if (pos < pos_bonus) {
	      sc = pos_bonus - pos;
	      return 100 + sc * sc;
	    } else {
	      return Math.max(100 + pos_bonus - pos, 0);
	    }
	  };
	
	  exports.scoreSize = scoreSize = function(n, m) {
	    return tau_size / (tau_size + Math.abs(m - n));
	  };
	
	  scoreExact = function(n, m, quality, pos) {
	    return 2 * n * (wm * quality + scorePosition(pos)) * scoreSize(n, m);
	  };
	
	  exports.scorePattern = scorePattern = function(count, len, sameCase, start, end) {
	    var bonus, sz;
	    sz = count;
	    bonus = 6;
	    if (sameCase === count) {
	      bonus += 2;
	    }
	    if (start) {
	      bonus += 3;
	    }
	    if (end) {
	      bonus += 1;
	    }
	    if (count === len) {
	      if (start) {
	        if (sameCase === len) {
	          sz += 2;
	        } else {
	          sz += 1;
	        }
	      }
	      if (end) {
	        bonus += 1;
	      }
	    }
	    return sameCase + sz * (sz + bonus);
	  };
	
	  exports.scoreCharacter = scoreCharacter = function(i, j, start, acro_score, csc_score) {
	    var posBonus;
	    posBonus = scorePosition(i);
	    if (start) {
	      return posBonus + wm * ((acro_score > csc_score ? acro_score : csc_score) + 10);
	    }
	    return posBonus + wm * csc_score;
	  };
	
	  exports.scoreConsecutives = scoreConsecutives = function(subject, subject_lw, query, query_lw, i, j, startOfWord) {
	    var k, m, mi, n, nj, sameCase, sz;
	    m = subject.length;
	    n = query.length;
	    mi = m - i;
	    nj = n - j;
	    k = mi < nj ? mi : nj;
	    sameCase = 0;
	    sz = 0;
	    if (query[j] === subject[i]) {
	      sameCase++;
	    }
	    while (++sz < k && query_lw[++j] === subject_lw[++i]) {
	      if (query[j] === subject[i]) {
	        sameCase++;
	      }
	    }
	    if (sz === 1) {
	      return 1 + 2 * sameCase;
	    }
	    return scorePattern(sz, n, sameCase, startOfWord, isWordEnd(i, subject, subject_lw, m));
	  };
	
	  exports.scoreExactMatch = scoreExactMatch = function(subject, subject_lw, query, query_lw, pos, n, m) {
	    var end, i, pos2, sameCase, start;
	    start = isWordStart(pos, subject, subject_lw);
	    if (!start) {
	      pos2 = subject_lw.indexOf(query_lw, pos + 1);
	      if (pos2 > -1) {
	        start = isWordStart(pos2, subject, subject_lw);
	        if (start) {
	          pos = pos2;
	        }
	      }
	    }
	    i = -1;
	    sameCase = 0;
	    while (++i < n) {
	      if (query[pos + i] === subject[i]) {
	        sameCase++;
	      }
	    }
	    end = isWordEnd(pos + n - 1, subject, subject_lw, m);
	    return scoreExact(n, m, scorePattern(n, n, sameCase, start, end), pos);
	  };
	
	  AcronymResult = (function() {
	    function AcronymResult(score, pos, count) {
	      this.score = score;
	      this.pos = pos;
	      this.count = count;
	    }
	
	    return AcronymResult;
	
	  })();
	
	  emptyAcronymResult = new AcronymResult(0, 0.1, 0);
	
	  exports.scoreAcronyms = scoreAcronyms = function(subject, subject_lw, query, query_lw) {
	    var count, fullWord, i, j, m, n, qj_lw, sameCase, score, sepCount, sumPos;
	    m = subject.length;
	    n = query.length;
	    if (!(m > 1 && n > 1)) {
	      return emptyAcronymResult;
	    }
	    count = 0;
	    sepCount = 0;
	    sumPos = 0;
	    sameCase = 0;
	    i = -1;
	    j = -1;
	    while (++j < n) {
	      qj_lw = query_lw[j];
	      if (isSeparator(qj_lw)) {
	        i = subject_lw.indexOf(qj_lw, i + 1);
	        if (i > -1) {
	          sepCount++;
	          continue;
	        } else {
	          break;
	        }
	      }
	      while (++i < m) {
	        if (qj_lw === subject_lw[i] && isWordStart(i, subject, subject_lw)) {
	          if (query[j] === subject[i]) {
	            sameCase++;
	          }
	          sumPos += i;
	          count++;
	          break;
	        }
	      }
	      if (i === m) {
	        break;
	      }
	    }
	    if (count < 2) {
	      return emptyAcronymResult;
	    }
	    fullWord = count === n ? isAcronymFullWord(subject, subject_lw, query, count) : false;
	    score = scorePattern(count, n, sameCase, true, fullWord);
	    return new AcronymResult(score, sumPos / count, count + sepCount);
	  };
	
	  isAcronymFullWord = function(subject, subject_lw, query, nbAcronymInQuery) {
	    var count, i, m, n;
	    m = subject.length;
	    n = query.length;
	    count = 0;
	    if (m > 12 * n) {
	      return false;
	    }
	    i = -1;
	    while (++i < m) {
	      if (isWordStart(i, subject, subject_lw) && ++count > nbAcronymInQuery) {
	        return false;
	      }
	    }
	    return true;
	  };
	
	}).call(this);


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var computeScore, countDir, file_coeff, getExtension, getExtensionScore, isMatch, scorePath, scoreSize, tau_depth, _ref;
	
	  _ref = __webpack_require__(11), isMatch = _ref.isMatch, computeScore = _ref.computeScore, scoreSize = _ref.scoreSize;
	
	  tau_depth = 13;
	
	  file_coeff = 1.2;
	
	  exports.score = function(string, query, options) {
	    var allowErrors, preparedQuery, score, string_lw;
	    preparedQuery = options.preparedQuery, allowErrors = options.allowErrors;
	    if (!(allowErrors || isMatch(string, preparedQuery.core_lw, preparedQuery.core_up))) {
	      return 0;
	    }
	    string_lw = string.toLowerCase();
	    score = computeScore(string, string_lw, preparedQuery);
	    score = scorePath(string, string_lw, score, options);
	    return Math.ceil(score);
	  };
	
	  scorePath = function(subject, subject_lw, fullPathScore, options) {
	    var alpha, basePathScore, basePos, depth, end, extAdjust, fileLength, pathSeparator, preparedQuery, useExtensionBonus;
	    if (fullPathScore === 0) {
	      return 0;
	    }
	    preparedQuery = options.preparedQuery, useExtensionBonus = options.useExtensionBonus, pathSeparator = options.pathSeparator;
	    end = subject.length - 1;
	    while (subject[end] === pathSeparator) {
	      end--;
	    }
	    basePos = subject.lastIndexOf(pathSeparator, end);
	    fileLength = end - basePos;
	    extAdjust = 1.0;
	    if (useExtensionBonus) {
	      extAdjust += getExtensionScore(subject_lw, preparedQuery.ext, basePos, end, 2);
	      fullPathScore *= extAdjust;
	    }
	    if (basePos === -1) {
	      return fullPathScore;
	    }
	    depth = preparedQuery.depth;
	    while (basePos > -1 && depth-- > 0) {
	      basePos = subject.lastIndexOf(pathSeparator, basePos - 1);
	    }
	    basePathScore = basePos === -1 ? fullPathScore : extAdjust * computeScore(subject.slice(basePos + 1, end + 1), subject_lw.slice(basePos + 1, end + 1), preparedQuery);
	    alpha = 0.5 * tau_depth / (tau_depth + countDir(subject, end + 1, pathSeparator));
	    return alpha * basePathScore + (1 - alpha) * fullPathScore * scoreSize(0, file_coeff * fileLength);
	  };
	
	  exports.countDir = countDir = function(path, end, pathSeparator) {
	    var count, i;
	    if (end < 1) {
	      return 0;
	    }
	    count = 0;
	    i = -1;
	    while (++i < end && path[i] === pathSeparator) {
	      continue;
	    }
	    while (++i < end) {
	      if (path[i] === pathSeparator) {
	        count++;
	        while (++i < end && path[i] === pathSeparator) {
	          continue;
	        }
	      }
	    }
	    return count;
	  };
	
	  exports.getExtension = getExtension = function(str) {
	    var pos;
	    pos = str.lastIndexOf(".");
	    if (pos < 0) {
	      return "";
	    } else {
	      return str.substr(pos + 1);
	    }
	  };
	
	  getExtensionScore = function(candidate, ext, startPos, endPos, maxDepth) {
	    var m, matched, n, pos;
	    if (!ext.length) {
	      return 0;
	    }
	    pos = candidate.lastIndexOf(".", endPos);
	    if (!(pos > startPos)) {
	      return 0;
	    }
	    n = ext.length;
	    m = endPos - pos;
	    if (m < n) {
	      n = m;
	      m = ext.length;
	    }
	    pos++;
	    matched = -1;
	    while (++matched < n) {
	      if (candidate[pos + matched] !== ext[matched]) {
	        break;
	      }
	    }
	    if (matched === 0 && maxDepth > 0) {
	      return 0.9 * getExtensionScore(candidate, ext, startPos, pos - 2, maxDepth - 1);
	    }
	    return matched / m;
	  };
	
	}).call(this);


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var Query, coreChars, countDir, getCharCodes, getExtension, opt_char_re, truncatedUpperCase, _ref;
	
	  _ref = __webpack_require__(12), countDir = _ref.countDir, getExtension = _ref.getExtension;
	
	  module.exports = Query = (function() {
	    function Query(query, _arg) {
	      var optCharRegEx, pathSeparator, _ref1;
	      _ref1 = _arg != null ? _arg : {}, optCharRegEx = _ref1.optCharRegEx, pathSeparator = _ref1.pathSeparator;
	      if (!(query && query.length)) {
	        return null;
	      }
	      this.query = query;
	      this.query_lw = query.toLowerCase();
	      this.core = coreChars(query, optCharRegEx);
	      this.core_lw = this.core.toLowerCase();
	      this.core_up = truncatedUpperCase(this.core);
	      this.depth = countDir(query, query.length, pathSeparator);
	      this.ext = getExtension(this.query_lw);
	      this.charCodes = getCharCodes(this.query_lw);
	    }
	
	    return Query;
	
	  })();
	
	  opt_char_re = /[ _\-:\/\\]/g;
	
	  coreChars = function(query, optCharRegEx) {
	    if (optCharRegEx == null) {
	      optCharRegEx = opt_char_re;
	    }
	    return query.replace(optCharRegEx, '');
	  };
	
	  truncatedUpperCase = function(str) {
	    var char, upper, _i, _len;
	    upper = "";
	    for (_i = 0, _len = str.length; _i < _len; _i++) {
	      char = str[_i];
	      upper += char.toUpperCase()[0];
	    }
	    return upper;
	  };
	
	  getCharCodes = function(str) {
	    var charCodes, i, len;
	    len = str.length;
	    i = -1;
	    charCodes = [];
	    while (++i < len) {
	      charCodes[str.charCodeAt(i)] = true;
	    }
	    return charCodes;
	  };
	
	}).call(this);


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var basenameMatch, computeMatch, isMatch, isWordStart, match, mergeMatches, scoreAcronyms, scoreCharacter, scoreConsecutives, _ref;
	
	  _ref = __webpack_require__(11), isMatch = _ref.isMatch, isWordStart = _ref.isWordStart, scoreConsecutives = _ref.scoreConsecutives, scoreCharacter = _ref.scoreCharacter, scoreAcronyms = _ref.scoreAcronyms;
	
	  exports.match = match = function(string, query, options) {
	    var allowErrors, baseMatches, matches, pathSeparator, preparedQuery, string_lw;
	    allowErrors = options.allowErrors, preparedQuery = options.preparedQuery, pathSeparator = options.pathSeparator;
	    if (!(allowErrors || isMatch(string, preparedQuery.core_lw, preparedQuery.core_up))) {
	      return [];
	    }
	    string_lw = string.toLowerCase();
	    matches = computeMatch(string, string_lw, preparedQuery);
	    if (matches.length === 0) {
	      return matches;
	    }
	    if (string.indexOf(pathSeparator) > -1) {
	      baseMatches = basenameMatch(string, string_lw, preparedQuery, pathSeparator);
	      matches = mergeMatches(matches, baseMatches);
	    }
	    return matches;
	  };
	
	  exports.wrap = function(string, query, options) {
	    var matchIndex, matchPos, matchPositions, output, strPos, tagClass, tagClose, tagOpen, _ref1;
	    if ((options.wrap != null)) {
	      _ref1 = options.wrap, tagClass = _ref1.tagClass, tagOpen = _ref1.tagOpen, tagClose = _ref1.tagClose;
	    }
	    if (tagClass == null) {
	      tagClass = 'highlight';
	    }
	    if (tagOpen == null) {
	      tagOpen = '<strong class="' + tagClass + '">';
	    }
	    if (tagClose == null) {
	      tagClose = '</strong>';
	    }
	    if (string === query) {
	      return tagOpen + string + tagClose;
	    }
	    matchPositions = match(string, query, options);
	    if (matchPositions.length === 0) {
	      return string;
	    }
	    output = '';
	    matchIndex = -1;
	    strPos = 0;
	    while (++matchIndex < matchPositions.length) {
	      matchPos = matchPositions[matchIndex];
	      if (matchPos > strPos) {
	        output += string.substring(strPos, matchPos);
	        strPos = matchPos;
	      }
	      while (++matchIndex < matchPositions.length) {
	        if (matchPositions[matchIndex] === matchPos + 1) {
	          matchPos++;
	        } else {
	          matchIndex--;
	          break;
	        }
	      }
	      matchPos++;
	      if (matchPos > strPos) {
	        output += tagOpen;
	        output += string.substring(strPos, matchPos);
	        output += tagClose;
	        strPos = matchPos;
	      }
	    }
	    if (strPos < string.length - 1) {
	      output += string.substring(strPos);
	    }
	    return output;
	  };
	
	  basenameMatch = function(subject, subject_lw, preparedQuery, pathSeparator) {
	    var basePos, depth, end;
	    end = subject.length - 1;
	    while (subject[end] === pathSeparator) {
	      end--;
	    }
	    basePos = subject.lastIndexOf(pathSeparator, end);
	    if (basePos === -1) {
	      return [];
	    }
	    depth = preparedQuery.depth;
	    while (depth-- > 0) {
	      basePos = subject.lastIndexOf(pathSeparator, basePos - 1);
	      if (basePos === -1) {
	        return [];
	      }
	    }
	    basePos++;
	    end++;
	    return computeMatch(subject.slice(basePos, end), subject_lw.slice(basePos, end), preparedQuery, basePos);
	  };
	
	  mergeMatches = function(a, b) {
	    var ai, bj, i, j, m, n, out;
	    m = a.length;
	    n = b.length;
	    if (n === 0) {
	      return a.slice();
	    }
	    if (m === 0) {
	      return b.slice();
	    }
	    i = -1;
	    j = 0;
	    bj = b[j];
	    out = [];
	    while (++i < m) {
	      ai = a[i];
	      while (bj <= ai && ++j < n) {
	        if (bj < ai) {
	          out.push(bj);
	        }
	        bj = b[j];
	      }
	      out.push(ai);
	    }
	    while (j < n) {
	      out.push(b[j++]);
	    }
	    return out;
	  };
	
	  computeMatch = function(subject, subject_lw, preparedQuery, offset) {
	    var DIAGONAL, LEFT, STOP, UP, acro_score, align, backtrack, csc_diag, csc_row, csc_score, i, j, m, matches, move, n, pos, query, query_lw, score, score_diag, score_row, score_up, si_lw, start, trace;
	    if (offset == null) {
	      offset = 0;
	    }
	    query = preparedQuery.query;
	    query_lw = preparedQuery.query_lw;
	    m = subject.length;
	    n = query.length;
	    acro_score = scoreAcronyms(subject, subject_lw, query, query_lw).score;
	    score_row = new Array(n);
	    csc_row = new Array(n);
	    STOP = 0;
	    UP = 1;
	    LEFT = 2;
	    DIAGONAL = 3;
	    trace = new Array(m * n);
	    pos = -1;
	    j = -1;
	    while (++j < n) {
	      score_row[j] = 0;
	      csc_row[j] = 0;
	    }
	    i = -1;
	    while (++i < m) {
	      score = 0;
	      score_up = 0;
	      csc_diag = 0;
	      si_lw = subject_lw[i];
	      j = -1;
	      while (++j < n) {
	        csc_score = 0;
	        align = 0;
	        score_diag = score_up;
	        if (query_lw[j] === si_lw) {
	          start = isWordStart(i, subject, subject_lw);
	          csc_score = csc_diag > 0 ? csc_diag : scoreConsecutives(subject, subject_lw, query, query_lw, i, j, start);
	          align = score_diag + scoreCharacter(i, j, start, acro_score, csc_score);
	        }
	        score_up = score_row[j];
	        csc_diag = csc_row[j];
	        if (score > score_up) {
	          move = LEFT;
	        } else {
	          score = score_up;
	          move = UP;
	        }
	        if (align > score) {
	          score = align;
	          move = DIAGONAL;
	        } else {
	          csc_score = 0;
	        }
	        score_row[j] = score;
	        csc_row[j] = csc_score;
	        trace[++pos] = score > 0 ? move : STOP;
	      }
	    }
	    i = m - 1;
	    j = n - 1;
	    pos = i * n + j;
	    backtrack = true;
	    matches = [];
	    while (backtrack && i >= 0 && j >= 0) {
	      switch (trace[pos]) {
	        case UP:
	          i--;
	          pos -= n;
	          break;
	        case LEFT:
	          j--;
	          pos--;
	          break;
	        case DIAGONAL:
	          matches.push(i + offset);
	          j--;
	          i--;
	          pos -= n + 1;
	          break;
	        default:
	          backtrack = false;
	      }
	    }
	    matches.reverse();
	    return matches;
	  };
	
	}).call(this);


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(16);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// this will inject Zepto in window, unfortunately no easy commonJS zepto build
	var zepto = __webpack_require__(17);
	
	// setup DOM element
	var DOM = __webpack_require__(18);
	DOM.element = zepto;
	
	// setup utils functions
	var _ = __webpack_require__(19);
	_.isArray = zepto.isArray;
	_.isFunction = zepto.isFunction;
	_.isObject = zepto.isPlainObject;
	_.bind = zepto.proxy;
	_.each = function(collection, cb) {
	  // stupid argument order for jQuery.each
	  zepto.each(collection, reverseArgs);
	  function reverseArgs(index, value) {
	    return cb(value, index);
	  }
	};
	_.map = zepto.map;
	_.mixin = zepto.extend;
	_.Event = zepto.Event;
	
	var typeaheadKey = 'aaAutocomplete';
	var Typeahead = __webpack_require__(20);
	var EventBus = __webpack_require__(21);
	
	function autocomplete(selector, options, datasets, typeaheadObject) {
	  datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 2);
	
	  var inputs = zepto(selector).each(function(i, input) {
	    var $input = zepto(input);
	    var eventBus = new EventBus({el: $input});
	    var typeahead = typeaheadObject || new Typeahead({
	      input: $input,
	      eventBus: eventBus,
	      dropdownMenuContainer: options.dropdownMenuContainer,
	      hint: options.hint === undefined ? true : !!options.hint,
	      minLength: options.minLength,
	      autoselect: options.autoselect,
	      autoselectOnBlur: options.autoselectOnBlur,
	      openOnFocus: options.openOnFocus,
	      templates: options.templates,
	      debug: options.debug,
	      cssClasses: options.cssClasses,
	      datasets: datasets,
	      keyboardShortcuts: options.keyboardShortcuts,
	      appendTo: options.appendTo,
	      autoWidth: options.autoWidth
	    });
	    $input.data(typeaheadKey, typeahead);
	  });
	
	  // expose all methods in the `autocomplete` attribute
	  inputs.autocomplete = {};
	  _.each(['open', 'close', 'getVal', 'setVal', 'destroy', 'getWrapper'], function(method) {
	    inputs.autocomplete[method] = function() {
	      var methodArguments = arguments;
	      var result;
	      inputs.each(function(j, input) {
	        var typeahead = zepto(input).data(typeaheadKey);
	        result = typeahead[method].apply(typeahead, methodArguments);
	      });
	      return result;
	    };
	  });
	
	  return inputs;
	}
	
	autocomplete.sources = Typeahead.sources;
	autocomplete.escapeHighlightedString = _.escapeHighlightedString;
	
	var wasAutocompleteSet = 'autocomplete' in window;
	var oldAutocomplete = window.autocomplete;
	autocomplete.noConflict = function noConflict() {
	  if (wasAutocompleteSet) {
	    window.autocomplete = oldAutocomplete;
	  } else {
	    delete window.autocomplete;
	  }
	  return autocomplete;
	};
	
	module.exports = autocomplete;


/***/ },
/* 17 */
/***/ function(module, exports) {

	/* istanbul ignore next */
	/* Zepto v1.2.0 - zepto event assets data - zeptojs.com/license */
	(function(global, factory) {
	  module.exports = factory(global);
	}(/* this ##### UPDATED: here we want to use window/global instead of this which is the current file context ##### */ window, function(window) {  
	  var Zepto = (function() {
	  var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
	    document = window.document,
	    elementDisplay = {}, classCache = {},
	    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
	    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	    rootNodeRE = /^(?:body|html)$/i,
	    capitalRE = /([A-Z])/g,
	
	    // special attributes that should be get/set via method calls
	    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
	
	    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	    table = document.createElement('table'),
	    tableRow = document.createElement('tr'),
	    containers = {
	      'tr': document.createElement('tbody'),
	      'tbody': table, 'thead': table, 'tfoot': table,
	      'td': tableRow, 'th': tableRow,
	      '*': document.createElement('div')
	    },
	    readyRE = /complete|loaded|interactive/,
	    simpleSelectorRE = /^[\w-]*$/,
	    class2type = {},
	    toString = class2type.toString,
	    zepto = {},
	    camelize, uniq,
	    tempParent = document.createElement('div'),
	    propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    },
	    isArray = Array.isArray ||
	      function(object){ return object instanceof Array }
	
	  zepto.matches = function(element, selector) {
	    if (!selector || !element || element.nodeType !== 1) return false
	    var matchesSelector = element.matches || element.webkitMatchesSelector ||
	                          element.mozMatchesSelector || element.oMatchesSelector ||
	                          element.matchesSelector
	    if (matchesSelector) return matchesSelector.call(element, selector)
	    // fall back to performing a selector:
	    var match, parent = element.parentNode, temp = !parent
	    if (temp) (parent = tempParent).appendChild(element)
	    match = ~zepto.qsa(parent, selector).indexOf(element)
	    temp && tempParent.removeChild(element)
	    return match
	  }
	
	  function type(obj) {
	    return obj == null ? String(obj) :
	      class2type[toString.call(obj)] || "object"
	  }
	
	  function isFunction(value) { return type(value) == "function" }
	  function isWindow(obj)     { return obj != null && obj == obj.window }
	  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	  function isObject(obj)     { return type(obj) == "object" }
	  function isPlainObject(obj) {
	    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	  }
	
	  function likeArray(obj) {
	    var length = !!obj && 'length' in obj && obj.length,
	      type = $.type(obj)
	
	    return 'function' != type && !isWindow(obj) && (
	      'array' == type || length === 0 ||
	        (typeof length == 'number' && length > 0 && (length - 1) in obj)
	    )
	  }
	
	  function compact(array) { return filter.call(array, function(item){ return item != null }) }
	  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	  function dasherize(str) {
	    return str.replace(/::/g, '/')
	           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	           .replace(/_/g, '-')
	           .toLowerCase()
	  }
	  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }
	
	  function classRE(name) {
	    return name in classCache ?
	      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	  }
	
	  function maybeAddPx(name, value) {
	    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	  }
	
	  function defaultDisplay(nodeName) {
	    var element, display
	    if (!elementDisplay[nodeName]) {
	      element = document.createElement(nodeName)
	      document.body.appendChild(element)
	      display = getComputedStyle(element, '').getPropertyValue("display")
	      element.parentNode.removeChild(element)
	      display == "none" && (display = "block")
	      elementDisplay[nodeName] = display
	    }
	    return elementDisplay[nodeName]
	  }
	
	  function children(element) {
	    return 'children' in element ?
	      slice.call(element.children) :
	      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
	  }
	
	  function Z(dom, selector) {
	    var i, len = dom ? dom.length : 0
	    for (i = 0; i < len; i++) this[i] = dom[i]
	    this.length = len
	    this.selector = selector || ''
	  }
	
	  // `$.zepto.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overridden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  zepto.fragment = function(html, name, properties) {
	    var dom, nodes, container
	
	    // A special case optimization for a single tag
	    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))
	
	    if (!dom) {
	      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
	      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	      if (!(name in containers)) name = '*'
	
	      container = containers[name]
	      container.innerHTML = '' + html
	      dom = $.each(slice.call(container.childNodes), function(){
	        container.removeChild(this)
	      })
	    }
	
	    if (isPlainObject(properties)) {
	      nodes = $(dom)
	      $.each(properties, function(key, value) {
	        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
	        else nodes.attr(key, value)
	      })
	    }
	
	    return dom
	  }
	
	  // `$.zepto.Z` swaps out the prototype of the given `dom` array
	  // of nodes with `$.fn` and thus supplying all the Zepto functions
	  // to the array. This method can be overridden in plugins.
	  zepto.Z = function(dom, selector) {
	    return new Z(dom, selector)
	  }
	
	  // `$.zepto.isZ` should return `true` if the given object is a Zepto
	  // collection. This method can be overridden in plugins.
	  zepto.isZ = function(object) {
	    return object instanceof zepto.Z
	  }
	
	  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	  // takes a CSS selector and an optional context (and handles various
	  // special cases).
	  // This method can be overridden in plugins.
	  zepto.init = function(selector, context) {
	    var dom
	    // If nothing given, return an empty Zepto collection
	    if (!selector) return zepto.Z()
	    // Optimize for string selectors
	    else if (typeof selector == 'string') {
	      selector = selector.trim()
	      // If it's a html fragment, create nodes from it
	      // Note: In both Chrome 21 and Firefox 15, DOM error 12
	      // is thrown if the fragment doesn't begin with <
	      if (selector[0] == '<' && fragmentRE.test(selector))
	        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // If it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // If a function is given, call it when the DOM is ready
	    else if (isFunction(selector)) return $(document).ready(selector)
	    // If a Zepto collection is given, just return it
	    else if (zepto.isZ(selector)) return selector
	    else {
	      // normalize array if an array of nodes is given
	      if (isArray(selector)) dom = compact(selector)
	      // Wrap DOM nodes.
	      else if (isObject(selector))
	        dom = [selector], selector = null
	      // If it's a html fragment, create nodes from it
	      else if (fragmentRE.test(selector))
	        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // And last but no least, if it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // create a new Zepto collection from the nodes found
	    return zepto.Z(dom, selector)
	  }
	
	  // `$` will be the base `Zepto` object. When calling this
	  // function just call `$.zepto.init, which makes the implementation
	  // details of selecting nodes and creating Zepto collections
	  // patchable in plugins.
	  $ = function(selector, context){
	    return zepto.init(selector, context)
	  }
	
	  function extend(target, source, deep) {
	    for (key in source)
	      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
	          target[key] = {}
	        if (isArray(source[key]) && !isArray(target[key]))
	          target[key] = []
	        extend(target[key], source[key], deep)
	      }
	      else if (source[key] !== undefined) target[key] = source[key]
	  }
	
	  // Copy all but undefined properties from one or more
	  // objects to the `target` object.
	  $.extend = function(target){
	    var deep, args = slice.call(arguments, 1)
	    if (typeof target == 'boolean') {
	      deep = target
	      target = args.shift()
	    }
	    args.forEach(function(arg){ extend(target, arg, deep) })
	    return target
	  }
	
	  // `$.zepto.qsa` is Zepto's CSS selector implementation which
	  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	  // This method can be overridden in plugins.
	  zepto.qsa = function(element, selector){
	    var found,
	        maybeID = selector[0] == '#',
	        maybeClass = !maybeID && selector[0] == '.',
	        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
	        isSimple = simpleSelectorRE.test(nameOnly)
	    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
	      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
	      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
	      slice.call(
	        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
	          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	          element.getElementsByTagName(selector) : // Or a tag
	          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	      )
	  }
	
	  function filtered(nodes, selector) {
	    return selector == null ? $(nodes) : $(nodes).filter(selector)
	  }
	
	  $.contains = document.documentElement.contains ?
	    function(parent, node) {
	      return parent !== node && parent.contains(node)
	    } :
	    function(parent, node) {
	      while (node && (node = node.parentNode))
	        if (node === parent) return true
	      return false
	    }
	
	  function funcArg(context, arg, idx, payload) {
	    return isFunction(arg) ? arg.call(context, idx, payload) : arg
	  }
	
	  function setAttribute(node, name, value) {
	    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
	  }
	
	  // access className property while respecting SVGAnimatedString
	  function className(node, value){
	    var klass = node.className || '',
	        svg   = klass && klass.baseVal !== undefined
	
	    if (value === undefined) return svg ? klass.baseVal : klass
	    svg ? (klass.baseVal = value) : (node.className = value)
	  }
	
	  // "true"  => true
	  // "false" => false
	  // "null"  => null
	  // "42"    => 42
	  // "42.5"  => 42.5
	  // "08"    => "08"
	  // JSON    => parse if valid
	  // String  => self
	  function deserializeValue(value) {
	    try {
	      return value ?
	        value == "true" ||
	        ( value == "false" ? false :
	          value == "null" ? null :
	          +value + "" == value ? +value :
	          /^[\[\{]/.test(value) ? $.parseJSON(value) :
	          value )
	        : value
	    } catch(e) {
	      return value
	    }
	  }
	
	  $.type = type
	  $.isFunction = isFunction
	  $.isWindow = isWindow
	  $.isArray = isArray
	  $.isPlainObject = isPlainObject
	
	  $.isEmptyObject = function(obj) {
	    var name
	    for (name in obj) return false
	    return true
	  }
	
	  $.isNumeric = function(val) {
	    var num = Number(val), type = typeof val
	    return val != null && type != 'boolean' &&
	      (type != 'string' || val.length) &&
	      !isNaN(num) && isFinite(num) || false
	  }
	
	  $.inArray = function(elem, array, i){
	    return emptyArray.indexOf.call(array, elem, i)
	  }
	
	  $.camelCase = camelize
	  $.trim = function(str) {
	    return str == null ? "" : String.prototype.trim.call(str)
	  }
	
	  // plugin compatibility
	  $.uuid = 0
	  $.support = { }
	  $.expr = { }
	  $.noop = function() {}
	
	  $.map = function(elements, callback){
	    var value, values = [], i, key
	    if (likeArray(elements))
	      for (i = 0; i < elements.length; i++) {
	        value = callback(elements[i], i)
	        if (value != null) values.push(value)
	      }
	    else
	      for (key in elements) {
	        value = callback(elements[key], key)
	        if (value != null) values.push(value)
	      }
	    return flatten(values)
	  }
	
	  $.each = function(elements, callback){
	    var i, key
	    if (likeArray(elements)) {
	      for (i = 0; i < elements.length; i++)
	        if (callback.call(elements[i], i, elements[i]) === false) return elements
	    } else {
	      for (key in elements)
	        if (callback.call(elements[key], key, elements[key]) === false) return elements
	    }
	
	    return elements
	  }
	
	  $.grep = function(elements, callback){
	    return filter.call(elements, callback)
	  }
	
	  if (window.JSON) $.parseJSON = JSON.parse
	
	  // Populate the class2type map
	  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	    class2type[ "[object " + name + "]" ] = name.toLowerCase()
	  })
	
	  // Define methods that will be available on all
	  // Zepto collections
	  $.fn = {
	    constructor: zepto.Z,
	    length: 0,
	
	    // Because a collection acts like an array
	    // copy over these useful array functions.
	    forEach: emptyArray.forEach,
	    reduce: emptyArray.reduce,
	    push: emptyArray.push,
	    sort: emptyArray.sort,
	    splice: emptyArray.splice,
	    indexOf: emptyArray.indexOf,
	    concat: function(){
	      var i, value, args = []
	      for (i = 0; i < arguments.length; i++) {
	        value = arguments[i]
	        args[i] = zepto.isZ(value) ? value.toArray() : value
	      }
	      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
	    },
	
	    // `map` and `slice` in the jQuery API work differently
	    // from their array counterparts
	    map: function(fn){
	      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
	    },
	    slice: function(){
	      return $(slice.apply(this, arguments))
	    },
	
	    ready: function(callback){
	      // need to check if document.body exists for IE as that browser reports
	      // document ready when it hasn't yet created the body element
	      if (readyRE.test(document.readyState) && document.body) callback($)
	      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	      return this
	    },
	    get: function(idx){
	      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
	    },
	    toArray: function(){ return this.get() },
	    size: function(){
	      return this.length
	    },
	    remove: function(){
	      return this.each(function(){
	        if (this.parentNode != null)
	          this.parentNode.removeChild(this)
	      })
	    },
	    each: function(callback){
	      emptyArray.every.call(this, function(el, idx){
	        return callback.call(el, idx, el) !== false
	      })
	      return this
	    },
	    filter: function(selector){
	      if (isFunction(selector)) return this.not(this.not(selector))
	      return $(filter.call(this, function(element){
	        return zepto.matches(element, selector)
	      }))
	    },
	    add: function(selector,context){
	      return $(uniq(this.concat($(selector,context))))
	    },
	    is: function(selector){
	      return this.length > 0 && zepto.matches(this[0], selector)
	    },
	    not: function(selector){
	      var nodes=[]
	      if (isFunction(selector) && selector.call !== undefined)
	        this.each(function(idx){
	          if (!selector.call(this,idx)) nodes.push(this)
	        })
	      else {
	        var excludes = typeof selector == 'string' ? this.filter(selector) :
	          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
	        this.forEach(function(el){
	          if (excludes.indexOf(el) < 0) nodes.push(el)
	        })
	      }
	      return $(nodes)
	    },
	    has: function(selector){
	      return this.filter(function(){
	        return isObject(selector) ?
	          $.contains(this, selector) :
	          $(this).find(selector).size()
	      })
	    },
	    eq: function(idx){
	      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
	    },
	    first: function(){
	      var el = this[0]
	      return el && !isObject(el) ? el : $(el)
	    },
	    last: function(){
	      var el = this[this.length - 1]
	      return el && !isObject(el) ? el : $(el)
	    },
	    find: function(selector){
	      var result, $this = this
	      if (!selector) result = $()
	      else if (typeof selector == 'object')
	        result = $(selector).filter(function(){
	          var node = this
	          return emptyArray.some.call($this, function(parent){
	            return $.contains(parent, node)
	          })
	        })
	      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
	      else result = this.map(function(){ return zepto.qsa(this, selector) })
	      return result
	    },
	    closest: function(selector, context){
	      var nodes = [], collection = typeof selector == 'object' && $(selector)
	      this.each(function(_, node){
	        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
	          node = node !== context && !isDocument(node) && node.parentNode
	        if (node && nodes.indexOf(node) < 0) nodes.push(node)
	      })
	      return $(nodes)
	    },
	    parents: function(selector){
	      var ancestors = [], nodes = this
	      while (nodes.length > 0)
	        nodes = $.map(nodes, function(node){
	          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	            ancestors.push(node)
	            return node
	          }
	        })
	      return filtered(ancestors, selector)
	    },
	    parent: function(selector){
	      return filtered(uniq(this.pluck('parentNode')), selector)
	    },
	    children: function(selector){
	      return filtered(this.map(function(){ return children(this) }), selector)
	    },
	    contents: function() {
	      return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
	    },
	    siblings: function(selector){
	      return filtered(this.map(function(i, el){
	        return filter.call(children(el.parentNode), function(child){ return child!==el })
	      }), selector)
	    },
	    empty: function(){
	      return this.each(function(){ this.innerHTML = '' })
	    },
	    // `pluck` is borrowed from Prototype.js
	    pluck: function(property){
	      return $.map(this, function(el){ return el[property] })
	    },
	    show: function(){
	      return this.each(function(){
	        this.style.display == "none" && (this.style.display = '')
	        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	          this.style.display = defaultDisplay(this.nodeName)
	      })
	    },
	    replaceWith: function(newContent){
	      return this.before(newContent).remove()
	    },
	    wrap: function(structure){
	      var func = isFunction(structure)
	      if (this[0] && !func)
	        var dom   = $(structure).get(0),
	            clone = dom.parentNode || this.length > 1
	
	      return this.each(function(index){
	        $(this).wrapAll(
	          func ? structure.call(this, index) :
	            clone ? dom.cloneNode(true) : dom
	        )
	      })
	    },
	    wrapAll: function(structure){
	      if (this[0]) {
	        $(this[0]).before(structure = $(structure))
	        var children
	        // drill down to the inmost element
	        while ((children = structure.children()).length) structure = children.first()
	        $(structure).append(this)
	      }
	      return this
	    },
	    wrapInner: function(structure){
	      var func = isFunction(structure)
	      return this.each(function(index){
	        var self = $(this), contents = self.contents(),
	            dom  = func ? structure.call(this, index) : structure
	        contents.length ? contents.wrapAll(dom) : self.append(dom)
	      })
	    },
	    unwrap: function(){
	      this.parent().each(function(){
	        $(this).replaceWith($(this).children())
	      })
	      return this
	    },
	    clone: function(){
	      return this.map(function(){ return this.cloneNode(true) })
	    },
	    hide: function(){
	      return this.css("display", "none")
	    },
	    toggle: function(setting){
	      return this.each(function(){
	        var el = $(this)
	        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
	      })
	    },
	    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
	    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
	    html: function(html){
	      return 0 in arguments ?
	        this.each(function(idx){
	          var originHtml = this.innerHTML
	          $(this).empty().append( funcArg(this, html, idx, originHtml) )
	        }) :
	        (0 in this ? this[0].innerHTML : null)
	    },
	    text: function(text){
	      return 0 in arguments ?
	        this.each(function(idx){
	          var newText = funcArg(this, text, idx, this.textContent)
	          this.textContent = newText == null ? '' : ''+newText
	        }) :
	        (0 in this ? this.pluck('textContent').join("") : null)
	    },
	    attr: function(name, value){
	      var result
	      return (typeof name == 'string' && !(1 in arguments)) ?
	        (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
	        this.each(function(idx){
	          if (this.nodeType !== 1) return
	          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
	          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
	        })
	    },
	    removeAttr: function(name){
	      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
	        setAttribute(this, attribute)
	      }, this)})
	    },
	    prop: function(name, value){
	      name = propMap[name] || name
	      return (1 in arguments) ?
	        this.each(function(idx){
	          this[name] = funcArg(this, value, idx, this[name])
	        }) :
	        (this[0] && this[0][name])
	    },
	    removeProp: function(name){
	      name = propMap[name] || name
	      return this.each(function(){ delete this[name] })
	    },
	    data: function(name, value){
	      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()
	
	      var data = (1 in arguments) ?
	        this.attr(attrName, value) :
	        this.attr(attrName)
	
	      return data !== null ? deserializeValue(data) : undefined
	    },
	    val: function(value){
	      if (0 in arguments) {
	        if (value == null) value = ""
	        return this.each(function(idx){
	          this.value = funcArg(this, value, idx, this.value)
	        })
	      } else {
	        return this[0] && (this[0].multiple ?
	           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
	           this[0].value)
	      }
	    },
	    offset: function(coordinates){
	      if (coordinates) return this.each(function(index){
	        var $this = $(this),
	            coords = funcArg(this, coordinates, index, $this.offset()),
	            parentOffset = $this.offsetParent().offset(),
	            props = {
	              top:  coords.top  - parentOffset.top,
	              left: coords.left - parentOffset.left
	            }
	
	        if ($this.css('position') == 'static') props['position'] = 'relative'
	        $this.css(props)
	      })
	      if (!this.length) return null
	      if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
	        return {top: 0, left: 0}
	      var obj = this[0].getBoundingClientRect()
	      return {
	        left: obj.left + window.pageXOffset,
	        top: obj.top + window.pageYOffset,
	        width: Math.round(obj.width),
	        height: Math.round(obj.height)
	      }
	    },
	    css: function(property, value){
	      if (arguments.length < 2) {
	        var element = this[0]
	        if (typeof property == 'string') {
	          if (!element) return
	          return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
	        } else if (isArray(property)) {
	          if (!element) return
	          var props = {}
	          var computedStyle = getComputedStyle(element, '')
	          $.each(property, function(_, prop){
	            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
	          })
	          return props
	        }
	      }
	
	      var css = ''
	      if (type(property) == 'string') {
	        if (!value && value !== 0)
	          this.each(function(){ this.style.removeProperty(dasherize(property)) })
	        else
	          css = dasherize(property) + ":" + maybeAddPx(property, value)
	      } else {
	        for (key in property)
	          if (!property[key] && property[key] !== 0)
	            this.each(function(){ this.style.removeProperty(dasherize(key)) })
	          else
	            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
	      }
	
	      return this.each(function(){ this.style.cssText += ';' + css })
	    },
	    index: function(element){
	      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
	    },
	    hasClass: function(name){
	      if (!name) return false
	      return emptyArray.some.call(this, function(el){
	        return this.test(className(el))
	      }, classRE(name))
	    },
	    addClass: function(name){
	      if (!name) return this
	      return this.each(function(idx){
	        if (!('className' in this)) return
	        classList = []
	        var cls = className(this), newName = funcArg(this, name, idx, cls)
	        newName.split(/\s+/g).forEach(function(klass){
	          if (!$(this).hasClass(klass)) classList.push(klass)
	        }, this)
	        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
	      })
	    },
	    removeClass: function(name){
	      return this.each(function(idx){
	        if (!('className' in this)) return
	        if (name === undefined) return className(this, '')
	        classList = className(this)
	        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
	          classList = classList.replace(classRE(klass), " ")
	        })
	        className(this, classList.trim())
	      })
	    },
	    toggleClass: function(name, when){
	      if (!name) return this
	      return this.each(function(idx){
	        var $this = $(this), names = funcArg(this, name, idx, className(this))
	        names.split(/\s+/g).forEach(function(klass){
	          (when === undefined ? !$this.hasClass(klass) : when) ?
	            $this.addClass(klass) : $this.removeClass(klass)
	        })
	      })
	    },
	    scrollTop: function(value){
	      if (!this.length) return
	      var hasScrollTop = 'scrollTop' in this[0]
	      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
	      return this.each(hasScrollTop ?
	        function(){ this.scrollTop = value } :
	        function(){ this.scrollTo(this.scrollX, value) })
	    },
	    scrollLeft: function(value){
	      if (!this.length) return
	      var hasScrollLeft = 'scrollLeft' in this[0]
	      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
	      return this.each(hasScrollLeft ?
	        function(){ this.scrollLeft = value } :
	        function(){ this.scrollTo(value, this.scrollY) })
	    },
	    position: function() {
	      if (!this.length) return
	
	      var elem = this[0],
	        // Get *real* offsetParent
	        offsetParent = this.offsetParent(),
	        // Get correct offsets
	        offset       = this.offset(),
	        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()
	
	      // Subtract element margins
	      // note: when an element has margin: auto the offsetLeft and marginLeft
	      // are the same in Safari causing offset.left to incorrectly be 0
	      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
	      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0
	
	      // Add offsetParent borders
	      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
	      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0
	
	      // Subtract the two offsets
	      return {
	        top:  offset.top  - parentOffset.top,
	        left: offset.left - parentOffset.left
	      }
	    },
	    offsetParent: function() {
	      return this.map(function(){
	        var parent = this.offsetParent || document.body
	        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
	          parent = parent.offsetParent
	        return parent
	      })
	    }
	  }
	
	  // for now
	  $.fn.detach = $.fn.remove
	
	  // Generate the `width` and `height` functions
	  ;['width', 'height'].forEach(function(dimension){
	    var dimensionProperty =
	      dimension.replace(/./, function(m){ return m[0].toUpperCase() })
	
	    $.fn[dimension] = function(value){
	      var offset, el = this[0]
	      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
	        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
	        (offset = this.offset()) && offset[dimension]
	      else return this.each(function(idx){
	        el = $(this)
	        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
	      })
	    }
	  })
	
	  function traverseNode(node, fun) {
	    fun(node)
	    for (var i = 0, len = node.childNodes.length; i < len; i++)
	      traverseNode(node.childNodes[i], fun)
	  }
	
	  // Generate the `after`, `prepend`, `before`, `append`,
	  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	  adjacencyOperators.forEach(function(operator, operatorIndex) {
	    var inside = operatorIndex % 2 //=> prepend, append
	
	    $.fn[operator] = function(){
	      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	      var argType, nodes = $.map(arguments, function(arg) {
	            var arr = []
	            argType = type(arg)
	            if (argType == "array") {
	              arg.forEach(function(el) {
	                if (el.nodeType !== undefined) return arr.push(el)
	                else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
	                arr = arr.concat(zepto.fragment(el))
	              })
	              return arr
	            }
	            return argType == "object" || arg == null ?
	              arg : zepto.fragment(arg)
	          }),
	          parent, copyByClone = this.length > 1
	      if (nodes.length < 1) return this
	
	      return this.each(function(_, target){
	        parent = inside ? target : target.parentNode
	
	        // convert all methods to a "before" operation
	        target = operatorIndex == 0 ? target.nextSibling :
	                 operatorIndex == 1 ? target.firstChild :
	                 operatorIndex == 2 ? target :
	                 null
	
	        var parentInDocument = $.contains(document.documentElement, parent)
	
	        nodes.forEach(function(node){
	          if (copyByClone) node = node.cloneNode(true)
	          else if (!parent) return $(node).remove()
	
	          parent.insertBefore(node, target)
	          if (parentInDocument) traverseNode(node, function(el){
	            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
	               (!el.type || el.type === 'text/javascript') && !el.src){
	              var target = el.ownerDocument ? el.ownerDocument.defaultView : window
	              target['eval'].call(target, el.innerHTML)
	            }
	          })
	        })
	      })
	    }
	
	    // after    => insertAfter
	    // prepend  => prependTo
	    // before   => insertBefore
	    // append   => appendTo
	    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
	      $(html)[operator](this)
	      return this
	    }
	  })
	
	  zepto.Z.prototype = Z.prototype = $.fn
	
	  // Export internal API functions in the `$.zepto` namespace
	  zepto.uniq = uniq
	  zepto.deserializeValue = deserializeValue
	  $.zepto = zepto
	
	  return $
	})()
	
	;(function($){
	  var _zid = 1, undefined,
	      slice = Array.prototype.slice,
	      isFunction = $.isFunction,
	      isString = function(obj){ return typeof obj == 'string' },
	      handlers = {},
	      specialEvents={},
	      focusinSupported = 'onfocusin' in window,
	      focus = { focus: 'focusin', blur: 'focusout' },
	      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }
	
	  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'
	
	  function zid(element) {
	    return element._zid || (element._zid = _zid++)
	  }
	  function findHandlers(element, event, fn, selector) {
	    event = parse(event)
	    if (event.ns) var matcher = matcherFor(event.ns)
	    return (handlers[zid(element)] || []).filter(function(handler) {
	      return handler
	        && (!event.e  || handler.e == event.e)
	        && (!event.ns || matcher.test(handler.ns))
	        && (!fn       || zid(handler.fn) === zid(fn))
	        && (!selector || handler.sel == selector)
	    })
	  }
	  function parse(event) {
	    var parts = ('' + event).split('.')
	    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
	  }
	  function matcherFor(ns) {
	    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	  }
	
	  function eventCapture(handler, captureSetting) {
	    return handler.del &&
	      (!focusinSupported && (handler.e in focus)) ||
	      !!captureSetting
	  }
	
	  function realEvent(type) {
	    return hover[type] || (focusinSupported && focus[type]) || type
	  }
	
	  function add(element, events, fn, data, selector, delegator, capture){
	    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
	    events.split(/\s/).forEach(function(event){
	      if (event == 'ready') return $(document).ready(fn)
	      var handler   = parse(event)
	      handler.fn    = fn
	      handler.sel   = selector
	      // emulate mouseenter, mouseleave
	      if (handler.e in hover) fn = function(e){
	        var related = e.relatedTarget
	        if (!related || (related !== this && !$.contains(this, related)))
	          return handler.fn.apply(this, arguments)
	      }
	      handler.del   = delegator
	      var callback  = delegator || fn
	      handler.proxy = function(e){
	        e = compatible(e)
	        if (e.isImmediatePropagationStopped()) return
	        e.data = data
	        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
	        if (result === false) e.preventDefault(), e.stopPropagation()
	        return result
	      }
	      handler.i = set.length
	      set.push(handler)
	      if ('addEventListener' in element)
	        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	    })
	  }
	  function remove(element, events, fn, selector, capture){
	    var id = zid(element)
	    ;(events || '').split(/\s/).forEach(function(event){
	      findHandlers(element, event, fn, selector).forEach(function(handler){
	        delete handlers[id][handler.i]
	      if ('removeEventListener' in element)
	        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	      })
	    })
	  }
	
	  $.event = { add: add, remove: remove }
	
	  $.proxy = function(fn, context) {
	    var args = (2 in arguments) && slice.call(arguments, 2)
	    if (isFunction(fn)) {
	      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
	      proxyFn._zid = zid(fn)
	      return proxyFn
	    } else if (isString(context)) {
	      if (args) {
	        args.unshift(fn[context], fn)
	        return $.proxy.apply(null, args)
	      } else {
	        return $.proxy(fn[context], fn)
	      }
	    } else {
	      throw new TypeError("expected function")
	    }
	  }
	
	  $.fn.bind = function(event, data, callback){
	    return this.on(event, data, callback)
	  }
	  $.fn.unbind = function(event, callback){
	    return this.off(event, callback)
	  }
	  $.fn.one = function(event, selector, data, callback){
	    return this.on(event, selector, data, callback, 1)
	  }
	
	  var returnTrue = function(){return true},
	      returnFalse = function(){return false},
	      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
	      eventMethods = {
	        preventDefault: 'isDefaultPrevented',
	        stopImmediatePropagation: 'isImmediatePropagationStopped',
	        stopPropagation: 'isPropagationStopped'
	      }
	
	  function compatible(event, source) {
	    if (source || !event.isDefaultPrevented) {
	      source || (source = event)
	
	      $.each(eventMethods, function(name, predicate) {
	        var sourceMethod = source[name]
	        event[name] = function(){
	          this[predicate] = returnTrue
	          return sourceMethod && sourceMethod.apply(source, arguments)
	        }
	        event[predicate] = returnFalse
	      })
	
	      event.timeStamp || (event.timeStamp = Date.now())
	
	      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
	          'returnValue' in source ? source.returnValue === false :
	          source.getPreventDefault && source.getPreventDefault())
	        event.isDefaultPrevented = returnTrue
	    }
	    return event
	  }
	
	  function createProxy(event) {
	    var key, proxy = { originalEvent: event }
	    for (key in event)
	      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]
	
	    return compatible(proxy, event)
	  }
	
	  $.fn.delegate = function(selector, event, callback){
	    return this.on(event, selector, callback)
	  }
	  $.fn.undelegate = function(selector, event, callback){
	    return this.off(event, selector, callback)
	  }
	
	  $.fn.live = function(event, callback){
	    $(document.body).delegate(this.selector, event, callback)
	    return this
	  }
	  $.fn.die = function(event, callback){
	    $(document.body).undelegate(this.selector, event, callback)
	    return this
	  }
	
	  $.fn.on = function(event, selector, data, callback, one){
	    var autoRemove, delegator, $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.on(type, selector, data, fn, one)
	      })
	      return $this
	    }
	
	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = data, data = selector, selector = undefined
	    if (callback === undefined || data === false)
	      callback = data, data = undefined
	
	    if (callback === false) callback = returnFalse
	
	    return $this.each(function(_, element){
	      if (one) autoRemove = function(e){
	        remove(element, e.type, callback)
	        return callback.apply(this, arguments)
	      }
	
	      if (selector) delegator = function(e){
	        var evt, match = $(e.target).closest(selector, element).get(0)
	        if (match && match !== element) {
	          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
	          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
	        }
	      }
	
	      add(element, event, callback, data, selector, delegator || autoRemove)
	    })
	  }
	  $.fn.off = function(event, selector, callback){
	    var $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.off(type, selector, fn)
	      })
	      return $this
	    }
	
	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = selector, selector = undefined
	
	    if (callback === false) callback = returnFalse
	
	    return $this.each(function(){
	      remove(this, event, callback, selector)
	    })
	  }
	
	  $.fn.trigger = function(event, args){
	    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
	    event._args = args
	    return this.each(function(){
	      // handle focus(), blur() by calling them directly
	      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
	      // items in the collection might not be DOM elements
	      else if ('dispatchEvent' in this) this.dispatchEvent(event)
	      else $(this).triggerHandler(event, args)
	    })
	  }
	
	  // triggers event handlers on current element just as if an event occurred,
	  // doesn't trigger an actual event, doesn't bubble
	  $.fn.triggerHandler = function(event, args){
	    var e, result
	    this.each(function(i, element){
	      e = createProxy(isString(event) ? $.Event(event) : event)
	      e._args = args
	      e.target = element
	      $.each(findHandlers(element, event.type || event), function(i, handler){
	        result = handler.proxy(e)
	        if (e.isImmediatePropagationStopped()) return false
	      })
	    })
	    return result
	  }
	
	  // shortcut methods for `.bind(event, fn)` for each event type
	  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
	  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
	  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
	    $.fn[event] = function(callback) {
	      return (0 in arguments) ?
	        this.bind(event, callback) :
	        this.trigger(event)
	    }
	  })
	
	  $.Event = function(type, props) {
	    if (!isString(type)) props = type, type = props.type
	    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
	    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
	    event.initEvent(type, bubbles, true)
	    return compatible(event)
	  }
	
	})(Zepto)
	
	;(function($){
	  var cache = [], timeout
	
	  $.fn.remove = function(){
	    return this.each(function(){
	      if(this.parentNode){
	        if(this.tagName === 'IMG'){
	          cache.push(this)
	          this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
	          if (timeout) clearTimeout(timeout)
	          timeout = setTimeout(function(){ cache = [] }, 60000)
	        }
	        this.parentNode.removeChild(this)
	      }
	    })
	  }
	})(Zepto)
	
	;(function($){
	  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
	    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []
	
	  // Get value from node:
	  // 1. first try key as given,
	  // 2. then try camelized key,
	  // 3. fall back to reading "data-*" attribute.
	  function getData(node, name) {
	    var id = node[exp], store = id && data[id]
	    if (name === undefined) return store || setData(node)
	    else {
	      if (store) {
	        if (name in store) return store[name]
	        var camelName = camelize(name)
	        if (camelName in store) return store[camelName]
	      }
	      return dataAttr.call($(node), name)
	    }
	  }
	
	  // Store value under camelized key on node
	  function setData(node, name, value) {
	    var id = node[exp] || (node[exp] = ++$.uuid),
	      store = data[id] || (data[id] = attributeData(node))
	    if (name !== undefined) store[camelize(name)] = value
	    return store
	  }
	
	  // Read all "data-*" attributes from a node
	  function attributeData(node) {
	    var store = {}
	    $.each(node.attributes || emptyArray, function(i, attr){
	      if (attr.name.indexOf('data-') == 0)
	        store[camelize(attr.name.replace('data-', ''))] =
	          $.zepto.deserializeValue(attr.value)
	    })
	    return store
	  }
	
	  $.fn.data = function(name, value) {
	    return value === undefined ?
	      // set multiple values via object
	      $.isPlainObject(name) ?
	        this.each(function(i, node){
	          $.each(name, function(key, value){ setData(node, key, value) })
	        }) :
	        // get value from first element
	        (0 in this ? getData(this[0], name) : undefined) :
	      // set value on all elements
	      this.each(function(){ setData(this, name, value) })
	  }
	
	  $.data = function(elem, name, value) {
	    return $(elem).data(name, value)
	  }
	
	  $.hasData = function(elem) {
	    var id = elem[exp], store = id && data[id]
	    return store ? !$.isEmptyObject(store) : false
	  }
	
	  $.fn.removeData = function(names) {
	    if (typeof names == 'string') names = names.split(/\s+/)
	    return this.each(function(){
	      var id = this[exp], store = id && data[id]
	      if (store) $.each(names || store, function(key){
	        delete store[names ? camelize(this) : key]
	      })
	    })
	  }
	
	  // Generate extended `remove` and `empty` functions
	  ;['remove', 'empty'].forEach(function(methodName){
	    var origFn = $.fn[methodName]
	    $.fn[methodName] = function() {
	      var elements = this.find('*')
	      if (methodName === 'remove') elements = elements.add(this)
	      elements.removeData()
	      return origFn.call(this)
	    }
	  })
	})(Zepto)
	  return Zepto
	}))


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  element: null
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DOM = __webpack_require__(18);
	
	function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	}
	
	module.exports = {
	  // those methods are implemented differently
	  // depending on which build it is, using
	  // $... or angular... or Zepto... or require(...)
	  isArray: null,
	  isFunction: null,
	  isObject: null,
	  bind: null,
	  each: null,
	  map: null,
	  mixin: null,
	
	  isMsie: function() {
	    // from https://github.com/ded/bowser/blob/master/bowser.js
	    return (/(msie|trident)/i).test(navigator.userAgent) ?
	      navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
	  },
	
	  // http://stackoverflow.com/a/6969486
	  escapeRegExChars: function(str) {
	    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	  },
	
	  isNumber: function(obj) { return typeof obj === 'number'; },
	
	  toStr: function toStr(s) {
	    return s === undefined || s === null ? '' : s + '';
	  },
	
	  cloneDeep: function cloneDeep(obj) {
	    var clone = this.mixin({}, obj);
	    var self = this;
	    this.each(clone, function(value, key) {
	      if (value) {
	        if (self.isArray(value)) {
	          clone[key] = [].concat(value);
	        } else if (self.isObject(value)) {
	          clone[key] = self.cloneDeep(value);
	        }
	      }
	    });
	    return clone;
	  },
	
	  error: function(msg) {
	    throw new Error(msg);
	  },
	
	  every: function(obj, test) {
	    var result = true;
	    if (!obj) {
	      return result;
	    }
	    this.each(obj, function(val, key) {
	      result = test.call(null, val, key, obj);
	      if (!result) {
	        return false;
	      }
	    });
	    return !!result;
	  },
	
	  any: function(obj, test) {
	    var found = false;
	    if (!obj) {
	      return found;
	    }
	    this.each(obj, function(val, key) {
	      if (test.call(null, val, key, obj)) {
	        found = true;
	        return false;
	      }
	    });
	    return found;
	  },
	
	  getUniqueId: (function() {
	    var counter = 0;
	    return function() { return counter++; };
	  })(),
	
	  templatify: function templatify(obj) {
	    if (this.isFunction(obj)) {
	      return obj;
	    }
	    var $template = DOM.element(obj);
	    if ($template.prop('tagName') === 'SCRIPT') {
	      return function template() { return $template.text(); };
	    }
	    return function template() { return String(obj); };
	  },
	
	  defer: function(fn) { setTimeout(fn, 0); },
	
	  noop: function() {},
	
	  formatPrefix: function(prefix, noPrefix) {
	    return noPrefix ? '' : prefix + '-';
	  },
	
	  className: function(prefix, clazz, skipDot) {
	    return (skipDot ? '' : '.') + prefix + clazz;
	  },
	
	  escapeHighlightedString: function(str, highlightPreTag, highlightPostTag) {
	    highlightPreTag = highlightPreTag || '<em>';
	    var pre = document.createElement('div');
	    pre.appendChild(document.createTextNode(highlightPreTag));
	
	    highlightPostTag = highlightPostTag || '</em>';
	    var post = document.createElement('div');
	    post.appendChild(document.createTextNode(highlightPostTag));
	
	    var div = document.createElement('div');
	    div.appendChild(document.createTextNode(str));
	    return div.innerHTML
	      .replace(RegExp(escapeRegExp(pre.innerHTML), 'g'), highlightPreTag)
	      .replace(RegExp(escapeRegExp(post.innerHTML), 'g'), highlightPostTag);
	  }
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var attrsKey = 'aaAttrs';
	
	var _ = __webpack_require__(19);
	var DOM = __webpack_require__(18);
	var EventBus = __webpack_require__(21);
	var Input = __webpack_require__(22);
	var Dropdown = __webpack_require__(30);
	var html = __webpack_require__(32);
	var css = __webpack_require__(33);
	
	// constructor
	// -----------
	
	// THOUGHT: what if datasets could dynamically be added/removed?
	function Typeahead(o) {
	  var $menu;
	  var $hint;
	
	  o = o || {};
	
	  if (!o.input) {
	    _.error('missing input');
	  }
	
	  this.isActivated = false;
	  this.debug = !!o.debug;
	  this.autoselect = !!o.autoselect;
	  this.autoselectOnBlur = !!o.autoselectOnBlur;
	  this.openOnFocus = !!o.openOnFocus;
	  this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
	  this.autoWidth = (o.autoWidth === undefined) ? true : !!o.autoWidth;
	
	  o.hint = !!o.hint;
	
	  if (o.hint && o.appendTo) {
	    throw new Error('[autocomplete.js] hint and appendTo options can\'t be used at the same time');
	  }
	
	  this.css = o.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
	  this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
	  this.cssClasses.prefix =
	    o.cssClasses.formattedPrefix = _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
	  this.listboxId = o.listboxId = [this.cssClasses.root, 'listbox', _.getUniqueId()].join('-');
	
	  var domElts = buildDom(o);
	
	  this.$node = domElts.wrapper;
	  var $input = this.$input = domElts.input;
	  $menu = domElts.menu;
	  $hint = domElts.hint;
	
	  if (o.dropdownMenuContainer) {
	    DOM.element(o.dropdownMenuContainer)
	      .css('position', 'relative') // ensure the container has a relative position
	      .append($menu.css('top', '0')); // override the top: 100%
	  }
	
	  // #705: if there's scrollable overflow, ie doesn't support
	  // blur cancellations when the scrollbar is clicked
	  //
	  // #351: preventDefault won't cancel blurs in ie <= 8
	  $input.on('blur.aa', function($e) {
	    var active = document.activeElement;
	    if (_.isMsie() && ($menu[0] === active || $menu[0].contains(active))) {
	      $e.preventDefault();
	      // stop immediate in order to prevent Input#_onBlur from
	      // getting exectued
	      $e.stopImmediatePropagation();
	      _.defer(function() { $input.focus(); });
	    }
	  });
	
	  // #351: prevents input blur due to clicks within dropdown menu
	  $menu.on('mousedown.aa', function($e) { $e.preventDefault(); });
	
	  this.eventBus = o.eventBus || new EventBus({el: $input});
	
	  this.dropdown = new Typeahead.Dropdown({
	    appendTo: o.appendTo,
	    wrapper: this.$node,
	    menu: $menu,
	    datasets: o.datasets,
	    templates: o.templates,
	    cssClasses: o.cssClasses,
	    minLength: this.minLength
	  })
	    .onSync('suggestionClicked', this._onSuggestionClicked, this)
	    .onSync('cursorMoved', this._onCursorMoved, this)
	    .onSync('cursorRemoved', this._onCursorRemoved, this)
	    .onSync('opened', this._onOpened, this)
	    .onSync('closed', this._onClosed, this)
	    .onSync('shown', this._onShown, this)
	    .onSync('empty', this._onEmpty, this)
	    .onSync('redrawn', this._onRedrawn, this)
	    .onAsync('datasetRendered', this._onDatasetRendered, this);
	
	  this.input = new Typeahead.Input({input: $input, hint: $hint})
	    .onSync('focused', this._onFocused, this)
	    .onSync('blurred', this._onBlurred, this)
	    .onSync('enterKeyed', this._onEnterKeyed, this)
	    .onSync('tabKeyed', this._onTabKeyed, this)
	    .onSync('escKeyed', this._onEscKeyed, this)
	    .onSync('upKeyed', this._onUpKeyed, this)
	    .onSync('downKeyed', this._onDownKeyed, this)
	    .onSync('leftKeyed', this._onLeftKeyed, this)
	    .onSync('rightKeyed', this._onRightKeyed, this)
	    .onSync('queryChanged', this._onQueryChanged, this)
	    .onSync('whitespaceChanged', this._onWhitespaceChanged, this);
	
	  this._bindKeyboardShortcuts(o);
	
	  this._setLanguageDirection();
	}
	
	// instance methods
	// ----------------
	
	_.mixin(Typeahead.prototype, {
	  // ### private
	
	  _bindKeyboardShortcuts: function(options) {
	    if (!options.keyboardShortcuts) {
	      return;
	    }
	    var $input = this.$input;
	    var keyboardShortcuts = [];
	    _.each(options.keyboardShortcuts, function(key) {
	      if (typeof key === 'string') {
	        key = key.toUpperCase().charCodeAt(0);
	      }
	      keyboardShortcuts.push(key);
	    });
	    DOM.element(document).keydown(function(event) {
	      var elt = (event.target || event.srcElement);
	      var tagName = elt.tagName;
	      if (elt.isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
	        // already in an input
	        return;
	      }
	
	      var which = event.which || event.keyCode;
	      if (keyboardShortcuts.indexOf(which) === -1) {
	        // not the right shortcut
	        return;
	      }
	
	      $input.focus();
	      event.stopPropagation();
	      event.preventDefault();
	    });
	  },
	
	  _onSuggestionClicked: function onSuggestionClicked(type, $el) {
	    var datum;
	
	    if (datum = this.dropdown.getDatumForSuggestion($el)) {
	      this._select(datum);
	    }
	  },
	
	  _onCursorMoved: function onCursorMoved(event, updateInput) {
	    var datum = this.dropdown.getDatumForCursor();
	    var currentCursorId = this.dropdown.getCurrentCursor().attr('id');
	    this.input.setActiveDescendant(currentCursorId);
	
	    if (datum) {
	      if (updateInput) {
	        this.input.setInputValue(datum.value, true);
	      }
	
	      this.eventBus.trigger('cursorchanged', datum.raw, datum.datasetName);
	    }
	  },
	
	  _onCursorRemoved: function onCursorRemoved() {
	    this.input.resetInputValue();
	    this._updateHint();
	    this.eventBus.trigger('cursorremoved');
	  },
	
	  _onDatasetRendered: function onDatasetRendered() {
	    this._updateHint();
	
	    this.eventBus.trigger('updated');
	  },
	
	  _onOpened: function onOpened() {
	    this._updateHint();
	    this.input.expand();
	
	    this.eventBus.trigger('opened');
	  },
	
	  _onEmpty: function onEmpty() {
	    this.eventBus.trigger('empty');
	  },
	
	  _onRedrawn: function onRedrawn() {
	    this.$node.css('top', 0 + 'px');
	    this.$node.css('left', 0 + 'px');
	
	    var inputRect = this.$input[0].getBoundingClientRect();
	
	    if (this.autoWidth) {
	      this.$node.css('width', inputRect.width + 'px');
	    }
	
	    var wrapperRect = this.$node[0].getBoundingClientRect();
	
	    var top = inputRect.bottom - wrapperRect.top;
	    this.$node.css('top', top + 'px');
	    var left = inputRect.left - wrapperRect.left;
	    this.$node.css('left', left + 'px');
	
	    this.eventBus.trigger('redrawn');
	  },
	
	  _onShown: function onShown() {
	    this.eventBus.trigger('shown');
	    if (this.autoselect) {
	      this.dropdown.cursorTopSuggestion();
	    }
	  },
	
	  _onClosed: function onClosed() {
	    this.input.clearHint();
	    this.input.removeActiveDescendant();
	    this.input.collapse();
	
	    this.eventBus.trigger('closed');
	  },
	
	  _onFocused: function onFocused() {
	    this.isActivated = true;
	
	    if (this.openOnFocus) {
	      var query = this.input.getQuery();
	      if (query.length >= this.minLength) {
	        this.dropdown.update(query);
	      } else {
	        this.dropdown.empty();
	      }
	
	      this.dropdown.open();
	    }
	  },
	
	  _onBlurred: function onBlurred() {
	    var cursorDatum;
	    var topSuggestionDatum;
	
	    cursorDatum = this.dropdown.getDatumForCursor();
	    topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
	
	    if (!this.debug) {
	      if (this.autoselectOnBlur && cursorDatum) {
	        this._select(cursorDatum);
	      } else if (this.autoselectOnBlur && topSuggestionDatum) {
	        this._select(topSuggestionDatum);
	      } else {
	        this.isActivated = false;
	        this.dropdown.empty();
	        this.dropdown.close();
	      }
	    }
	  },
	
	  _onEnterKeyed: function onEnterKeyed(type, $e) {
	    var cursorDatum;
	    var topSuggestionDatum;
	
	    cursorDatum = this.dropdown.getDatumForCursor();
	    topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
	
	    if (cursorDatum) {
	      this._select(cursorDatum);
	      $e.preventDefault();
	    } else if (this.autoselect && topSuggestionDatum) {
	      this._select(topSuggestionDatum);
	      $e.preventDefault();
	    }
	  },
	
	  _onTabKeyed: function onTabKeyed(type, $e) {
	    var datum;
	
	    if (datum = this.dropdown.getDatumForCursor()) {
	      this._select(datum);
	      $e.preventDefault();
	    } else {
	      this._autocomplete(true);
	    }
	  },
	
	  _onEscKeyed: function onEscKeyed() {
	    this.dropdown.close();
	    this.input.resetInputValue();
	  },
	
	  _onUpKeyed: function onUpKeyed() {
	    var query = this.input.getQuery();
	
	    if (this.dropdown.isEmpty && query.length >= this.minLength) {
	      this.dropdown.update(query);
	    } else {
	      this.dropdown.moveCursorUp();
	    }
	
	    this.dropdown.open();
	  },
	
	  _onDownKeyed: function onDownKeyed() {
	    var query = this.input.getQuery();
	
	    if (this.dropdown.isEmpty && query.length >= this.minLength) {
	      this.dropdown.update(query);
	    } else {
	      this.dropdown.moveCursorDown();
	    }
	
	    this.dropdown.open();
	  },
	
	  _onLeftKeyed: function onLeftKeyed() {
	    if (this.dir === 'rtl') {
	      this._autocomplete();
	    }
	  },
	
	  _onRightKeyed: function onRightKeyed() {
	    if (this.dir === 'ltr') {
	      this._autocomplete();
	    }
	  },
	
	  _onQueryChanged: function onQueryChanged(e, query) {
	    this.input.clearHintIfInvalid();
	
	    if (query.length >= this.minLength) {
	      this.dropdown.update(query);
	    } else {
	      this.dropdown.empty();
	    }
	
	    this.dropdown.open();
	    this._setLanguageDirection();
	  },
	
	  _onWhitespaceChanged: function onWhitespaceChanged() {
	    this._updateHint();
	    this.dropdown.open();
	  },
	
	  _setLanguageDirection: function setLanguageDirection() {
	    var dir = this.input.getLanguageDirection();
	
	    if (this.dir !== dir) {
	      this.dir = dir;
	      this.$node.css('direction', dir);
	      this.dropdown.setLanguageDirection(dir);
	    }
	  },
	
	  _updateHint: function updateHint() {
	    var datum;
	    var val;
	    var query;
	    var escapedQuery;
	    var frontMatchRegEx;
	    var match;
	
	    datum = this.dropdown.getDatumForTopSuggestion();
	
	    if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
	      val = this.input.getInputValue();
	      query = Input.normalizeQuery(val);
	      escapedQuery = _.escapeRegExChars(query);
	
	      // match input value, then capture trailing text
	      frontMatchRegEx = new RegExp('^(?:' + escapedQuery + ')(.+$)', 'i');
	      match = frontMatchRegEx.exec(datum.value);
	
	      // clear hint if there's no trailing text
	      if (match) {
	        this.input.setHint(val + match[1]);
	      } else {
	        this.input.clearHint();
	      }
	    } else {
	      this.input.clearHint();
	    }
	  },
	
	  _autocomplete: function autocomplete(laxCursor) {
	    var hint;
	    var query;
	    var isCursorAtEnd;
	    var datum;
	
	    hint = this.input.getHint();
	    query = this.input.getQuery();
	    isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
	
	    if (hint && query !== hint && isCursorAtEnd) {
	      datum = this.dropdown.getDatumForTopSuggestion();
	      if (datum) {
	        this.input.setInputValue(datum.value);
	      }
	
	      this.eventBus.trigger('autocompleted', datum.raw, datum.datasetName);
	    }
	  },
	
	  _select: function select(datum) {
	    if (typeof datum.value !== 'undefined') {
	      this.input.setQuery(datum.value);
	    }
	    this.input.setInputValue(datum.value, true);
	
	    this._setLanguageDirection();
	
	    var event = this.eventBus.trigger('selected', datum.raw, datum.datasetName);
	    if (event.isDefaultPrevented() === false) {
	      this.dropdown.close();
	
	      // #118: allow click event to bubble up to the body before removing
	      // the suggestions otherwise we break event delegation
	      _.defer(_.bind(this.dropdown.empty, this.dropdown));
	    }
	  },
	
	  // ### public
	
	  open: function open() {
	    // if the menu is not activated yet, we need to update
	    // the underlying dropdown menu to trigger the search
	    // otherwise we're not gonna see anything
	    if (!this.isActivated) {
	      var query = this.input.getInputValue();
	      if (query.length >= this.minLength) {
	        this.dropdown.update(query);
	      } else {
	        this.dropdown.empty();
	      }
	    }
	    this.dropdown.open();
	  },
	
	  close: function close() {
	    this.dropdown.close();
	  },
	
	  setVal: function setVal(val) {
	    // expect val to be a string, so be safe, and coerce
	    val = _.toStr(val);
	
	    if (this.isActivated) {
	      this.input.setInputValue(val);
	    } else {
	      this.input.setQuery(val);
	      this.input.setInputValue(val, true);
	    }
	
	    this._setLanguageDirection();
	  },
	
	  getVal: function getVal() {
	    return this.input.getQuery();
	  },
	
	  destroy: function destroy() {
	    this.input.destroy();
	    this.dropdown.destroy();
	
	    destroyDomStructure(this.$node, this.cssClasses);
	
	    this.$node = null;
	  },
	
	  getWrapper: function getWrapper() {
	    return this.dropdown.$container[0];
	  }
	});
	
	function buildDom(options) {
	  var $input;
	  var $wrapper;
	  var $dropdown;
	  var $hint;
	
	  $input = DOM.element(options.input);
	  $wrapper = DOM
	    .element(html.wrapper.replace('%ROOT%', options.cssClasses.root))
	    .css(options.css.wrapper);
	
	  // override the display property with the table-cell value
	  // if the parent element is a table and the original input was a block
	  //  -> https://github.com/algolia/autocomplete.js/issues/16
	  if (!options.appendTo && $input.css('display') === 'block' && $input.parent().css('display') === 'table') {
	    $wrapper.css('display', 'table-cell');
	  }
	  var dropdownHtml = html.dropdown.
	    replace('%PREFIX%', options.cssClasses.prefix).
	    replace('%DROPDOWN_MENU%', options.cssClasses.dropdownMenu);
	  $dropdown = DOM.element(dropdownHtml)
	    .css(options.css.dropdown)
	    .attr({
	      role: 'listbox',
	      id: options.listboxId
	    });
	  if (options.templates && options.templates.dropdownMenu) {
	    $dropdown.html(_.templatify(options.templates.dropdownMenu)());
	  }
	  $hint = $input.clone().css(options.css.hint).css(getBackgroundStyles($input));
	
	  $hint
	    .val('')
	    .addClass(_.className(options.cssClasses.prefix, options.cssClasses.hint, true))
	    .removeAttr('id name placeholder required')
	    .prop('readonly', true)
	    .attr({
	      'aria-hidden': 'true',
	      autocomplete: 'off',
	      spellcheck: 'false',
	      tabindex: -1
	    });
	  if ($hint.removeData) {
	    $hint.removeData();
	  }
	
	  // store the original values of the attrs that get modified
	  // so modifications can be reverted on destroy
	  $input.data(attrsKey, {
	    'aria-autocomplete': $input.attr('aria-autocomplete'),
	    'aria-expanded': $input.attr('aria-expanded'),
	    'aria-owns': $input.attr('aria-owns'),
	    autocomplete: $input.attr('autocomplete'),
	    dir: $input.attr('dir'),
	    role: $input.attr('role'),
	    spellcheck: $input.attr('spellcheck'),
	    style: $input.attr('style'),
	    type: $input.attr('type')
	  });
	
	  $input
	    .addClass(_.className(options.cssClasses.prefix, options.cssClasses.input, true))
	    .attr({
	      autocomplete: 'off',
	      spellcheck: false,
	
	      // Accessibility features
	      // Give the field a presentation of a "select".
	      // Combobox is the combined presentation of a single line textfield
	      // with a listbox popup.
	      // https://www.w3.org/WAI/PF/aria/roles#combobox
	      role: 'combobox',
	      // Let the screen reader know the field has an autocomplete
	      // feature to it.
	      'aria-autocomplete': (options.datasets &&
	        options.datasets[0] && options.datasets[0].displayKey ? 'both' : 'list'),
	      // Indicates whether the dropdown it controls is currently expanded or collapsed
	      'aria-expanded': 'false',
	      // If a placeholder is set, label this field with itself, which in this case,
	      // is an explicit pointer to use the placeholder attribute value.
	      'aria-labelledby': ($input.attr('placeholder') ? $input.attr('id') : null),
	      // Explicitly point to the listbox,
	      // which is a list of suggestions (aka options)
	      'aria-owns': options.listboxId
	    })
	    .css(options.hint ? options.css.input : options.css.inputWithNoHint);
	
	  // ie7 does not like it when dir is set to auto
	  try {
	    if (!$input.attr('dir')) {
	      $input.attr('dir', 'auto');
	    }
	  } catch (e) {
	    // ignore
	  }
	
	  $wrapper = options.appendTo
	    ? $wrapper.appendTo(DOM.element(options.appendTo).eq(0)).eq(0)
	    : $input.wrap($wrapper).parent();
	
	  $wrapper
	    .prepend(options.hint ? $hint : null)
	    .append($dropdown);
	
	  return {
	    wrapper: $wrapper,
	    input: $input,
	    hint: $hint,
	    menu: $dropdown
	  };
	}
	
	function getBackgroundStyles($el) {
	  return {
	    backgroundAttachment: $el.css('background-attachment'),
	    backgroundClip: $el.css('background-clip'),
	    backgroundColor: $el.css('background-color'),
	    backgroundImage: $el.css('background-image'),
	    backgroundOrigin: $el.css('background-origin'),
	    backgroundPosition: $el.css('background-position'),
	    backgroundRepeat: $el.css('background-repeat'),
	    backgroundSize: $el.css('background-size')
	  };
	}
	
	function destroyDomStructure($node, cssClasses) {
	  var $input = $node.find(_.className(cssClasses.prefix, cssClasses.input));
	
	  // need to remove attrs that weren't previously defined and
	  // revert attrs that originally had a value
	  _.each($input.data(attrsKey), function(val, key) {
	    if (val === undefined) {
	      $input.removeAttr(key);
	    } else {
	      $input.attr(key, val);
	    }
	  });
	
	  $input
	    .detach()
	    .removeClass(_.className(cssClasses.prefix, cssClasses.input, true))
	    .insertAfter($node);
	  if ($input.removeData) {
	    $input.removeData(attrsKey);
	  }
	
	  $node.remove();
	}
	
	Typeahead.Dropdown = Dropdown;
	Typeahead.Input = Input;
	Typeahead.sources = __webpack_require__(34);
	
	module.exports = Typeahead;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var namespace = 'autocomplete:';
	
	var _ = __webpack_require__(19);
	var DOM = __webpack_require__(18);
	
	// constructor
	// -----------
	
	function EventBus(o) {
	  if (!o || !o.el) {
	    _.error('EventBus initialized without el');
	  }
	
	  this.$el = DOM.element(o.el);
	}
	
	// instance methods
	// ----------------
	
	_.mixin(EventBus.prototype, {
	
	  // ### public
	
	  trigger: function(type) {
	    var args = [].slice.call(arguments, 1);
	
	    var event = _.Event(namespace + type);
	    this.$el.trigger(event, args);
	    return event;
	  }
	});
	
	module.exports = EventBus;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var specialKeyCodeMap;
	
	specialKeyCodeMap = {
	  9: 'tab',
	  27: 'esc',
	  37: 'left',
	  39: 'right',
	  13: 'enter',
	  38: 'up',
	  40: 'down'
	};
	
	var _ = __webpack_require__(19);
	var DOM = __webpack_require__(18);
	var EventEmitter = __webpack_require__(23);
	
	// constructor
	// -----------
	
	function Input(o) {
	  var that = this;
	  var onBlur;
	  var onFocus;
	  var onKeydown;
	  var onInput;
	
	  o = o || {};
	
	  if (!o.input) {
	    _.error('input is missing');
	  }
	
	  // bound functions
	  onBlur = _.bind(this._onBlur, this);
	  onFocus = _.bind(this._onFocus, this);
	  onKeydown = _.bind(this._onKeydown, this);
	  onInput = _.bind(this._onInput, this);
	
	  this.$hint = DOM.element(o.hint);
	  this.$input = DOM.element(o.input)
	    .on('blur.aa', onBlur)
	    .on('focus.aa', onFocus)
	    .on('keydown.aa', onKeydown);
	
	  // if no hint, noop all the hint related functions
	  if (this.$hint.length === 0) {
	    this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
	  }
	
	  // ie7 and ie8 don't support the input event
	  // ie9 doesn't fire the input event when characters are removed
	  // not sure if ie10 is compatible
	  if (!_.isMsie()) {
	    this.$input.on('input.aa', onInput);
	  } else {
	    this.$input.on('keydown.aa keypress.aa cut.aa paste.aa', function($e) {
	      // if a special key triggered this, ignore it
	      if (specialKeyCodeMap[$e.which || $e.keyCode]) {
	        return;
	      }
	
	      // give the browser a chance to update the value of the input
	      // before checking to see if the query changed
	      _.defer(_.bind(that._onInput, that, $e));
	    });
	  }
	
	  // the query defaults to whatever the value of the input is
	  // on initialization, it'll most likely be an empty string
	  this.query = this.$input.val();
	
	  // helps with calculating the width of the input's value
	  this.$overflowHelper = buildOverflowHelper(this.$input);
	}
	
	// static methods
	// --------------
	
	Input.normalizeQuery = function(str) {
	  // strips leading whitespace and condenses all whitespace
	  return (str || '').replace(/^\s*/g, '').replace(/\s{2,}/g, ' ');
	};
	
	// instance methods
	// ----------------
	
	_.mixin(Input.prototype, EventEmitter, {
	
	  // ### private
	
	  _onBlur: function onBlur() {
	    this.resetInputValue();
	    this.$input.removeAttr('aria-activedescendant');
	    this.trigger('blurred');
	  },
	
	  _onFocus: function onFocus() {
	    this.trigger('focused');
	  },
	
	  _onKeydown: function onKeydown($e) {
	    // which is normalized and consistent (but not for ie)
	    var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
	
	    this._managePreventDefault(keyName, $e);
	    if (keyName && this._shouldTrigger(keyName, $e)) {
	      this.trigger(keyName + 'Keyed', $e);
	    }
	  },
	
	  _onInput: function onInput() {
	    this._checkInputValue();
	  },
	
	  _managePreventDefault: function managePreventDefault(keyName, $e) {
	    var preventDefault;
	    var hintValue;
	    var inputValue;
	
	    switch (keyName) {
	    case 'tab':
	      hintValue = this.getHint();
	      inputValue = this.getInputValue();
	
	      preventDefault = hintValue &&
	        hintValue !== inputValue &&
	        !withModifier($e);
	      break;
	
	    case 'up':
	    case 'down':
	      preventDefault = !withModifier($e);
	      break;
	
	    default:
	      preventDefault = false;
	    }
	
	    if (preventDefault) {
	      $e.preventDefault();
	    }
	  },
	
	  _shouldTrigger: function shouldTrigger(keyName, $e) {
	    var trigger;
	
	    switch (keyName) {
	    case 'tab':
	      trigger = !withModifier($e);
	      break;
	
	    default:
	      trigger = true;
	    }
	
	    return trigger;
	  },
	
	  _checkInputValue: function checkInputValue() {
	    var inputValue;
	    var areEquivalent;
	    var hasDifferentWhitespace;
	
	    inputValue = this.getInputValue();
	    areEquivalent = areQueriesEquivalent(inputValue, this.query);
	    hasDifferentWhitespace = areEquivalent && this.query ?
	      this.query.length !== inputValue.length : false;
	
	    this.query = inputValue;
	
	    if (!areEquivalent) {
	      this.trigger('queryChanged', this.query);
	    } else if (hasDifferentWhitespace) {
	      this.trigger('whitespaceChanged', this.query);
	    }
	  },
	
	  // ### public
	
	  focus: function focus() {
	    this.$input.focus();
	  },
	
	  blur: function blur() {
	    this.$input.blur();
	  },
	
	  getQuery: function getQuery() {
	    return this.query;
	  },
	
	  setQuery: function setQuery(query) {
	    this.query = query;
	  },
	
	  getInputValue: function getInputValue() {
	    return this.$input.val();
	  },
	
	  setInputValue: function setInputValue(value, silent) {
	    if (typeof value === 'undefined') {
	      value = this.query;
	    }
	    this.$input.val(value);
	
	    // silent prevents any additional events from being triggered
	    if (silent) {
	      this.clearHint();
	    } else {
	      this._checkInputValue();
	    }
	  },
	
	  expand: function expand() {
	    this.$input.attr('aria-expanded', 'true');
	  },
	
	  collapse: function collapse() {
	    this.$input.attr('aria-expanded', 'false');
	  },
	
	  setActiveDescendant: function setActiveDescendant(activedescendantId) {
	    this.$input.attr('aria-activedescendant', activedescendantId);
	  },
	
	  removeActiveDescendant: function removeActiveDescendant() {
	    this.$input.removeAttr('aria-activedescendant');
	  },
	
	  resetInputValue: function resetInputValue() {
	    this.setInputValue(this.query, true);
	  },
	
	  getHint: function getHint() {
	    return this.$hint.val();
	  },
	
	  setHint: function setHint(value) {
	    this.$hint.val(value);
	  },
	
	  clearHint: function clearHint() {
	    this.setHint('');
	  },
	
	  clearHintIfInvalid: function clearHintIfInvalid() {
	    var val;
	    var hint;
	    var valIsPrefixOfHint;
	    var isValid;
	
	    val = this.getInputValue();
	    hint = this.getHint();
	    valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
	    isValid = val !== '' && valIsPrefixOfHint && !this.hasOverflow();
	
	    if (!isValid) {
	      this.clearHint();
	    }
	  },
	
	  getLanguageDirection: function getLanguageDirection() {
	    return (this.$input.css('direction') || 'ltr').toLowerCase();
	  },
	
	  hasOverflow: function hasOverflow() {
	    // 2 is arbitrary, just picking a small number to handle edge cases
	    var constraint = this.$input.width() - 2;
	
	    this.$overflowHelper.text(this.getInputValue());
	
	    return this.$overflowHelper.width() >= constraint;
	  },
	
	  isCursorAtEnd: function() {
	    var valueLength;
	    var selectionStart;
	    var range;
	
	    valueLength = this.$input.val().length;
	    selectionStart = this.$input[0].selectionStart;
	
	    if (_.isNumber(selectionStart)) {
	      return selectionStart === valueLength;
	    } else if (document.selection) {
	      // NOTE: this won't work unless the input has focus, the good news
	      // is this code should only get called when the input has focus
	      range = document.selection.createRange();
	      range.moveStart('character', -valueLength);
	
	      return valueLength === range.text.length;
	    }
	
	    return true;
	  },
	
	  destroy: function destroy() {
	    this.$hint.off('.aa');
	    this.$input.off('.aa');
	
	    this.$hint = this.$input = this.$overflowHelper = null;
	  }
	});
	
	// helper functions
	// ----------------
	
	function buildOverflowHelper($input) {
	  return DOM.element('<pre aria-hidden="true"></pre>')
	    .css({
	      // position helper off-screen
	      position: 'absolute',
	      visibility: 'hidden',
	      // avoid line breaks and whitespace collapsing
	      whiteSpace: 'pre',
	      // use same font css as input to calculate accurate width
	      fontFamily: $input.css('font-family'),
	      fontSize: $input.css('font-size'),
	      fontStyle: $input.css('font-style'),
	      fontVariant: $input.css('font-variant'),
	      fontWeight: $input.css('font-weight'),
	      wordSpacing: $input.css('word-spacing'),
	      letterSpacing: $input.css('letter-spacing'),
	      textIndent: $input.css('text-indent'),
	      textRendering: $input.css('text-rendering'),
	      textTransform: $input.css('text-transform')
	    })
	    .insertAfter($input);
	}
	
	function areQueriesEquivalent(a, b) {
	  return Input.normalizeQuery(a) === Input.normalizeQuery(b);
	}
	
	function withModifier($e) {
	  return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
	}
	
	module.exports = Input;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var immediate = __webpack_require__(24);
	var splitter = /\s+/;
	
	module.exports = {
	  onSync: onSync,
	  onAsync: onAsync,
	  off: off,
	  trigger: trigger
	};
	
	function on(method, types, cb, context) {
	  var type;
	
	  if (!cb) {
	    return this;
	  }
	
	  types = types.split(splitter);
	  cb = context ? bindContext(cb, context) : cb;
	
	  this._callbacks = this._callbacks || {};
	
	  while (type = types.shift()) {
	    this._callbacks[type] = this._callbacks[type] || {sync: [], async: []};
	    this._callbacks[type][method].push(cb);
	  }
	
	  return this;
	}
	
	function onAsync(types, cb, context) {
	  return on.call(this, 'async', types, cb, context);
	}
	
	function onSync(types, cb, context) {
	  return on.call(this, 'sync', types, cb, context);
	}
	
	function off(types) {
	  var type;
	
	  if (!this._callbacks) {
	    return this;
	  }
	
	  types = types.split(splitter);
	
	  while (type = types.shift()) {
	    delete this._callbacks[type];
	  }
	
	  return this;
	}
	
	function trigger(types) {
	  var type;
	  var callbacks;
	  var args;
	  var syncFlush;
	  var asyncFlush;
	
	  if (!this._callbacks) {
	    return this;
	  }
	
	  types = types.split(splitter);
	  args = [].slice.call(arguments, 1);
	
	  while ((type = types.shift()) && (callbacks = this._callbacks[type])) { // eslint-disable-line
	    syncFlush = getFlush(callbacks.sync, this, [type].concat(args));
	    asyncFlush = getFlush(callbacks.async, this, [type].concat(args));
	
	    if (syncFlush()) {
	      immediate(asyncFlush);
	    }
	  }
	
	  return this;
	}
	
	function getFlush(callbacks, context, args) {
	  return flush;
	
	  function flush() {
	    var cancelled;
	
	    for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
	      // only cancel if the callback explicitly returns false
	      cancelled = callbacks[i].apply(context, args) === false;
	    }
	
	    return !cancelled;
	  }
	}
	
	function bindContext(fn, context) {
	  return fn.bind ?
	    fn.bind(context) :
	    function() { fn.apply(context, [].slice.call(arguments, 0)); };
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var types = [
	  __webpack_require__(25),
	  __webpack_require__(26),
	  __webpack_require__(27),
	  __webpack_require__(28),
	  __webpack_require__(29)
	];
	var draining;
	var currentQueue;
	var queueIndex = -1;
	var queue = [];
	var scheduled = false;
	function cleanUpNextTick() {
	  if (!draining || !currentQueue) {
	    return;
	  }
	  draining = false;
	  if (currentQueue.length) {
	    queue = currentQueue.concat(queue);
	  } else {
	    queueIndex = -1;
	  }
	  if (queue.length) {
	    nextTick();
	  }
	}
	
	//named nextTick for less confusing stack traces
	function nextTick() {
	  if (draining) {
	    return;
	  }
	  scheduled = false;
	  draining = true;
	  var len = queue.length;
	  var timeout = setTimeout(cleanUpNextTick);
	  while (len) {
	    currentQueue = queue;
	    queue = [];
	    while (currentQueue && ++queueIndex < len) {
	      currentQueue[queueIndex].run();
	    }
	    queueIndex = -1;
	    len = queue.length;
	  }
	  currentQueue = null;
	  queueIndex = -1;
	  draining = false;
	  clearTimeout(timeout);
	}
	var scheduleDrain;
	var i = -1;
	var len = types.length;
	while (++i < len) {
	  if (types[i] && types[i].test && types[i].test()) {
	    scheduleDrain = types[i].install(nextTick);
	    break;
	  }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	  this.fun = fun;
	  this.array = array;
	}
	Item.prototype.run = function () {
	  var fun = this.fun;
	  var array = this.array;
	  switch (array.length) {
	  case 0:
	    return fun();
	  case 1:
	    return fun(array[0]);
	  case 2:
	    return fun(array[0], array[1]);
	  case 3:
	    return fun(array[0], array[1], array[2]);
	  default:
	    return fun.apply(null, array);
	  }
	
	};
	module.exports = immediate;
	function immediate(task) {
	  var args = new Array(arguments.length - 1);
	  if (arguments.length > 1) {
	    for (var i = 1; i < arguments.length; i++) {
	      args[i - 1] = arguments[i];
	    }
	  }
	  queue.push(new Item(task, args));
	  if (!scheduled && !draining) {
	    scheduled = true;
	    scheduleDrain();
	  }
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	exports.test = function () {
	  // Don't get fooled by e.g. browserify environments.
	  return (typeof process !== 'undefined') && !process.browser;
	};
	
	exports.install = function (func) {
	  return function () {
	    process.nextTick(func);
	  };
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 26 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	//based off rsvp https://github.com/tildeio/rsvp.js
	//license https://github.com/tildeio/rsvp.js/blob/master/LICENSE
	//https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/asap.js
	
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;
	
	exports.test = function () {
	  return Mutation;
	};
	
	exports.install = function (handle) {
	  var called = 0;
	  var observer = new Mutation(handle);
	  var element = global.document.createTextNode('');
	  observer.observe(element, {
	    characterData: true
	  });
	  return function () {
	    element.data = (called = ++called % 2);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 27 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	exports.test = function () {
	  if (global.setImmediate) {
	    // we can only get here in IE10
	    // which doesn't handel postMessage well
	    return false;
	  }
	  return typeof global.MessageChannel !== 'undefined';
	};
	
	exports.install = function (func) {
	  var channel = new global.MessageChannel();
	  channel.port1.onmessage = func;
	  return function () {
	    channel.port2.postMessage(0);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 28 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	exports.test = function () {
	  return 'document' in global && 'onreadystatechange' in global.document.createElement('script');
	};
	
	exports.install = function (handle) {
	  return function () {
	
	    // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	    // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	    var scriptEl = global.document.createElement('script');
	    scriptEl.onreadystatechange = function () {
	      handle();
	
	      scriptEl.onreadystatechange = null;
	      scriptEl.parentNode.removeChild(scriptEl);
	      scriptEl = null;
	    };
	    global.document.documentElement.appendChild(scriptEl);
	
	    return handle;
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	exports.test = function () {
	  return true;
	};
	
	exports.install = function (t) {
	  return function () {
	    setTimeout(t, 0);
	  };
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(19);
	var DOM = __webpack_require__(18);
	var EventEmitter = __webpack_require__(23);
	var Dataset = __webpack_require__(31);
	var css = __webpack_require__(33);
	
	// constructor
	// -----------
	
	function Dropdown(o) {
	  var that = this;
	  var onSuggestionClick;
	  var onSuggestionMouseEnter;
	  var onSuggestionMouseLeave;
	
	  o = o || {};
	
	  if (!o.menu) {
	    _.error('menu is required');
	  }
	
	  if (!_.isArray(o.datasets) && !_.isObject(o.datasets)) {
	    _.error('1 or more datasets required');
	  }
	  if (!o.datasets) {
	    _.error('datasets is required');
	  }
	
	  this.isOpen = false;
	  this.isEmpty = true;
	  this.minLength = o.minLength || 0;
	  this.templates = {};
	  this.appendTo = o.appendTo || false;
	  this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
	  this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
	  this.cssClasses.prefix =
	    o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
	
	  // bound functions
	  onSuggestionClick = _.bind(this._onSuggestionClick, this);
	  onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
	  onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
	
	  var cssClass = _.className(this.cssClasses.prefix, this.cssClasses.suggestion);
	  this.$menu = DOM.element(o.menu)
	    .on('mouseenter.aa', cssClass, onSuggestionMouseEnter)
	    .on('mouseleave.aa', cssClass, onSuggestionMouseLeave)
	    .on('click.aa', cssClass, onSuggestionClick);
	
	  this.$container = o.appendTo ? o.wrapper : this.$menu;
	
	  if (o.templates && o.templates.header) {
	    this.templates.header = _.templatify(o.templates.header);
	    this.$menu.prepend(this.templates.header());
	  }
	
	  if (o.templates && o.templates.empty) {
	    this.templates.empty = _.templatify(o.templates.empty);
	    this.$empty = DOM.element('<div class="' +
	      _.className(this.cssClasses.prefix, this.cssClasses.empty, true) + '">' +
	      '</div>');
	    this.$menu.append(this.$empty);
	  }
	
	  this.datasets = _.map(o.datasets, function(oDataset) {
	    return initializeDataset(that.$menu, oDataset, o.cssClasses);
	  });
	  _.each(this.datasets, function(dataset) {
	    var root = dataset.getRoot();
	    if (root && root.parent().length === 0) {
	      that.$menu.append(root);
	    }
	    dataset.onSync('rendered', that._onRendered, that);
	  });
	
	  if (o.templates && o.templates.footer) {
	    this.templates.footer = _.templatify(o.templates.footer);
	    this.$menu.append(this.templates.footer());
	  }
	
	  var self = this;
	  DOM.element(window).resize(function() {
	    self._redraw();
	  });
	}
	
	// instance methods
	// ----------------
	
	_.mixin(Dropdown.prototype, EventEmitter, {
	
	  // ### private
	
	  _onSuggestionClick: function onSuggestionClick($e) {
	    this.trigger('suggestionClicked', DOM.element($e.currentTarget));
	  },
	
	  _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
	    var elt = DOM.element($e.currentTarget);
	    if (elt.hasClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true))) {
	      // we're already on the cursor
	      // => we're probably entering it again after leaving it for a nested div
	      return;
	    }
	    this._removeCursor();
	
	    // Fixes iOS double tap behaviour, by modifying the DOM right before the
	    // native href clicks happens, iOS will requires another tap to follow
	    // a suggestion that has an <a href> element inside
	    // https://www.google.com/search?q=ios+double+tap+bug+href
	    var suggestion = this;
	    setTimeout(function() {
	      // this exact line, when inside the main loop, will trigger a double tap bug
	      // on iOS devices
	      suggestion._setCursor(elt, false);
	    }, 0);
	  },
	
	  _onSuggestionMouseLeave: function onSuggestionMouseLeave($e) {
	    // $e.relatedTarget is the `EventTarget` the pointing device entered to
	    if ($e.relatedTarget) {
	      var elt = DOM.element($e.relatedTarget);
	      if (elt.closest('.' + _.className(this.cssClasses.prefix, this.cssClasses.cursor, true)).length > 0) {
	        // our father is a cursor
	        // => it means we're just leaving the suggestion for a nested div
	        return;
	      }
	    }
	    this._removeCursor();
	    this.trigger('cursorRemoved');
	  },
	
	  _onRendered: function onRendered(e, query) {
	    this.isEmpty = _.every(this.datasets, isDatasetEmpty);
	
	    if (this.isEmpty) {
	      if (query.length >= this.minLength) {
	        this.trigger('empty');
	      }
	
	      if (this.$empty) {
	        if (query.length < this.minLength) {
	          this._hide();
	        } else {
	          var html = this.templates.empty({
	            query: this.datasets[0] && this.datasets[0].query
	          });
	          this.$empty.html(html);
	          this._show();
	        }
	      } else if (_.any(this.datasets, hasEmptyTemplate)) {
	        if (query.length < this.minLength) {
	          this._hide();
	        } else {
	          this._show();
	        }
	      } else {
	        this._hide();
	      }
	    } else if (this.isOpen) {
	      if (this.$empty) {
	        this.$empty.empty();
	      }
	
	      if (query.length >= this.minLength) {
	        this._show();
	      } else {
	        this._hide();
	      }
	    }
	
	    this.trigger('datasetRendered');
	
	    function isDatasetEmpty(dataset) {
	      return dataset.isEmpty();
	    }
	
	    function hasEmptyTemplate(dataset) {
	      return dataset.templates && dataset.templates.empty;
	    }
	  },
	
	  _hide: function() {
	    this.$container.hide();
	  },
	
	  _show: function() {
	    // can't use jQuery#show because $menu is a span element we want
	    // display: block; not dislay: inline;
	    this.$container.css('display', 'block');
	
	    this._redraw();
	
	    this.trigger('shown');
	  },
	
	  _redraw: function redraw() {
	    if (!this.isOpen || !this.appendTo) return;
	
	    this.trigger('redrawn');
	  },
	
	  _getSuggestions: function getSuggestions() {
	    return this.$menu.find(_.className(this.cssClasses.prefix, this.cssClasses.suggestion));
	  },
	
	  _getCursor: function getCursor() {
	    return this.$menu.find(_.className(this.cssClasses.prefix, this.cssClasses.cursor)).first();
	  },
	
	  _setCursor: function setCursor($el, updateInput) {
	    $el.first()
	      .addClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true))
	      .attr('aria-selected', 'true');
	    this.trigger('cursorMoved', updateInput);
	  },
	
	  _removeCursor: function removeCursor() {
	    this._getCursor()
	      .removeClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true))
	      .removeAttr('aria-selected');
	  },
	
	  _moveCursor: function moveCursor(increment) {
	    var $suggestions;
	    var $oldCursor;
	    var newCursorIndex;
	    var $newCursor;
	
	    if (!this.isOpen) {
	      return;
	    }
	
	    $oldCursor = this._getCursor();
	    $suggestions = this._getSuggestions();
	
	    this._removeCursor();
	
	    // shifting before and after modulo to deal with -1 index
	    newCursorIndex = $suggestions.index($oldCursor) + increment;
	    newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
	
	    if (newCursorIndex === -1) {
	      this.trigger('cursorRemoved');
	
	      return;
	    } else if (newCursorIndex < -1) {
	      newCursorIndex = $suggestions.length - 1;
	    }
	
	    this._setCursor($newCursor = $suggestions.eq(newCursorIndex), true);
	
	    // in the case of scrollable overflow
	    // make sure the cursor is visible in the menu
	    this._ensureVisible($newCursor);
	  },
	
	  _ensureVisible: function ensureVisible($el) {
	    var elTop;
	    var elBottom;
	    var menuScrollTop;
	    var menuHeight;
	
	    elTop = $el.position().top;
	    elBottom = elTop + $el.height() +
	      parseInt($el.css('margin-top'), 10) +
	      parseInt($el.css('margin-bottom'), 10);
	    menuScrollTop = this.$menu.scrollTop();
	    menuHeight = this.$menu.height() +
	      parseInt(this.$menu.css('paddingTop'), 10) +
	      parseInt(this.$menu.css('paddingBottom'), 10);
	
	    if (elTop < 0) {
	      this.$menu.scrollTop(menuScrollTop + elTop);
	    } else if (menuHeight < elBottom) {
	      this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
	    }
	  },
	
	  // ### public
	
	  close: function close() {
	    if (this.isOpen) {
	      this.isOpen = false;
	
	      this._removeCursor();
	      this._hide();
	
	      this.trigger('closed');
	    }
	  },
	
	  open: function open() {
	    if (!this.isOpen) {
	      this.isOpen = true;
	
	      if (!this.isEmpty) {
	        this._show();
	      }
	
	      this.trigger('opened');
	    }
	  },
	
	  setLanguageDirection: function setLanguageDirection(dir) {
	    this.$menu.css(dir === 'ltr' ? this.css.ltr : this.css.rtl);
	  },
	
	  moveCursorUp: function moveCursorUp() {
	    this._moveCursor(-1);
	  },
	
	  moveCursorDown: function moveCursorDown() {
	    this._moveCursor(+1);
	  },
	
	  getDatumForSuggestion: function getDatumForSuggestion($el) {
	    var datum = null;
	
	    if ($el.length) {
	      datum = {
	        raw: Dataset.extractDatum($el),
	        value: Dataset.extractValue($el),
	        datasetName: Dataset.extractDatasetName($el)
	      };
	    }
	
	    return datum;
	  },
	
	  getCurrentCursor: function getCurrentCursor() {
	    return this._getCursor().first();
	  },
	
	  getDatumForCursor: function getDatumForCursor() {
	    return this.getDatumForSuggestion(this._getCursor().first());
	  },
	
	  getDatumForTopSuggestion: function getDatumForTopSuggestion() {
	    return this.getDatumForSuggestion(this._getSuggestions().first());
	  },
	
	  cursorTopSuggestion: function cursorTopSuggestion() {
	    this._setCursor(this._getSuggestions().first(), false);
	  },
	
	  update: function update(query) {
	    _.each(this.datasets, updateDataset);
	
	    function updateDataset(dataset) {
	      dataset.update(query);
	    }
	  },
	
	  empty: function empty() {
	    _.each(this.datasets, clearDataset);
	    this.isEmpty = true;
	
	    function clearDataset(dataset) {
	      dataset.clear();
	    }
	  },
	
	  isVisible: function isVisible() {
	    return this.isOpen && !this.isEmpty;
	  },
	
	  destroy: function destroy() {
	    this.$menu.off('.aa');
	
	    this.$menu = null;
	
	    _.each(this.datasets, destroyDataset);
	
	    function destroyDataset(dataset) {
	      dataset.destroy();
	    }
	  }
	});
	
	// helper functions
	// ----------------
	Dropdown.Dataset = Dataset;
	
	function initializeDataset($menu, oDataset, cssClasses) {
	  return new Dropdown.Dataset(_.mixin({$menu: $menu, cssClasses: cssClasses}, oDataset));
	}
	
	module.exports = Dropdown;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var datasetKey = 'aaDataset';
	var valueKey = 'aaValue';
	var datumKey = 'aaDatum';
	
	var _ = __webpack_require__(19);
	var DOM = __webpack_require__(18);
	var html = __webpack_require__(32);
	var css = __webpack_require__(33);
	var EventEmitter = __webpack_require__(23);
	
	// constructor
	// -----------
	
	function Dataset(o) {
	  o = o || {};
	  o.templates = o.templates || {};
	
	  if (!o.source) {
	    _.error('missing source');
	  }
	
	  if (o.name && !isValidName(o.name)) {
	    _.error('invalid dataset name: ' + o.name);
	  }
	
	  // tracks the last query the dataset was updated for
	  this.query = null;
	  this._isEmpty = true;
	
	  this.highlight = !!o.highlight;
	  this.name = typeof o.name === 'undefined' || o.name === null ? _.getUniqueId() : o.name;
	
	  this.source = o.source;
	  this.displayFn = getDisplayFn(o.display || o.displayKey);
	
	  this.templates = getTemplates(o.templates, this.displayFn);
	
	  this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
	  this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
	  this.cssClasses.prefix =
	    o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
	
	  var clazz = _.className(this.cssClasses.prefix, this.cssClasses.dataset);
	  this.$el = o.$menu && o.$menu.find(clazz + '-' + this.name).length > 0 ?
	    DOM.element(o.$menu.find(clazz + '-' + this.name)[0]) :
	    DOM.element(
	      html.dataset.replace('%CLASS%', this.name)
	        .replace('%PREFIX%', this.cssClasses.prefix)
	        .replace('%DATASET%', this.cssClasses.dataset)
	    );
	
	  this.$menu = o.$menu;
	}
	
	// static methods
	// --------------
	
	Dataset.extractDatasetName = function extractDatasetName(el) {
	  return DOM.element(el).data(datasetKey);
	};
	
	Dataset.extractValue = function extractValue(el) {
	  return DOM.element(el).data(valueKey);
	};
	
	Dataset.extractDatum = function extractDatum(el) {
	  var datum = DOM.element(el).data(datumKey);
	  if (typeof datum === 'string') {
	    // Zepto has an automatic deserialization of the
	    // JSON encoded data attribute
	    datum = JSON.parse(datum);
	  }
	  return datum;
	};
	
	// instance methods
	// ----------------
	
	_.mixin(Dataset.prototype, EventEmitter, {
	
	  // ### private
	
	  _render: function render(query, suggestions) {
	    if (!this.$el) {
	      return;
	    }
	    var that = this;
	
	    var hasSuggestions;
	    var renderArgs = [].slice.call(arguments, 2);
	    this.$el.empty();
	
	    hasSuggestions = suggestions && suggestions.length;
	    this._isEmpty = !hasSuggestions;
	
	    if (!hasSuggestions && this.templates.empty) {
	      this.$el
	        .html(getEmptyHtml.apply(this, renderArgs))
	        .prepend(that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null)
	        .append(that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null);
	    } else if (hasSuggestions) {
	      this.$el
	        .html(getSuggestionsHtml.apply(this, renderArgs))
	        .prepend(that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null)
	        .append(that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null);
	    }
	
	    if (this.$menu) {
	      this.$menu.addClass(
	        this.cssClasses.prefix + (hasSuggestions ? 'with' : 'without') + '-' + this.name
	      ).removeClass(
	        this.cssClasses.prefix + (hasSuggestions ? 'without' : 'with') + '-' + this.name
	      );
	    }
	
	    this.trigger('rendered', query);
	
	    function getEmptyHtml() {
	      var args = [].slice.call(arguments, 0);
	      args = [{query: query, isEmpty: true}].concat(args);
	      return that.templates.empty.apply(this, args);
	    }
	
	    function getSuggestionsHtml() {
	      var args = [].slice.call(arguments, 0);
	      var $suggestions;
	      var nodes;
	      var self = this;
	
	      var suggestionsHtml = html.suggestions.
	        replace('%PREFIX%', this.cssClasses.prefix).
	        replace('%SUGGESTIONS%', this.cssClasses.suggestions);
	      $suggestions = DOM
	        .element(suggestionsHtml)
	        .css(this.css.suggestions);
	
	      // jQuery#append doesn't support arrays as the first argument
	      // until version 1.8, see http://bugs.jquery.com/ticket/11231
	      nodes = _.map(suggestions, getSuggestionNode);
	      $suggestions.append.apply($suggestions, nodes);
	
	      return $suggestions;
	
	      function getSuggestionNode(suggestion) {
	        var $el;
	
	        var suggestionHtml = html.suggestion.
	          replace('%PREFIX%', self.cssClasses.prefix).
	          replace('%SUGGESTION%', self.cssClasses.suggestion);
	        $el = DOM.element(suggestionHtml)
	          .attr({
	            role: 'option',
	            id: ['option', Math.floor(Math.random() * 100000000)].join('-')
	          })
	          .append(that.templates.suggestion.apply(this, [suggestion].concat(args)));
	
	        $el.data(datasetKey, that.name);
	        $el.data(valueKey, that.displayFn(suggestion) || undefined); // this led to undefined return value
	        $el.data(datumKey, JSON.stringify(suggestion));
	        $el.children().each(function() { DOM.element(this).css(self.css.suggestionChild); });
	
	        return $el;
	      }
	    }
	
	    function getHeaderHtml() {
	      var args = [].slice.call(arguments, 0);
	      args = [{query: query, isEmpty: !hasSuggestions}].concat(args);
	      return that.templates.header.apply(this, args);
	    }
	
	    function getFooterHtml() {
	      var args = [].slice.call(arguments, 0);
	      args = [{query: query, isEmpty: !hasSuggestions}].concat(args);
	      return that.templates.footer.apply(this, args);
	    }
	  },
	
	  // ### public
	
	  getRoot: function getRoot() {
	    return this.$el;
	  },
	
	  update: function update(query) {
	    var that = this;
	
	    this.query = query;
	    this.canceled = false;
	    this.source(query, render);
	
	    function render(suggestions) {
	      // if the update has been canceled or if the query has changed
	      // do not render the suggestions as they've become outdated
	      if (!that.canceled && query === that.query) {
	        // concat all the other arguments that could have been passed
	        // to the render function, and forward them to _render
	        var args = [].slice.call(arguments, 1);
	        args = [query, suggestions].concat(args);
	        that._render.apply(that, args);
	      }
	    }
	  },
	
	  cancel: function cancel() {
	    this.canceled = true;
	  },
	
	  clear: function clear() {
	    this.cancel();
	    this.$el.empty();
	    this.trigger('rendered', '');
	  },
	
	  isEmpty: function isEmpty() {
	    return this._isEmpty;
	  },
	
	  destroy: function destroy() {
	    this.$el = null;
	  }
	});
	
	// helper functions
	// ----------------
	
	function getDisplayFn(display) {
	  display = display || 'value';
	
	  return _.isFunction(display) ? display : displayFn;
	
	  function displayFn(obj) {
	    return obj[display];
	  }
	}
	
	function getTemplates(templates, displayFn) {
	  return {
	    empty: templates.empty && _.templatify(templates.empty),
	    header: templates.header && _.templatify(templates.header),
	    footer: templates.footer && _.templatify(templates.footer),
	    suggestion: templates.suggestion || suggestionTemplate
	  };
	
	  function suggestionTemplate(context) {
	    return '<p>' + displayFn(context) + '</p>';
	  }
	}
	
	function isValidName(str) {
	  // dashes, underscores, letters, and numbers
	  return (/^[_a-zA-Z0-9-]+$/).test(str);
	}
	
	module.exports = Dataset;


/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  wrapper: '<span class="%ROOT%"></span>',
	  dropdown: '<span class="%PREFIX%%DROPDOWN_MENU%"></span>',
	  dataset: '<div class="%PREFIX%%DATASET%-%CLASS%"></div>',
	  suggestions: '<span class="%PREFIX%%SUGGESTIONS%"></span>',
	  suggestion: '<div class="%PREFIX%%SUGGESTION%"></div>'
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(19);
	
	var css = {
	  wrapper: {
	    position: 'relative',
	    display: 'inline-block'
	  },
	  hint: {
	    position: 'absolute',
	    top: '0',
	    left: '0',
	    borderColor: 'transparent',
	    boxShadow: 'none',
	    // #741: fix hint opacity issue on iOS
	    opacity: '1'
	  },
	  input: {
	    position: 'relative',
	    verticalAlign: 'top',
	    backgroundColor: 'transparent'
	  },
	  inputWithNoHint: {
	    position: 'relative',
	    verticalAlign: 'top'
	  },
	  dropdown: {
	    position: 'absolute',
	    top: '100%',
	    left: '0',
	    zIndex: '100',
	    display: 'none'
	  },
	  suggestions: {
	    display: 'block'
	  },
	  suggestion: {
	    whiteSpace: 'nowrap',
	    cursor: 'pointer'
	  },
	  suggestionChild: {
	    whiteSpace: 'normal'
	  },
	  ltr: {
	    left: '0',
	    right: 'auto'
	  },
	  rtl: {
	    left: 'auto',
	    right: '0'
	  },
	  defaultClasses: {
	    root: 'algolia-autocomplete',
	    prefix: 'aa',
	    noPrefix: false,
	    dropdownMenu: 'dropdown-menu',
	    input: 'input',
	    hint: 'hint',
	    suggestions: 'suggestions',
	    suggestion: 'suggestion',
	    cursor: 'cursor',
	    dataset: 'dataset',
	    empty: 'empty'
	  },
	  // will be merged with the default ones if appendTo is used
	  appendTo: {
	    wrapper: {
	      position: 'absolute',
	      zIndex: '100',
	      display: 'none'
	    },
	    input: {},
	    inputWithNoHint: {},
	    dropdown: {
	      display: 'block'
	    }
	  }
	};
	
	// ie specific styling
	if (_.isMsie()) {
	  // ie6-8 (and 9?) doesn't fire hover and click events for elements with
	  // transparent backgrounds, for a workaround, use 1x1 transparent gif
	  _.mixin(css.input, {
	    backgroundImage: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)'
	  });
	}
	
	// ie7 and under specific styling
	if (_.isMsie() && _.isMsie() <= 7) {
	  // if someone can tell me why this is necessary to align
	  // the hint with the query in ie7, i'll send you $5 - @JakeHarding
	  _.mixin(css.input, {marginTop: '-1px'});
	}
	
	module.exports = css;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	  hits: __webpack_require__(35),
	  popularIn: __webpack_require__(38)
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(19);
	var version = __webpack_require__(36);
	var parseAlgoliaClientVersion = __webpack_require__(37);
	
	module.exports = function search(index, params) {
	  var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
	  if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
	    params = params || {};
	    params.additionalUA = 'autocomplete.js ' + version;
	  }
	  return sourceFn;
	
	  function sourceFn(query, cb) {
	    index.search(query, params, function(error, content) {
	      if (error) {
	        _.error(error.message);
	        return;
	      }
	      cb(content.hits, content);
	    });
	  }
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "0.28.1";


/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function parseAlgoliaClientVersion(agent) {
	  var parsed = agent.match(/Algolia for vanilla JavaScript (\d+\.)(\d+\.)(\d+)/);
	  if (parsed) return [parsed[1], parsed[2], parsed[3]];
	  return undefined;
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(19);
	var version = __webpack_require__(36);
	var parseAlgoliaClientVersion = __webpack_require__(37);
	
	module.exports = function popularIn(index, params, details, options) {
	  var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
	  if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
	    params = params || {};
	    params.additionalUA = 'autocomplete.js ' + version;
	  }
	  if (!details.source) {
	    return _.error("Missing 'source' key");
	  }
	  var source = _.isFunction(details.source) ? details.source : function(hit) { return hit[details.source]; };
	
	  if (!details.index) {
	    return _.error("Missing 'index' key");
	  }
	  var detailsIndex = details.index;
	
	  options = options || {};
	
	  return sourceFn;
	
	  function sourceFn(query, cb) {
	    index.search(query, params, function(error, content) {
	      if (error) {
	        _.error(error.message);
	        return;
	      }
	
	      if (content.hits.length > 0) {
	        var first = content.hits[0];
	
	        var detailsParams = _.mixin({hitsPerPage: 0}, details);
	        delete detailsParams.source; // not a query parameter
	        delete detailsParams.index; // not a query parameter
	
	        var detailsAlgoliaVersion = parseAlgoliaClientVersion(detailsIndex.as._ua);
	        if (detailsAlgoliaVersion && detailsAlgoliaVersion[0] >= 3 && detailsAlgoliaVersion[1] > 20) {
	          params.additionalUA = 'autocomplete.js ' + version;
	        }
	
	        detailsIndex.search(source(first), detailsParams, function(error2, content2) {
	          if (error2) {
	            _.error(error2.message);
	            return;
	          }
	
	          var suggestions = [];
	
	          // add the 'all department' entry before others
	          if (options.includeAll) {
	            var label = options.allTitle || 'All departments';
	            suggestions.push(_.mixin({
	              facet: {value: label, count: content2.nbHits}
	            }, _.cloneDeep(first)));
	          }
	
	          // enrich the first hit iterating over the facets
	          _.each(content2.facets, function(values, facet) {
	            _.each(values, function(count, value) {
	              suggestions.push(_.mixin({
	                facet: {facet: facet, value: value, count: count}
	              }, _.cloneDeep(first)));
	            });
	          });
	
	          // append all other hits
	          for (var i = 1; i < content.hits.length; ++i) {
	            suggestions.push(content.hits[i]);
	          }
	
	          cb(suggestions, content);
	        });
	
	        return;
	      }
	
	      cb([]);
	    });
	  }
	};


/***/ },
/* 39 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(41);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<div id=\"form_container\"><h1>Test of fuse.js (<a href=\"http://fusejs.io\">http://fusejs.io</a>)</h1><input type=\"text\" id=\"input1\" placeholder=\"Search\" value=\"\"><input type=\"text\" id=\"input2\" placeholder=\"test of autocomplet.js by algolia\" value=\"\"><button id=\"btn\">Go !</button></div><div class=\"header\">Fuse.js results</div><div class=\"header\">Test resuls for <a href=\"http://fusejs.io\">fuse.js</a></div><div id=\"fuse\" class=\"output_container\"></div><div class=\"header\">Fuzzaldrin results</div><div id=\"fuzzaldrin\" class=\"output_container\"></div><div class=\"header\">Fuzzaldrin-Plus results</div><div id=\"fuzzaldrin-plus\" class=\"output_container\"></div>");;return buf.join("");
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */
	
	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];
	
	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }
	
	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	};
	
	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function nulls(val) {
	  return val != null && val !== '';
	}
	
	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}
	
	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};
	
	
	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};
	
	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];
	
	  var keys = Object.keys(obj);
	
	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];
	
	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }
	
	  return buf.join('');
	};
	
	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */
	
	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;
	
	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}
	
	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};
	
	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */
	
	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(42).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);
	
	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');
	
	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};
	
	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 42 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map