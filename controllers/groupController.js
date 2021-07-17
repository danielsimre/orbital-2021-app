import ClassRole from "../models/ClassRole.js";
import Group from "../models/Group.js";
import { ParentTask } from "../models/BaseTask.js";
import User from "../models/User.js";

import {
  validateCanAccessGroup,
  validateFieldsPresent,
  successfulFindOneQuery,
  successfulFindQuery,
  validateGroupSize,
  validateClassIsIncomplete,
} from "../utils/validation.js";
import { ClassRoles } from "../utils/enums.js";

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

// Users will be automatically added as group members or mentors depending on their class role
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
    .then((curGroup) => {
      validateClassIsIncomplete(res, curGroup.classId);
      return curGroup;
    })
    .then(async (curGroup) => {
      const { usernames } = req.body;
      validateFieldsPresent(
        res,
        "Please add an array of usernames for attribute usernames",
        usernames
      );
      // Remove duplicate user names
      return validateGroupSize(res, [...new Set(usernames)], curGroup);
    })
    .then(async (curGroup) => {
      const uniqueUsernames = [...new Set(req.body.usernames)];
      // These five arrays contain the user names, split into five categories:
      // Successfully added users, user names that are not attached to a user,
      // users that are not in the class,
      // users that are already in the group,
      // and users that are already in another group under this class (students only)
      const successArr = [];
      const doesNotExistArr = [];
      const notInClassArr = [];
      const alreadyInGroupArr = [];
      const alreadyHasGroupArr = [];

      await Promise.all(
        uniqueUsernames.map(async (username) => {
          // Check if user exists
          const curUser = await User.findOne({ username });
          if (!successfulFindOneQuery(curUser)) {
            doesNotExistArr.push(username);
            return;
          }
          // Check if user is in the class
          const classRole = await ClassRole.findOne({
            classId: curGroup.classId,
            userId: curUser.id,
          });
          if (!successfulFindOneQuery(classRole)) {
            notInClassArr.push(username);
            return;
          }
          // If user is a mentor, check if they are already in charge of this group
          if (classRole.role === ClassRoles.MENTOR) {
            if (curGroup.mentoredBy.includes(curUser.id)) {
              alreadyInGroupArr.push(username);
              return;
            }
          } else {
            // Check if student is already in this group
            if (curGroup.groupMembers.includes(curUser.id)) {
              alreadyInGroupArr.push(username);
              return;
            }
            // Checks if student is already in another group
            const userGroup = await Group.find({
              classId: curGroup.classId,
              groupMembers: curUser.id,
            });
            if (successfulFindQuery(userGroup)) {
              alreadyHasGroupArr.push(username);
              return;
            }
          }

          // Successfully added
          successArr.push(username);
          if (classRole.role === ClassRoles.MENTOR) {
            curGroup.mentoredBy.push(curUser.id);
          } else {
            curGroup.groupMembers.push(curUser.id);
            // Add this new group member to all parent tasks in this group
            // (Parent tasks are assigned to all group members)
            await ParentTask.updateMany(
              {
                _id: { $in: curGroup.tasks },
                isMilestone: true,
              },
              { $push: { assignedTo: curUser.id } }
            );
          }
        })
      );
      res.json({
        doesNotExist: doesNotExistArr,
        notInClass: notInClassArr,
        alreadyInGroup: alreadyInGroupArr,
        alreadyHasGroup: alreadyHasGroupArr,
        successfullyAdded: successArr,
      });
      curGroup.save();
    })
    .catch((err) => console.log(err));
};
