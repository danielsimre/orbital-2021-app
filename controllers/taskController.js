import Mongoose from "mongoose";
import { BaseTask, ParentTask } from "../models/BaseTask.js";
import { Comment } from "../models/BaseText.js";
import User from "../models/User.js";
import {
  validateCanAccessTask,
  validateCompleteParentTask,
  validateFieldsPresent,
  validateURLs,
  validateDueDate,
  validateIsSubtask,
  validateSubtaskData,
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
    // api/v1/tasks/:id?isCompleted is to edit the isCompleted status of a task
  } else if (req.query.isCompleted === "") {
    ParentTask.findById(req.params.id)
      .populate({ path: "subtasks", select: "isCompleted" })
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
        if (isCompleted) {
          validateCompleteParentTask(res, task);
        }
        task.isCompleted = isCompleted;
        task.save();
      })
      .then(() =>
        res.json({ msg: "Successfully updated completion status of task" })
      )
      .catch((err) => console.log(err));
    // api/v1/tasks/:id?subtasks is to edit the info of a subtask
    // Attributes that can be updated are name, desc, dueDate, assignedTo, isCompleted
  } else if (req.query.subtasks === "") {
    BaseTask.findById(req.params.id)
      .then((subtask) => validateIsSubtask(res, subtask))
      .then((subtask) =>
        // Check that user can access parent of this subtask
        ParentTask.findOne({ subtasks: subtask.id }).then((parentTask) =>
          validateCanAccessTask(
            res,
            parentTask,
            req.user.id,
            "Cannot access this subtask"
          )
        )
      )
      .then(async (task) => {
        const { dueDate, assignedTo, isCompleted } = req.body;
        // Check variables depending on what inputs are given in req.body
        if (dueDate !== undefined) {
          validateDueDate(res, new Date(dueDate));
          if (assignedTo !== undefined) {
            await validateSubtaskData(res, task, dueDate, assignedTo);
          } else {
            await validateSubtaskData(res, task, dueDate, []);
          }
        } else if (assignedTo !== undefined) {
          await validateSubtaskData(res, task, task.dueDate, assignedTo);
        }
        // If subtask is marked as false, mark parent task as false
        if (isCompleted === false) {
          task.isCompleted = false;
          await task.save();
        }
      })
      .then(async () => {
        let editedFields = "";
        const updatedSubtask = {};
        const editableAttributes = [
          "name",
          "desc",
          "dueDate",
          "assignedTo",
          "isCompleted",
        ];
        for (let i = 0; i < editableAttributes.length; i += 1) {
          // If the user input contains the attribute, add it to the updated object
          if (
            Object.prototype.hasOwnProperty.call(
              req.body,
              editableAttributes[i]
            )
          ) {
            updatedSubtask[editableAttributes[i]] =
              req.body[editableAttributes[i]];
            editedFields += `${editableAttributes[i]} `;
          }
        }
        if (Object.prototype.hasOwnProperty.call(req.body, "assignedTo")) {
          await User.find({ username: { $in: req.body.assignedTo } })
            .then((userArray) => userArray.map((user) => user.id))
            .then((assignedToIds) => {
              updatedSubtask.assignedTo = assignedToIds;
            });
        }
        // Prevent name and desc from being empty strings
        if (updatedSubtask.name === "") {
          delete updatedSubtask.name;
        }
        if (updatedSubtask.desc === "") {
          delete updatedSubtask.desc;
        }
        return BaseTask.updateOne({ _id: req.params.id }, updatedSubtask).then(
          () => editedFields
        );
      })
      .then((editedFields) =>
        res.json({ msg: `Fields edited: ${editedFields}` })
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
        taskId: curTask.id,
      });

      newComment.save();
      // Might not be necessary: search comments collection instead
      // curTask.comments.push(newComment.id);
      // curTask.save();
    })
    .then(() => res.json({ msg: "Successfully created comment" }))
    .catch((err) => console.log(err));
};

export const getComments = (req, res) => {
  ParentTask.findOne({ _id: req.params.id })
    .then((task) =>
      validateCanAccessTask(res, task, req.user.id, "Cannot access this task")
    )
    .then((task) => Comment.find({ taskId: task.id }))
    .then((comments) => res.json(comments))
    .catch((err) => console.log(err));
};

// Only works for parent tasks, there cannot be subtasks of subtasks
export const createSubtask = (req, res) => {
  ParentTask.findOne({ _id: req.params.id })
    .then((task) =>
      validateCanAccessTask(res, task, req.user.id, "Cannot access this task")
    )
    .then((task) => {
      const { taskName, taskDesc, dueDate, assignedTo } = req.body;
      validateFieldsPresent(
        res,
        "Please add a valid string value for attributes taskName and taskDesc, " +
          "a valid date for dueDate, and an array of user names (from members in the group) for assignedTo",
        taskName,
        taskDesc,
        dueDate,
        assignedTo
      );
      validateDueDate(res, new Date(dueDate));
      return validateSubtaskData(res, task, dueDate, assignedTo);
    })
    .then((task) => {
      const { taskName, taskDesc, dueDate, assignedTo } = req.body;
      User.find({ username: { $in: assignedTo } })
        .then((userArray) => userArray.map((user) => user.id))
        .then((assignedToIds) => {
          const newSubtask = new BaseTask({
            name: taskName,
            desc: taskDesc,
            dueDate,
            isMilestone: false,
            assignedTo: assignedToIds,
            classId: task.classId,
          });
          task.subtasks.push(newSubtask);
          // Set the parent task to false, as a new subtask that is incompleted has been added
          task.isCompleted = false;
          task.save();
          newSubtask.save();
        });
    })
    .then(() => res.json({ msg: "Successfully created task" }))
    .catch((err) => console.log(err));
};

export const deleteSubtask = (req, res) => {
  // Non-parent tasks have isMilestone always set to false
  // The parent task associated with this subtask will be updated accordingly
  BaseTask.findById(req.params.id)
    .then((subtask) => validateIsSubtask(res, subtask))
    .then((subtask) =>
      // Check that user can access parent of this subtask
      ParentTask.findOne({ subtasks: subtask.id })
        .then((parentTask) =>
          validateCanAccessTask(
            res,
            parentTask,
            req.user.id,
            "Cannot access this subtask"
          )
        )
        .then(() => subtask)
    )
    .then((subtask) => {
      subtask.remove();
      ParentTask.collection.updateMany(
        {},
        {
          $pull: {
            subtasks: Mongoose.Types.ObjectId(subtask.id),
          },
        }
      );
    })
    .then(() => res.json({ msg: "Successfully deleted task" }))
    .catch((err) => console.log(err));
};
