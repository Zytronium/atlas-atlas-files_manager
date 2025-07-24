#!/usr/bin/node
/*
 * Manages the logic for the /files routes
 */
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import AuthController from './AuthController';
import dbclient from '../utils/db';
import fileQueue from '../queues/fileQueue';

dotenv.config({ quiet: true });

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const user = await AuthController.getUserFromToken(req.headers['x-token']);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name,
      type,
      parentId = 0,
      isPublic = false,
      data,
    } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    const allowedTypes = ['folder', 'file', 'image'];
    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId !== 0) {
      const parentFile = await dbclient.db.collection('files').findOne({ _id: new ObjectId(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    const fileDoc = {
      userId: user._id,
      name,
      type,
      isPublic,
      parentId,
    };
    if (type === 'file' || type === 'image') {
      if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH, { recursive: true });
      }
      const fileName = uuidv4();
      const filePath = path.join(FOLDER_PATH, fileName);
      const buffer = Buffer.from(data, 'base64');
      await fs.promises.writeFile(filePath, buffer);
      fileDoc.localPath = filePath;
    }
    const result = await dbclient.db.collection('files').insertOne(fileDoc);

    if (type === 'image') {
      await fileQueue.add({
        userId: user._id.toString(),
        fileId: result.insertedId.toString(),
      });
    }
    const response = {
      id: result.insertedId,
      userId: fileDoc.userId,
      name: fileDoc.name,
      type: fileDoc.type,
      isPublic: fileDoc.isPublic,
      parentId: fileDoc.parentId,
    };
    return res.status(201).json(response);
  }

  static async getShow(req, res) {
    const user = await AuthController.getUserFromToken(req.headers['x-token']);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) {
      return res.status(401).json({ error: 'Not found' });
    }
    const file = await dbclient.db.collection('files').findOne({
      _id: new ObjectId(fileId),
      userId: user._id,
    });
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async getIndex(req, res) {
    const user = await AuthController.getUserFromToken(req.headers['x-token']);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const parentId = req.query.parentId || 0;
    const page = parseInt(req.query.page, 10) || 0;
    const match = {
      userId: user._id,
      parentId: parentId === 0 ? 0 : new ObjectId(parentId),
    };
    const files = await dbclient.db.collection('files')
      .aggregate([
        { $match: match },
        { $skip: page * 20 },
        { $limit: 20 },
        {
          $project: {
            _id: 0,
            id: '$_id',
            userId: 1,
            name: 1,
            type: 1,
            isPublic: 1,
            parentId: 1,
          },
        },
      ])
      .toArray();
    return res.status(200).json(files);
  }

  static async putPublish(req, res) {
    // Token check
    const user = await AuthController.getUserFromToken(req.headers['x-token']);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // gets id parameter
    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }
    // Searches mongoesDB for id
    const file = await dbclient.db.collection('files').findOne({
      _id: new ObjectId(fileId),
      userId: user._id,
    });
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    // Updates isPublic
    await dbclient.db.collection('files').updateOne(
      { _id: new ObjectId(fileId) },
      { $set: { isPublic: true } },
    );
    // Sets up the new files info
    const updatedFile = {
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: true,
      parentId: file.parentId,
    };
    return res.status(200).json(updatedFile);
  }

  static async putUnpublish(req, res) {
    const user = await AuthController.getUserFromToken(req.headers['x-token']);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }
    const file = await dbclient.db.collection('files').findOne({
      _id: new ObjectId(fileId),
      userId: user._id,
    });
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    await dbclient.db.collection('files').updateOne(
      { _id: new ObjectId(fileId) },
      { $set: { isPublic: false } },
    );
    const updatedFile = {
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: false,
      parentId: file.parentId,
    };
    return res.status(200).json(updatedFile);
  }

  static async getFile(req, res) {
    const user = await AuthController.getUserFromToken(req.headers['x-token']);
    const { id: fileId } = req.params;
    const { size } = req.query;
    const validSizes = ['100', '250', '500'];
    if (!user) {
      return res.status(404).json({ error: 'Unauthorized' });
    }
    if (!ObjectId.isValid(fileId)) {
      return res.status(404).json({ error: 'Not found' });
    }
    const file = await dbclient.db.collection('files').findOne({
      _id: new ObjectId(fileId),
    });
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (!file.isPublic && (!user || user._id.toString() !== file.userId.toString())) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }
    let filePath = file.localPath;
    if (size && validSizes.includes(size)) {
      const ext = path.extname(filePath);
      const base = path.basename(filePath, ext);
      const dir = path.dirname(filePath);
      filePath = path.join(dir, `${base}_${size}${ext}`);
    }
    try {
      const fileData = await fs.promises.readFile(filePath);
      const mimeType = file.type === 'image' ? 'image/*' : 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      return res.status(200).send(fileData);
    } catch (err) {
      return res.status(404).json({ error: 'File not found on disk' });
    }
  }
}

module.exports = FilesController;
