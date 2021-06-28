import { BaseTask, ParentTask } from "../models/BaseTask.js";
import {
  validateCanAccessTask,
  validateFieldsPresent,
  validateURLs,
} from "../utils/validation.js";

export const getAllInfo = (req, res) => {
  Promise.all([
    BaseTask.find({ assignedTo: req.user.id, isCompleted: false }),
    BaseTask.find({ assignedTo: req.user.id, isCompleted: true }),
  ])
    .then((tasks) =>
      res.json({ incompletedTasks: tasks[0], completedTasks: tasks[1] })
    )
    .catch((err) => console.log(err));
};

export const update = (req, res) => {
  // api/v1/tasks/:id?submissions is to edit submissions (Only for parent tasks)
  if (req.query.submissions === "") {
    ParentTask.findById(req.params.id)
      .then((task) =>
        validateCanAccessTask(
          res,
          task,
          req.user.id,
          "Cannot update submissions of task"
        )
      )
      .then((task) => {
        const { submissionLinks } = req.body;
        validateFieldsPresent(
          res,
          "Please add an array of urls for attribute submissionLinks",
          submissionLinks
        );
        validateURLs(res, submissionLinks);
        task.submissions = submissionLinks;
        task.save();
      })
      .then(() =>
        res.json({ msg: "Successfully updated submissions for task" })
      )
      .catch((err) => console.log(err));
    // api/v1/tasks/:id?isCompleted is to edit
  } else if (req.query.isCompleted === "") {
    ParentTask.findById(req.params.id)
      .then((task) =>
        validateCanAccessTask(
          res,
          task,
          req.user.id,
          "Cannot update completion status of task"
        )
      )
      .then((task) => {
        const { isCompleted } = req.body;
        validateFieldsPresent(
          res,
          "Please add a boolean value for attribute isCompleted",
          isCompleted
        );
        task.isCompleted = isCompleted;
        task.save();
      })
      .then(() =>
        res.json({ msg: "Successfully updated completion status of task" })
      )
      .catch((err) => console.log(err));
  } else {
    res.status(404).json({ msg: "Invalid operation" });
  }
};

export const createComment = (req, res) => {
  ParentTask.findOne({ _id: req.params.id })
    .then((curTask) => {
      const { title, content } = req.body;
      const newComment = new Comment({
        title,
        content,
        createdBy: req.user.id,
      });

      newComment.save();
      curTask.comments.push(newComment.id);
      curTask.save();
    })
    .then(() => res.json({ msg: "Successfully created comment" }))
    .catch((err) => console.log(err));
};
