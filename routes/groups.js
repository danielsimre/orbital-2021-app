import express from "express";

import * as groupController from "../controllers/groupController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route GET api/v1/groups/
// @desc Get all groups that the user is involved in (both as a student and as a mentor)
// @access Private
router.get("/", ensureAuthenticated, groupController.getAllInfo);

// @route GET api/v1/groups/:id
// @desc Get the information of the group (User must be a part of the group, either as a student or mentor)
// @access Private
router.get("/:id", ensureAuthenticated, groupController.getInfo);

// @route DELETE api/v1/groups/:id
// @desc Delete the specified group and remove it from its class
// @access Private
router.put("/:id", ensureAuthenticated, groupController.rename);

// @route DELETE api/v1/groups/:id
// @desc Delete the specified group and remove it from its class
// @access Private
router.delete("/:id", ensureAuthenticated, groupController.deleteGroup);

// @route POST api/v1/groups/:id/users
// @desc Add users/mentors to the group
// @access Private
router.post("/:id/users", ensureAuthenticated, groupController.addUsers);

// @route DELETE api/v1/groups/:id/users/:userId
// @desc Remove specified student from the group
// @access Private
router.delete(
  "/:id/users/:userId",
  ensureAuthenticated,
  groupController.removeUser
);

// @route DELETE api/v1/groups/:id/users
// @desc Leave a specified group
// @access Private
router.delete("/:id/users", ensureAuthenticated, groupController.leaveGroup);

export default router;
