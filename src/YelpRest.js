import Yelp from './Yelp';

var log;
import _ from 'lodash';

/**
 * YelpRest extends Yelp class to provide REST access to Yelp class functionality
 * @param {object} opts - The object, containing your Yelp credentials as subobject and logger
 * @param {object} opts.yelpCredentials - The object, containing your Yelp credentials
 * @param {string} opts.yelpCredentials.consumer_key - Consumer Key from Yelp's Manage API access
 * @param {string} opts.yelpCredentials.consumer_secret - Consumer Secret from Yelp's Manage API access
 * @param {string} opts.yelpCredentials.token - Token from Yelp's Manage API access
 * @param {string} opts.yelpCredentials.token_secret - Token Secret from Yelp's Manage API access
 */
export default class YelpRest extends Yelp {
  constructor(opts) {
    super(opts.yelpCredentials);
    this.log = log = opts.log;
  }

  /**
   * Get YelpRest parameters and map it to Yelp API parameters
   * @param {object} query - Query parameters accepted by YelpRest server
   * @returns {object} - Query parameters mapped to Yelp API
   */
  static queryToParamsMapper(query) {
    var params = _.clone(query);
    _.extend(params, {
      term: 'food',
      location: 'Montreal'
    });
    log.info('params =', params);
    return params;
  }

  /**
   * YelpRest middelware function to response with Yelp data on custom YelpRest request
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  middleware(req, res) {
    log.info('got request');
    log.info('query =', req.query);
    var params = this.queryToParamsMapper(req.query);
    return this.search(params)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  };

};
