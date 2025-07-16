#!/usr/bin/node
/*
 * routes/index.js contains the endpoints for the server. Each route
 * imports the logic from controllers/AppController.js.
 */
import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

export default router;
