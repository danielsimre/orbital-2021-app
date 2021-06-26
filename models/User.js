import mongoose from "mongoose";

const { Schema } = mongoose;

const baseOptions = {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      const { id, ...rest } = ret;
      delete rest._id;
      delete rest.__v;
      return { id: ret.id, type: "users", attributes: { ...rest } };
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      const { id, ...rest } = ret;
      delete rest._id;
      delete rest.__v;
      return { id: ret.id, type: "users", attributes: { ...rest } };
    },
  },
};

const UserSchema = new Schema(
  {
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
  },
  baseOptions
);

// Virtual populate
UserSchema.virtual("classes", {
  ref: "ClassRole",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.model("User", UserSchema);

export default User;
