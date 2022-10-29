require('dotenv').config();
import express from 'express';
import config from 'config';
import dbConnection from './utils/db-connection';

const app = express();

const port = config.get<number>('port');
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  dbConnection()
});
