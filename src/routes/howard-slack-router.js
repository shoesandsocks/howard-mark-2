/* eslint-disable no-case-declarations, camelcase */

import express from 'express';
// import { runBot, stopBot } from '../utils/slack-responder';

export const howardSlackRouter = express.Router();

howardSlackRouter.post('/', async (req, res) => {
  const { text, token, user_name } = req.body;
  if (typeof text !== 'string' || token !== process.env.SLASH_TOKEN) {
    return res.send('Something went very wrong');
  }
  switch (text) {
    case 'status': {
      const onOff = () => {
        if (req.app.locals.hushed) return 'hushed';
        return req.app.locals.responderOn ? 'on' : 'off';
      };
      return res.send(`Howard is ${onOff()}, ${user_name}. His mouthiness is ${req.app.locals.mouthiness}%.`);
    }
    case 'stop': {
      if (!req.app.locals.responderOn) {
        if (!req.app.locals.hushed) {
          return res.send(`Howard's is off already, ${user_name}.`);
        }
      }
      req.app.locals.responderOn = false;
      req.app.locals.stopBot();
      if (req.app.locals.hushed) {
        req.app.locals.hushed = false;
        return res.send(`Howard was hushed; now he's off, ${user_name}`);
      }
      return res.send(`Howard is now off, ${user_name}.`);
    }
    case 'start': {
      if (req.app.locals.responderOn === true && !req.app.locals.hushed) {
        return res.send(`Howard's already started, ${user_name}.`);
      }
      req.app.locals.responderOn = true;
      req.app.locals.runBot(req.app.locals.mouthiness);
      if (req.app.locals.hushed) {
        req.app.locals.hushed = false;
        clearTimeout(req.app.locals.restartTimer);
        return res.send(`Howard was hushed; now he's on again, ${user_name}`);
      }
      return res.send(`Howard has started, ${user_name}. His mouthiness is ${req.app.locals.mouthiness}%.`);
    }
    case 'shh': {
      if (!req.app.locals.responderOn) {
        return res.send(`Howard's off. No sense in shushing him, ${user_name}.`);
      }
      if (req.app.locals.hushed) {
        return res.send(`Howard's already hushed, ${user_name}.`);
      }
      req.app.locals.responderOn = false;
      req.app.locals.hushed = true;
      req.app.locals.stopBot();
      req.app.locals.restartTimer = setTimeout(() => {
        if (req.app.locals.responderOn === false || req.app.locals.hushed) {
          // delay wrapped in `if` in case someone intentionally turned it back on during 'shh'
          req.app.locals.responderOn = true;
          req.app.locals.hushed = false;
          req.app.locals.runBot(req.app.locals.mouthiness);
        }
      }, 30 * 60 * 1000); // 30 min in millis
      return res.sendStatus(200);
    }
    case /^1?\d{1,2}%$/.test(text) && text: {
      const num = +text.slice(0, -1);
      req.app.locals.mouthiness = num;
      req.app.locals.stopBot();
      return setTimeout(() => {
        req.app.locals.runBot(req.app.locals.mouthiness);
        res.send(`Howard's mouthiness adjusted to ${req.app.locals.mouthiness}%`);
      }, 50);
    }
    default:
      return res.send('I didn\'t catch that.');
  }
});
