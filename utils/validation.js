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
  if (!fields.every((field) => field)) {
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

export const validateGetClassInfo = (res, curClass) => {
  if (!successfulFindOneQuery(curClass)) {
    sendJsonErrMessage(res, 404, "Class does not exist");
  }
  // If the users array is empty, then the logged in user's id was not found in this class
  if (!curClass.users.length) {
    sendJsonErrMessage(res, 403, "Not authorized to view this class");
  }
  return curClass;
};

export const validateGetGroupInfo = (res, curGroup) => {
  if (!successfulFindOneQuery(curGroup)) {
    sendJsonErrMessage(
      res,
      400,
      "Group does not exist or user is not authorized to access this group"
    );
  }
  return curGroup;
};

// Checks if user has permissions to add users to class/groups
export const validateAddUsersToClass = (res, curClass) => {
  if (curClass.users[0].role !== ClassRoles.MENTOR) {
    sendJsonErrMessage(res, 403, "Not authorized to add users to class");
  }
  return curClass;
};

export const validateAddUsersToGroup = (res, curGroup) => {
  if (!successfulFindOneQuery(curGroup)) {
    sendJsonErrMessage(
      res,
      400,
      "Group does not exist or user is not authorized to add users to group"
    );
  }
  return curGroup;
};

export const validateAddGroupsToClass = (res, curClass) => {
  if (curClass.users[0].role !== ClassRoles.MENTOR) {
    sendJsonErrMessage(res, 403, "Not authorized to add groups to class");
  }
  return curClass;
};

export const validateDueDate = (res, dueDate) => {
  if (!(dueDate instanceof Date) || dueDate <= new Date()) {
    sendJsonErrMessage(res, 400, "Please enter a valid date");
  }
};

export const validateValueInEnum = (res, msg, enumType, value) => {
  if (!Object.values(enumType).includes(value)) {
    sendJsonErrMessage(res, 400, msg);
  }
};
