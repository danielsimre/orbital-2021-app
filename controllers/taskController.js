import Task from "../models/Task";
import { validateFieldsPresent } from "../utils/validation";

export const createTask = (req, res) => {
  const { name, desc, dueDate, assignedUser } = req.body;

  validateFieldsPresent(
    res,
    "Please fill in all fields",
    name,
    desc,
    dueDate,
    assignedUser
  );

  // need to check if user performing request is mentor
  // const isMentor = req.user...???

  const newTask = new Task({
    name,
    desc,
    dueDate,
    assignedTo: req.user.id,
  });

  newTask.save();
};

export const getTaskInfo = (req, res) => {
  console.log("Getting task info");
};
