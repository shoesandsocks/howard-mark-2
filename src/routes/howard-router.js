/* eslint-disable no-case-declarations */
import express from 'express';

import { howard } from '../utils/howard';

export const howardRouter = express.Router();

howardRouter.post('/', async (req, res) => {
  const { argument } = req.body;
  const kind = parseInt(req.body.kind, 10);
  if (!argument || !kind) {
    return res.json({ error: 'missing info' });
  }
  if (typeof kind !== 'number' || kind < 1 || kind > 7) {
    return res.json({ error: 'bad kind' });
  }
  try {
    switch (kind) {
      case 1:
        const ep = parseInt(argument, 10);
        try {
          return res.json({ response: await howard('getEpisode', ep) });
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
        const num = parseInt(argument, 10);
        try {
          return res.json({ response: await howard('getQuotes', num) });
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
      case 6:
        try {
          return res.json({ response: await howard('getAll')})
        } catch (e) {
          return res.json({
            error: `Something went wrong getting all original.text items: ${e}`;
          });
        }
      default:
        return res.json({ error: 'bad kind. how did you do that?' });
    }
  } catch (e) {
    return res.json({ error: 'calamity.' });
  }
});
