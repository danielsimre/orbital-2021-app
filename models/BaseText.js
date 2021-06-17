import mongoose from "mongoose";

const { Schema } = mongoose;

const baseOptions = {
  discriminatorKey: "textType",
  collection: "text",
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      const { id, ...rest } = ret;
      delete rest._id;
      delete rest.__v;
      return { id: ret.id, type: "texts", attributes: { ...rest } };
    },
  },
};

const BaseTextSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creationDate: {
      type: Date,
      required: true,
      default: Date(),
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
  },
  baseOptions
);

const BaseText = mongoose.model("Text", BaseTextSchema);

// discrimate between Announcements and Comments
// Announcements belong to a Class group, Comments belong to a Task

const Announcement = BaseText.discriminator(
  "Announcement",
  new Schema({ class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" } })
);

const Comment = BaseText.discriminator(
  "Comment",
  new Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: "BaseTask" },
  })
);

export { Announcement, Comment };
