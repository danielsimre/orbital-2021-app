import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles({
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function AddSubtaskButton(props) {
  // Queried values
  const { handleEditTask } = props;

  // Form values

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const styles = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return <></>;
}

export default AddSubtaskButton;
