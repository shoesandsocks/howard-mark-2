import express from 'express';
import path from 'path';
import cors from 'cors';
import { howardRouter } from './routes/howard-router';

require('dotenv').config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

/* requests to /howard go through routes/howardRouter */
app.use('/howard', howardRouter);

/* catch-all sends everything to build/index.html (front-end, built elsewhere/pasted here) */
app.use(express.static(path.join(__dirname, '../client/build')));

app.listen(port, () => `On ${port}`);
