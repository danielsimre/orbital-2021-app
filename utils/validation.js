import ClassRole from "../models/ClassRole.js";
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

// Verify that the user can access the current class
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

export const validateCanAccessGroup = (res, curGroup, msg) => {
  if (!successfulFindOneQuery(curGroup)) {
    sendJsonErrMessage(res, 400, msg);
  }
  return curGroup;
};

// Only mentors can add groups/tasks/announcements to a class
export const validateIsMentor = (res, curClass, msg) => {
  if (curClass.role !== ClassRoles.MENTOR) {
    sendJsonErrMessage(res, 403, msg);
  }
  return curClass;
};

export const validateDueDate = (res, dueDate) => {
  if (!(dueDate instanceof Date) || dueDate < new Date()) {
    sendJsonErrMessage(res, 400, "Please enter a valid date");
  }
};

export const validateValueInEnum = (res, msg, enumType, value) => {
  if (!Object.values(enumType).includes(value)) {
    sendJsonErrMessage(res, 400, msg);
  }
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
