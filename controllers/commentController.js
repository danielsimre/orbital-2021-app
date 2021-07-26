import { Comment } from "../models/BaseText.js";
import { BaseTask } from "../models/BaseTask.js";
import {
  validateAuthorOfComment,
  validateClassIsIncomplete,
  validateFieldsPresent,
} from "../utils/validation.js";

export const getAllInfo = (req, res) => {
  BaseTask.find({ assignedTo: req.user.id })
    .select("_id")
    .then((arr) => Comment.find({ taskId: { $in: arr } }))
    .then((comments) => res.json(comments))
    .catch((err) => console.log(err));
};

export const getComment = (req, res) => {
  Comment.findById(req.params.id).then((comment) => res.json(comment));
};

export const updateComment = (req, res) => {
  Comment.findById(req.params.id)
    .then((comment) => {
      validateFieldsPresent(
        res,
        "Please enter a non-empty string for attributes title and content",
        req.body.title,
        req.body.content
      );
      return comment;
    })
    .then((comment) =>
      validateClassIsIncomplete(res, comment.taskId.classId.id, comment)
    )
    .then((comment) =>
      validateAuthorOfComment(
        res,
        comment,
        req.user.id,
        "Unable to access comment"
      )
    )
    .then((comment) =>
      Comment.updateOne(
        { _id: comment.id },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
          },
          $currentDate: {
            lastEditDate: true,
          },
        }
      )
    )
    .then(() => res.json({ msg: "Comment successfully updated" }))
    .catch((err) => console.log(err));
};

export const deleteComment = (req, res) => {
  Comment.findById(req.params.id)
    .then((comment) =>
      validateClassIsIncomplete(res, comment.taskId.classId.id, comment)
    )
    .then((comment) =>
      validateAuthorOfComment(
        res,
        comment,
        req.user.id,
        "Unable to access comment"
      )
    )
    .then((comment) => Comment.deleteOne({ _id: comment.id }))
    .then((comment) => res.json(comment))
    .catch((err) => console.log(err));
};
