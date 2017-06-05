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
	
	// 1] init html
	__webpack_require__(3)
	const htmlbody = __webpack_require__(4)()
	document.body.innerHTML = htmlbody
	const btnEl    = document.getElementById('btn')
	const input1El = document.getElementById('input1')
	const outputEl = document.getElementById('output_container')
	input1El.select()
	input1El.focus()
	
	
	// 2] prepare the Search options
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
	
	search = function(input){
	  const startTime = performance.now()
	  const results   = fuse.search(input);
	  const endTime   = performance.now()
	  const duration  = numeral((endTime - startTime)/1000).format('0.000')
	  console.log(results);
	  var output      = ''
	  // compute the boldified html output
	  for (res of results){
	    path = res.item.path
	    var lastIndex = 0
	    var boldified = ''
	    if (res.matches[0].indices) {
	      for ( range of res.matches[0].indices) {
	        boldified +=  path.slice(lastIndex,range[0]) + '<b>' + path.slice(range[0],range[1]) + '</b>'
	        lastIndex = range[1]
	      }
	      boldified +=  path.slice(lastIndex)
	    } else {
	      boldified = path
	    }
	    output += `<p> <span class="score">${ numeral(res.score).format('0.000')}</span><span class="path"> ${boldified}</span></p>`
	  }
	  outputEl.innerHTML = `<p>Search in ${duration}ms</p>${output}`
	  }
	
	input1El.addEventListener('input', (e)=>{
	  search(e.target.value)}
	)
	
	// triger an imediate a search to ease debug
	function autoTrigerSearch(query) {
	  input1El.value = query
	  input1El.dispatchEvent(new Event('input'))
	}
	
	
	// 3] Prepare the list where to search and trigger one
	list_type = 'long list'
	list_type = 'small'
	list_type = 'pathes'
	if (list_type == 'small') {
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
	  fuse = new Fuse(list, options)
	  autoTrigerSearch('mik')
	
	}else if (list_type == 'pathes') {
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
	  fuse = new Fuse(list, options)
	  autoTrigerSearch('admin edf fact')
	
	}else if (list_type == 'long list') {
	  // get data from the the json file (/tools/path-list.json)
	  let url = 'path-list.json';
	  fetch(url)
	  .then(res => res.json())
	  .then((out) => {
	    console.log('Checkout this JSON! ', out);
	    list = out
	    fuse = new Fuse(list, options) // "list" is the item array
	    autoTrigerSearch('ordonnance')
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
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(5);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<div id=\"form_container\"><h1>Test of fuse.js (<a href=\"http://fusejs.io\">http://fusejs.io</a>)</h1><input type=\"text\" id=\"input1\" placeholder=\"Search\" value=\"\"><button id=\"btn\">Go !</button></div><div id=\"output_container\"></div>");;return buf.join("");
	}

/***/ },
/* 5 */
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
	    str = str || __webpack_require__(6).readFileSync(filename, 'utf8')
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
/* 6 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map