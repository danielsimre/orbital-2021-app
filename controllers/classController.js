import User from "../models/User.js";
import Class from "../models/Class.js";
import ClassRole from "../models/ClassRole.js";
import Group from "../models/Group.js";
import { ClassRoles } from "../utils/enums.js";
import {
  validateGetClassInfo,
  validateAddUsersToClass,
  validateAddGroupsToClass,
  validateFieldsPresent,
  validateValueInEnum,
  successfulFindOneQuery,
} from "../utils/validation.js";

export const getInfo = (req, res) => {
  Class.findById(req.params.id)
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can view this class
    .then((curClass) => validateGetClassInfo(res, curClass))
    // Query the class, now with info of ALL users involved in the class
    .then(() =>
      Class.findById(req.params.id).populate({
        path: "users",
        populate: {
          path: "userId",
        },
      })
    )
    .then((curClass) => res.json(curClass))
    .catch((err) => console.log(err));
};

export const create = (req, res) => {
  const { name, desc } = req.body;

  // Ensure all fields are filled in
  validateFieldsPresent(
    res,
    "Please fill in the name and desc fields",
    name,
    desc
  );

  const newClass = new Class({
    name,
    desc,
    created_by: req.user.id,
  });

  newClass
    .save()
    .then((savedClass) => {
      // Creator of the class is automatically considered a 'mentor'
      const newClassRole = new ClassRole({
        userId: req.user.id,
        classId: savedClass.id,
        role: ClassRoles.MENTOR,
      });
      newClassRole.save();
      return {
        user: {
          id: savedClass.id,
          name: savedClass.name,
          created_by: savedClass.created_by,
        },
        classRole: {
          userId: newClassRole.userId,
          classId: newClassRole.classId,
          role: newClassRole.role,
        },
      };
    })
    .then((classRoleInfo) => {
      console.log(classRoleInfo);
      res.json(classRoleInfo);
    })
    .catch((err) => console.log(err));
};

// Can add users as group members or mentors
export const addUsers = (req, res) => {
  Class.findById(req.params.id)
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can add users to the Class
    .then((curClass) => validateGetClassInfo(res, curClass))
    .then((curClass) => validateAddUsersToClass(res, curClass))
    // Add user(s) to the class
    .then(async () => {
      const { userEmails, newUserRole } = req.body;
      validateFieldsPresent(
        res,
        "Please add an array of user email(s) for attribute userEmails, " +
          "and either STUDENT or MENTOR for attribute newUserRole",
        userEmails,
        newUserRole
      );

      validateValueInEnum(
        res,
        "Please enter STUDENT or MENTOR for attribute newUserRole",
        ClassRoles,
        newUserRole
      );

      // Remove duplicate emails
      const uniqueUserEmails = [...new Set(userEmails)];

      // These three arrays contain the user emails, split into three categories:
      // Successfully added users, emails that are not attached to a user,
      // and users that are already in the class
      const successArr = [];
      const doesNotExistArr = [];
      const alreadyAddedArr = [];
      await Promise.all(
        uniqueUserEmails.map(async (userEmail) => {
          // Check if user exists
          const curUser = await User.findOne({ email: userEmail });
          if (!successfulFindOneQuery(curUser)) {
            doesNotExistArr.push(userEmail);
            return;
          }
          // Check if user is already in class
          const classRole = await ClassRole.findOne({
            classId: req.params.id,
            userId: curUser.id,
          });
          if (successfulFindOneQuery(classRole)) {
            alreadyAddedArr.push(userEmail);
            return;
          }
          // Successfully added user
          successArr.push(userEmail);
          const newClassRole = new ClassRole({
            userId: curUser.id,
            classId: req.params.id,
            role: newUserRole,
          });
          newClassRole.save();
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
  Class.findById(req.params.id)
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can add groups to the class
    .then((curClass) => validateGetClassInfo(res, curClass))
    .then((curClass) => validateAddGroupsToClass(res, curClass))
    // Add user(s) to the class
    .then(async (curClass) => {
      const { groupNames } = req.body;

      validateFieldsPresent(
        res,
        "Please add an array of group name(s) for attribute groupNames",
        groupNames
      );
      // These three arrays contain the group names, split into three categories:
      // Successfully added groups, group names repeated in the current request,
      // and group names that are already associated with a group in this class
      const successArr = [];
      const dupeInRequestArr = [];
      const nameConflictArr = [];

      // Remove duplicated names, and add them to the error array
      const uniqueGroupNames = groupNames.filter((groupName, index, self) => {
        if (self.indexOf(groupName) !== index) {
          dupeInRequestArr.push(groupName);
          return false;
        }
        return true;
      });

      await Promise.all(
        uniqueGroupNames.map(async (groupName) => {
          const group = await Group.findOne({ name: groupName });
          if (successfulFindOneQuery(group)) {
            nameConflictArr.push(groupName);
            return;
          }

          successArr.push(groupName);
          const newGroup = new Group({
            name: groupName,
            classId: curClass.id,
            createdBy: req.user.id,
          });
          // Add the new group id to this Class
          curClass.groups.push(newGroup.id);
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
      curClass.save();
    })
    .catch((err) => console.log(err));
};

// If the user is not a part of the class, do not return anything
// If the user is a part of the class as a student, return their group (if they have one)
// If the user is a part of the class as a mentor, return all groups they are mentoring
export const getGroups = (req, res) => {
  Class.findById(req.params.id)
    .populate({
      path: "users",
      match: { userId: req.user.id },
      populate: {
        path: "userId",
      },
    })
    // Verify that the user can access the class
    .then((curClass) => validateGetClassInfo(res, curClass))
    // Return a object with attributes groups, which contains an array of all groups
    // and an attribute user_role, which describes the user's role in the class
    // Mentors can have multiple groups in the array, students have at most one
    .then((curClass) =>
      Group.find({
        $and: [
          { classId: curClass.id },
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
