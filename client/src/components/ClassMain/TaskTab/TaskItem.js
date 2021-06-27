import { useState } from "react";
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
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  makeStyles,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  accordion: {
    width: "100%",
  },
  detail: {
    width: "100%",
  },
  detailBox: {
    padding: "16px",
  },
});

function TaskItem(props) {
  // Queried values
  const { taskObject } = props;

  // Form values
  const [submissionURL, setSubmissionURL] = useState("");

  // Misc values
  const [subtaskFormOpen, setSubtaskFormOpen] = useState(false);
  const classes = useStyles();

  // new URL will throw an error if the url is invalid
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      console.log(err);
    } finally {
      return false;
    }
  };

  // Handle dialog opening and closing
  function handleSubtaskOpen() {
    setSubtaskFormOpen(true);
  }

  function handleSubtaskClose() {
    setSubtaskFormOpen(false);
  }

  // Allow user to only check the main task as done after all subtasks are done
  function allSubtasksCompleted(subtaskArr) {
    return subtaskArr.every((subtask) => subtask.isCompleted);
  }

  function handleLinkSubmit(event) {
    event.preventDefault();
    if (isValidURL(submissionURL)) {
      // PUT request here
    }
  }

  return (
    <Accordion className={classes.accordion}>
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
                  control={
                    <Checkbox
                      color="primary"
                      disabled={!allSubtasksCompleted(taskObject.subtasks)}
                    />
                  }
                  color="primary"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.detail}>
          {/*Description of task*/}
          <div className={classes.detailBox}>
            <Card variant="outlined">
              <Typography variant="h5" align="left">
                Description
              </Typography>
              <Typography variant="body" display="block">
                {taskObject.desc}
              </Typography>
            </Card>
          </div>
          {/*Subtask List*/}
          <div className={classes.detailBox}>
            <Card variant="outlined">
              <Typography variant="h5" align="left">
                Subtasks
                <Button onClick={handleSubtaskOpen}>Add subtask</Button>
              </Typography>
            </Card>
          </div>
          <Dialog open={subtaskFormOpen} onClose={handleSubtaskClose}>
            <DialogTitle>Add subtask</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the task name and provide detailed instructions for the
                task.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubtaskClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubtaskClose} color="primary">
                Add subtask
              </Button>
            </DialogActions>
          </Dialog>
          {/*Area to submit work as a link*/}
          <div className={classes.detailBox}>
            <Card variant="outlined">
              <Typography variant="h5" align="left">
                Submit Work
              </Typography>
              <TextField
                label="Link (with https)"
                variant="outlined"
                size="small"
                onChange={(event) => setSubmissionURL(event.target.value)}
              />
              <Button onClick={handleLinkSubmit}>Submit</Button>
            </Card>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default TaskItem;
