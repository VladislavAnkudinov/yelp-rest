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
/*!*******************************!*\
  !*** ./src/test/Yelp.test.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(/*! dotenv/config */ 6);
	
	var _Yelp = __webpack_require__(/*! ../Yelp */ 1);
	
	var _Yelp2 = _interopRequireDefault(_Yelp);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var chai = __webpack_require__(/*! chai */ 5);
	var expect = chai.expect;
	
	var opts = {
	  consumer_key: process.env.YELP_CONSUMER_KEY,
	  consumer_secret: process.env.YELP_CONSUMER_SECRET,
	  token: process.env.YELP_TOKEN,
	  token_secret: process.env.YELP_TOKEN_SECRET
	};
	
	var yelp = new _Yelp2.default(opts);
	
	describe('Yelp API access testing...', function () {
	
	  it('yelp search', function (done) {
	    yelp.search({
	      term: 'food',
	      location: 'Montreal'
	    }).then(function (data) {
	      expect(data.region).to.be.an('object');
	      done();
	    }).catch(function (err) {
	      done(err);
	    });
	  });
	
	  it('yelp business', function (done) {
	    yelp.business('yelp-san-francisco').then(function (data) {
	      expect(data.is_claimed).to.equal(true);
	      expect(data.rating).to.be.a('number');
	      expect(data.mobile_url).to.be.a('string');
	      expect(data.categories).to.be.an('array');
	      expect(data.reviews).to.be.an('array');
	      done();
	    }).catch(function (err) {
	      done(err);
	    });
	  });
	
	  it('yelp phone search', function (done) {
	    yelp.phoneSearch({ phone: '+15555555555' }).then(function (data) {
	      expect(data.total).to.be.a('number');
	      expect(data.businesses).to.be.an('array');
	      done();
	    }).catch(function (err) {
	      done(err);
	    });
	  });
	
	  it('yelp - callback', function (done) {
	    yelp.search({
	      term: 'food',
	      location: 'Montreal'
	    }, function (err, data) {
	      if (err) return done(err);
	      expect(data.region).to.be.an('object');
	      expect(data.total).to.be.a('number');
	      expect(data.businesses).to.be.an('array');
	      done();
	    });
	  });
	});

/***/ },
/* 1 */
/*!*********************!*\
  !*** ./src/Yelp.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _querystring = __webpack_require__(/*! querystring */ 2);
	
	var _querystring2 = _interopRequireDefault(_querystring);
	
	var _oauth = __webpack_require__(/*! oauth */ 3);
	
	var _oauth2 = _interopRequireDefault(_oauth);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OAuth = _oauth2.default.OAuth;
	
	var baseUrl = 'http://api.yelp.com/v2/';
	
	/**
	 * Yelp class provides access to Yelp API
	 * @param {object} opts - The object, containing your Yelp credentials
	 * @param {string} opts.consumer_key - Consumer Key from Yelp's Manage API access
	 * @param {string} opts.consumer_secret - Consumer Secret from Yelp's Manage API access
	 * @param {string} opts.token - Token from Yelp's Manage API access
	 * @param {string} opts.token_secret - Token Secret from Yelp's Manage API access
	 */
	
	var Yelp = function () {
	  function Yelp(opts) {
	    _classCallCheck(this, Yelp);
	
	    this.oauthToken = opts.token;
	    this.oauthTokenSecret = opts.token_secret;
	    this.oauth = new OAuth(null, null, opts.consumer_key, opts.consumer_secret, opts.version || '1.0', null, 'HMAC-SHA1');
	  }
	
	  /**
	   * General Yelp API request
	   *
	   * @param {string} resource - Yelp API resource: search / buisiness/<id> / phone_search
	   * @param {object} params - Yelp API request parameters
	   * @param {function} cb - Callback function (optional)
	   * @returns {*}
	   */
	
	
	  _createClass(Yelp, [{
	    key: 'get',
	    value: function get(resource) {
	      var _this = this;
	
	      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	      var cb = arguments[2];
	
	      var promise = new Promise(function (resolve, reject) {
	        var debug = params.debug;
	        delete params.debug;
	
	        _this.oauth.get(baseUrl + resource + '?' + _querystring2.default.stringify(params), _this.oauthToken, _this.oauthTokenSecret, function (err, _data, response) {
	          if (err) return reject(err);
	          var data = JSON.parse(_data);
	          if (debug) return resolve([data, response]);
	          resolve(data);
	        });
	      });
	      if (typeof cb === 'function') {
	        promise.then(function (res) {
	          return cb(null, res);
	        }).catch(cb);
	        return null;
	      }
	      return promise;
	    }
	
	    /**
	     * Yelp Search API request
	     * https://www.yelp.com/developers/documentation/v2/search_api
	     * @param {object} params
	     * @param {function} callback
	     * @returns {Promise}
	     */
	
	  }, {
	    key: 'search',
	    value: function search(params, callback) {
	      return this.get('search', params, callback);
	    }
	
	    /**
	     * Yelp Business API request
	     * https://www.yelp.com/developers/documentation/v2/business
	     * @param {string} id - The business id at Yelp
	     * @param {function} callback
	     * @returns {Promise}
	     */
	
	  }, {
	    key: 'business',
	    value: function business(id, callback) {
	      return this.get('business/' + id, undefined, callback);
	    }
	
	    /**
	     * Yelp Phone Search API request
	     * https://www.yelp.com/developers/documentation/v2/phone_search
	     * @param {object} params - The object containing the phone
	     * @param {string} params.phone - The phone string, eg "+12223334444"
	     * @param {function} callback
	     * @returns {Promise}
	     */
	
	  }, {
	    key: 'phoneSearch',
	    value: function phoneSearch(params, callback) {
	      return this.get('phone_search', params, callback);
	    }
	  }]);
	
	  return Yelp;
	}();

	exports.default = Yelp;

