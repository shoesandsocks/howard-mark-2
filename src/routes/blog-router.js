/* eslint-disable no-case-declarations, camelcase */
import express from 'express';
import axios from 'axios';

require('dotenv').config();

export const blogRouter = express.Router();

blogRouter.post('/notify', async (req, res) => {
  const toSlack = {};
  if (req.body.email) {
    toSlack.email = req.body.email;
  }

  if (req.body.textarea) {
    toSlack.textarea = req.body.textarea;
  }

  axios.post(
    process.env.WEBHOOK,
    {
      text: `got a blog inquiry: ${JSON.stringify(toSlack)}`,
    },
    {
      headers: { 'Content-type': 'application/json' },
    },
  )
    .then(() =>
      res.send({ message: `received ${req.body.email} and alerting admins` }))
    .catch(e => console.log(e));
});
