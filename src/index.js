import express from 'express';
import path from 'path';
import cors from 'cors';
import enforce from 'express-sslify';
import { howardRouter } from './routes/howard-router';

require('dotenv').config();

const port = process.env.PORT;
const app = express();

/*
* BEGIN SETUP
*/

/* basic cors usage to allow other domains to hit /howard. TODO: maybe revisit this */
app.use(cors());

/* urlencoded to read POST data coming in */
app.use(express.urlencoded({ extended: true }));

/* force HTTPS
*  docs say: "Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
// a load balancer (e.g. Heroku)."" */
app.use(enforce.HTTPS({ trustProtoHeader: true }));

/*
* BEGIN ROUTES
*/

/* requests to /howard go through routes/howardRouter */
app.use('/howard', howardRouter);

/* this pair acts as catch-all: sends all else to build/index.html (front-end, built elsewhere) */
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

/* start server */
app.listen(port, () => `On ${port}`);
