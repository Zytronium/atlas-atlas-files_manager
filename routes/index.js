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

// -------------- AppController Endpoints -------------- \\

// GET /status
router.get('/status', AppController.getStatus);

// GET /stats
router.get('/stats', AppController.getStats);

// POST /files
router.post('/files', FilesController.postUpload);

// ------------- UsersController Endpoints ------------- \\

// GET /users/me
// router.get('/users/me', UsersController.getMe); // todo

// POST /users
router.post('/users', UsersController.postNew);

// GET /files/:id
router.get('/files/:id', FilesController.getShow);

// GET /files
router.get('/files', FilesController.getIndex);
// ------------- AuthController Endpoints ------------- \\

// GET /connect
router.get('/connect', AuthController.getConnect);

// GET /disconnect
// router.get('/disconnect', AuthController.getDisconnect); // todo

export default router;
