import ProjectRoles from "./enums.js";

export const validateRegistration = (req, res, queriedUser) => {
  const { username, email, password, passwordConfirm } = req.body;

  // Ensure all fields are filled in
  if (!username || !email || !password || !passwordConfirm) {
    res.status(400).json({ msg: "Please fill in all fields" });
    return false;
  }

  // Ensure that user confirms password correctly
  if (password !== passwordConfirm) {
    res.status(400).json({ msg: "Password confirmation failed" });
    return false;
  }

  // Enforces password length of >= 6
  if (password.length < 6) {
    res.status(400).json({ msg: "Password should be at least 6 characters" });
    return false;
  }

  if (queriedUser && queriedUser.email === email) {
    res.status(400).json({ msg: "Email is already registered" });
    return false;
  }
  if (queriedUser && queriedUser.username === username) {
    res.status(400).json({ msg: "Username is already in use" });
    return false;
  }
  return true;
};

export const validateGetProjectInfo = (curProject, res) => {
  // If the users array is empty, then the logged in user's id was not found in this project
  if (curProject == null) {
    res.status(401).json({ msg: "Project does not exist" });
    return Promise.reject(new Error("Project does not exist"));
  }
  if (!curProject.users.length) {
    res.status(401).json({ msg: "Not authorized to view this project" });
    return Promise.reject(new Error("User unauthorized to view project"));
  }
  return Promise.resolve();
};

// Checks if user has permissions to add users to project/groups
export const validateAddUsers = (curProject, res) => {
  if (curProject.users[0].role !== ProjectRoles.MENTOR) {
    res.status(401).json({ msg: "Not authorized to add users to project" });
    return Promise.reject(
      new Error("User unauthorized to add users to project")
    );
  }
  return curProject;
};
