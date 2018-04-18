/* eslint-disable no-console */
import schedule from 'node-schedule';

import { howard } from './howard';
import { bot } from './slackbot-instance';
import { allJobs } from '../activeJobs';

const botParams = {
  icon_emoji: ':howard:',
};

const getOneQuote = () => howard('getQuotes', 1).then(response => response[0].text);

export const runJobs = () =>
  allJobs.forEach((j, i) =>
    schedule.scheduleJob(j.jobName, j.cronSked, async () => {
      const oneQuote = await getOneQuote();
      bot.postTo(j.channelName, `${oneQuote} (this is testJob${i})`, botParams);
    }));
