#!/usr/bin/node
import {MongoClient} from 'mongodb';

class DBClient {
  constructor () {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, {useUnifiedTopology: true});
    this.dbName = database;

    this.client.connect()
      .then(() => {
        this.db = this.client.db(this.dbName);
      })
      .catch((err) => {
        console.error('MongoDB Client Error:', err);
      });
  }
}

const dbClient = new DBClient();
export default dbClient;
