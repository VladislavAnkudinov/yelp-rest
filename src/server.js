//import 'source-map-support/register';
import 'dotenv/config';
import bunyan from 'bunyan';
import YelpRest from './YelpRest';
import express from 'express';

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
// Number of workers, equals number of cores if not specified in .env
const numWorkers = process.env.NUM_WORKERS || numCPUs;

if (cluster.isMaster) {
  // Create logger
  let ringbuffer = new bunyan.RingBuffer({limit: 100});
  let log = bunyan.createLogger({
    name: `Yelp Rest Server Master ${process.pid}`,
    streams: [
      {
        level: 'info',
        stream: process.stdout
      },
      {
        level: 'trace',
        type: 'raw',
        stream: ringbuffer
      }
    ]
  });
  // Fork workers.
  for (var i = 0; i < numWorkers; i++) {
    log.info(`Populating worker ${i}`);
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    log.info(`YRS Worker ${worker.process.pid} died`);
  });
} else {
  // Instantiate express app
  let app = express();
  app.set('port', process.env.PORT);

  // Create logger
  let ringbuffer = new bunyan.RingBuffer({limit: 100});
  let log = bunyan.createLogger({
    name: `YRS Worker ${process.pid}`,
    streams: [
      {
        level: 'info',
        stream: process.stdout
      },
      {
        level: 'trace',
        type: 'raw',
        stream: ringbuffer
      }
    ]
  });
  app.set('log', log);

  // Instantiate YelpRest
  var yelpRest = new YelpRest({
    yelpCredentials: {
      consumer_key: process.env.YELP_CONSUMER_KEY,
      consumer_secret: process.env.YELP_CONSUMER_SECRET,
      token: process.env.YELP_TOKEN,
      token_secret: process.env.YELP_TOKEN_SECRET
    },
    log
  });

  // Append search request handler
  app.get('/api/search', yelpRest.search());

  // Run the server
  app.listen(process.env.PORT, (err) => {
    if (err) {
      log.error(err);
      return;
    }
    log.info(`Server listening on port ${app.get('port')}...`);
  });
}
