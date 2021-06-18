import { Checkbox } from "@material-ui/core";

function TaskIncompleteList(props) {
  const { incompleteTasks, handleTaskToggle } = props;

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
        {incompleteTasks
          .filter((task) => !task.isComplete)
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
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default TaskIncompleteList;
