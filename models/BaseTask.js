import mongoose from "mongoose";

const { Schema } = mongoose;

const BaseTaskSchema = new Schema(
  {
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
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
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
        return { id: ret.id, type: "tasks", attributes: { ...rest } };
      },
    },
  }
);

const Task = mongoose.model("Task", BaseTaskSchema);

// 2nd parameter is another schema: discriminator returns a union of both schemas provided
const ParentTask = Task.discriminator(
  "ParentTask",
  new mongoose.Schema({ subtasks: [Task] })
);

export { Task, ParentTask };
