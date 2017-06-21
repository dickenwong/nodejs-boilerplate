'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const exphbs = require('express-handlebars');
// eslint-disable-next-line import/no-unresolved
const makeExpressLoggers = require('/usr/src/helpers/express-loggers');


class Server {
  constructor(port = 3000) {
    this.basePath = process.env.BASE_PATH;
    this.env = process.env.NODE_ENV || 'production';

    this.app = express();
    this.baseRouter = express.Router(); // eslint-disable-line new-cap
    this.setViewEngine();
    const { requestLogger, errorLogger } = this.getLoggers();
    this.baseRouter.use(requestLogger);
    this.setRoutes();
    this.baseRouter.use(errorLogger);
    this.baseRouter.use(this.onNotFound.bind(this));
    this.baseRouter.use(this.onError.bind(this));
    this.app.use(this.basePath, this.baseRouter);

    this.server = http.createServer(this.app);
    this.app.set('port', port);

    const server = this.server;
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    function onError(error) {
      if (error.syscall !== 'listen') throw error;
      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    function onListening() {
      const addr = server.address();
      console.log(`App listening at http://${addr.address}:${addr.port}`);
    }
  }

  setViewEngine() {
    this.app.engine('handlebars', exphbs.create({}).engine);
    this.app.set('view engine', 'handlebars');
    this.baseRouter.use('/dist', express.static(path.join(__dirname, 'public', 'dist')));
  }

  getLoggers() {
    const logPath = path.join(__dirname, 'logs', 'design-showcase-winston.log');
    return makeExpressLoggers(logPath);
  }

  setRoutes() {
    const self = this;
    /* eslint-disable global-require */
    // self.baseRouter.get('/', (req, res, next) => {
    //   res.render('main', {
    //     parse: {
    //       serverUrl: process.env.PUBLIC_SERVER_URL,
    //       appId: process.env.APP_ID,
    //       javascriptKey: process.env.JAVASCRIPT_KEY,
    //     },
    //     basePath: self.basePath,
    //     goCampaignUrlPrefix: process.env.CAMPAIGN_URL_PREFIX,
    //     snapteeDomain: process.env.SNAPTEE_DOMAIN || 'snaptee.co',
    //   });
    // });

    /* eslint-enable global-require */
  }

  onNotFound(req, res, next) {
    res.send(404);
  }

  onError(err, req, res, next) {
    if (this.env === 'development') {
      res.status(500).json({
        message: err.message,
        status: err.status,
        stack: err.stack,
      });
    } else {
      res.send(500);
    }
  }
}


const server = new Server(3000);
module.exports = server;
