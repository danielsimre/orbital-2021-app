import mongoose from "mongoose";

const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creation_date: {
      type: Date,
      required: true,
      default: Date.now,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const { id, ...rest } = ret;
        delete rest._id;
        delete rest.__v;
        return { id: ret.id, type: "projects", attributes: { ...rest } };
      },
    },
  }
);

// Virtual populate
ProjectSchema.virtual("users", {
  ref: "ProjectRole",
  localField: "_id",
  foreignField: "projectId",
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
