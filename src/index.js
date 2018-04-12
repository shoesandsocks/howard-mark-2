import express from 'express';
import path from 'path';
import cors from 'cors';
import { howardRouter } from './routes/howard-router';

require('dotenv').config();

const port = process.env.PORT;
const app = express();

/* basic cors usage to allow other domains to hit /howard. urlencoded to read POST data coming in */
app.use(cors());
app.use(express.urlencoded({ extended: true }));

/* requests to /howard go through routes/howardRouter */
app.use('/howard', howardRouter);

/* this pair acts as catch-all: sends all else to build/index.html (front-end, built elsewhere) */
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

/* start server */
app.listen(port, () => `On ${port}`);
