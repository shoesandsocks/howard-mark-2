import express from 'express';
import cors from 'cors';

import { howardRouter } from './routes/howard-router';

require('dotenv').config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/howard', howardRouter);

app.listen(port, () => `On ${port}`);
