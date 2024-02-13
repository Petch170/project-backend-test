import bcrypt from 'bcrypt'; // Make sure to import the bcrypt library
import { checkMissingField } from '../utils/requestUtils.js'; // Import the checkMissingField function
import databaseClient from '../services/database.mjs'; // Import the databaseClient

const signupRoute = async (req, res) => {
  const DATA_KEY_SIGNUP = ["fullName", "email", "password", "gender", "dob", "phoneNumber", "typemem"];
  let body = req.body;

  const [isChecked , setISsChecked] = checkMissingField(DATA_KEY_SIGNUP,body);

  if (!isChecked) {
    res.send(`Missing Fields: ${"".concat(setISsChecked)}`);
    return;
  }

  // Check if the email already exists in the database
  const existingMember = await databaseClient.db().collection("members").findOne({ email: body.email });
  if (existingMember) {
    res.status(400).json({ error: 'Email already exists' });
    return;
  }

  const SALT = 10;
  const saltRound = await bcrypt.genSalt(SALT);
  body["password"] = await bcrypt.hash(body["password"], saltRound);

  await databaseClient.db().collection("members").insertOne(body);

  res.status(200).json(body);
};

export default signupRoute;
