import mongoose from "mongoose";

const { Schema } = mongoose;

// tasks can be discriminated by their taskType (in baseOptions)
// if not can query the tasks collection for all tasks instead
// see: https://stackoverflow.com/questions/38725454/mongoose-discriminators-behavior

const baseOptions = {
  discriminatorKey: "taskType",
  collection: "task",
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      const { id, ...rest } = ret;
      delete rest._id;
      delete rest.__v;
      return { id: ret.id, type: "tasks", attributes: { ...rest } };
    },
  },
};

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
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
  },
  baseOptions
);

const BaseTask = mongoose.model("BaseTask", BaseTaskSchema);

// 2nd parameter is another schema: discriminator returns a union of both schemas provided
const ParentTask = BaseTask.discriminator(
  "ParentTask",
  new mongoose.Schema({ subtasks: [BaseTask] })
);

export { BaseTask, ParentTask };
