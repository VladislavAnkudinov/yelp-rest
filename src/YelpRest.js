import Yelp from './Yelp';

var log;
import _ from 'lodash';

export default class YelpRest extends Yelp {
  constructor(opts) {
    super(opts.yelpCredentials);
    this.log = log = opts.log;
  };

  queryToParamsMapper = (query) => {
    var params = _.clone(query);
    _.extend(params, {
      term: 'food',
      location: 'Montreal'
    });
    log.info('params =', params);
    return params;
  };

  middleware = (req, res) => {
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
