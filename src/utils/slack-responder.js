import winston from 'winston';

import { bot } from './slackbot-instance';
import { howard } from './howard';
import { coinflip } from './coinflip';

require('dotenv').config();

const botParams = {
  icon_emoji: ':howard:',
};

const randomQuote = channel =>
  howard('getQuotes', 1)
    .then((reply) => {
      const quote = reply[0].text; // array of 1
      console.log(`Linode process here, generating a Random from slack-responder.js file: ${quote}`);
      return bot.postMessage(channel, quote, botParams);
    })
    .catch((e) => {
      winston.error('randomQuote fn broke: ', e);
      return bot.postMessage(channel, 'Howard is offline or something.', botParams);
    });

const search = (textToSearch, channel) =>
  howard('searchQuotes', textToSearch)
    .then(async (reply) => {
      let text;
      try {
        if (Array.isArray(reply) && reply.length > 0) {
          const rnd = Math.floor(Math.random() * reply.length);
          text = reply[rnd].text; // eslint-disable-line
        } else if (Array.isArray(reply) && reply.length === 0) {
          return randomQuote(channel);
        }
      } catch (er) {
        winston.error('processing went wrong, this is from the try-catch', er);
        return randomQuote(channel);
      }
      // original 'handleColons' fn; a small edge case
      if (text.match(/:$/)) {
        setTimeout(() => search(text, channel), 3000);
      }
      return bot.postMessage(channel, text, botParams);
    })
    .catch((e) => {
      winston.error('entire search went wrong, this is from the then-catch', e);
      return randomQuote(channel);
    });

/**
 * START AND STOP FUNCTIONS TO EXPORT FROM MODULE
 */
export const stopBot = () => {
  bot.removeAllListeners();
};

export const runBot = (mouthiness) => {
  bot.on('start', () => winston.info('Server started; linked to slack'));
  bot.on('message', async (data) => {
    const { text, channel } = data;
    if (
      data.type !== 'message' ||
      !data.type ||
      data.bot_id ||
      !text ||
      data.subtype === 'file_share' ||
      data.text.split(' ')[0].indexOf('/') > -1
    ) {
      return null;
    }
    if (channel === 'C61L2R7N2') {
      // #debug
      try {
        return howard('getMarkov', text).then(markov =>
          bot.postMessage(channel, markov[0].text, botParams));
      } catch (e) {
        return bot.postMessage(
          channel,
          'something broke in the markov part of the slack-responder file',
          botParams,
        );
      }
    }
    if (channel === 'C3ZHJ4K9Q') {
      // #testing ->
    }
    if (text.indexOf('howard') > -1 || text.indexOf('Howard') > -1) {
      if (text.match(/\?$/)) {
        // hHoward and a Qmark -> 100%
        return randomQuote(channel); // rnd, not custom. else it'll always throw "Howard Hughes" Q
      }
      if (coinflip(80)) {
        // hHoward, but not Qmark -> 80%
        return randomQuote(channel); // rnd, not custom. else it'll always throw "Howard Hughes" Q
      }
      return null;
    }
    if (coinflip(mouthiness)) {
      // all other -> go by the server mouthiness setting
      return search(text, channel);
    }
    return null;
  });
};
