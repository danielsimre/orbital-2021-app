import ClassRole from "../models/ClassRole.js";
import Class from "../models/Class.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import { ClassRoles } from "./enums.js";

// Internal function to send json message + throw error for failed validation
const sendJsonErrMessage = (res, status, msg) => {
  res.status(status).json({ msg });
  throw new Error(msg);
};

// The following two functions return truthy values if the query was successful, falsy values otherwise
export const successfulFindQuery = (queriedObjects) => queriedObjects.length;
export const successfulFindOneQuery = (queriedObject) => queriedObject;

export const validateFieldsPresent = (res, msg, ...fields) => {
  if (!fields.every((field) => field !== undefined && field !== "")) {
    sendJsonErrMessage(res, 400, msg);
  }
};

export const validateRegistration = (req, res, queriedUser) => {
  const { username, email, password, passwordConfirm } = req.body;

  validateFieldsPresent(
    res,
    "Please fill in the fields username, email, password, passwordConfirm",
    username,
    email,
    password,
    passwordConfirm
  );

  // Ensure that user confirms password correctly
  if (password !== passwordConfirm) {
    sendJsonErrMessage(res, 400, "Password confirmation failed");
  }

  // Enforces password length of >= 6
  if (password.length < 6) {
    sendJsonErrMessage(res, 400, "Password should be at least 6 characters");
  }

  if (queriedUser && queriedUser.email === email) {
    sendJsonErrMessage(res, 409, "Email is already registered");
  }

  if (queriedUser && queriedUser.username === username) {
    sendJsonErrMessage(res, 409, "Username is already in use");
  }
};

export const validateUniqueUsername = (req, res, queriedUser) => {
  const { newUsername } = req.body;

  validateFieldsPresent(res, "Please enter a new username", newUsername);

  if (queriedUser && queriedUser.username === newUsername) {
    sendJsonErrMessage(res, 409, "Username is already in use");
  }
};

// Verify that the user can access the current class
// and returns that class if so
export const validateCanAccessClass = (req, res) =>
  ClassRole.findOne({ classId: req.params.id, userId: req.user.id })
    .populate({ path: "classId" })
    .then((classRoleObj) => {
      if (!successfulFindOneQuery(classRoleObj)) {
        sendJsonErrMessage(res, 404, "Failed to get class data");
      }
      classRoleObj.classId.role = classRoleObj.role;
      return classRoleObj.classId;
    });

export const validateClassIsIncomplete = (res, classId, ret) => {
  Class.findById(classId).then((classObj) => {
    if (classObj.isCompleted) {
      sendJsonErrMessage(
        res,
        403,
        "Class data cannot be modified as it has been marked as completed"
      );
    }
  });
  return ret;
};

export const validateCanAccessGroup = (res, curGroup, msg) => {
  if (!successfulFindOneQuery(curGroup)) {
    sendJsonErrMessage(res, 400, msg);
  }
  return curGroup;
};

// Check if the user can access the group the task belongs to (user must be a member or mentor of the group)
// curTask must be a parent task for this function to work (validate will fail on subtasks)
export const validateCanAccessTask = (res, curTask, userId, msg) => {
  if (curTask === null) {
    return sendJsonErrMessage(res, 400, "Task object is null");
  }
  return Group.find({
    $and: [
      { tasks: curTask.id },
      {
        $or: [{ groupMembers: userId }, { mentoredBy: userId }],
      },
    ],
  }).then((groupObj) => {
    if (!successfulFindQuery(groupObj)) {
      sendJsonErrMessage(res, 400, msg);
    }
    return curTask;
  });
};

// Only mentors can add groups/tasks/announcements to a class
export const validateIsMentor = (res, curClass, msg) => {
  if (curClass.role !== ClassRoles.MENTOR) {
    sendJsonErrMessage(res, 403, msg);
  }
  return curClass;
};

export const validateDueDate = (res, dueDate) => {
  if (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime())) {
    sendJsonErrMessage(res, 400, "Please enter a valid date");
  }
};

