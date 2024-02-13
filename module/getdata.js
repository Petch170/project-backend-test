import databaseClient from "../services/database.mjs";
import { checkMissingField } from "../utils/requestUtils.js";import dotenv from "dotenv";
import cors from "cors";
import express, { response } from "express";

const getdata = async (req, res) => {
    let body = req.body;
    const DATA_KEYS = ["email"];
    const [isBodyChecked, missingFields] = checkMissingField(
      DATA_KEYS,
      body
    );

    if (!isBodyChecked) {
        res.send(`Missing Fields: ${"".concat(missingFields)}`);
        return;
      }


    console.log('req',body);
  const data = await databaseClient
    .db()
    .collection("members")
    .findOne({ email: body.email }, {projection: {password: 0}});
    // .find({}, { projection: { _id: 1, average_heart_rate: 1 } })

    // console.log('res',data);
    const sendData = data;
    res.send(sendData);
};

export default getdata;