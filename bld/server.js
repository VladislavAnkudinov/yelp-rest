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
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(/*! source-map-support/register */ 1);
	
	var _bunyan = __webpack_require__(/*! bunyan */ 6);
	
	var _bunyan2 = _interopRequireDefault(_bunyan);
	
	var _YelpRest = __webpack_require__(/*! ./YelpRest */ 7);
	
	var _YelpRest2 = _interopRequireDefault(_YelpRest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(/*! dotenv */ 12).config();
	exports.default = _YelpRest2.default;
	
	
	if (process.argv[1]) {
	  var ringbuffer;
	  var yelpRest;
	
	  (function () {
	    console.log('Runing server...');
	    var express = __webpack_require__(/*! express */ 13);
	    var app = express();
	    app.set('port', process.env.PORT);
	    ringbuffer = new _bunyan2.default.RingBuffer({ limit: 100 });
	
	    var log = _bunyan2.default.createLogger({
	      name: 'Yelp Rest Server',
	      streams: [{
	        level: 'info',
	        stream: process.stdout
	      }, {
	        level: 'trace',
	        type: 'raw', // use 'raw' to get raw log record objects
	        stream: ringbuffer
	      }]
	    });
	    yelpRest = new _YelpRest2.default({
	      yelpCredentials: {
	        consumer_key: process.env.YELP_CONSUMER_KEY,
	        consumer_secret: process.env.YELP_CONSUMER_SECRET,
	        token: process.env.YELP_TOKEN,
	        token_secret: process.env.YELP_TOKEN_SECRET
	      },
	      app: app,
	      log: log
	    });
	
	    app.set('log', log);
	    app.get('/api/search', yelpRest.middleware);
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
/*!******************************************!*\
  !*** ./~/source-map-support/register.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(/*! ./ */ 2).install();

/***/ },
/* 2 */
/*!****************************************************!*\
  !*** ./~/source-map-support/source-map-support.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var SourceMapConsumer = __webpack_require__(/*! source-map */ 3).SourceMapConsumer;
	var path = __webpack_require__(/*! path */ 4);
	var fs = __webpack_require__(/*! fs */ 5);
	
	// Only install once if called multiple times
	var errorFormatterInstalled = false;
	var uncaughtShimInstalled = false;
	
	// If true, the caches are reset before a stack trace formatting operation
	var emptyCacheBetweenOperations = false;
	
	// Supports {browser, node, auto}
	var environment = "auto";
	
	// Maps a file path to a string containing the file contents
	var fileContentsCache = {};
	
	// Maps a file path to a source map for that file
	var sourceMapCache = {};
	
	// Regex for detecting source maps
	var reSourceMap = /^data:application\/json[^,]+base64,/;
	
	// Priority list of retrieve handlers
	var retrieveFileHandlers = [];
	var retrieveMapHandlers = [];
	
	function isInBrowser() {
	  if (environment === "browser") return true;
	  if (environment === "node") return false;
	  return typeof window !== 'undefined' && typeof XMLHttpRequest === 'function';
	}
	
	function hasGlobalProcessEventEmitter() {
	  return (typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && process !== null && typeof process.on === 'function';
	}
	
	function handlerExec(list) {
	  return function (arg) {
	    for (var i = 0; i < list.length; i++) {
	      var ret = list[i](arg);
	      if (ret) {
	        return ret;
	      }
	    }
	    return null;
	  };
	}
	
	var retrieveFile = handlerExec(retrieveFileHandlers);
	
	retrieveFileHandlers.push(function (path) {
	  // Trim the path to make sure there is no extra whitespace.
	  path = path.trim();
	  if (path in fileContentsCache) {
	    return fileContentsCache[path];
	  }
	
	  try {
	    // Use SJAX if we are in the browser
	    if (isInBrowser()) {
	      var xhr = new XMLHttpRequest();
	      xhr.open('GET', path, false);
	      xhr.send(null);
	      var contents = null;
	      if (xhr.readyState === 4 && xhr.status === 200) {
	        contents = xhr.responseText;
	      }
	    }
	
	    // Otherwise, use the filesystem
	    else {
	        var contents = fs.readFileSync(path, 'utf8');
	      }
	  } catch (e) {
	    var contents = null;
	  }
	
	  return fileContentsCache[path] = contents;
	});
	
	// Support URLs relative to a directory, but be careful about a protocol prefix
	// in case we are in the browser (i.e. directories may start with "http://")
	function supportRelativeURL(file, url) {
	  if (!file) return url;
	  var dir = path.dirname(file);
	  var match = /^\w+:\/\/[^\/]*/.exec(dir);
	  var protocol = match ? match[0] : '';
	  return protocol + path.resolve(dir.slice(protocol.length), url);
	}
	
	function retrieveSourceMapURL(source) {
	  var fileData;
	
	  if (isInBrowser()) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', source, false);
	    xhr.send(null);
	    fileData = xhr.readyState === 4 ? xhr.responseText : null;
	
	    // Support providing a sourceMappingURL via the SourceMap header
	    var sourceMapHeader = xhr.getResponseHeader("SourceMap") || xhr.getResponseHeader("X-SourceMap");
	    if (sourceMapHeader) {
	      return sourceMapHeader;
	    }
	  }
	
	  // Get the URL of the source map
	  fileData = retrieveFile(source);
	  //        //# sourceMappingURL=foo.js.map                       /*# sourceMappingURL=foo.js.map */
	  var re = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg;
	  // Keep executing the search to find the *last* sourceMappingURL to avoid
	  // picking up sourceMappingURLs from comments, strings, etc.
	  var lastMatch, match;
	  while (match = re.exec(fileData)) {
	    lastMatch = match;
	  }if (!lastMatch) return null;
	  return lastMatch[1];
	};
	
	// Can be overridden by the retrieveSourceMap option to install. Takes a
	// generated source filename; returns a {map, optional url} object, or null if
	// there is no source map.  The map field may be either a string or the parsed
	// JSON object (ie, it must be a valid argument to the SourceMapConsumer
	// constructor).
	var retrieveSourceMap = handlerExec(retrieveMapHandlers);
	retrieveMapHandlers.push(function (source) {
	  var sourceMappingURL = retrieveSourceMapURL(source);
	  if (!sourceMappingURL) return null;
	
	  // Read the contents of the source map
	  var sourceMapData;
	  if (reSourceMap.test(sourceMappingURL)) {
	    // Support source map URL as a data url
	    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
	    sourceMapData = new Buffer(rawData, "base64").toString();
	    sourceMappingURL = null;
	  } else {
	    // Support source map URLs relative to the source URL
	    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
	    sourceMapData = retrieveFile(sourceMappingURL);
	  }
	
	  if (!sourceMapData) {
	    return null;
	  }
	
	  return {
	    url: sourceMappingURL,
	    map: sourceMapData
	  };
	});
	
	function mapSourcePosition(position) {
	  var sourceMap = sourceMapCache[position.source];
	  if (!sourceMap) {
	    // Call the (overrideable) retrieveSourceMap function to get the source map.
	    var urlAndMap = retrieveSourceMap(position.source);
	    if (urlAndMap) {
	      sourceMap = sourceMapCache[position.source] = {
	        url: urlAndMap.url,
	        map: new SourceMapConsumer(urlAndMap.map)
	      };
	
	      // Load all sources stored inline with the source map into the file cache
	      // to pretend like they are already loaded. They may not exist on disk.
	      if (sourceMap.map.sourcesContent) {
	        sourceMap.map.sources.forEach(function (source, i) {
	          var contents = sourceMap.map.sourcesContent[i];
	          if (contents) {
	            var url = supportRelativeURL(sourceMap.url, source);
	            fileContentsCache[url] = contents;
	          }
	        });
	      }
	    } else {
	      sourceMap = sourceMapCache[position.source] = {
	        url: null,
	        map: null
	      };
	    }
	  }
	
	  // Resolve the source URL relative to the URL of the source map
	  if (sourceMap && sourceMap.map) {
	    var originalPosition = sourceMap.map.originalPositionFor(position);
	
	    // Only return the original position if a matching line was found. If no
	    // matching line is found then we return position instead, which will cause
	    // the stack trace to print the path and line for the compiled file. It is
	    // better to give a precise location in the compiled file than a vague
	    // location in the original file.
	    if (originalPosition.source !== null) {
	      originalPosition.source = supportRelativeURL(sourceMap.url, originalPosition.source);
	      return originalPosition;
	    }
	  }
	
	  return position;
	}
	
	// Parses code generated by FormatEvalOrigin(), a function inside V8:
	// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
	function mapEvalOrigin(origin) {
	  // Most eval() calls are in this format
	  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
	  if (match) {
	    var position = mapSourcePosition({
	      source: match[2],
	      line: match[3],
	      column: match[4] - 1
	    });
	    return 'eval at ' + match[1] + ' (' + position.source + ':' + position.line + ':' + (position.column + 1) + ')';
	  }
	
	  // Parse nested eval() calls using recursion
	  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
	  if (match) {
	    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
	  }
	
	  // Make sure we still return useful information if we didn't find anything
	  return origin;
	}
	
	// This is copied almost verbatim from the V8 source code at
	// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
	// implementation of wrapCallSite() used to just forward to the actual source
	// code of CallSite.prototype.toString but unfortunately a new release of V8
	// did something to the prototype chain and broke the shim. The only fix I
	// could find was copy/paste.
	function CallSiteToString() {
	  var fileName;
	  var fileLocation = "";
	  if (this.isNative()) {
	    fileLocation = "native";
	  } else {
	    fileName = this.getScriptNameOrSourceURL();
	    if (!fileName && this.isEval()) {
	      fileLocation = this.getEvalOrigin();
	      fileLocation += ", "; // Expecting source position to follow.
	    }
	
	    if (fileName) {
	      fileLocation += fileName;
	    } else {
	      // Source code does not originate from a file and is not native, but we
	      // can still get the source position inside the source string, e.g. in
	      // an eval string.
	      fileLocation += "<anonymous>";
	    }
	    var lineNumber = this.getLineNumber();
	    if (lineNumber != null) {
	      fileLocation += ":" + lineNumber;
	      var columnNumber = this.getColumnNumber();
	      if (columnNumber) {
	        fileLocation += ":" + columnNumber;
	      }
	    }
	  }
	
	  var line = "";
	  var functionName = this.getFunctionName();
	  var addSuffix = true;
	  var isConstructor = this.isConstructor();
	  var isMethodCall = !(this.isToplevel() || isConstructor);
	  if (isMethodCall) {
	    var typeName = this.getTypeName();
	    var methodName = this.getMethodName();
	    if (functionName) {
	      if (typeName && functionName.indexOf(typeName) != 0) {
	        line += typeName + ".";
	      }
	      line += functionName;
	      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
	        line += " [as " + methodName + "]";
	      }
	    } else {
	      line += typeName + "." + (methodName || "<anonymous>");
	    }
	  } else if (isConstructor) {
	    line += "new " + (functionName || "<anonymous>");
	  } else if (functionName) {
	    line += functionName;
	  } else {
	    line += fileLocation;
	    addSuffix = false;
	  }
	  if (addSuffix) {
	    line += " (" + fileLocation + ")";
	  }
	  return line;
	}
	
	function cloneCallSite(frame) {
	  var object = {};
	  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function (name) {
	    object[name] = /^(?:is|get)/.test(name) ? function () {
	      return frame[name].call(frame);
	    } : frame[name];
	  });
	  object.toString = CallSiteToString;
	  return object;
	}
	
	function wrapCallSite(frame) {
	  // Most call sites will return the source file from getFileName(), but code
	  // passed to eval() ending in "//# sourceURL=..." will return the source file
	  // from getScriptNameOrSourceURL() instead
	  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
	  if (source) {
	    var line = frame.getLineNumber();
	    var column = frame.getColumnNumber() - 1;
	
	    // Fix position in Node where some (internal) code is prepended.
	    // See https://github.com/evanw/node-source-map-support/issues/36
	    if (line === 1 && !isInBrowser() && !frame.isEval()) {
	      column -= 62;
	    }
	
	    var position = mapSourcePosition({
	      source: source,
	      line: line,
	      column: column
	    });
	    frame = cloneCallSite(frame);
	    frame.getFileName = function () {
	      return position.source;
	    };
	    frame.getLineNumber = function () {
	      return position.line;
	    };
	    frame.getColumnNumber = function () {
	      return position.column + 1;
	    };
	    frame.getScriptNameOrSourceURL = function () {
	      return position.source;
	    };
	    return frame;
	  }
	
	  // Code called using eval() needs special handling
	  var origin = frame.isEval() && frame.getEvalOrigin();
	  if (origin) {
	    origin = mapEvalOrigin(origin);
	    frame = cloneCallSite(frame);
	    frame.getEvalOrigin = function () {
	      return origin;
	    };
	    return frame;
	  }
	
	  // If we get here then we were unable to change the source position
	  return frame;
	}
	
	// This function is part of the V8 stack trace API, for more info see:
	// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	function prepareStackTrace(error, stack) {
	  if (emptyCacheBetweenOperations) {
	    fileContentsCache = {};
	    sourceMapCache = {};
	  }
	
	  return error + stack.map(function (frame) {
	    return '\n    at ' + wrapCallSite(frame);
	  }).join('');
	}
	
	// Generate position and snippet of original source with pointer
	function getErrorSource(error) {
	  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
	  if (match) {
	    var source = match[1];
	    var line = +match[2];
	    var column = +match[3];
	
	    // Support the inline sourceContents inside the source map
	    var contents = fileContentsCache[source];
	
	    // Support files on disk
	    if (!contents && fs.existsSync(source)) {
	      contents = fs.readFileSync(source, 'utf8');
	    }
	
	    // Format the line from the original source code like node does
	    if (contents) {
	      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
	      if (code) {
	        return source + ':' + line + '\n' + code + '\n' + new Array(column).join(' ') + '^';
	      }
	    }
	  }
	  return null;
	}
	
	function printErrorAndExit(error) {
	  var source = getErrorSource(error);
	
	  if (source) {
	    console.error();
	    console.error(source);
	  }
	
	  console.error(error.stack);
	  process.exit(1);
	}
	
	function shimEmitUncaughtException() {
	  var origEmit = process.emit;
	
	  process.emit = function (type) {
	    if (type === 'uncaughtException') {
	      var hasStack = arguments[1] && arguments[1].stack;
	      var hasListeners = this.listeners(type).length > 0;
	
	      if (hasStack && !hasListeners) {
	        return printErrorAndExit(arguments[1]);
	      }
	    }
	
	    return origEmit.apply(this, arguments);
	  };
	}
	
	exports.wrapCallSite = wrapCallSite;
	exports.getErrorSource = getErrorSource;
	exports.mapSourcePosition = mapSourcePosition;
	exports.retrieveSourceMap = retrieveSourceMap;
	
	exports.install = function (options) {
	  options = options || {};
	
	  if (options.environment) {
	    environment = options.environment;
	    if (["node", "browser", "auto"].indexOf(environment) === -1) {
	      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}");
	    }
	  }
	
	  // Allow sources to be found by methods other than reading the files
	  // directly from disk.
	  if (options.retrieveFile) {
	    if (options.overrideRetrieveFile) {
	      retrieveFileHandlers.length = 0;
	    }
	
	    retrieveFileHandlers.unshift(options.retrieveFile);
	  }
	
	  // Allow source maps to be found by methods other than reading the files
	  // directly from disk.
	  if (options.retrieveSourceMap) {
	    if (options.overrideRetrieveSourceMap) {
	      retrieveMapHandlers.length = 0;
	    }
	
	    retrieveMapHandlers.unshift(options.retrieveSourceMap);
	  }
	
	  // Configure options
	  if (!emptyCacheBetweenOperations) {
	    emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ? options.emptyCacheBetweenOperations : false;
	  }
	
	  // Install the error reformatter
	  if (!errorFormatterInstalled) {
	    errorFormatterInstalled = true;
	    Error.prepareStackTrace = prepareStackTrace;
	  }
	
	  if (!uncaughtShimInstalled) {
	    var installHandler = 'handleUncaughtExceptions' in options ? options.handleUncaughtExceptions : true;
	
	    // Provide the option to not install the uncaught exception handler. This is
	    // to support other uncaught exception handlers (in test frameworks, for
	    // example). If this handler is not installed and there are no other uncaught
	    // exception handlers, uncaught exceptions will be caught by node's built-in
	    // exception handler and the process will still be terminated. However, the
	    // generated JavaScript code will be shown above the stack trace instead of
	    // the original source code.
	    if (installHandler && hasGlobalProcessEventEmitter()) {
	      uncaughtShimInstalled = true;
	      shimEmitUncaughtException();
	    }
	  }
	};

