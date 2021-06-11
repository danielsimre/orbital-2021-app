import mongoose from "mongoose";

const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mentoredBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
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
  {
    toJSON: {
      transform: (doc, ret) => {
        const groupId = ret._id;
        delete ret._id;
        delete ret.__v;
        return { id: groupId, type: "groups", attributes: { ...ret } };
      },
    },
  }
);

const Group = mongoose.model("Group", GroupSchema);

export default Group;
