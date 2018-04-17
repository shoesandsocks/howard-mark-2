import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import enforce from 'express-sslify';
import winston from 'winston';
import axios from 'axios';

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

// Bot variables and functions, on 'locals' object
app.locals.responderOn = false;
app.locals.mouthiness = 21;
app.locals.hushed = false;
app.locals.runBot = runBot;
app.locals.stopBot = stopBot;
app.locals.runBot(app.locals.mouthiness);

/* gzip text, i guess? this is new to me, this project */
app.use(compression());

/* basic cors usage to allow other domains to hit routes. TODO: maybe revisit this */
app.use(cors());

/* to read the `.body` on POST data coming in, not sure if need both, but... */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*
*  Force HTTPS
*  N.B.: docs say, "Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
*        a load balancer (e.g. Heroku).""
*/
if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
/**
 * AUTHORIZATION MIDDLEWARE
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
/*
*
*/
app.get('/howardsettings', isAuthed, (req, res) => {
  res.send({
    status: app.locals.responderOn,
    mouthiness: app.locals.mouthiness,
    hushed: false,
  });
});

/*
*  /howard route handles the "data API," requesting quotes or eps from the db
*  /howardslack routes handle slash-commands from the Howard slackbot (`/howard status`, et al.)
*/
app.use('/howard', howardRouter);
app.use('/howardslack', howardSlackRouter);

// oauth endpoint for slack login handshake
app.get('/oauth', (req, res) => {
  const { code } = req.query;
  const sec = process.env.CLIENT_SECRET;
  const oauthURL = `https://slack.com/api/oauth.access?client_id=11083475395.188120798310&client_secret=${sec}&code=${code}`;

  axios
    .get(oauthURL)
    .then((response) => {
      // console.log(response.data);
      if (response.data.ok) {
        const { user } = response.data;
        const { id, name, image_192 } = user; // eslint-disable-line
        // db.collection('webusers').updateOne(
        //   { tumblr_id: id },
        //   {
        //     $set: { name, avatar: image_192 },
        //     $push: { lastLogin: { $each: [new Date()], $slice: -10 } },
        //     $setOnInsert: { createdAt: new Date() },
        //   },
        //   { upsert: true },
        // );
        const token = jwt.sign({ name, avi: image_192 }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        return res.redirect(`login/?token=${token}`);
      }
      return res.send({ error: 'error getting response from Slack.' });
    })
    .catch((error) => {
      winston.error(error);
      return res.send({ error });
    });
});

/* next 2 lines send other routes to /client/build (front-end, built in h-m-2-frontend folder) */
app.use('/', express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  console.log('star');
  return res.sendFile('index.html', { root: path.join(__dirname, '../client/build') });
});

/* start server */
app.listen(port, () => winston.info(`On ${port}`));
