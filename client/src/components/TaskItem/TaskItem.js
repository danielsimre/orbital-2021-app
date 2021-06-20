import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import CustomBox from "../CustomBox";

// This component is in charge of rendering the task
// and its subtasks. The logic handling the checkboxes and stuff should be in tasklist probably

function TaskItem(props) {
  // pass in a task json object
  const { taskObject } = props;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Due</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Done</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{taskObject.name}</TableCell>
              <TableCell>{taskObject.dueDate}</TableCell>
              <TableCell>{taskObject.assignedTo}</TableCell>
              <TableCell>
                <FormControlLabel
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  control={<Checkbox />}
                  color="primary"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="h5" display="inline">
          Description
        </Typography>
        <div>
          <Typography variant="body" display="inline">
            {taskObject.desc}
          </Typography>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default TaskItem;
