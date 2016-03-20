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
/*!*********************************!*\
  !*** ./src/test/server.test.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(/*! dotenv */ 1).config();
	
	var chai = __webpack_require__(/*! chai */ 2);
	var expect = chai.expect;
	
	var testUrl = 'http://server.com/api/search?restaurant=chinese&lat=40.75493&lng=-73.98878';
	
	describe('server testing...', function () {
	
	  it('just pass', function () {
	    expect(null).to.be.equal(null);
	  });
	});

/***/ },
/* 1 */
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = require("dotenv");

/***/ },
/* 2 */
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/***/ function(module, exports) {

	module.exports = require("chai");

/***/ }
/******/ ]);
//# sourceMappingURL=server.test.js.map