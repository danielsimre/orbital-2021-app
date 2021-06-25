import express from "express";

import getAllAnnouncements from "../controllers/announcementController.js";
import ensureAuthenticated from "../config/auth.js";

const router = express.Router();

router.get("/", ensureAuthenticated, getAllAnnouncements);

export default router;
