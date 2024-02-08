import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcrypt";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import databaseClient from "./services/database.mjs";
import { mockUserActivity } from "./data/mockUserActivity.js";
import { mockUserInfo } from "./data/mockUserInfo.js";
import { mockActivity } from "./data/mockCard.js";
import { ObjectId } from "mongodb";
import { auth } from "./middlewares/auth.js";

const HOSTNAME = process.env.SERVER_IP || "localhost";
const PORT = process.env.SERVER_PORT || 8000;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadToCloudinary(req, res, next) {
  // console.log("req.file", req.file);
  const fileBufferBase64 = Buffer.from(req.file.buffer).toString("base64");
  const base64File = `data:${req.file.mimetype};base64,${fileBufferBase64}`;
  // console.log("fileBufferBase64", fileBufferBase64);
  // console.log("base64File", base64File);
  req.cloudinary = await cloudinary.uploader.upload(base64File, {
    resource_type: "auto",
  });
  // console.log(req.cloudinary);
  next();
}

// upload to local
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads");
//   },
//   filename: function (req, file, cb) {
//     const name = uuidv4();
//     const extension = file.mimetype.split("/")[1];
//     const filename = `${name}.${extension}`;
//     cb(null, filename);
//   },
// });

dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();
// const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(helmet());

app.get("/user/activity/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  // const data = [...mockUserActivity];
  // const userData = data.filter((user) => user.userId === Number(userId));
  const userData = await databaseClient
    .db()
    .collection("user-activity")
    .find({ userId: new ObjectId(userId) })
    .toArray();
  res.json({ count: userData.length, data: userData });
});

app.get("/user/info/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  // const data = [...mockUserInfo];
  // const userData = data.filter((user) => user.userId === Number(userId));
  const userData = await databaseClient
    .db()
    .collection("user-info")
    .find({ _id: new ObjectId(userId) })
    .project({ password: 0 })
    .toArray();
  res.json({ data: userData });
});

app.post("/user/changePassword/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  const saltRounds = 12;
  const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
  // const data = [...mockUserInfo];
  // const userData = data.filter((user) => user.userId === Number(userId))[0];
  // userData.password = hashedPassword;
  await databaseClient
    .db()
    .collection("user-info")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );
  res.status(200).send("OK");
});

app.patch(
  "/user/editProfile/:userId",
  auth,
  upload.single("image"),
  uploadToCloudinary,
  async (req, res) => {
    const { userId } = req.params;
    const { name, email, phoneNumber } = req.body;
    // const { filename } = req.file;
    // const data = [...mockUserInfo];
    // const userData = data.filter((user) => user.userId === Number(userId))[0];
    // userData.fullName = name;
    // userData.email = email;
    // userData.phone = phoneNumber;
    // userData.imagePath = `/uploads/${filename}`;
    await databaseClient
      .db()
      .collection("user-info")
      .updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            fullName: name,
            email: email,
            phone: phoneNumber,
            imagePath: req.cloudinary.secure_url,
          },
        }
      );
    res.send("OK");
  }
);

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

//USERHOME-PAGE
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
 
  try {
    res.status(200).json(postFilterbyUserId);
} catch (err) {
    res.status(500).send(err);
}
});


app.post("/post/", upload.single("imageUrl"), uploadToCloudinary, async (req, res) => {
  try {
    const { userId, profilepic, fullname, activityName, activityType, date, durations, distance, description } = req.body;
    
    // Insert the new record into the database collection and capture the result
    const insertResult = await databaseClient
      .db()
      .collection("user_card")
      .insertOne({
        userId: userId,
        profilepic: profilepic,
        fullname: fullname,
        activityName: activityName,
        activityType: activityType,
        date: date,
        durations: durations,
        distance: distance,
        description: description,
        imageUrl: req.cloudinary.secure_url, // Assuming this holds the URL from Cloudinary upload
      });

    // Check if the insertion was successful
    if (insertResult.insertedCount === 1) {
      res.status(200).send({ insertedId: insertResult.insertedId });
    } else {
      res.status(500).json({ error: "Failed to insert record into the database" });
    }    
    
  } catch (error) {
    console.error("Error creating new record:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
