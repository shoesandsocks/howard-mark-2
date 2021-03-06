/* eslint-disable no-case-declarations */
import express from 'express';
import MongoClient from 'mongodb';

import { coreUpdate } from '../utils/json-to-database-reconciler';

require('dotenv').config();

export const updateRouter = express.Router();

updateRouter.get('/', async (req, res) => {
  const client = await MongoClient.connect(process.env.MLAB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = await client.db('howard');
  coreUpdate(db)
    .then(r => res.send(r))
    .catch((ex) => {
      console.log('coreUpdate failed in update-router file', ex);
      res.json({ message: 'sorry charly' });
    });
});
