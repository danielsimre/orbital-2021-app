import express from "express";

import getAllInfo from "../controllers/announcementController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route GET api/v1/announcements/
// @desc Get all announcements from classes that the user is in
// @access Private
router.get("/", ensureAuthenticated, getAllInfo);

export default router;
