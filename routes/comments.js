import express from "express";

import * as commentController from "../controllers/commentController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route GET api/v1/comments/
// @desc Get all comments from tasks that the user is assigned to
// @access Private
router.get("/", ensureAuthenticated, commentController.getAllInfo);

// @route GET api/v1/comments/:id/
// @desc Get the specified comment info
// @access Private
router.get("/:id", ensureAuthenticated, commentController.getComment);

// @route PUT api/v1/comments/:id/
// @desc Update the specified comment
// @access Private
router.put("/:id", ensureAuthenticated, commentController.updateComment);

// @route DELETE api/v1/comments/:id/
// @desc Delete the specified comment
// @access Private
router.delete("/:id", ensureAuthenticated, commentController.deleteComment);

export default router;
