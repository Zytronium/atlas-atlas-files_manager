#!/usr/bin/node
/*
 * Util for MongoDB. You must have the mongod service installed and running
 * on the host specified (in process.env) for this to connect. If the host
 * is 'localhost' (which is default), it must be running on your machine.
 */
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

class DBClient {
  constructor () {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, {useUnifiedTopology: true});
    this.dbName = database;
    this.isConnected = false;

    this.client.connect()
      .then(() => {
        this.db = this.client.db(this.dbName);
        this.isConnected = true;
      })
      .catch((err) => {
        console.error('MongoDB Client Error:', err);
      });
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments({}, { hint: "_id"});
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments({}, { hint: "_id"});
  }
}

const dbClient = new DBClient();
export default dbClient;
