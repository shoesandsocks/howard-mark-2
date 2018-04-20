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

const validateArgs = ({ tumblr_id, jobName = '', newJob = {} }) => {
  const keys = Object.keys(newJob);
  console.log(keys, jobName, newJob, tumblr_id);
  if (!tumblr_id) {
    return { error: 'No tumblr_id' };
  }
  if (tumblr_id.length !== 9 || typeof tumblr_id !== 'string') {
    return { error: 'Malformed tumblr_id' };
  }
  if (jobName === '' && keys.length !== 3) {
    return { error: 'Either jobName or newJob missing/malformed.' };
  }
  if (jobName !== '' && keys.length !== 0) {
    return { error: 'Do not send both jobName and newJob.' };
  }
  if (typeof jobName !== 'string') {
    return { error: 'Malformed jobName' };
  }
  if (keys.length === 3) {
    if (!(newJob.jobName && newJob.schedule && newJob.channel)) {
      return { error: 'Malformed newJob object.' };
    }
  }
  return true;
};

export const runJobs = async () => {
  const jobs = await getJobs();
  jobs.forEach(obj => obj.activeCronJobs.forEach(job => scheduleJob(job)));
  setTimeout(() => {
    console.log('on initial runJobs, jobs are: ', schedule.scheduledJobs);
  }, 3000);
};

export const killJob = async (tumblr_id, jobName) => {
  const validity = validateArgs({ tumblr_id, jobName });
  if (validity.error) {
    return validity.error;
  }
  const uniqueName = tumblr_id + jobName;

  console.log('killJob about to use node-schedule on: ', uniqueName);
  console.log('where current jobs are: ', schedule.scheduledJobs);
  schedule.scheduledJobs[uniqueName].cancel();
  console.log('after killing, current jobs are: ', schedule.scheduledJobs);

  return deleteJob(tumblr_id, jobName);
};

export const addJob = async (tumblr_id, newJob) => {
  const validity = validateArgs({ tumblr_id, newJob });
  if (validity.error) {
    return validity.error;
  }
  const uniqueName = tumblr_id + newJob.jobName;
  const withUniqueName = Object.assign({}, newJob, { jobName: uniqueName });

  console.log('addJob: ', JSON.stringify(withUniqueName));
  scheduleJob(withUniqueName);
  console.log('after adding, current jobs are: ', schedule.scheduledJobs);

  return saveJob(tumblr_id, withUniqueName);
};
