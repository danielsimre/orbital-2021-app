import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  register_date: {
    type: Date,
    required: true,
    default: Date.now,
    select: false,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
