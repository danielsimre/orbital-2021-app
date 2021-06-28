import express from "express";

import * as taskController from "../controllers/taskController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route GET api/v1/tasks/
// @desc Gets all tasks, sorted by due date. Returns two arrays, one with completed tasks and the
//       other with uncompleted tasks
// @access Private
router.get("/", ensureAuthenticated, taskController.getAllInfo);

// @route PUT api/v1/tasks/:id
// @desc Updates the task
// @access Private
router.put("/:id", ensureAuthenticated, taskController.update);

// @route POST api/v1/tasks/:id/comments
// @desc Creates a comment under this task
// @access Private
router.post("/:id/comments", ensureAuthenticated, taskController.createComment);

export default router;
