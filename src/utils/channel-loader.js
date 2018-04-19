import { bot } from './slackbot-instance';

export const channelLoader = new Promise((resolve, reject) => {
  bot
    .getChannels()
    .then((response) => {
      const channelMap = response.channels
        .filter(c => !c.is_archived)
        .map(c => ({ id: c.id, name: c.name }));
      resolve(channelMap);
    })
    .catch((error) => {
      reject(new Error(error));
    });
});
