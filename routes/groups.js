import express from "express";

import * as groupController from "../controllers/groupController.js";
import ensureAuthenticated from "../config/auth.js";

const router = express.Router();

// @route GET api/v1/groups/:id
// @desc Get the information of the group (User must be a part of the group, either as a student or mentor)
// @access Private
router.get("/:id", ensureAuthenticated, groupController.getInfo);

// @route POST api/v1/groups/:id
// @desc Add users/mentors to the group (?mentor to add mentors, no params for students)
//       User must be a mentor of the group
// @access Private
router.post("/:id", ensureAuthenticated, groupController.addUsers);

export default router;
