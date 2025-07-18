#!/usr/bin/node
/*
 * Manages the logic for the /files route
 */
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import AuthController from '../AuthController.js';// subject to change
import dbclient from '../utils/db';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const user = await AuthController.getUserFromToken(req);
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

    const allowedTypes = ['folder', 'file', 'images'];
    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const parentIdVal = parentId === 0 ? 0 : parentId;
    if (parentId !== 0) {
      const parentFile = await dbclient.db.collection('files').findOne({ _id: new dbclient.ObjectId(parentId) });
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
      parentId: parentIdVal,
    };
    if (type === 'file' || type === 'image') {
      const fileName = uuidv4();
      if (!fs.existsSync(FOLDER_PATH, fileName)) {
        fs.mkdirSync(FOLDER_PATH, { recursive: true });
      }
      const filePath = path.join(FOLDER_PATH, fileName);
      const buffer = Buffer.from(data, 'base64');
      await fs.promises.writeFile(filePath, buffer);
      fileDoc.localPath = filePath;
    }
    const result = await dbclient.db.collection('files').insertOne(fileDoc);
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
}

module.exports = FilesController;
