#!/usr/bin/node
/*
 * routes/index.js contains the endpoints for the server. Each route
 * imports the logic from controllers/AppController.js.
 */
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

// GET /status
router.get('/status', AppController.getStatus);

// GET /stats
router.get('/stats', AppController.getStats);

// POST /files
router.post('/files', AppController.postUpload);

// POST /users
router.post('/users', UsersController.postNew);

// GET /files/:id
router.get('/files/:id', FilesController.getShow);

// GET /files
router.get('/files', FilesController.getIndex);

// PUT /files/:id/publish
router.get('/files/:id/publish', FilesController.putPublish);

// PUT /files/:id/publish
router.get('/files/:id/publish', FilesController.putUnpublish);

export default router;
