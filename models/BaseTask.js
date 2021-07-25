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

// Cannot use arrow notation in this case, due to usage of 'this'
function formatData(next) {
  this.sort({ dueDate: 1 })
    .populate({ path: "classId", select: "name" })
    .populate({ path: "assignedTo", select: "username" })
    .populate({ path: "comments", select: "-taskId" })
    .populate({ path: "subtasks" });
  next();
}

BaseTaskSchema.pre("findOne", formatData).pre("find", formatData);

const BaseTask = mongoose.model("BaseTask", BaseTaskSchema);

// 2nd parameter is another schema: discriminator returns a union of both schemas provided
const ParentTask = BaseTask.discriminator(
  "ParentTask",
  new mongoose.Schema({
    subtasks: [{ type: Schema.Types.ObjectId, ref: "BaseTask" }],
    submissions: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  })
);

export { BaseTask, ParentTask };
