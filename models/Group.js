import mongoose from "mongoose";

const { Schema } = mongoose;

const baseOptions = {
  toJSON: {
    transform: (doc, ret) => {
      const groupId = ret._id;
      delete ret._id;
      delete ret.__v;
      return { id: groupId, type: "groups", attributes: { ...ret } };
    },
  },
};

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mentoredBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "ParentTask" }],
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creationDate: {
      type: Date,
      required: true,
      default: Date.now,
      select: false,
    },
  },
  baseOptions
);

const Group = mongoose.model("Group", GroupSchema);

export default Group;
