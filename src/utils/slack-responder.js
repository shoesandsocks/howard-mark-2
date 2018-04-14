import SlackBot from 'slackbots';

import { howard } from './howard';
import { coinflip } from './coinflip';

// set up bot
require('dotenv').config();

const bot = new SlackBot({
  token: process.env.BOT_TOKEN,
  name: 'Howard Chicken',
});

const botParams = {
  icon_emoji: ':chicken:',
};

const handleColons = (term, channel) => {
  if (term.match(/:$/)) {
    setTimeout(() => search(term, channel), 3000);
  }
};

const search = (text, channel) =>
  howard('searchQuotes', text).then((reply) => {
    console.log(reply);
    handleColons(reply.text, channel);
    return bot.postMessage(channel, reply.text, botParams);
  });

/**
 * START AND STOP FUNCTIONS TO EXPORT FROM MODULE
 */
export const stopBot = () => {
  bot.removeAllListeners();
};

export const runBot = (db, mouthiness) => {
  bot.on('start', () => console.log('Server started; linked to slack'));
  bot.on('message', async (data) => {
    if (
      data.type !== 'message' ||
      !data.type ||
      data.bot_id ||
      !data.text ||
      data.subtype === 'file_share' ||
      data.text.split(' ')[0].indexOf('/') > -1
    ) {
      return null;
    }
    if (data.channel === 'C61L2R7N2') {
      // #debug
      return howard('getMarkov', data.text).then(markov =>
        bot.postMessage(data.channel, markov.text, botParams));
    }
    if (data.channel === 'C3ZHJ4K9Q') {
      // #testing ->
    }
    if (data.text.indexOf('howard') > -1 || data.text.indexOf('Howard') > -1) {
      if (data.text.match(/\?$/)) {
        // hHoward and a Qmark -> 100%
        return howard('searchQuotes', data.text).then(reply =>
          bot.postMessage(data.channel, reply.text, botParams));
      }
      if (coinflip(80)) {
        // hHoward, but not Qmark -> 80%
        return search(data.text, data.channel);
      }
      return null;
    }
    if (coinflip(mouthiness)) {
      // all other -> go by the server mouthiness setting
      return search(data.text, data.channel);
    }
    return null;
  });
};
