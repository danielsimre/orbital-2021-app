import express from "express";

import * as classController from "../controllers/classController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route POST api/v1/classes/
// @desc Create a new class
// @access Private
router.post("/", ensureAuthenticated, classController.create);

// @route GET api/v1/classes/:id
// @desc Get the information of the class (User must be a part of the class)
//       Also gets the role of the user for this class
// @access Private
router.get("/:id", ensureAuthenticated, classController.getInfo);

// @route POST api/v1/classes/:id/users
// @desc Adds a user/users to the class (User emails are given in the form of an array)
//       User must be a mentor to add users
// @access Private
router.post("/:id/users", ensureAuthenticated, classController.addUsers);

// @route GET api/v1/classes/:id/groups
// @desc If the user is not a part of the class, do not return anything
//       If the user is a part of the class as a student, return their group (if they have one)
//       If the user is a part of the class as a mentor, return all groups they are mentoring
// @access Private
router.get("/:id/groups", ensureAuthenticated, classController.getGroups);

// @route POST api/v1/classes/:id/groups
// @desc Adds a group/groups to the class (Group names are given in the form of an array)
//       User must be a mentor to add groups, and the user will be added to the mentored_by array of
//       the groups they create
// @access Private
router.post("/:id/groups", ensureAuthenticated, classController.createGroups);

// @route GET api/v1/classes/:id/tasks
// @desc Get all tasks from this class that are assigned to this user (Only for students)
// @access Private
router.get("/:id/tasks", ensureAuthenticated, classController.getTasks);

// @route POST api/v1/classes/:id/tasks
// @desc Propagate tasks to all groups in this class (Only for mentors)
// @access Private
router.post("/:id/tasks", ensureAuthenticated, classController.createTasks);

// @route GET api/v1/classes/:id/announcements
// @desc Get all announcements made to the class
// @access Private
router.get(
  "/:id/announcements",
  ensureAuthenticated,
  classController.getAnnouncements
);

// @route POST api/v1/classes/:id/announcements
// @desc Makes an announcement in this class
// @access Private
router.post(
  "/:id/announcements",
  ensureAuthenticated,
  classController.createAnnouncement
);

export default router;
