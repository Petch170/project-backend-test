import dotenv from "dotenv";
import cors from "cors";
import express, { response } from "express";
import multer from "multer";
import { ObjectId } from "mongodb";
import databaseClient from "../services/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginRoute = async (req, res) => {
  let body = req.body;
  const LOGIN_DATA_KEYS = ["email", "password"];
  const [isBodyChecked, missingFields] = checkMissingField(
    LOGIN_DATA_KEYS,
    body
  );
  // console.log(body);
  // res.send(body);

  if (!isBodyChecked) {
    res.send(`Missing Fields: ${"".concat(missingFields)}`);
    return;
  }

  const user = await databaseClient
    .db()
    .collection("members")
    .findOne({ email: body.email });
  if (user === null) {
    res.send("User or Password invalid");
    return;
  }
  // hash password
  if (!bcrypt.compareSync(body.password, user.password)) {
    res.send("E-Mail or Password invalid");
    return;
  }


  // Generate JWT token
  const token = createJwt(body.email);
  
  // Send response with token and body
  res.json({ token });
};

// Function to create JWT token
function createJwt(email) {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const data = { email: email };
  const token = jwt.sign(data, jwtSecretKey, {
    expiresIn: "7d",
  });
  return token;
};
  ///////////////////////////////////////////



export default loginRoute;
