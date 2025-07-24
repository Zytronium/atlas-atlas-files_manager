import Bull from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const fileQueue = new Bull('fileQueue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
});

export default fileQueue;
