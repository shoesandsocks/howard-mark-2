import express from 'express';
import micropub from 'micropub-express';

export const micropubRouter = express.Router();

micropubRouter.post('/', micropub({
  tokenReference: {
    me: 'https://www.pineandvine.com/',
    endpoint: 'https://tokens.indieauth.com/token',
  },
  handler(micropubDocument) {
    console.log(micropubDocument);
    return Promise.resolve().then(() => ({ url: 'http://example.com/url/to/new/post' }));
  },
}));

micropubRouter.get('/', micropub({
  tokenReference: {
    me: 'https://www.pineandvine.com/',
    endpoint: 'https://tokens.indieauth.com/token',
  },
  handler(micropubDocument) {
    console.log(micropubDocument);
    return Promise.resolve().then(() => ({ url: 'http://example.com/url/to/new/post' }));
  },
}));
