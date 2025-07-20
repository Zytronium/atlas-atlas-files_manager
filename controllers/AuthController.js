#!/usr/bin/node
/*
 * AuthController contains the logic for routes relating to authentication.
 */
import redisClient from "../utils/redis";
import dbclient from "../utils/db";
import { ObjectId } from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import crypto from 'crypto';

class AuthController {
  // GET /connect logic - Sign in a user by generating a new authentication token
  static async getConnect(req, res) {
    // Get 'users' collection
    const usersCol = dbclient.db.collection("users");

    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if auth header exists and starts with "Basic "
    if (!authHeader || !authHeader.startsWith("Basic ")) { // If not, return error 401 Unauthorized
      return res.status(401).send({ error: "Unauthorized" });
    }

    // Remove "Basic " from auth header string and decode from base64
    const base64Credentials = authHeader.replace("Basic ", "");
    const credentials = Buffer.from(base64Credentials, "base64").toString();
    // ^ This will result in something like "someone@example.com:password123" (email:password)

    // Get email & password from credentials
    const [email, password] = credentials.split(":");

    // Hash the password
    const hashedPW = crypto.createHash('sha1').update(password).digest('hex');

    // Search for a user with this email and password in the DB and return it.
    const user = await usersCol.findOne({email: email, password: hashedPW});
    if (!user) { // If the user is not found, return error 401 Unauthorized
      return res.status(401).send({ error: "Unauthorized" });
    }

    // Generate and save a random UUID token that expires in 1 day
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 86400); // 86,400 seconds = 24 hours

    // Return the token with status code 200
    res.status(200).send({ token: token});
  }

  // GET /disconnect logic
  static async getDisconnect(req, res) {
    // todo

  }

  // Not an endpoint. Helper function that gets a user from a token.
  static async getUserFromToken(token) {
    // Get 'users' collection
    const usersCol = dbclient.db.collection("users");

    if (!token) {
      // Return null if no token was found (i.e., token is null or undefined)
      return null;
    }

    // Get the user ID from redis
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      // Return null if not found
      return null;
    }

    // Find the user in the Mongo DB from the user ID
    const user = await usersCol.findOne({ _id: new ObjectId(userId) });
    // Return the user if found, else null
    return user || null;
  }

}

export default AuthController;
