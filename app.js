import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcrypt";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { mockUserActivity } from "./data/mockUserActivity.js";
import { mockUserInfo } from "./data/mockUserInfo.js";

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