/***/ },
/* 3 */
/*!*****************************!*\
  !*** external "source-map" ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = require("source-map");

/***/ },
/* 4 */
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 6 */
/*!*************************!*\
  !*** external "bunyan" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = require("bunyan");

/***/ },
/* 7 */
/*!*************************!*\
  !*** ./src/YelpRest.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Yelp2 = __webpack_require__(/*! ./Yelp */ 8);
	
	var _Yelp3 = _interopRequireDefault(_Yelp2);
	
	var _lodash = __webpack_require__(/*! lodash */ 11);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var log;
	
	var YelpRest = function (_Yelp) {
	  _inherits(YelpRest, _Yelp);
	
	  function YelpRest(opts) {
	    _classCallCheck(this, YelpRest);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(YelpRest).call(this, opts.yelpCredentials));
	
	    _this.queryToParamsMapper = function (query) {
	      var params = _lodash2.default.clone(query);
	      _lodash2.default.extend(params, {
	        term: 'food',
	        location: 'Montreal'
	      });
	      log.info('params =', params);
	      return params;
	    };
	
	    _this.middleware = function (req, res) {
	      log.info('got request');
	      log.info('query =', req.query);
	      var params = _this.queryToParamsMapper(req.query);
	      return _this.search(params).then(function (data) {
	        res.json(data);
	      }).catch(function (err) {
	        res.json(err);
	      });
	    };
	
	    _this.log = log = opts.log;
	    return _this;
	  }
	
	  return YelpRest;
	}(_Yelp3.default);
	
	exports.default = YelpRest;
	;

