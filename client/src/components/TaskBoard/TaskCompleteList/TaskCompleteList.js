import { Checkbox } from "@material-ui/core";

function TaskCompleteList(props) {
  const { completedTasks, handleTaskToggle } = props;

  return (
    <table style={{ margin: "0 auto", width: "50%" }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Task</th>
          <th>Description</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody style={{ textAlign: "center" }}>
        {completedTasks
          .filter((task) => task.isComplete)
          .map((task, index) => (
            <tr key={task.description}>
              <td>{index + 1}</td>
              <td>{task.name}</td>
              <td>{task.description}</td>
              <td>
                <Checkbox
                  color="primary"
                  checked={task.isComplete}
                  onChange={() => handleTaskToggle(task, index)}
                  inputProps={{
                    "aria-label": `checkbox that determines if task ${index} is done`,
                  }}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default TaskCompleteList;
