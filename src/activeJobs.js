const testJob = {
  jobName: 'test',
  cronSked: '*/1 * * * *',
  channelName: 'debug',
};
const testJob2 = {
  jobName: 'test2',
  cronSked: '*/2 * * * *',
  channelName: 'debug',
};

export const allJobs = [testJob, testJob2];

/* TODO:

store these job objects in the db?

load and run them every time server starts

web access to review and CRUD?

*/
