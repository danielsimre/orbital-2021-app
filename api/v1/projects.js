import express from "express";

import User from "../../models/User.js";
import Project from "../../models/Project.js";
import ProjectRole from "../../models/ProjectRole.js";
import ensureAuthenticated from "../../config/auth.js";

const router = express.Router();

/**
 * Enum for user roles in a project.
 * @readonly
 * @enum {{name: string, hex: string}}
 */
const PROJECTROLES = Object.freeze({
  MENTOR: "MENTOR",
  STUDENT: "STUDENT",
});

// @route GET api/v1/projects/info/:id
// @desc Get the information of the project (User must be a part of the project)
// @access Private
router.get("/info/:id", ensureAuthenticated, (req, res) => {
  Project.findById({ _id: req.params.id })
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can view this project
    .then((curProject) => {
      // If the users array is empty, then the logged in user's id was not found in this project
      if (curProject == null) {
        res.status(401).json({ msg: "Project does not exist" });
        return Promise.reject("Project does not exist");
      }
      if (!curProject.users.length) {
        res.status(401).json({ msg: "Not authorized to view this project" });
        return Promise.reject("User unauthorized to view project");
      }
    })
    // Query the project, now with info of ALL users involved in the project
    .then(() => {
      return Project.findById({ _id: req.params.id }).populate({
        path: "users",
        populate: {
          path: "userId",
        },
      });
    })
    .then((curProject) => res.json(curProject))
    .catch((err) => console.log(err));
});

// @route POST api/v1/projects/new
// @desc Create a new project
// @access Private
router.post("/new", ensureAuthenticated, (req, res) => {
  const { name, desc, dueDate } = req.body;

  // Ensure all fields are filled in
  if (!name || !desc || !dueDate) {
    res.status(400).json({ msg: "Please fill in all fields" });
    return;
  }

  const newProject = new Project({
    name,
    desc,
    dueDate,
    created_by: req.user.id,
  });

  // Check if date is valid
  if (!(newProject.dueDate instanceof Date)) {
    res.status(400).json({ msg: "Please enter a valid date" });
    return;
  }

  newProject
    .save()
    .then((savedProject) => {
      // Creator of the project is automatically considered a 'mentor'
      const newProjectRole = new ProjectRole({
        userId: req.user.id,
        projectId: savedProject.id,
        role: PROJECTROLES.MENTOR,
      });

      newProjectRole
        .save()
        .then((savedProjectRole) => {
          res.json({
            user: {
              id: savedProject.id,
              name: savedProject.name,
              created_by: savedProject.created_by,
            },
            projectRole: {
              userId: savedProjectRole.userId,
              projectID: savedProjectRole.projectId,
              role: savedProjectRole.role,
            },
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// @route POST api/v1/projects/info/:id/users
// @desc Adds a user/users to the project (User emails are given the form of an array)
// CURRENTLY ONLY ADDS STUDENTS
// @access Private
router.post("/info/:id/users", ensureAuthenticated, (req, res) => {
  Project.findById({ _id: req.params.id })
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can add users to the project
    .then((curProject) => {
      // If the users array is empty, then the logged in user's id was not found in this project
      // OR if the users array is not empty (user is part of project), but the user role is not "MENTOR",
      // prevent the current user from adding other users
      if (curProject == null) {
        res.status(401).json({ msg: "Project does not exist" });
        return Promise.reject("Project does not exist");
      }
      if (
        !curProject.users.length ||
        curProject.users[0].role !== PROJECTROLES.MENTOR
      ) {
        res.status(401).json({ msg: "Not authorized to add users to project" });
        return Promise.reject("User unauthorized to add users to project");
      }
    })
    // Add user(s) to the project
    .then(async () => {
      const { userEmails } = req.body;
      if (userEmails == null) {
        res.status(401).json({
          msg: "Please add an array of user emails for attribute userEmails",
        });
        return Promise.reject(
          "Please add an array of user emails for attribute userEmails"
        );
      }
      // These three arrays contain the user emails, split into three categories:
      // Successfully added users, emails that are not attached to a user,
      // and users that are already in the project
      let successArr = [],
        doesNotExistArr = [],
        alreadyAddedArr = [];
      await Promise.all(
        userEmails.map(async (userEmail) => {
          // Note: FindOne returns null on an empty query, find returns an empty array
          const curUser = await User.findOne({ email: userEmail });
          if (curUser == null) {
            doesNotExistArr.push(userEmail);
            return;
          }
          const isUserInProject = await ProjectRole.findOne({
            projectId: req.params.id,
            userId: curUser.id,
          });
          if (isUserInProject != null) {
            alreadyAddedArr.push(userEmail);
            return;
          } else {
            successArr.push(userEmail);
            const newProjectRole = new ProjectRole({
              userId: curUser.id,
              projectId: req.params.id,
              role: PROJECTROLES.STUDENT,
            });
            newProjectRole.save();
          }
        })
      );
      res.json({
        doesNotExist: doesNotExistArr,
        alreadyAdded: alreadyAddedArr,
        successfullyAdded: successArr,
      });
    })
    .catch((err) => console.log(err));
});

export default router;
