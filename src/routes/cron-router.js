/* eslint-disable no-case-declarations */
import express from 'express';
import { addJob, killJob } from '../utils/cron-management';
import { getOneUsersJobs } from '../utils/db-cron-jobs';
import { channelLoader } from '../utils/channel-loader';

export const cronRouter = express.Router();

const latest = async (tumblr_id, res) => {
  const channels = await channelLoader;
  const usersJobs = await getOneUsersJobs(tumblr_id);
  return res.send({ usersJobs, channels });
};

cronRouter.post('/', async (req, res) => latest(req.body.tumblr_id, res));

cronRouter.post('/add', async (req, res) => {
  await addJob(req.body.tumblr_id, req.body.newJob);
  return latest(req.body.tumblr_id, res);
});

cronRouter.post('/kill', async (req, res) => {
  await killJob(req.body.tumblr_id, req.body.jobName);
  return latest(req.body.tumblr_id, res);
});
