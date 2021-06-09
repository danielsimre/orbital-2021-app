import mongoose from "mongoose";

const { Schema } = mongoose;

const ProjectRoleSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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

const ProjectRole = mongoose.model("ProjectRole", ProjectRoleSchema);

export default ProjectRole;
