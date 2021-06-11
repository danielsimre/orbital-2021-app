import User from "../models/User.js";
import Project from "../models/Project.js";
import ProjectRole from "../models/ProjectRole.js";
import Group from "../models/Group.js";
import { ProjectRoles } from "../utils/enums.js";
import {
  validateGetProjectInfo,
  validateAddUsersToProject,
  validateAddGroupsToProject,
  validateFieldsPresent,
  validateDueDate,
  successfulFindOneQuery,
} from "../utils/validation.js";

export const getInfo = (req, res) => {
  Project.findById(req.params.id)
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
      Project.findById(req.params.id).populate({
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

// Currently only adds students
export const addUsers = (req, res) => {
  Project.findById(req.params.id)
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can add users to the project
    .then((curProject) => validateGetProjectInfo(res, curProject))
    .then((curProject) => validateAddUsersToProject(res, curProject))
    // Add user(s) to the project
    .then(async () => {
      let { userEmails } = req.body;

      validateFieldsPresent(
        res,
        "Please add an array of user email(s) for attribute userEmails",
        userEmails
      );

      // Remove duplicate emails
      userEmails = [...new Set(userEmails)];

      // These three arrays contain the user emails, split into three categories:
      // Successfully added users, emails that are not attached to a user,
      // and users that are already in the project
      const successArr = [];
      const doesNotExistArr = [];
      const alreadyAddedArr = [];
      await Promise.all(
        userEmails.map(async (userEmail) => {
          // Check if user exists
          const curUser = await User.findOne({ email: userEmail });
          if (!successfulFindOneQuery(curUser)) {
            doesNotExistArr.push(userEmail);
            return;
          }
          // Check if user is already in project
          const userProjectRole = await ProjectRole.findOne({
            projectId: req.params.id,
            userId: curUser.id,
          });
          if (successfulFindOneQuery(userProjectRole)) {
            alreadyAddedArr.push(userEmail);
            return;
          }
          // Successfully added user
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

export const createGroups = (req, res) => {
  Project.findById(req.params.id)
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can add groups to the project
    .then((curProject) => validateGetProjectInfo(res, curProject))
    .then((curProject) => validateAddGroupsToProject(res, curProject))
    // Add user(s) to the project
    .then(async (curProject) => {
      let { groupNames } = req.body;

      validateFieldsPresent(
        res,
        "Please add an array of group name(s) for attribute groupNames",
        groupNames
      );
      // These three arrays contain the group names, split into three categories:
      // Successfully added groups, group names repeated in the current request,
      // and group names that are already associated with a group in this project
      const successArr = [];
      const dupeInRequestArr = [];
      const nameConflictArr = [];

      // Remove duplicated names, and add them to the error array
      groupNames = groupNames.filter((groupName, index, self) => {
        if (self.indexOf(groupName) !== index) {
          dupeInRequestArr.push(groupName);
          return false;
        }
        return true;
      });

      await Promise.all(
        groupNames.map(async (groupName) => {
          const group = await Group.findOne({ name: groupName });
          if (successfulFindOneQuery(group)) {
            nameConflictArr.push(groupName);
            return;
          }

          successArr.push(groupName);
          const newGroup = new Group({
            name: groupName,
            projectId: curProject.id,
            createdBy: req.user.id,
          });
          // Add the new group id to this project
          curProject.groups.push(newGroup.id);
          // Add whoever created this group as a mentor for the group
          newGroup.mentoredBy.push(req.user.id);
          newGroup.save();
        })
      );
      res.json({
        dupeInRequest: [...new Set(dupeInRequestArr)],
        nameConflict: nameConflictArr,
        successfullyAdded: successArr,
      });
      curProject.save();
    })
    .catch((err) => console.log(err));
};

// If the user is not a part of the project, do not return anything
// If the user is a part of the project as a student, return their group (if they have one)
// If the user is a part of the project as a mentor, return all groups they are mentoring
export const getGroups = (req, res) => {
  Project.findById(req.params.id)
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can access the project
    .then((curProject) => validateGetProjectInfo(res, curProject))
    // Return a object with attributes groups, which contains an array of all groups
    // and an attribute user_role, which describes the user's role in the project
    // Mentors can have multiple groups in the array, students have at most one
    .then((curProject) =>
      Group.find({
        $and: [
          { projectId: curProject.id },
          {
            $or: [{ groupMembers: req.user.id }, { mentoredBy: req.user.id }],
          },
        ],
      })
    )
    .then((groupsObj) => {
      res.json(groupsObj);
    })
    .catch((err) => console.log(err));
};
