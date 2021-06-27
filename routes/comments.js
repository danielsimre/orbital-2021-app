import express from "express";

import getAllInfo from "../controllers/commentController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route GET api/v1/comments/
// @desc Get all comments from tasks that the user is assigned to
// @access Private
router.get("/", ensureAuthenticated, getAllInfo);

export default router;
