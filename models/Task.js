import mongoose from "mongoose";

const { Schema } = mongoose;

const TaskSchema = new Schema({
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
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
