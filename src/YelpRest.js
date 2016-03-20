import Yelp from './Yelp';
import _ from 'lodash';

var log;

// Constanst for Yelp Search API https://www.yelp.com/developers/documentation/v2/search_api
let SORT_BEST_MATCHECED = 0;
let SORT_DISTANCE = 1;
let SORT_HIGHEST_RATED = 2;

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
    query = _.clone(query);
    if (!query.lat) return null;  // latitude required
    if (!query.lng) return null;  // longitude required
    let params = {
      ll: `${query.lat},${query.lng}`,
      // Sort by distance if not specified.
      sort: typeof query.sort == 'undefined' ? SORT_DISTANCE : query.sort
    };
    delete query.lat;
    delete query.lng;
    delete query.sort;
    // Push everything despite coordinates and sort method to search term
    params.term = Object.keys(query).map((key) => `${key}+${query[key]}`).join('+');
    log.info('do request to Yelp API, params =', params);
    return params;
  }

  /**
   * @returns {function(this:YelpRest)} -  YelpRest search request handler function
   */
  search() {
    let search = super.search;
    return function (req, res) {
      log.info('got request, query =', req.query);
      var params = YelpRest.queryToParamsMapper(req.query);
      if (!params) {
        var err = {error: 'Wrong query'};
        log.error(err);
        res.status(400).json(err);
        return;
      }
      search.call(this, params)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          log.error(err);
          res.status(400).json(err);
        });
    }.bind(this);
  }

};
