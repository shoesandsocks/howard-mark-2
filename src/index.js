import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import enforce from 'express-sslify';
import { howardRouter } from './routes/howard-router';
import { howardSlackRouter } from './routes/howard-slack-router';

import { runBot, stopBot } from './utils/slack-responder';
// import { howardController } from './routes/howard-controller';

require('dotenv').config();

const port = process.env.PORT;
const app = express();

/*
* BEGIN SETUP
*/
// Bot setup

app.locals.responderOn = true;
app.locals.mouthiness = 21;
app.locals.hushed = false;
app.locals.runBot = runBot;
app.locals.stopBot = stopBot;
app.locals.runBot(app.locals.mouthiness);

/* gzip text, i guess? this is new to me, this project */
app.use(compression());

/* basic cors usage to allow other domains to hit /howard. TODO: maybe revisit this */
app.use(cors());

/* to read POST data coming in */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* force HTTPS
*  docs say: "Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
// a load balancer (e.g. Heroku)."" */
app.use(enforce.HTTPS({ trustProtoHeader: true }));

/**
 * AUTHORIZATION MIDDLEWARE (must be?) before routes
 */
const isAuthed = (req, res, next) => {
  const token = req.header('token');
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded && !err) {
        return next();
      }
      return res.json({ error: err.message });
    });
  } else {
    return res.json({ error: 'no token' });
  }
  return false;
};

/*
* BEGIN ROUTES
*/

/*
* test middleware
*/
// app.use('*', (req, res, next) => {
//   console.log('====================================');
//   console.log(req.body);
//   console.log('====================================');
//   next();
// });

/* requests to /howard go through routes/howardRouter */
app.use('/howard', howardRouter);
app.use('/howardslack', howardSlackRouter);

/* this pair acts as catch-all: sends all else to build/index.html (front-end, built elsewhere) */
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

/* start server */
app.listen(port, () => console.log(`On ${port}`)); // eslint-disable-line