export const validateValueInEnum = (res, msg, enumType, value) => {
  if (!Object.values(enumType).includes(value)) {
    sendJsonErrMessage(res, 400, msg);
  }
};

export const validateURLs = (res, submissionLinks) => {
  submissionLinks.forEach((link) => {
    try {
      const url = new URL(link);
    } catch (err) {
      sendJsonErrMessage(res, 400, "Invalid submission link(s)");
    }
  });
};

export const validateSameTaskFramework = (
  res,
  newTaskFramework,
  oldTaskFramework
) => {
  if (newTaskFramework.length === oldTaskFramework.length) {
    for (let i = 0; i < newTaskFramework.length; i += 1) {
      const newTask = newTaskFramework[i];
      const oldTask = oldTaskFramework[i];
      // If there is at least 1 difference, the framework is treated as different
      if (
        newTask.name !== oldTask.name ||
        newTask.desc !== oldTask.desc ||
        new Date(newTask.dueDate).getTime() !== oldTask.dueDate.getTime() ||
        newTask.isMilestone !== oldTask.isMilestone
      ) {
        return;
      }
    }
    sendJsonErrMessage(
      res,
      400,
      "New task framework is identical to old framework"
    );
  }
};

export const validateAuthorOfComment = (res, curComment, userId, msg) => {
  if (!successfulFindOneQuery(curComment)) {
    sendJsonErrMessage(res, 404, "Failed to find comment");
  }
  if (!curComment.createdBy.equals(userId)) {
    sendJsonErrMessage(res, 400, msg);
  }
  return curComment;
};

export const validateIsSubtask = (res, task) => {
  // If task with this id cannot be found, or this task is a milestone (parent task)
  if (!successfulFindOneQuery(task) || task.isMilestone) {
    sendJsonErrMessage(res, 404, "Subtask with this id does not exist");
  }
  return task;
};

export const validateSubtaskData = (res, task, dueDate, assignedTo) => {
  // Check that the due date of the subtask is not after the due date of the parent task
  if (new Date(dueDate) > task.dueDate) {
    return sendJsonErrMessage(
      res,
      400,
      "Due date of the subtask cannot be after the due date of the parent task"
    );
  }
  // Check that for all the usernames in the assignedTo array, they are group members in the
  // group that this task belongs to
  return User.find({ username: { $in: assignedTo } })
    .then((userArray) => {
      // If lengths differ, then some users either do not exist or are not a part of this group
      if (userArray.length !== assignedTo.length) {
        sendJsonErrMessage(res, 400, "Some users in assignedTo are invalid");
      }
      return userArray.map((user) => user.id);
    })
    .then((userIdArray) => {
      if (userIdArray.length === 0) {
        return Group.findOne({ tasks: task.id });
      }
      return Group.findOne({
        tasks: task.id,
        groupMembers: { $all: userIdArray },
      });
    })
    .then((group) => {
      if (!successfulFindOneQuery(group)) {
        sendJsonErrMessage(
          res,
          400,
          "Some users in assignedTo are not group members of this group"
        );
      }
      return task;
    });
};

export const validateCompleteParentTask = (res, task) => {
  if (!task.subtasks.every((subtask) => subtask.isCompleted)) {
    sendJsonErrMessage(
      res,
      400,
      "Must mark subtasks as completed before marking parent task as completed"
    );
  }
};

