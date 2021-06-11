import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    madeBy: {
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
    text: {
      type: String,
      required: true,
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

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
