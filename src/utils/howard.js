import MongoClient from 'mongodb';
import { markov } from './markov';
import { triadMaker } from './triadMaker';

require('dotenv').config();

export const howard = async (query, argument) => {
  if (!query) return null;
  // argument sometimes optional (for now)

  const client = await MongoClient.connect(process.env.MLAB);
  const db = await client.db('howard');
  const canon = await db.collection('canon');
  const howie = await db.collection('howard');
  /* getEpisode(num) return that ep */
  const getEpisode = async (n) => {
    const theEp = await howie.findOne({ 'original.episode': n });
    return theEp.original;
  };

  /* getRandomEpisode() returns an ep */
  const getRandomEpisode = async () => {
    const array = await howie
      .aggregate([{ $match: { 'original.episode': { $exists: true } } }, { $sample: { size: 1 } }])
      .toArray();
    return array[0].original;
  };

  /* searchQuotes(term) does that */
  const searchQuotes = async (term) => {
    const foundQuotes = await howie
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
    const getQuoteObjects = await canon
      .aggregate([{ $match: { 'quote.text': { $exists: true } } }, { $sample: { size: n } }])
      .toArray();
    return getQuoteObjects.map(q => q.quote);
  };

  /* getMarkov(string) returns markov from string seed */
  const getMarkov = async (string) => {
    const numberOfQuotes = await howie.find({ 'original.text': { $exists: true } }).count();
    const allQuotesArray = await getQuotes(numberOfQuotes);
    const triads = triadMaker(allQuotesArray.map(q => q.text));
    const markovResult = markov(string, triads);
    return markovResult;
  };

  switch (query) {
    case 'getEpisode':
      return getEpisode(argument);
    case 'getRandomEpisode':
      return getRandomEpisode();
    case 'getQuotes':
      return getQuotes(argument);
    case 'searchQuotes':
      return searchQuotes(argument);
    case 'getMarkov':
      return getMarkov(argument);
    default:
      return 'That is not a thing.';
  }
};
