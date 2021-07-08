import express from "express";

import * as taskController from "../controllers/taskController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route GET api/v1/tasks/
// @desc Gets all tasks, sorted by due date. Returns two arrays, one with completed tasks and the
//       other with uncompleted tasks
// @access Private
router.get("/", ensureAuthenticated, taskController.getAllInfo);

// @route POST api/v1/tasks/:id
// @desc Adds a subtask under this task
// @access Private
router.post("/:id", ensureAuthenticated, taskController.createSubtask);

// @route PUT api/v1/tasks/:id
// @desc Updates the task
// @access Private
router.put("/:id", ensureAuthenticated, taskController.update);

// @route DELETE api/v1/tasks/:id
// @desc Deletes this task (only works for subtasks)
// @access Private
router.delete("/:id", ensureAuthenticated, taskController.deleteSubtask);

// @route POST api/v1/tasks/:id/comments
// @desc Creates a comment under this task
// @access Private
router.post("/:id/comments", ensureAuthenticated, taskController.createComment);

// @route GET api/v1/tasks/:id/comments
// @desc Get all comments under this task
// @access Private
router.get("/:id/comments", ensureAuthenticated, taskController.getComments);

export default router;
