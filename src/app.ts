require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { MessageResponse } from './types/MessageTypes';

import api from './api';
import { itWorks } from './middlewares';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({ message: 'It works! API location: api/v1' });
});

app.use('/api/v1', api);

app.use(itWorks);

export default app;
