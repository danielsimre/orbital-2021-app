import ClassRole from "../models/ClassRole.js";
import Group from "../models/Group.js";
import { ParentTask } from "../models/BaseTask.js";
import User from "../models/User.js";

import {
  validateCanAccessGroup,
  validateFieldsPresent,
  validateValueInEnum,
  successfulFindOneQuery,
  successfulFindQuery,
} from "../utils/validation.js";
import { GroupRoles, ClassRoles } from "../utils/enums.js";

export const getInfo = (req, res) => {
  Group.findOne({
    $and: [
      { _id: req.params.id },
      {
        $or: [{ groupMembers: req.user.id }, { mentoredBy: req.user.id }],
      },
    ],
  })
    .populate({ path: "groupMembers", select: "username email" })
    .populate({ path: "mentoredBy", select: "username email" })
    .populate({
      path: "tasks",
      populate: {
        path: "comments",
      },
    })
    .then((curGroup) =>
      validateCanAccessGroup(
        res,
        curGroup,
        "Group does not exist or user is not authorized to access this group"
      )
    )
    .then((curGroup) => res.json(curGroup))
    .catch((err) => console.log(err));
};

export const getAllInfo = (req, res) => {
  Promise.all([
    Group.find({ groupMembers: req.user.id }, "name classId").populate({
      path: "classId",
      select: "name",
    }),
    Group.find({ mentoredBy: req.user.id }, "name classId").populate({
      path: "classId",
      select: "name",
    }),
  ])
    .then((groupArray) =>
      res.json({ memberOf: groupArray[0], mentorOf: groupArray[1] })
    )
    .catch((err) => console.log(err));
};

// Can add users as group members or mentors
export const addUsers = (req, res) => {
  Group.findOne({
    _id: req.params.id,
    mentoredBy: req.user.id,
  })
    .then((curGroup) =>
      validateCanAccessGroup(
        res,
        curGroup,
        "Group does not exist or user is not authorized to add users to group"
      )
    )
    .then(async (curGroup) => {
      const { userEmails, newUserRole } = req.body;

      validateFieldsPresent(
        res,
        "Please add an array of user email(s) for attribute userEmails, " +
          "and either GROUPMEMBER/GROUPLEADER or MENTOR for attribute newUserRole",
        userEmails,
        newUserRole
      );

      validateValueInEnum(
        res,
        "Please enter GROUPMEMBER/GROUPLEADER or MENTOR for attribute newUserRole",
        GroupRoles,
        newUserRole
      );

      // Remove duplicate emails
      const uniqueUserEmails = [...new Set(userEmails)];

      // These five arrays contain the user emails, split into five categories:
      // Successfully added users, emails that are not attached to a user,
      // users that are not in the class,
      // users that are already in the group (or other groups under this class, for group members)
      // and users that have a role mismatch (adding a mentor as a group member, or student as a mentor)
      const successArr = [];
      const doesNotExistArr = [];
      const notInClassArr = [];
      const alreadyHasGroupArr = [];
      const roleMismatchArr = [];

      await Promise.all(
        uniqueUserEmails.map(async (userEmail) => {
          // Check if user exists
          const curUser = await User.findOne({ email: userEmail });
          if (!successfulFindOneQuery(curUser)) {
            doesNotExistArr.push(userEmail);
            return;
          }
          // Check if user is in the class
          const classRole = await ClassRole.findOne({
            classId: curGroup.classId,
            userId: curUser.id,
          });
          if (!successfulFindOneQuery(classRole)) {
            notInClassArr.push(userEmail);
            return;
          }
          // If mentors are being added, check if mentor is already in charge of this group
          if (newUserRole === GroupRoles.MENTOR) {
            if (curGroup.mentoredBy.includes(curUser.id)) {
              alreadyHasGroupArr.push(userEmail);
              return;
            }

            // Check if there is a role mismatch (user is not a class mentor)
            if (classRole.role !== ClassRoles.MENTOR) {
              roleMismatchArr.push(userEmail);
              return;
            }
          } else {
            // Check if user already has a group for this class (need not be the current group)
            const userGroup = await Group.find({
              classId: curGroup.classId,
              groupMembers: curUser.id,
            });
            if (successfulFindQuery(userGroup)) {
              alreadyHasGroupArr.push(userEmail);
              return;
            }

            // Check if there is a role mismatch (user is not a student)
            if (classRole.role !== ClassRoles.STUDENT) {
              roleMismatchArr.push(userEmail);
              return;
            }
          }

          // Successfully added
          successArr.push(userEmail);
          if (newUserRole === GroupRoles.MENTOR) {
            curGroup.mentoredBy.push(curUser.id);
          } else {
            curGroup.groupMembers.push(curUser.id);
            // Add this new group member to all parent tasks in this group
            // (Parent tasks are assigned to all group members)
            await ParentTask.updateMany(
              { classId: curGroup.classId },
              { $push: { assignedTo: curUser.id } }
            );
          }
        })
      );
      res.json({
        doesNotExist: doesNotExistArr,
        notInClass: notInClassArr,
        alreadyHasGroup: alreadyHasGroupArr,
        roleMismatch: roleMismatchArr,
        successfullyAdded: successArr,
      });
      curGroup.save();
    })
    .catch((err) => console.log(err));
};
