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

	'use strict';
	
	__webpack_require__(1);
	
	var _bunyan = __webpack_require__(4);
	
	var _bunyan2 = _interopRequireDefault(_bunyan);
	
	var _YelpRest = __webpack_require__(5);
	
	var _YelpRest2 = _interopRequireDefault(_YelpRest);
	
	var _express = __webpack_require__(10);
	
	var _express2 = _interopRequireDefault(_express);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//import 'source-map-support/register';
	
	
	var cluster = __webpack_require__(11);
	var numCPUs = __webpack_require__(12).cpus().length;
	// Number of workers, equals number of cores if not specified in .env
	var numWorkers = process.env.NUM_WORKERS || numCPUs;
	
	if (cluster.isMaster) {
	  var i;
	
	  (function () {
	    // Create logger
	    var ringbuffer = new _bunyan2.default.RingBuffer({ limit: 100 });
	    var log = _bunyan2.default.createLogger({
	      name: 'Yelp Rest Server Master ' + process.pid,
	      streams: [{
	        level: 'info',
	        stream: process.stdout
	      }, {
	        level: 'trace',
	        type: 'raw',
	        stream: ringbuffer
	      }]
	    });
	    // Fork workers.
	    for (i = 0; i < numWorkers; i++) {
	      log.info('Populating worker ' + i);
	      cluster.fork();
	    }
	    cluster.on('exit', function (worker, code, signal) {
	      log.info('YRS Worker ' + worker.process.pid + ' died');
	    });
	  })();
	} else {
	  var yelpRest;
	
	  (function () {
	    // Instantiate express app
	    var app = (0, _express2.default)();
	    app.set('port', process.env.PORT);
	
	    // Create logger
	    var ringbuffer = new _bunyan2.default.RingBuffer({ limit: 100 });
	    var log = _bunyan2.default.createLogger({
	      name: 'YRS Worker ' + process.pid,
	      streams: [{
	        level: 'info',
	        stream: process.stdout
	      }, {
	        level: 'trace',
	        type: 'raw',
	        stream: ringbuffer
	      }]
	    });
	    app.set('log', log);
	
	    // Instantiate YelpRest
	    yelpRest = new _YelpRest2.default({
	      yelpCredentials: {
	        consumer_key: process.env.YELP_CONSUMER_KEY,
	        consumer_secret: process.env.YELP_CONSUMER_SECRET,
	        token: process.env.YELP_TOKEN,
	        token_secret: process.env.YELP_TOKEN_SECRET
	      },
	      log: log
	    });
	
	    // Append search request handler
	
	    app.get('/api/search', yelpRest.search());
	
	    // Run the server
	    app.listen(process.env.PORT, function (err) {
	      if (err) {
	        log.error(err);
	        return;
	      }
	      log.info('Server listening on port ' + app.get('port') + '...');
	    });
	  })();
	}

/***/ },
/* 1 */
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
	
	  __webpack_require__(2).config(options);
	})();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(3);
	
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
/* 3 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("bunyan");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Yelp2 = __webpack_require__(6);
	
	var _Yelp3 = _interopRequireDefault(_Yelp2);
	
	var _lodash = __webpack_require__(9);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var log;
	
	// Constanst for Yelp Search API https://www.yelp.com/developers/documentation/v2/search_api
	var SORT_BEST_MATCHECED = 0;
	var SORT_DISTANCE = 1;
	var SORT_HIGHEST_RATED = 2;
	
	/**
	 * YelpRest extends Yelp class to provide REST access to Yelp class functionality
	 * @param {object} opts - The object, containing your Yelp credentials as subobject and logger
	 * @param {object} opts.yelpCredentials - The object, containing your Yelp credentials
	 * @param {string} opts.yelpCredentials.consumer_key - Consumer Key from Yelp's Manage API access
	 * @param {string} opts.yelpCredentials.consumer_secret - Consumer Secret from Yelp's Manage API access
	 * @param {string} opts.yelpCredentials.token - Token from Yelp's Manage API access
	 * @param {string} opts.yelpCredentials.token_secret - Token Secret from Yelp's Manage API access
	 */
	
	var YelpRest = function (_Yelp) {
	  _inherits(YelpRest, _Yelp);
	
	  function YelpRest(opts) {
	    _classCallCheck(this, YelpRest);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(YelpRest).call(this, opts.yelpCredentials));
	
	    _this.log = log = opts.log;
	    return _this;
	  }
	
	  /**
	   * Get YelpRest parameters and map it to Yelp API parameters
	   * @param {object} query - Query parameters accepted by YelpRest server
	   * @returns {object} - Query parameters mapped to Yelp API
	   */
	
	
	  _createClass(YelpRest, [{
	    key: 'search',
	
	
	    /**
	     * @returns {function(this:YelpRest)} -  YelpRest search request handler function
	     */
	    value: function search() {
	      var search = _get(Object.getPrototypeOf(YelpRest.prototype), 'search', this);
	      return function (req, res) {
	        log.info('got request, query =', req.query);
	        var params = YelpRest.queryToParamsMapper(req.query);
	        if (!params) {
	          var err = { error: 'Wrong query' };
	          log.error(err);
	          res.status(400).json(err);
	          return;
	        }
	        search.call(this, params).then(function (data) {
	          res.json(data);
	        }).catch(function (err) {
	          log.error(err);
	          res.status(400).json(err);
	        });
	      }.bind(this);
	    }
	  }], [{
	    key: 'queryToParamsMapper',
	    value: function queryToParamsMapper(query) {
	      query = _lodash2.default.clone(query);
	      if (!query.lat) return null; // latitude required
	      if (!query.lng) return null; // longitude required
	      var params = {
	        ll: query.lat + ',' + query.lng,
	        // Sort by distance if not specified.
	        sort: typeof query.sort == 'undefined' ? SORT_DISTANCE : query.sort
	      };
	      delete query.lat;
	      delete query.lng;
	      delete query.sort;
	      // Push everything despite coordinates and sort method to search term
	      params.term = Object.keys(query).map(function (key) {
	        return key + '+' + query[key];
	      }).join('+');
	      log.info('do request to Yelp API, params =', params);
	      return params;
	    }
	  }]);
	
	  return YelpRest;
	}(_Yelp3.default);
	
	exports.default = YelpRest;
	;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _querystring = __webpack_require__(7);
	
	var _querystring2 = _interopRequireDefault(_querystring);
	
	var _oauth = __webpack_require__(8);
	
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
/* 7 */
/***/ function(module, exports) {

	module.exports = require("querystring");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("oauth");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("cluster");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("os");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map