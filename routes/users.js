import express from "express";

import * as userController from "../controllers/userController.js";
import ensureAuthenticated from "../utils/config/auth.js";

const router = express.Router();

// @route POST api/v1/users/register
// @desc Register new user
// @access Public
router.post("/register", userController.register);

// @route POST api/v1/users/login
// @desc Login with existing user
// @access Public
router.post("/login", userController.login);

// @route POST api/v1/users/logout
// @desc Log out of the current session
// @access Private
router.post("/logout", ensureAuthenticated, userController.logout);

// @route GET api/v1/users/
// @desc Get the info of the logged in user
// @access Private
router.get("/", ensureAuthenticated, userController.getInfo);

// @route GET api/v1/users/auth
// @desc Checks if the user is logged in
// @access Private
router.get("/auth", ensureAuthenticated, userController.isLoggedIn);

// @route PUT api/v1/users/username
// @desc Change the username of the current user
// @access Private
router.put("/username", ensureAuthenticated, userController.changeUsername);

export default router;
