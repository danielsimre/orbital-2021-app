import express from "express";

import * as projectController from "../controllers/projectController.js";
import ensureAuthenticated from "../config/auth.js";

const router = express.Router();

// @route GET api/v1/projects/info/:id
// @desc Get the information of the project (User must be a part of the project)
// @access Private
router.get("/info/:id", ensureAuthenticated, projectController.getInfo);

// @route POST api/v1/projects/new
// @desc Create a new project
// @access Private
router.post("/new", ensureAuthenticated, projectController.create);

// @route POST api/v1/projects/info/:id/users
// @desc Adds a user/users to the project (User emails are given in the form of an array)
//       User must be a mentor to add users
// @access Private
router.post("/info/:id/users", ensureAuthenticated, projectController.addUsers);

// @route POST api/v1/projects/info/:id/groups
// @desc Adds a group/groups to the project (Group names are given in the form of an array)
//       User must be a mentor to add groups, and the user will be added to the mentored_by array of
//       the groups they create
// @access Private
router.post(
  "/info/:id/groups",
  ensureAuthenticated,
  projectController.createGroups
);

// @route GET api/v1/projects/info/:id/groups
// @desc If the user is not a part of the project, do not return anything
//       If the user is a part of the project as a student, return their group (if they have one)
//       If the user is a part of the project as a mentor, return all groups they are mentoring
// @access Private
router.get(
  "/info/:id/groups",
  ensureAuthenticated,
  projectController.getGroups
);

export default router;
