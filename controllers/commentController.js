import { Comment } from "../models/BaseText.js";
import { BaseTask } from "../models/BaseTask.js";
import Group from "../models/Group.js";
import {
  validateAuthorOfComment,
  validateClassIsIncomplete,
  validateFieldsPresent,
} from "../utils/validation.js";

export const getAllInfo = (req, res) => {
  Promise.all([
    BaseTask.find({ assignedTo: req.user.id })
      .select("_id")
      .then((tasks) => tasks.map((task) => task._id)),
    Group.find({ mentoredBy: req.user.id })
      .select("tasks")
      .then((groupsArr) => {
        let taskArr = [];
        groupsArr.forEach((group) => {
          taskArr = taskArr.concat(group.tasks);
        });
        return taskArr;
      }),
    // taskArr[0] represent comments belonging to tasks that this user belongs to
    // taskArr[1] represent comments belonging to all tasks in groups that the user is mentoring
  ])
    .then((taskArr) =>
      // Exclude comments made by this user
      Comment.find({
        taskId: {
          $in: taskArr[0].concat(taskArr[1]),
        },
        createdBy: { $ne: req.user.id },
      }).then((comments) =>
        // Add groupId to each comment
        Promise.all(
          comments.map(async (comment) => {
            const commentObj = comment.toObject();
            const group = await Group.findOne({
              tasks: commentObj.attributes.taskId.id,
            });
            commentObj.attributes.groupId = group._id;
            return commentObj;
          })
        )
      )
    )
    .then((commentObjArr) => res.json(commentObjArr))
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
