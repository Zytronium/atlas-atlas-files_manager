#!/usr/bin/node
/*
 * AppController contains the logic for each route.
 */
import redisClient from "../utils/redis";
import dbclient from "../utils/db";

class AppController {
  // GET /status logic
  static getStatus(req, res) {
    // Gets the status of the Redis client and Mongo DB client.
    res.status(200).send({ "redis": redisClient.isAlive(), "db": dbclient.isAlive() });
  }

  // GET /stats logic
  static async getStats(req, res) {
    // Gets the number of users and number of files in the Mongo DB
    res.status(200).send({ "users": await dbclient.nbUsers(), "files": await dbclient.nbFiles() });
  }
}

export default AppController;
