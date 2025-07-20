#!/usr/bin/node
/*
 * AuthController contains the logic for routes relating to authentication.
 */
import redisClient from "../utils/redis";
import dbclient from "../utils/db";
import {v4 as uuidv4} from 'uuid';
import crypto from 'crypto';

class AuthController {
  // GET /connect logic
  static async getConnect(req, res) {
    // Sign in to a user by generating a new authentication token

    // Get the user from the Authorization header
    const user = await AuthController.getUserFromToken(req);
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

  // Not an endpoint. Helper function that gets a user from the Authorization header in req.
  static async getUserFromToken(req) {
    // Gets a user from the token stored in `req`. Returns the user if found,
    // else, returns null, in which case, the endpoint calling this function
    // should return error 401 Unauthorized.

    // Get 'users' collection
    const usersCol = dbclient.db.collection("users");

    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if auth header exists and starts with "Basic "
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      // If not, return null. The calling function should return error 401 Unauthorized
      return null;
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
    return await usersCol.findOne({email: email, password: hashedPW});
    // If this returns null, the user is not found and the calling function should return error 401 Unauthorized
  }
}

export default AuthController;
