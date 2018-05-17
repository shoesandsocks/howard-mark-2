/* eslint-disable no-case-declarations */
import express from 'express';
import MongoClient from 'mongodb';

import { coreUpdate } from '../utils/json-to-database-reconciler';

require('dotenv').config();

export const updateRouter = express.Router();

updateRouter.get('/', async (req, res) => {
  const client = await MongoClient.connect(process.env.MLAB);
  const db = await client.db('howard');
  console.log(db.collection('howard').find());
  coreUpdate(db).then(r => res.send(r));
});
