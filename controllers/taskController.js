import Task from "../models/Task";
import { validateDueDate, validateFieldsPresent } from "../utils/validation";

export const addTask = (req, res) => {
  const { name, desc, dueDate, assignedUser } = req.body;

  validateFieldsPresent(
    res,
    "Please fill in all fields",
    name,
    desc,
    dueDate,
    assignedUser
  );

  validateDueDate(res, dueDate);
  // need to check if user performing request is mentor
  // const isMentor = req.user...???

  const newTask = new Task({
    name,
    desc,
    dueDate,
    assignedTo: req.user.id,
  });

  console.log(newTask);
};

export const getTaskInfo = (req, res) => {
  console.log("Getting task info");
};
