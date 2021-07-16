import Mongoose from "mongoose";
import { Announcement } from "../models/BaseText.js";
import { BaseTask, ParentTask } from "../models/BaseTask.js";
import Class from "../models/Class.js";
import ClassRole from "../models/ClassRole.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

import {
  validateCanAccessClass,
  validateIsMentor,
  validateFieldsPresent,
  validateValueInEnum,
  validateSameTaskFramework,
  validateDueDate,
  successfulFindOneQuery,
  validateCanRemoveUser,
  generateInviteCode,
  validateInviteCode,
} from "../utils/validation.js";
import { ClassRoles } from "../utils/enums.js";

export const getInfo = (req, res) => {
  validateCanAccessClass(req, res)
    // Query the class, now with info of ALL users involved in the class
    .then((classRoleObj) =>
      Class.findById(req.params.id)
        .populate({
          path: "users",
          populate: {
            path: "userId",
          },
        })
        .then((curClass) => {
          const classObj = curClass.toObject();
          classObj.attributes.role = classRoleObj.role;
          return classObj;
        })
    )
    .then((curClass) => res.json(curClass))
    .catch((err) => console.log(err));
};

// If the user is not a part of the class, return an error
// If the user is a part of the class as a student, return their group (if they have one)
// If the user is a part of the class as a mentor, return all groups they are mentoring
// Attributes of each group includes which mentors and students can be added to
// the group from the class
export const getGroups = (req, res) => {
  validateCanAccessClass(req, res)
    // Return a object with attributes groups, which contains an array of all groups
    // Mentors can have multiple groups in the array, students have at most one
    .then(() =>
      Group.find({
        $and: [
          { classId: req.params.id },
          {
            $or: [{ groupMembers: req.user.id }, { mentoredBy: req.user.id }],
          },
        ],
      })
    )
    .then((curGroups) => {
      const invalidStudents = [];
      // Find all students that are already in a group
      curGroups.forEach((group) => {
        const groupObj = group.toObject();
        invalidStudents.push(...groupObj.attributes.groupMembers);
      });
      return Promise.all(
        curGroups.map((group) => {
          const groupObj = group.toObject();
          return Promise.all([
            ClassRole.find({
              userId: { $nin: invalidStudents },
              classId: groupObj.attributes.classId,
              role: ClassRoles.STUDENT,
            }).populate({
              path: "userId",
              select: "username",
            }),
            ClassRole.find({
              userId: { $nin: groupObj.attributes.mentoredBy },
              classId: groupObj.attributes.classId,
              role: ClassRoles.MENTOR,
            }).populate({
              path: "userId",
              select: "username",
            }),
          ]).then(([addableStudents, addableMentors]) => {
            groupObj.attributes.addableStudents = addableStudents.map(
              (student) => student.userId.username
            );
            groupObj.attributes.addableMentors = addableMentors.map(
              (mentor) => mentor.userId.username
            );
            return groupObj;
          });
        })
      );
    })
    .then((groupsObj) => res.json(groupsObj))
    .catch((err) => console.log(err));
};

// Get announcements sorted by order of when the announcement was made, starting from the latest one
export const getAnnouncements = (req, res) => {
  validateCanAccessClass(req, res)
    .then(() =>
      Announcement.find({
        classId: req.params.id,
      })
    )
    .then((announcements) => {
      res.json(announcements);
    })
    .catch((err) => console.log(err));
};

export const create = async (req, res) => {
  const { name, desc, groupSize } = req.body;

  // Ensure all fields are filled in
  validateFieldsPresent(
    res,
    "Please fill in the name, desc and groupSize fields",
    name,
    desc,
    groupSize
  );

  const newClass = new Class({
    name,
    desc,
    created_by: req.user.id,
    studentInviteCode: await generateInviteCode(),
    mentorInviteCode: await generateInviteCode(),
    groupSize,
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
      res.json(classRoleInfo);
    })
    .catch((err) => console.log(err));
};

