#!/usr/bin/node
/*
 * UsersController contains the logic for each route relating to users.
 */
import dbclient from "../utils/db";
import crypto from 'crypto';

class UsersController {
  // POST /users logic
  static async postNew(req, res) {
    // Get 'users' collection
    const usersCol = dbclient.db.collection("users");

    // Get email and password specified
    const { email, password } = req.body;

    // If email is missing, return error `Missing email` with status code 400
    if (!email) {
      return res.status(400).send({ error: "Missing email" });
    }
    // If password is missing, return error `Missing password` with status code 400
    if (!password) {
      return res.status(400).send({ error: "Missing password" });
    }
    // If a user with that email already exists in the DB, return error `Already exist` with status code 400
    if (await usersCol.findOne({ email: email })) {
      return res.status(400).send({ error: "Already exist" });
    }

    // Hash the password in SHA1
    const hashedPW = crypto.createHash("sha1").update(password).digest("hex");

    // Create the user with the email and hashed password
    const user = {
      email: email,
      password: hashedPW,
    };

    // Save that user to MongoDB's 'users' collection
    const result = await usersCol.insertOne(user); // MongoDB will autogenerate an id

    // Return the new user's email and id with status code 201
    res.status(201).send({ email: email, id: result.insertedId });
  }
}

export default UsersController;
