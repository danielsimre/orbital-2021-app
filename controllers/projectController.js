import User from "../models/User.js";
import Project from "../models/Project.js";
import ProjectRole from "../models/ProjectRole.js";
import { ProjectRoles } from "../utils/enums.js";
import {
  validateGetProjectInfo,
  validateAddUsers,
  validateFieldsPresent,
  validateDueDate,
  successfulFindOneQuery,
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
    .then((curProject) => validateGetProjectInfo(res, curProject))
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
  validateFieldsPresent(
    res,
    "Please fill in the name, desc and dueDate fields",
    name,
    desc,
    dueDate
  );

  const newProject = new Project({
    name,
    desc,
    dueDate,
    created_by: req.user.id,
  });
  // Check if dueDate is the proper date and that the due date is after the current date
  validateDueDate(res, newProject.dueDate);

  newProject
    .save()
    .then((savedProject) => {
      // Creator of the project is automatically considered a 'mentor'
      const newProjectRole = new ProjectRole({
        userId: req.user.id,
        projectId: savedProject.id,
        role: ProjectRoles.MENTOR,
      });
      newProjectRole.save();
      return {
        user: {
          id: savedProject.id,
          name: savedProject.name,
          created_by: savedProject.created_by,
        },
        projectRole: {
          userId: newProjectRole.userId,
          projectID: newProjectRole.projectId,
          role: newProjectRole.role,
        },
      };
    })
    .then((projectRoleInfo) => {
      console.log(projectRoleInfo);
      res.json(projectRoleInfo);
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
    .then((curProject) => validateGetProjectInfo(res, curProject))
    .then((curProject) => validateAddUsers(res, curProject))
    // Add user(s) to the project
    .then(async () => {
      const { userEmails } = req.body;
      validateFieldsPresent(
        res,
        "Please add an array of user email(s) for attribute userEmails",
        userEmails
      );

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
          if (!successfulFindOneQuery(curUser)) {
            doesNotExistArr.push(userEmail);
            return;
          }
          const userProjectRole = await ProjectRole.findOne({
            projectId: req.params.id,
            userId: curUser.id,
          });
          if (successfulFindOneQuery(userProjectRole)) {
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
    })
    .catch((err) => console.log(err));
};