// Can add users as group members or mentors
export const addUsers = (req, res) => {
  validateCanAccessClass(req, res)
    .then((classRoleObj) =>
      validateIsMentor(
        res,
        classRoleObj,
        "Not authorized to add users to class"
      )
    )
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
          const classRoleObj = await ClassRole.findOne({
            classId: req.params.id,
            userId: curUser.id,
          });
          if (successfulFindOneQuery(classRoleObj)) {
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
  validateCanAccessClass(req, res)
    .then((classRoleObj) =>
      validateIsMentor(
        res,
        classRoleObj,
        "Not authorized to add groups to class"
      )
    )
    // Add groups to the class
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
      // Also filter out empty strings
      const uniqueGroupNames = groupNames.filter((groupName, index, self) => {
        if (self.indexOf(groupName) !== index) {
          dupeInRequestArr.push(groupName);
          return false;
        }
        if (groupName === "") {
          return false;
        }
        return true;
      });

      await Promise.all(
        uniqueGroupNames.map(async (groupName) => {
          const group = await Group.findOne({
            name: groupName,
            classId: req.params.id,
          });

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
          // Add the propagated tasks from this class to the new group (if present)
          curClass.taskFramework.forEach((taskObject) => {
            const newTask = new ParentTask({
              name: taskObject.name,
              desc: taskObject.desc,
              dueDate: taskObject.dueDate,
              isMilestone: taskObject.isMilestone,
              assignedTo: newGroup.groupMembers,
              classId: curClass.id,
            });
            newTask.save();
            newGroup.tasks.push(newTask.id);
          });
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

export const createTasks = (req, res) => {
  validateCanAccessClass(req, res)
    .then((classRoleObj) =>
      validateIsMentor(
        res,
        classRoleObj,
        "Not authorized to add tasks to class"
      )
    )
    // Add tasks to the class
    .then(async (curClass) => {
      // taskArray is an array of objects with attributes name, desc, dueDate and isMilestone
      const { taskArray } = req.body;

      // Check if the task array is present
      validateFieldsPresent(
        res,
        "Please add an array of tasks for attribute taskArray",
        taskArray
      );

      // Check if all attributes for each task are present/valid
      taskArray.forEach((taskObject) => {
        validateFieldsPresent(
          res,
          "Task is missing one of the following attributes: name, desc, dueDate and isMilestone",
          taskObject.name,
          taskObject.desc,
          taskObject.dueDate,
          taskObject.isMilestone
        );
        validateDueDate(res, new Date(taskObject.dueDate));
      });

      // Sort the input array by dueDate (earliest due date is first)
      taskArray.sort((task1, task2) => {
        if (task1.dueDate < task2.dueDate) {
          return -1;
        }
        if (task1.dueDate > task2.dueDate) {
          return 1;
        }
        return 0;
      });

      // Compare new task framework with the current one. If they are the same, throw an error
      validateSameTaskFramework(res, taskArray, curClass.taskFramework);

      const groups = await Group.find({ classId: req.params.id });

      // Clear the old tasks from all groups and the database
      await BaseTask.deleteMany({ classId: req.params.id });
      groups.map((group) => {
        const newGroup = group;
        newGroup.tasks = [];
        return newGroup;
      });

      // Override the old task framework in the class
      curClass.taskFramework = taskArray;
      curClass.save();

      await Promise.all(
        taskArray.map(async (taskObject) => {
          groups.forEach((group) => {
            const newTask = new ParentTask({
              name: taskObject.name,
              desc: taskObject.desc,
              dueDate: taskObject.dueDate,
              isMilestone: taskObject.isMilestone,
              assignedTo: group.groupMembers,
              classId: curClass.id,
            });
            newTask.save();
            group.tasks.push(newTask.id);
          });
        })
      );
      await groups.forEach((group) => group.save());
    })
    .then(() =>
      res.json({
        msg: "Successfully created tasks",
      })
    )
    .catch((err) => console.log(err));
};

// If the user is not a part of the class, return an error
// If the user is a part of the class as a mentor, nothing will be returned (mentors do not have tasks)
// If the user is a part of the class as a student, return all tasks from this class that are
// assigned to this user
export const getTasks = (req, res) => {
  validateCanAccessClass(req, res)
    .then(() =>
      ParentTask.find({
        classId: req.params.id,
        assignedTo: req.user.id,
      })
    )
    .then((tasksObj) => res.json(tasksObj))
    .catch((err) => console.log(err));
};

export const createAnnouncement = (req, res) => {
  validateCanAccessClass(req, res)
    .then((classRoleObj) =>
      validateIsMentor(
        res,
        classRoleObj,
        "Not authorized to add announcements to class"
      )
    )
    // Add announcement to the class
    .then(() => {
      const { title, content } = req.body;

      validateFieldsPresent(
        res,
        "Please add a non-empty string for attributes title and content",
        title,
        content
      );

      const newAnnouncement = new Announcement({
        createdBy: req.user.id,
        title,
        content,
        classId: req.params.id,
      });
      newAnnouncement.save();
    })
    .then(() => res.json({ msg: "Successfully created announcement" }))
    .catch((err) => console.log(err));
};

export const removeUser = (req, res) => {
  validateCanAccessClass(req, res)
    .then((classRoleObj) => validateCanRemoveUser(req, res, classRoleObj))
    .then((classRole) => {
      Group.findOne({
        classId: req.params.id,
        $or: [
          { groupMembers: req.params.userId },
          { mentoredBy: req.params.userId },
        ],
      }).then((group) => {
        if (classRole.role === ClassRoles.MENTOR) {
          group.mentoredBy = group.mentoredBy.filter(
            (user) =>
              !Mongoose.Types.ObjectId(user.id).equals(
                Mongoose.Types.ObjectId(req.params.userId)
              )
          );
        } else {
          group.groupMembers = group.groupMembers.filter(
            (user) =>
              !Mongoose.Types.ObjectId(user.id).equals(
                Mongoose.Types.ObjectId(req.params.userId)
              )
          );
        }
        group.save();
      });
      classRole.remove();
    })
    .then(() => res.json({ msg: "Successfully removed user from class" }));
};

// ?studentInviteCode and ?mentorInviteCode generates new invite codes for the class
// Also allows updating of group size for all groups
export const updateInfo = (req, res) => {
  if (req.query.studentInviteCode === "") {
    validateCanAccessClass(req, res)
      .then(async (curClass) => {
        curClass.studentInviteCode = await generateInviteCode();
        return curClass;
      })
      .then((curClass) => {
        curClass.save();
        res.json({ msg: "Successfully generated new student invite code" });
      })
      .catch((err) => console.log(err));
  } else if (req.query.mentorInviteCode === "") {
    validateCanAccessClass(req, res)
      .then(async (curClass) => {
        curClass.mentorInviteCode = await generateInviteCode();
        return curClass;
      })
      .then((curClass) => {
        curClass.save();
        res.json({ msg: "Successfully generated new mentor invite code" });
      })
      .catch((err) => console.log(err));
  } else {
    validateCanAccessClass(req, res)
      .then((curClass) => {
        let { groupSize } = req.body;
        // If groupSize is not an integer, set it to null so that an error is
        // thrown in validateFieldsPresent
        groupSize = Number.isInteger(groupSize) ? groupSize : null;
        validateFieldsPresent(
          res,
          "Please add an integer for attribute groupSize",
          groupSize
        );
        curClass.groupSize = groupSize;
        // Reset group members for all groups
        return Group.find({ classId: curClass.id }).then((groups) => {
          Promise.all(
            groups.map((group) => {
              group.groupMembers = [];
              group.save();
              return group;
            })
          );
          curClass.save();
          return groupSize;
        });
      })
      .then((groupSize) => {
        res.json({ msg: `Successfully updated group size to ${groupSize}` });
      })
      .catch((err) => console.log(err));
  }
};

export const joinClass = (req, res) => {
  const { inviteCode } = req.body;
  validateFieldsPresent(
    res,
    "Please add an invite code for attribute inviteCode",
    inviteCode
  );
  Promise.all([
    Class.findOne({ studentInviteCode: inviteCode }),
    Class.findOne({ mentorInviteCode: inviteCode }),
  ])
    // Ensure that the invite code is valid
    // and that the user is not already enrolled in the class
    .then(([studentClass, mentorClass]) =>
      validateInviteCode(req, res, studentClass, mentorClass)
    )
    .then((newClassRole) => {
      newClassRole.save();
      res.json({ msg: "Successfully joined class" });
    })
    .catch((err) => console.log(err));
};
