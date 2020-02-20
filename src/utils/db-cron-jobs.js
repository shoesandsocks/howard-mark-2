import MongoClient from 'mongodb';

require('dotenv').config();

export const getJobs = async () => {
  const client = await MongoClient.connect(process.env.MLAB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = await client.db('howard');
  try {
    const allJobs = await db
      .collection('webusers')
      .find({})
      .project({ tumblr_id: 1, activeCronJobs: 1, _id: 0 })
      .toArray();

    client.close();
    return allJobs;
  } catch (e) {
    client.close();
    return { error: e };
  }
};

export const getOneUsersJobs = async (tumblr_id) => {
  const client = await MongoClient.connect(process.env.MLAB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = await client.db('howard');
  try {
    const oneUsersJobs = await db
      .collection('webusers')
      .find({ tumblr_id })
      .project({ activeCronJobs: 1, _id: 0 })
      .toArray();
    client.close();
    oneUsersJobs[0].activeCronJobs.forEach((j) => {
      j.jobName = j.jobName.substring(9); // remove mashed-on user id before sending to client
    });
    return oneUsersJobs;
  } catch (e) {
    client.close();
    return { error: e };
  }
};

export const saveJob = async (tumblr_id, newJob) => {
  const client = await MongoClient.connect(process.env.MLAB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = await client.db('howard');

  try {
    const updatedJobs = await db.collection('webusers').findOneAndUpdate(
      { tumblr_id },
      { $addToSet: { activeCronJobs: newJob } },
      {
        projection: { activeCronJobs: 1, _id: 0 },
        returnNewDocument: true,
      },
    );
    client.close();
    return updatedJobs;
  } catch (e) {
    client.close();
    return { error: e };
  }
};

export const deleteJob = async (tumblr_id, jobName) => {
  const client = await MongoClient.connect(process.env.MLAB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = await client.db('howard');
  const uniqueName = tumblr_id + jobName;
  try {
    const updatedJobs = await db.collection('webusers').findOneAndUpdate(
      { tumblr_id },
      { $pull: { activeCronJobs: { jobName: uniqueName } } },
      {
        projection: { activeCronJobs: 1, _id: 0 },
        returnNewDocument: true,
      },
    );
    client.close();
    return updatedJobs;
  } catch (e) {
    client.close();
    return { error: e };
  }
};
