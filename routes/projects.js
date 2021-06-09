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
// @desc Adds a user/users to the project (User emails are given the form of an array)
// @access Private
router.post("/info/:id/users", ensureAuthenticated, projectController.addUsers);

export default router;
