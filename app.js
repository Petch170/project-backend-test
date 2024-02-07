import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcrypt";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { mockUserActivity } from "./data/mockUserActivity.js";
import { mockUserInfo } from "./data/mockUserInfo.js";
import { mockActivity } from "./data/mockCard.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const name = uuidv4();
    const extension = file.mimetype.split("/")[1];
    const filename = `${name}.${extension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(helmet());

app.get("/user/activity/:userId", (req, res) => {
  const { userId } = req.params;
  const data = [...mockUserActivity];
  const userData = data.filter((user) => user.userId === Number(userId));
  res.json({ data: userData });
});

app.get("/user/info/:userId", (req, res) => {
  const { userId } = req.params;
  const data = [...mockUserInfo];
  const userData = data.filter((user) => user.userId === Number(userId));
  res.json({ data: userData });
});

app.post("/user/changePassword/:userId", (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  const data = [...mockUserInfo];
  const saltRounds = 12;
  const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
  const userData = data.filter((user) => user.userId === Number(userId))[0];
  userData.password = hashedPassword;
  res.json({ data: [userData] });
});

app.patch("/user/editProfile/:userId", upload.single("image"), (req, res) => {
  const { userId } = req.params;
  const { name, email, phoneNumber } = req.body;
  const { filename } = req.file;
  const data = [...mockUserInfo];
  const userData = data.filter((user) => user.userId === Number(userId))[0];
  userData.fullName = name;
  userData.email = email;
  userData.phone = phoneNumber;
  userData.imagePath = `/uploads/${filename}`;
  res.json({ data: [userData] });
});

// mock upload
// app.patch("/user/:userId/uploads", upload.single("image"), (req, res) => {
//   const { filename } = req.file;
//   const { name } = req.body;
//   console.log(req.file);
//   const todoId = parseInt(req.params.userId, 10);
//   const updatedTodo = updateTodo(todoId, { imagePath: `/uploads/${filename}` });
//   if (!updatedTodo) {
//     res.status(404).json({ error: { message: "todo not found" } });
//   }

//   res.json({ data: [{ id: todoId, imagePath: `/uploads/${filename}`, name }] });
// });


app.get("/post/",(req, res) => {
  try  {
    res.status(200).json(mockActivity);
} catch (err) {
    res.status(500).send(err);
}
});

app.get("/post/:userId/",(req, res) => {
  const {userId} = req.params
  const postFilterbyUserId = mockActivity.filter((post) => post.userId === userId)
  console.log(userId);
  try {
    res.status(200).json(postFilterbyUserId);
} catch (err) {
    res.status(500).send(err);
}
});


app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null
  };

  mockActivity.push(newRecord);

  console.log('New record added:', newRecord);

  res.status(200).json({status: 'success', message: 'New record added successfully'});
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});

app.post('/post', upload.single('imageUrl'), (req, res) => {
  // Extract data from req.body
  const { userId, profilepic, fullname, id, activityName, activityType, date, durations, distance, description } = req.body;

  // Construct the new record
  const newRecord = {
    userId,
    profilepic,
    fullname,
    id,
    activityName,
    activityType,
    date,
    durations,
    distance,
    description,
    imageUrl: req.file ? req.file.path : null // Use the path of the uploaded file if available
  };

  // Push the new record to the mockData array
  mockData.push(newRecord);

  console.log('New record added:', newRecord);

  // Respond with the added record
  res.status(200).json(newRecord);
});


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });