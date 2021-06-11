import express from "express";

import * as taskController from "../controllers/taskController.js";
import ensureAuthenticated from "../config/auth.js";

const router = express.Router();

// @route POST api/v1/tasks/:group
// @desc Add a task to a group
// @access Private
router.post("/:group", ensureAuthenticated, taskController.addTask);

// @route GET api/v1/tasks/:group
// @desc Get the info of all tasks in a group
// @access Private
router.get("/:group", ensureAuthenticated, taskController.getGroupTaskInfo);

// @route GET api/v1/tasks/
// @desc Get the info of all tasks assigned to user
// @access Private
router.get("/", ensureAuthenticated, taskController.getUserTasks);

// @route GET api/v1/tasks/info/:id
// @desc Get info of specified task
// @access Private
router.get("/info/:id", ensureAuthenticated, taskController.getTaskInfo);

export default router;
