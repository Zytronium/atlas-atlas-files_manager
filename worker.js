import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import imageThumbnail from 'image-thumbnail';
import dbClient from './utils/db';
import fileQueue from './queues/fileQueue';

fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) throw new Error('Missing fileId');
  if (!userId) throw new Error('Missing userId');

  const file = await dbClient.db.collection('files').findOne({
    _id: new ObjectId(fileId),
    userId,
  });

  if (!file) throw new Error('File not found');

  const filePath = file.localPath;
  const sizes = [500, 250, 100];

  for (const size of sizes) {
    try {
      const thumbnail = await imageThumbnail(filePath, { width: size });
      const ext = path.extname(filePath);
      const base = path.basename(filePath, ext);
      const dir = path.dirname(filePath);
      const thumbPath = path.join(dir, `${base}_${size}${ext}`);
      await fs.promises.writeFile(thumbPath, thumbnail);
    } catch (err) {
      console.error(`Failed to create thumbnail (size ${size}):`, err.message);
    }
  }
});