export const validateCanRemoveUser = (req, res, classRoleObj) => {
  // Non-mentors cannot remove users
  if (classRoleObj.role !== ClassRoles.MENTOR) {
    sendJsonErrMessage(res, 403, "Not authorized to remove users");
  }
  // User cannot remove themselves
  if (req.user.id === req.params.userId) {
    sendJsonErrMessage(res, 403, "Cannot remove yourself from class");
  }

  // User is a mentor: check if user to be removed exists
  return ClassRole.findOne({
    classId: req.params.id,
    userId: req.params.userId,
  })
    .populate({ path: "classId" })
    .then((classRole) => {
      if (!successfulFindOneQuery(classRole)) {
        sendJsonErrMessage(res, 400, "That user does not exist in the class");
      }
      if (classRole.classId.created_by.equals(req.user.id)) {
        // User making the request is the creator of the class, allow deletion always
        return classRole;
      }
      if (classRole.role === ClassRoles.MENTOR) {
        // Current user is not creator but wants to remove a mentor
        sendJsonErrMessage(res, 403, "Cannot remove that mentor from class");
      }
      return classRole;
    })
    .catch((err) => console.log(err));
};

export const generateInviteCode = async () => {
  const validChars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let classWithIdenticalCode = [];
  let inviteCode = "";
  do {
    inviteCode = "";
    for (let i = 0; i < 15; i += 1) {
      inviteCode += validChars.charAt(
        Math.floor(Math.random() * validChars.length)
      );
    }
    // If a class is found with this invite code, generate a new code
    // eslint-disable-next-line no-await-in-loop
    classWithIdenticalCode = await Class.findOne({
      $or: [
        { studentInviteCode: inviteCode },
        { mentorInviteCode: inviteCode },
      ],
    });
  } while (successfulFindOneQuery(classWithIdenticalCode));
  return inviteCode;
};

export const validateInviteCode = (req, res, studentClass, mentorClass) => {
  if (
    successfulFindOneQuery(studentClass) ||
    successfulFindOneQuery(mentorClass)
  ) {
    let inviteClass = studentClass;
    let newUserRole = ClassRoles.STUDENT;
    if (successfulFindOneQuery(mentorClass)) {
      inviteClass = mentorClass;
      newUserRole = ClassRoles.MENTOR;
    }
    return ClassRole.findOne({
      userId: req.user.id,
      classId: inviteClass.id,
    }).then((classRole) => {
      // If user is not enrolled in class, return the class info to add to user to it
      if (!successfulFindOneQuery(classRole)) {
        return new ClassRole({
          userId: req.user.id,
          classId: inviteClass.id,
          role: newUserRole,
        });
      }
      return sendJsonErrMessage(
        res,
        400,
        "User is already enrolled in the class"
      );
    });
  }
  return sendJsonErrMessage(res, 400, "Invalid invite code");
};

export const validateGroupSize = (res, usernames, curGroup) =>
  // Find all users via their usernames and get an array of user ids
  User.find({ username: { $in: usernames } })
    .then((userArray) => userArray.map((user) => user.id))
    .then((userIds) =>
      // Only check for students
      ClassRole.find({
        role: ClassRoles.STUDENT,
        classId: curGroup.classId,
        userId: { $in: userIds },
      })
    )
    .then((validStudents) =>
      // Does not check if the student already has a group
      Class.findById(curGroup.classId).then((classObj) => {
        if (
          curGroup.groupMembers.length + validStudents.length >
          classObj.groupSize
        ) {
          sendJsonErrMessage(
            res,
            400,
            `Adding these students would cause group to exceed member limit of ${classObj.groupSize}`
          );
        }
        return curGroup;
      })
    )
    .catch((err) => {
      throw err;
    });

export const validateHasMentors = (res, mentorArray) => {
  if (mentorArray.length < 1) {
    sendJsonErrMessage(
      res,
      403,
      "You cannot leave the group as it will have no mentors left"
    );
  }
};

export const validateNoStudentsLeft = (res, studentArray) => {
  if (studentArray.length > 0) {
    sendJsonErrMessage(
      res,
      403,
      "You cannot delete this group as there are still students inside"
    );
  }
};

export const validateUniqueGroupName = (res, group, name) => {
  Group.find({ classId: group.classId }).then((groupArr) => {
    if (groupArr.some((grp) => grp.name === name)) {
      sendJsonErrMessage(
        res,
        403,
        "There exists another group with the same name in this class already"
      );
    }
  });
  return group;
};
