import { useState } from "react";
import {
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";

import SubtaskDialogs from "./SubtaskDialogs";

function SubtaskTable(props) {
  const { subtaskList } = props;

  const [isCompleteList, setIsCompleteList] = useState(
    subtaskList.map((obj) => obj.isCompleted)
  );

  function toggleComplete(index) {
    const toggled = !isCompleteList[index];
    const newCompleteList = [
      ...isCompleteList.slice(0, index),
      toggled,
      ...isCompleteList.slice(index + 1),
    ];
    setIsCompleteList(newCompleteList);
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
            <TableCell>Completed?</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtaskList.map((subtaskObject, index) => (
            <TableRow>
              <TableCell>{subtaskObject.name}</TableCell>
              <TableCell>{subtaskObject.desc}</TableCell>
              <TableCell>{subtaskObject.dueDate.slice(0, 10)}</TableCell>
              <TableCell>
                <Checkbox
                  color="primary"
                  checked={isCompleteList[index]}
                  onChange={() => toggleComplete(index)}
                />
              </TableCell>
              <TableCell>
                <SubtaskDialogs subtaskObject={subtaskObject} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default SubtaskTable;
