import express from 'express';

require('dotenv').config();

export const podcastRouter = express.Router();

podcastRouter.get('/', (req, res) => res.json({ message: 'Nothing here, at the mo.' }));
podcastRouter.post('/', (req, res) => {
  if (req.body && req.body.code && req.body.code === process.env.PODCAST_MAKE_CODE) {
    // make();
    console.log('now what.');
  } else {
    console.log('bad code');
  }
  res.json({ message: 'if that was a good code, we\'ll generate a new episode' });
});
