/* eslint-disable no-console */
import schedule from 'node-schedule';

import { howard } from './howard';
import { bot } from './slackbot-instance';
import { getJobs, saveJob, deleteJob } from './db-cron-jobs';

const botParams = {
  icon_emoji: ':howard:',
};

const getOneQuote = () => howard('getQuotes', 1).then(response => response[0].text);

const scheduleJob = job =>
  schedule.scheduleJob(job.jobName, job.cronSked, async () => {
    const oneQuote = await getOneQuote();
    bot.postTo(job.channelName, oneQuote, botParams);
  });

export const runJobs = async () => {
  const jobs = await getJobs();
  jobs.forEach(obj => obj.activeCronJobs.forEach(job => scheduleJob(job)));
  // setTimeout(() => {
  //   console.log(schedule.scheduledJobs);
  // }, 10000);
};

export const killJob = async (tumblr_id, jobName) => {
  console.log('killJob about to use node-schedule: ', tumblr_id, jobName);
  const uniqueName = tumblr_id + jobName;
  console.log(schedule.scheduledJobs);

  schedule.scheduledJobs[uniqueName].cancel();
  return deleteJob(tumblr_id, jobName);
};

export const addJob = async (tumblr_id, newJob) => {
  const uniqueName = tumblr_id + newJob.jobName;
  const withUniqueName = Object.assign({}, newJob, { jobName: uniqueName });

  console.log('addJob: ', JSON.stringify(withUniqueName));

  scheduleJob(withUniqueName);
  return saveJob(tumblr_id, withUniqueName);
};

// TODO: BONUS: figure out what to do with tumblr_id. howard quotes
// to DM channels, maybe?
