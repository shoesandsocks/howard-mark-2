import express from 'express';

import { howard } from '../utils/howard';

export const howardRouter = express.Router();

howardRouter.post('/', async (req, res) => {
  console.log(req.body);
  const argument = req.body.argument;
  const kind = parseInt(req.body.kind);
  if (!argument || !kind) {
    return res.json({ error: 'missing info' });
  }
  if (typeof kind !== 'number' || kind < 1 || kind > 5) {
    return res.json({ error: 'bad kind' });
  }
  switch (kind) {
    case 1:
      argument = parseInt(argument);
      try {
        return res.json({ response: await howard('getEpisode', argument) });
      } catch (e) {
        return res.json({
          error: `Something went wrong (probably not an ep #): ${e}`,
        });
      }
    case 2:
      try {
        return res.json({ response: await howard('getRandomEpisode') });
      } catch (e) {
        return res.json({
          error: `Something went wrong getting a random ep: ${e}`,
        });
      }
    case 3:
      argument = parseInt(argument);
      try {
        return res.json({ response: await howard('getQuotes', argument) });
      } catch (e) {
        return res.json({
          error: `Something went wrong getting some quotes: ${e}`,
        });
      }
    case 4:
      try {
        return res.json({ response: await howard('searchQuotes', argument) });
      } catch (e) {
        return res.json({
          error: `Something went wrong with that search: ${e}`,
        });
      }
    case 5:
      try {
        return res.json({ response: await howard('getMarkov', argument) });
      } catch (e) {
        return res.json({
          error: `Something went wrong 'markiving' that: ${e}`,
        });
      }
    default:
      return res.json({ error: 'bad kind. how did you do that?' });
  }
});
