import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { ContentModel, UserModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/brain-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo error:", err);
    process.exit(1);
  });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username: username,
      password: password,
    });
    res.json({
      message: "User signup successfully",
    });
  } catch (e) {
    res.status(411).json({
      message: "User is already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    // TEMP (before bcrypt)
    if (existingUser.password !== password) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);

    res.json({ token });
  } catch (err) {
    console.error("SIGNIN ERROR:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  await ContentModel.create({
    link,
    type,
    // @ts-ignore
    userId: req.userId,
    tags: [],
  });

  return res.status(200).json({
    message: "Content Added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.post("/api/v1/delete", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId: req.userId,
  });
});

app.post("/api/v1/brain/share", (req, res) => {});

app.post("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(3000, () => console.log(`server started at port 3000`));
