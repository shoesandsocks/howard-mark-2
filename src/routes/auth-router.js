import express from 'express';
import axios from 'axios';
import winston from 'winston';
import jwt from 'jsonwebtoken';

import { userLogging } from '../utils/db-user-logging';

export const authRouter = express.Router();

authRouter.get('/', (req, res) => {
  const { code } = req.query;
  const sec = process.env.CLIENT_SECRET;
  const oauthURL = `https://slack.com/api/oauth.access?client_id=11083475395.188120798310&client_secret=${sec}&code=${code}`;

  axios
    .get(oauthURL)
    .then((response) => {
      // console.log(response.data);
      if (response.data.ok) {
        const {
          user: { id, name, image_192 }, // eslint-disable-line
        } = response.data;
        const token = jwt.sign(
          { name, avi: image_192, tumblr_id: id },
          process.env.JWT_SECRET,
          {
            expiresIn: '4h',
          },
        );
        userLogging(id, name, image_192);
        return res.redirect(`/?token=${token}`);
      }
      return res.send({ error: 'error getting response from Slack.' });
    })
    .catch((error) => {
      winston.error(error);
      return res.send({ error });
    });
});
