import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";

import User from "../../models/User.js";
import ensureAuthenticated from "../../config/auth.js";

const router = express.Router();

const validateRegistration = (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  // Ensure all fields are filled in
  if (!username || !email || !password || !passwordConfirm) {
    res.status(400).json({ msg: "Please fill in all fields" });
    return;
  }

  // Ensure that user confirms password correctly
  if (password !== passwordConfirm) {
    res.status(400).json({ msg: "Password confirmation failed" });
    return;
  }

  // Enforces password length of >= 6
  if (password.length < 6) {
    res.status(400).json({ msg: "Password should be at least 6 characters" });
  }
};

// @route POST api/v1/users/register
// @desc Register new user
// @access Public
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  validateRegistration(req, res);
  // If header is already sent, that means there was a registration error
  if (res.headersSent) return;

  User.findOne({
    $or: [
      {
        email,
      },
      {
        username,
      },
    ],
  }).then((queriedUser) => {
    if (queriedUser && queriedUser.email === email) {
      return res.status(400).json({ msg: "Email is already registered" });
    }
    if (queriedUser && queriedUser.username === username) {
      return res.status(400).json({ msg: "Username is already in use" });
    }
    // Hash password with bcryptjs, then store in database
    return bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(password, salt, (err2, hash) => {
        if (err2) throw err2;
        const newUser = new User({
          username,
          email,
          password: hash,
        });

        // Send back user details for confirmation
        newUser
          .save()
          .then((savedUser) => {
            res.json({
              user: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email,
              },
            });
          })
          .catch((err3) => console.log(err3));
      })
    );
  });
});

// @route POST api/v1/users/login
// @desc Login with existing user
// @access Public
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user)
      res
        .status(400)
        .json({ msg: info.msg || "Please fill in your email/password" });
    else {
      req.logIn(user, (err2) => {
        if (err2) throw err2;
        console.log("Successful login:");
        console.log(req.user.email);
        res.json({ msg: "Successfully Authenticated" });
      });
    }
  })(req, res, next);
});

// @route POST api/v1/users/logout
// @desc Log out of the current session
// @access Private
router.post("/logout", ensureAuthenticated, (req, res) => {
  req.logOut();
  res.clearCookie("connect.sid");
  res.json({ msg: "You have successfully logged out" });
});

// @route GET api/v1/users/
// @desc Get the info of the logged in user
// @access Private
router.get("/", ensureAuthenticated, (req, res) => {
  // api/v1/users?projects returns an array of all projects the user is involved in
  if (req.query.projects === "") {
    User.findById(req.user.id)
      .populate({
        path: "projects",
        populate: {
          path: "projectId",
        },
      })
      .then((curUser) => res.json({ projects: curUser.projects }));
  } else {
    User.findById(req.user.id)
      .populate("projects")
      .then((curUser) => res.json(curUser));
  }
});

// @route GET api/v1/users/auth
// @desc Checks if the user is logged in
// @access Private
router.get("/auth", ensureAuthenticated, (req, res) => {
  res.json({ isAuthenticated: true });
});

export default router;
