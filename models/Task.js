import mongoose from "mongoose";

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    groupId: {
      // group the task belongs to
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    submissions: {
      type: [String],
    },
    assignedTo: {
      // users tasked to complete this task
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isMilestone: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const { id, ...rest } = ret;
        delete rest._id;
        delete rest.__v;
        return { id: ret.id, attributes: { ...rest } };
      },
    },
  }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
