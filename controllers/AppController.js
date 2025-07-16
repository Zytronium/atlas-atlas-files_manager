#!/usr/bin/node
/*
 * AppController contains the logic for each route.
 */
import redisClient from "../utils/redis";
import dbclient from "../utils/db";

class AppController {
  static getStatus(req, res) {
    res.status(200).send({ "redis": redisClient.isAlive(), "db": dbclient.isAlive() });
  }

  static async getStats(req, res) {
    res.status(200).send({ "users": await dbclient.nbUsers(), "files": await dbclient.nbFiles() });
  }
}

export default AppController;
