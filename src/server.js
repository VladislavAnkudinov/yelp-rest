import 'source-map-support/register'

require('dotenv').config();
import bunyan from 'bunyan';
import YelpRest from './YelpRest';
export default YelpRest;

if (process.argv[1]) {
  console.log('Runing server...');
  let express = require('express');
  let app = express();
  app.set('port', process.env.PORT);
  var ringbuffer = new bunyan.RingBuffer({limit: 100});
  let log = bunyan.createLogger({
    name: 'Yelp Rest Server',
    streams: [
      {
        level: 'info',
        stream: process.stdout
      },
      {
        level: 'trace',
        type: 'raw',    // use 'raw' to get raw log record objects
        stream: ringbuffer
      }
    ]
  });
  var yelpRest = new YelpRest({
    yelpCredentials: {
      consumer_key: process.env.YELP_CONSUMER_KEY,
      consumer_secret: process.env.YELP_CONSUMER_SECRET,
      token: process.env.YELP_TOKEN,
      token_secret: process.env.YELP_TOKEN_SECRET
    },
    log
  });
  app.set('log', log);
  app.get('/api/search', yelpRest.middleware);
  app.listen(process.env.PORT, (err) => {
    if (err) {
      log.error(err);
      return;
    }
    log.info(`Server listening on port ${app.get('port')}...`);
  })
}
