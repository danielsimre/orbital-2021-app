import bcrypt from "bcryptjs";
import passport from "passport";

import User from "../models/User.js";
import {
  validateRegistration,
  validateUniqueUsername,
  validateFieldsPresent,
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
  let { username, firstName, lastName, email, password } = req.body;
  User.findOne({ $or: [{ email }, { username }] })
    .then((queriedUser) => validateRegistration(req, res, queriedUser))
    // Hash password with bcryptjs, then store in database
    .then(() => {
      username = username.trim();
      firstName = firstName.trim();
      lastName = lastName.trim();
      email = email.trim();
      password = password.trim();
      return bcrypt.genSalt(10);
    })
    .then((salt) => bcrypt.hash(password.trim(), salt))
    .then((hash) => {
      const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        password: hash,
      });
      // Send back user details for confirmation
      newUser.save();
      console.log(`Successfully registered: ${email}`);
      res.json({
        id: newUser.id,
        username,
        firstName,
        lastName,
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
  let { newUsername } = req.body;

  // Ensure all fields are filled in
  validateFieldsPresent(
    res,
    "Please enter a string for attribute newUsername",
    newUsername
  );
  newUsername = newUsername.trim();

  User.findOne({ username: newUsername })
    .then((queriedUser) => {
      validateUniqueUsername(req, res, queriedUser);
    })
    .then(() => User.updateOne({ _id: req.user.id }, { username: newUsername }))
    .then(() => {
      res.json({ msg: "Successfully updated your username" });
    })
    .catch((err) => console.log(err));
};

export const changePassword = (req, res) => {
  let { curPassword, newPassword, confirmNewPassword } = req.body;

  validateFieldsPresent(
    res,
    "There are missing fields. Ensure that all fields are filled in.",
    curPassword,
    newPassword,
    confirmNewPassword
  );

  curPassword = curPassword.trim();
  newPassword = newPassword.trim();
  confirmNewPassword = confirmNewPassword.trim();

  if (newPassword !== confirmNewPassword) {
    res.status(400).json({ msg: "Password confirmation failed" });
  } else {
    User.findById(req.user.id)
      .select("+password")
      .then((queriedUser) => {
        bcrypt
          .compare(curPassword, queriedUser.password)
          .then((result) => {
            if (!result) {
              res.status(400).json({ msg: "Wrong password given. Try again." });
              throw Error("Wrong password given");
            } else {
              bcrypt
                .genSalt(10)
                .then((salt) => bcrypt.hash(newPassword.trim(), salt))
                .then((hashedPass) => {
                  queriedUser.password = hashedPass;
                  queriedUser.save();
                });
            }
          })
          .then(() => {
            res.json({ msg: "Successfully updated your password" });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      })
      .catch((err) => console.log(err));
  }
};
