require('dotenv').config();

var chai = require('chai');
var expect = chai.expect;

var testUrl = 'http://server.com/api/search?restaurant=chinese&lat=40.75493&lng=-73.98878';

describe('server testing...', function () {

  it('just pass', function () {
    expect(null).to.be.equal(null);
  });

});