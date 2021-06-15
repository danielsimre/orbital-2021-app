import mongoose from "mongoose";

const { Schema } = mongoose;

const ClassRoleSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    role: {
      type: String,
      enum: ["MENTOR", "STUDENT"],
      required: true,
      default: "STUDENT",
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const ClassRole = mongoose.model("ClassRole", ClassRoleSchema);

export default ClassRole;
