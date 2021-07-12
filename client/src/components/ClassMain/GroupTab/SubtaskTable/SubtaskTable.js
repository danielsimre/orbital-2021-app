import {
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";
import axios from "axios";

import SubtaskDialogs from "./SubtaskDialogs";

function SubtaskTable(props) {
  const { groupMembers, refreshGroupData, parentDueDate, isMentor } = props;
  const subtaskList = props.subtaskList.sort((subtask1, subtask2) => {
    if (subtask1.attributes.dueDate < subtask2.attributes.dueDate) {
      return -1;
    }
    if (subtask1.attributes.dueDate > subtask2.attributes.dueDate) {
      return 1;
    }
    return 0;
  });

  function handleChangeCompletion(subtaskId, isCompleted) {
    axios
      .put(
        `/api/v1/tasks/${subtaskId}?subtasks`,
        {
          isCompleted: isCompleted,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        refreshGroupData();
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Typography variant="h5" align="left">
        Subtasks
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Completed?</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtaskList.map((subtaskObject, index) => (
            <TableRow>
              <TableCell>{subtaskObject.attributes.name}</TableCell>
              <TableCell>{subtaskObject.attributes.desc}</TableCell>
              <TableCell>
                {subtaskObject.attributes.dueDate.slice(0, 10)}
              </TableCell>
              <TableCell>
                {subtaskObject.attributes.assignedTo.map(
                  (assignedUser, index) => {
                    return (
                      <>
                        {(index !== 0 ? ", " : "") +
                          assignedUser.attributes.username}
                      </>
                    );
                  }
                )}
              </TableCell>
              <TableCell>
                <Checkbox
                  color="primary"
                  checked={subtaskObject.attributes.isCompleted}
                  onChange={(event) =>
                    handleChangeCompletion(
                      subtaskObject.id,
                      event.target.checked
                    )
                  }
                  disabled={isMentor}
                />
              </TableCell>
              <TableCell>
                <SubtaskDialogs
                  subtaskObject={subtaskObject}
                  groupMembers={groupMembers}
                  refreshGroupData={refreshGroupData}
                  parentDueDate={parentDueDate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default SubtaskTable;
