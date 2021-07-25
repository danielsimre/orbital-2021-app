import bcrypt from "bcryptjs";
import passport from "passport";

import User from "../models/User.js";
import {
  validateRegistration,
  validateUniqueUsername,
} from "../utils/validation.js";

export const getInfo = (req, res) => {
  // api/v1/users?classes returns an array of all classes the user is involved in
  if (req.query.classes === "") {
    User.findById(req.user.id)
      .populate({
        path: "classes",
        populate: {
          path: "classId",
        },
      })
      .then((curUser) => {
        // Sort classes by their name in alphabetical order
        curUser.classes.sort((class1, class2) => {
          if (class1.classId.name < class2.classId.name) {
            return -1;
          }
          if (class1.classId.name > class2.classId.namee) {
            return 1;
          }
          return 0;
        });
        return curUser.classes;
      })
      .then((curClasses) => res.json({ classes: curClasses }));
  } else {
    User.findById(req.user.id)
      .populate("classes")
      .then((curUser) => res.json(curUser));
  }
};

export const register = (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ $or: [{ email }, { username }] })
    .then((queriedUser) => validateRegistration(req, res, queriedUser))
    // Hash password with bcryptjs, then store in database
    .then(() => bcrypt.genSalt(10))
    .then((salt) => bcrypt.hash(password, salt))
    .then((hash) => {
      const newUser = new User({
        username,
        email,
        password: hash,
      });
      // Send back user details for confirmation
      newUser.save();
      console.log(`Successfully registered: ${email}`);
      res.json({
        id: newUser.id,
        username,
        email,
      });
    })
    .catch((err) => console.log(err));
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user)
      res
        .status(400)
        .json({ msg: info.msg || "Please fill in your email/password" });
    else {
      req.logIn(user, (err2) => {
        if (err2) throw err2;
        console.log(`Successful login: ${req.user.email}`);
        res.json({ msg: "Successfully Authenticated" });
      });
    }
  })(req, res, next);
};

export const isLoggedIn = (req, res) => {
  res.json({ isAuthenticated: true });
};

export const logout = (req, res) => {
  req.logOut();
  res.clearCookie("connect.sid");
  res.json({ msg: "You have successfully logged out" });
};

export const changeUsername = (req, res) => {
  const { newUsername } = req.body;

  User.findOne({ username: newUsername })
    .then((queriedUser) => {
      validateUniqueUsername(req, res, queriedUser);
    })
    .then(() =>
      User.findOneAndUpdate({ _id: req.user.id }, { username: newUsername })
    )
    .then(() => {
      res.json({ msg: "Successfully updated your username" });
    })
    .catch((err) => console.log(err));
};
