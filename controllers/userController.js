import bcrypt from "bcryptjs";
import passport from "passport";

import User from "../models/User.js";
import { validateRegistration } from "../utils/validation.js";

export const register = (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({
    $or: [
      {
        email,
      },
      {
        username,
      },
    ],
  })
    .then((queriedUser) => {
      if (!validateRegistration(req, res, queriedUser)) {
        return Promise.reject(new Error("Registration failed"));
      }
      // Hash password with bcryptjs, then store in database
      return bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(password, salt, (hashErr, hash) => {
          if (hashErr) throw hashErr;
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
            .catch((saveErr) => console.log(saveErr));
        })
      );
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
        console.log("Successful login:");
        console.log(req.user.email);
        res.json({ msg: "Successfully Authenticated" });
      });
    }
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logOut();
  res.clearCookie("connect.sid");
  res.json({ msg: "You have successfully logged out" });
};

export const getInfo = (req, res) => {
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
};

export const isLoggedIn = (req, res) => {
  res.json({ isAuthenticated: true });
};
