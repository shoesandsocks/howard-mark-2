import SlackBot from 'slackbots';

export const bot = new SlackBot({
  token: process.env.BOT_TOKEN,
  name: 'Howard Chicken',
});