/***/ },
/* 2 */
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = require("querystring");

/***/ },
/* 3 */
/*!************************!*\
  !*** external "oauth" ***!
  \************************/
/***/ function(module, exports) {

	module.exports = require("oauth");

/***/ },
/* 4 */,
/* 5 */
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/***/ function(module, exports) {

	module.exports = require("chai");

/***/ },
/* 6 */
/*!****************************!*\
  !*** ./~/dotenv/config.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	(function () {
	  var options = {};
	  process.argv.forEach(function (val, idx, arr) {
	    var matches = val.match(/^dotenv_config_(.+)=(.+)/);
	    if (matches) {
	      options[matches[1]] = matches[2];
	    }
	  });
	
	  __webpack_require__(/*! ./lib/main */ 7).config(options);
	})();

/***/ },
/* 7 */
/*!******************************!*\
  !*** ./~/dotenv/lib/main.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(/*! fs */ 8);
	
	module.exports = {
	  /*
	   * Main entry point into dotenv. Allows configuration before loading .env
	   * @param {Object} options - valid options: path ('.env'), encoding ('utf8')
	   * @returns {Boolean}
	  */
	  config: function config(options) {
	    var path = '.env';
	    var encoding = 'utf8';
	    var silent = false;
	
	    if (options) {
	      if (options.silent) {
	        silent = options.silent;
	      }
	      if (options.path) {
	        path = options.path;
	      }
	      if (options.encoding) {
	        encoding = options.encoding;
	      }
	    }
	
	    try {
	      // specifying an encoding returns a string instead of a buffer
	      var parsedObj = this.parse(fs.readFileSync(path, { encoding: encoding }));
	
	      Object.keys(parsedObj).forEach(function (key) {
	        process.env[key] = process.env[key] || parsedObj[key];
	      });
	
	      return parsedObj;
	    } catch (e) {
	      if (!silent) {
	        console.error(e);
	      }
	      return false;
	    }
	  },
	
	  /*
	   * Parses a string or buffer into an object
	   * @param {String|Buffer} src - source to be parsed
	   * @returns {Object}
	  */
	  parse: function parse(src) {
	    var obj = {};
	
	    // convert Buffers before splitting into lines and processing
	    src.toString().split('\n').forEach(function (line) {
	      // matching "KEY' and 'VAL' in 'KEY=VAL'
	      var keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
	      // matched?
	      if (keyValueArr != null) {
	        var key = keyValueArr[1];
	
	        // default undefined or missing values to empty string
	        var value = keyValueArr[2] ? keyValueArr[2] : '';
	
	        // expand newlines in quoted values
	        var len = value ? value.length : 0;
	        if (len > 0 && value.charAt(0) === '\"' && value.charAt(len - 1) === '\"') {
	          value = value.replace(/\\n/gm, '\n');
	        }
	
	        // remove any surrounding quotes and extra spaces
	        value = value.replace(/(^['"]|['"]$)/g, '').trim();
	
	        obj[key] = value;
	      }
	    });
	
	    return obj;
	  }
	
	};
	
	module.exports.load = module.exports.config;

/***/ },
/* 8 */
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ }
/******/ ]);
//# sourceMappingURL=Yelp.test.js.map