import { useState } from "react";
import { Button, Modal } from "@material-ui/core";

import TaskForm from "../TaskForm";
import TaskCompleteList from "./TaskCompleteList";
import TaskIncompleteList from "./TaskIncompleteList";

function TaskBoard() {
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleAddTask(event) {
    event.preventDefault();
    addTask(newTaskName, newTaskDesc);
  }

  function addTask(name, description) {
    const newTasks = [
      ...incompleteTasks,
      {
        name: name,
        description: description,
        isComplete: false,
      },
    ];
    setIncompleteTasks(newTasks);
  }

  function handleCompleteToIncompleteToggle(toToggleTask, toToggleTaskIndex) {
    const newCompletedTasks = [
      ...completedTasks.slice(0, toToggleTaskIndex),
      ...completedTasks.slice(toToggleTaskIndex + 1),
    ];
    const newIncompleteTasks = [
      ...incompleteTasks,
      {
        name: toToggleTask.name,
        description: toToggleTask.description,
        isComplete: !toToggleTask.isComplete,
      },
    ];
    setIncompleteTasks(newIncompleteTasks);
    setCompletedTasks(newCompletedTasks);
  }

  function handleIncompleteToCompleteToggle(toToggleTask, toToggleTaskIndex) {
    const newIncompleteTasks = [
      ...incompleteTasks.slice(0, toToggleTaskIndex),
      ...incompleteTasks.slice(toToggleTaskIndex + 1),
    ];
    const newCompletedTasks = [
      ...completedTasks,
      {
        name: toToggleTask.name,
        description: toToggleTask.description,
        isComplete: !toToggleTask.isComplete,
      },
    ];
    setIncompleteTasks(newIncompleteTasks);
    setCompletedTasks(newCompletedTasks);
  }

  return (
    <>
      <Button onClick={handleOpen}>Add Task</Button>
      <Modal open={isOpen} onClose={handleClose}>
        <TaskForm
          newTaskName={newTaskName}
          setNewTaskName={setNewTaskName}
          newTaskDesc={newTaskDesc}
          setNewTaskDesc={setNewTaskDesc}
          handleAddTask={handleAddTask}
        />
      </Modal>
      <div className="grid-container" style={{ display: "grid" }}>
        <div style={{ gridRow: "1" }}>To Do</div>
        <div style={{ gridRow: "2" }}>
          <TaskIncompleteList
            incompleteTasks={incompleteTasks}
            handleTaskToggle={handleIncompleteToCompleteToggle}
          />
        </div>
        <div style={{ gridRow: "1" }}>Completed</div>
        <div style={{ gridRow: "2" }}>
          <TaskCompleteList
            completedTasks={completedTasks}
            handleTaskToggle={handleCompleteToIncompleteToggle}
          />
        </div>
      </div>
    </>
  );
}

export default TaskBoard;
