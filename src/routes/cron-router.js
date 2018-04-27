/* eslint-disable no-case-declarations */
import express from 'express';
import { addJob, killJob } from '../utils/cron-management';
import { getOneUsersJobs } from '../utils/db-cron-jobs';
import { channelLoader } from '../utils/channel-loader';

export const cronRouter = express.Router();

const latest = async (tumblr_id) => {
  const channels = await channelLoader;
  const usersJobs = await getOneUsersJobs(tumblr_id);
  return { usersJobs, channels };
};

cronRouter.post('/', async (req, res) => {
  const jobsAndChannels = await latest(req.body.tumblr_id);
  return res.send({ jobsAndChannels });
});

cronRouter.post('/add', async (req, res) => {
  const { tumblr_id, newJob } = req.body;
  let message;
  try {
    message = await addJob(tumblr_id, newJob);
  } catch (e) {
    message = JSON.stringify(e);
  }
  const jobsAndChannels = await latest(tumblr_id);
  return res.send({ jobsAndChannels, message });
});

cronRouter.post('/kill', async (req, res) => {
  const { tumblr_id, jobName } = req.body;
  let message;
  try {
    message = await killJob(tumblr_id, jobName);
  } catch (e) {
    message = JSON.stringify(e);
  }
  const jobsAndChannels = await latest(tumblr_id);
  return res.send({ jobsAndChannels, message });
});
