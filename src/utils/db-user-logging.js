import MongoClient from 'mongodb';

require('dotenv').config();

export const userLogging = async (id, name, image) => {
  const client = await MongoClient.connect(process.env.MLAB);
  const db = await client.db('howard');

  db.collection('webusers').updateOne(
    { tumblr_id: id },
    {
      $set: { name, avatar: image },
      $push: { lastLogin: { $each: [new Date()], $slice: -10 } },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  return client.close();
};
