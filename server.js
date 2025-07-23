#!/usr/bin/node
/*
 * server.js is the main Express server. It contains the server
 * startup logic and imports all routes from routes/index.js.
 */
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Allow JSON requests
app.use(express.json());

// Serve all API endpoints imported from routes/index.js
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
