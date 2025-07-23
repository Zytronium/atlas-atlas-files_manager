#!/usr/bin/node
/*
 * routes/index.js contains the endpoints for the server. Each route
 * imports the logic from controllers/AppController.js.
 */
import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

// -------------- AppController Endpoints -------------- \\

// GET /status
router.get('/status', AppController.getStatus);

// GET /stats
router.get('/stats', AppController.getStats);

// ------------- AuthController Endpoints ------------- \\

// GET /connect
router.get('/connect', AuthController.getConnect);

// GET /disconnect
router.get('/disconnect', AuthController.getDisconnect);

// ------------- UsersController Endpoints ------------- \\

// GET /users/me
router.get('/users/me', UsersController.getMe);

// POST /users
router.post('/users', UsersController.postNew);

// GET /files/:id
router.get('/files/:id', FilesController.getShow);

// GET /files
router.get('/files', FilesController.getIndex);

// POST /files
router.post('/files', FilesController.postUpload);

// ------------- FilesController Endpoints ------------- \\

// PUT /files/:id/publish
router.put('/files/:id/publish', FilesController.putPublish);

// PUT /files/:id/publish
router.put('/files/:id/publish', FilesController.putUnpublish);

// GET /files/:id/data
router.get('/files/:id/data', FilesController.getFile);

// GET /files/:id
router.get('/files/:id', FilesController.getShow);

// GET /files
router.get('/files', FilesController.getIndex);

export default router;
