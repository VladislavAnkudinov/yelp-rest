import 'dotenv/config';

var chai = require('chai');
var expect = chai.expect;

import Yelp from '../Yelp';

const opts = {
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
};

const yelp = new Yelp(opts);

describe('Yelp API access testing...', function () {

  it('yelp search', function (done) {
    yelp.search({
        term: 'food',
        location: 'Montreal'
      })
      .then((data) => {
        expect(data.region).to.be.an('object');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('yelp business', function (done) {
    yelp.business('yelp-san-francisco')
      .then((data) => {
        expect(data.is_claimed).to.equal(true);
        expect(data.rating).to.be.a('number');
        expect(data.mobile_url).to.be.a('string');
        expect(data.categories).to.be.an('array');
        expect(data.reviews).to.be.an('array');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('yelp phone search', function (done) {
    yelp.phoneSearch({phone: '+15555555555'})
      .then((data) => {
        expect(data.total).to.be.a('number');
        expect(data.businesses).to.be.an('array');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('yelp - callback', function (done) {
    yelp.search({
      term: 'food',
      location: 'Montreal'
    }, (err, data) => {
      if (err) return done(err);
      expect(data.region).to.be.an('object');
      expect(data.total).to.be.a('number');
      expect(data.businesses).to.be.an('array');
      done();
    });
  });

});
