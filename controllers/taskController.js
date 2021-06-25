import { BaseTask, ParentTask } from "../models/BaseTask.js";

export const getAllInfo = (req, res) => {
  BaseTask.find({ assignedTo: req.user.id })
    .then((tasks) => res.json(tasks))
    .catch((err) => console.log(err));
};

export const update = (req, res) => {
  BaseTask.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json({ msg: "Successfully updated task" }))
    .catch((err) => console.log(err));
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