/***/ },
/* 8 */
/*!*********************!*\
  !*** ./src/Yelp.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _querystring = __webpack_require__(/*! querystring */ 9);
	
	var _querystring2 = _interopRequireDefault(_querystring);
	
	var _oauth = __webpack_require__(/*! oauth */ 10);
	
	var _oauth2 = _interopRequireDefault(_oauth);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OAuth = _oauth2.default.OAuth;
	
	var baseUrl = 'http://api.yelp.com/v2/';
	
	/**
	 * Yel class provides access to Yelp API
	 * @param {object} opts - The options, containing your Yelp credentials
	 * @param {string} author - The author of the book.
	 *
	 */
	
	var Yelp = function () {
	  function Yelp(opts) {
	    _classCallCheck(this, Yelp);
	
	    this.oauthToken = opts.token;
	    this.oauthTokenSecret = opts.token_secret;
	    this.oauth = new OAuth(null, null, opts.consumer_key, opts.consumer_secret, opts.version || '1.0', null, 'HMAC-SHA1');
	  }
	
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
	  }, {
	    key: 'search',
	    value: function search(params, callback) {
	      return this.get('search', params, callback);
	    }
	  }, {
	    key: 'business',
	    value: function business(id, callback) {
	      return this.get('business/' + id, undefined, callback);
	    }
	
	    /**
	     * Exampe:
	     * yelp.phone_search({phone: "+12223334444"}, function(error, data) {});
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
/* 9 */
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = require("querystring");

/***/ },
/* 10 */
/*!************************!*\
  !*** external "oauth" ***!
  \************************/
/***/ function(module, exports) {

	module.exports = require("oauth");

/***/ },
/* 11 */
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 12 */
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = require("dotenv");

/***/ },
/* 13 */
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = require("express");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map