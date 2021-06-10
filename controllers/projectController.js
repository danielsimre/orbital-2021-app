import User from "../models/User.js";
import Project from "../models/Project.js";
import ProjectRole from "../models/ProjectRole.js";
import { ProjectRoles } from "../utils/enums.js";
import {
  validateGetProjectInfo,
  validateAddUsers,
} from "../utils/validation.js";

export const getInfo = (req, res) => {
  Project.findById({ _id: req.params.id })
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can view this project
    .then((curProject) => validateGetProjectInfo(curProject, res))
    // Query the project, now with info of ALL users involved in the project
    .then(() =>
      Project.findById({ _id: req.params.id }).populate({
        path: "users",
        populate: {
          path: "userId",
        },
      })
    )
    .then((curProject) => res.json(curProject))
    .catch((err) => console.log(err));
};

export const create = (req, res) => {
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
  // Check if dueDate is the proper date and that the due date is after the current date
  if (
    !(newProject.dueDate instanceof Date) ||
    newProject.dueDate <= new Date()
  ) {
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
        role: ProjectRoles.MENTOR,
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
};

// Currently only adds users
export const addUsers = (req, res) => {
  Project.findById({ _id: req.params.id })
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can add users to the project
    .then((curProject) => validateGetProjectInfo(curProject, res))
    .then((curProject) => validateAddUsers(curProject, res))
    // Add user(s) to the project
    .then(async () => {
      const { userEmails } = req.body;
      if (userEmails == null) {
        res.status(401).json({
          msg: "Please add an array of user emails for attribute userEmails",
        });
        return Promise.reject(
          new Error(
            "Please add an array of user emails for attribute userEmails"
          )
        );
      }
      // These three arrays contain the user emails, split into three categories:
      // Successfully added users, emails that are not attached to a user,
      // and users that are already in the project
      const successArr = [];
      const doesNotExistArr = [];
      const alreadyAddedArr = [];
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
          }
          successArr.push(userEmail);
          const newProjectRole = new ProjectRole({
            userId: curUser.id,
            projectId: req.params.id,
            role: ProjectRoles.STUDENT,
          });
          newProjectRole.save();
        })
      );
      res.json({
        doesNotExist: doesNotExistArr,
        alreadyAdded: alreadyAddedArr,
        successfullyAdded: successArr,
      });
      return Promise.resolve();
    })
    .catch((err) => console.log(err));
};
