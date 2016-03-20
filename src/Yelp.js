import querystring from 'querystring';
import oauth from 'oauth';

const OAuth = oauth.OAuth;

const baseUrl = 'http://api.yelp.com/v2/';

/**
 * Yelp class provides access to Yelp API
 * @param {object} opts - The object, containing your Yelp credentials
 * @param {string} opts.consumer_key - Consumer Key from Yelp's Manage API access
 * @param {string} opts.consumer_secret - Consumer Secret from Yelp's Manage API access
 * @param {string} opts.token - Token from Yelp's Manage API access
 * @param {string} opts.token_secret - Token Secret from Yelp's Manage API access
 */
export default class Yelp {
  constructor(opts) {
    this.oauthToken = opts.token;
    this.oauthTokenSecret = opts.token_secret;
    this.oauth = new OAuth(
      null,
      null,
      opts.consumer_key,
      opts.consumer_secret,
      opts.version || '1.0',
      null,
      'HMAC-SHA1'
    );
  }

  /**
   * General Yelp API request
   * 
   * @param {string} resource - Yelp API resource: search / buisiness/<id> / phone_search
   * @param {object} params - Yelp API request parameters
   * @param {function} cb - Callback function (optional)
   * @returns {*}
   */
  get(resource, params = {}, cb) {
    const promise = new Promise((resolve, reject) => {
      const debug = params.debug;
      delete params.debug;

      this.oauth.get(
        baseUrl + resource + '?' + querystring.stringify(params),
        this.oauthToken,
        this.oauthTokenSecret,
        (err, _data, response) => {
          if (err) return reject(err);
          const data = JSON.parse(_data);
          if (debug) return resolve([data, response]);
          resolve(data);
        }
      );
    });
    if (typeof cb === 'function') {
      promise
        .then((res) => cb(null, res))
        .catch(cb);
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
  search(params, callback) {
    return this.get('search', params, callback);
  }

  /**
   * Yelp Business API request
   * https://www.yelp.com/developers/documentation/v2/business
   * @param {string} id - The business id at Yelp
   * @param {function} callback
   * @returns {Promise}
   */
  business(id, callback) {
    return this.get(`business/${id}`, undefined, callback);
  }

  /**
   * Yelp Phone Search API request
   * https://www.yelp.com/developers/documentation/v2/phone_search
   * @param {object} params - The object containing the phone
   * @param {string} params.phone - The phone string, eg "+12223334444"
   * @param {function} callback
   * @returns {Promise}
   */
  phoneSearch(params, callback) {
    return this.get('phone_search', params, callback);
  }
}
