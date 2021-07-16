import mongoose from "mongoose";

const { Schema } = mongoose;

const baseOptions = {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      const { id, ...rest } = ret;
      delete rest._id;
      delete rest.__v;
      return { id: ret.id, type: "classes", attributes: { ...rest } };
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      const { id, ...rest } = ret;
      delete rest._id;
      delete rest.__v;
      return { id: ret.id, type: "classes", attributes: { ...rest } };
    },
  },
};

const ClassSchema = new Schema(
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
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    taskFramework: [
      {
        name: { type: String, required: true },
        desc: { type: String, required: true },
        dueDate: { type: Date, required: true },
        isMilestone: { type: Boolean, required: true, default: false },
      },
    ],
    studentInviteCode: {
      type: String,
      unique: true,
    },
    mentorInviteCode: {
      type: String,
      unique: true,
    },
    groupSize: {
      type: Number,
      required: true,
      default: 5,
      min: [1, "Group size must be at least 1"],
      max: [10, "Group size can be at most 10"],
      validate: {
        validator: Number.isInteger,
        message: "Group size must be an integer value between 1 and 10",
      },
    },
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
  baseOptions
);

// Virtual populate
ClassSchema.virtual("users", {
  ref: "ClassRole",
  localField: "_id",
  foreignField: "classId",
});

const Class = mongoose.model("Class", ClassSchema);

export default Class;
