/* eslint-disable no-case-declarations */
import express from 'express';
import { addJob, killJob } from '../utils/cron-management';
import { getOneUsersJobs } from '../utils/db-cron-jobs';

export const cronRouter = express.Router();

const latest = async (tumblr_id, res) => {
  const usersJobs = await getOneUsersJobs(tumblr_id);
  return res.send({ usersJobs });
};

cronRouter.post('/', async (req, res) => {
  console.log(req.body);

  latest(req.body.tumblr_id, res);
});

cronRouter.post('/add', async (req, res) => {
  await addJob(req.body.tumblr_id, req.body.newJob);
  return latest(req.body.tumblr_id, res);
});

cronRouter.post('/kill', async (req, res) => {
  console.log(req.body);
  await killJob(req.body.tumblr_id, req.body.jobName);
  return latest(req.body.tumblr_id, res);
});
