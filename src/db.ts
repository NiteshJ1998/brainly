import { Model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

const UserModel = new Model(UserSchema, "User");
