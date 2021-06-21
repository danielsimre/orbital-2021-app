import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useState } from "react";

// This component is in charge of rendering the task and its subtasks.
// The logic handling the checkboxes and submission should be done in tasklist

function TaskItem(props) {
  // pass in a task json object
  const { taskObject } = props;
  const [formOpen, setFormOpen] = useState(false);

  const handleClose = () => {
    setFormOpen(false);
  };

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
        <Paper>
          <Typography variant="h5" align="left" gutterBottom>
            Description
          </Typography>
          <Typography variant="body" display="block">
            {taskObject.desc}
          </Typography>
        </Paper>
        <Button onClick={() => setFormOpen(true)}>Add subtask</Button>
        <Dialog open={formOpen} onClose={() => setFormOpen(false)}>
          <DialogTitle>Add subtask</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the task name and provide detailed instructions for the
              task.
            </DialogContentText>
            <TextField></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Add subtask
            </Button>
          </DialogActions>
        </Dialog>
      </AccordionDetails>
    </Accordion>
  );
}

export default TaskItem;
