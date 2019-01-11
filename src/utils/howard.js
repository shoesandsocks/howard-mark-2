import MongoClient from 'mongodb';

const markov = require('markov');

const m = markov(1);

const runSeed = async (db, getQuotes, input) => {
  const numberOfQuotes = await db
    .collection('howard')
    .find({ 'original.text': { $exists: true } })
    .count();
  const allQuotesArray = await getQuotes(numberOfQuotes);
  console.log(allQuotesArray);
  const response = [];
  m.seed(allQuotesArray.join(' '), () => response.push(m.respond(input.toString()).join(' ')));
  return setTimeout(() => response, 10000);
};


require('dotenv').config();

export const howard = async (query, argument) => {
  if (!query) return null;
  // argument sometimes optional (for now)

  const client = await MongoClient.connect(process.env.MLAB);
  const db = await client.db('howard');

  /* getEpisode(num) return that ep */
  const getEpisode = async (n) => {
    const theEp = await db.collection('howard').findOne({ 'original.episode': n });
    return theEp.original;
  };

  const getAllTextItems = async () => {
    const array = await db
      .collection('howard')
      .aggregate([{ $match: { 'original.text': { $exists: true } } }])
      .toArray();
    return array;
  };
  /* getRandomEpisode() returns an ep */
  const getRandomEpisode = async () => {
    const array = await db
      .collection('howard')
      .aggregate([{ $match: { 'original.episode': { $exists: true } } }, { $sample: { size: 1 } }])
      .toArray();
    return array[0].original;
  };

  /* searchQuotes(term) does that */
  const searchQuotes = async (term) => {
    const foundQuotes = await db
      .collection('howard')
      .aggregate([
        { $match: { $text: { $search: term } } },
        { $match: { 'original.text': { $exists: true } } },
        { $match: { deprecated: { $exists: false } } },
      ])
      .toArray();
    return foundQuotes.map(q => q.original);
  };

  /* getQuotes() returns the quotes View */
  const getQuotes = async (n) => {
    const getQuoteObjects = await db
      .collection('canon')
      .aggregate([{ $match: { 'quote.text': { $exists: true } } }, { $sample: { size: n } }])
      .toArray();
    return getQuoteObjects.map(q => q.quote);
  };

  /* getMarkov(string) returns markov from string seed */
  const getMarkov = input =>
    runSeed(db, getQuotes, input);
    // should return an array
    // [{ text: 'hi' }, { text: 'hi12' }];

  let returnValue;
  switch (query) {
    case 'getAll':
      returnValue = await getAllTextItems();
      break;
    case 'getEpisode':
      returnValue = await getEpisode(argument);
      break;
    case 'getRandomEpisode':
      returnValue = await getRandomEpisode();
      break;
    case 'getQuotes':
      returnValue = await getQuotes(argument);
      break;
    case 'searchQuotes':
      returnValue = await searchQuotes(argument);
      break;
    case 'getMarkov':
      returnValue = await getMarkov(argument);
      break;
    default:
      returnValue = 'That is not a thing.';
  }
  await client.close();
  return returnValue;
};
