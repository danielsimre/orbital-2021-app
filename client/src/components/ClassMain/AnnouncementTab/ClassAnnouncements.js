import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  Typography,
  Tooltip,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle, Pagination } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

import AnnouncementForm from "./AnnouncementForm";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  header: {
    display: "flex",
    justifyContent: "center",
  },
  title: {
    flex: "0 1",
    marginRight: "0.5em",
    padding: "16px",
  },
  announceTitle: {
    fontSize: 18,
  },
  announceText: {
    fontSize: 14,
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function ClassAnnouncements(props) {
  // Queried values
  const { curUserRole, classID, isCompleted } = props;
  const [announcementList, setAnnouncementList] = useState([]);

  // Pagination values
  const ITEMS_PER_PAGE = 4;
  const numPages = Math.ceil(announcementList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState([]);

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(true);
  const classes = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function getClassAnnouncements(classId) {
    axios
      .get(`/api/v1/classes/${classId}/announcements`, {
        withCredentials: true,
      })
      .then((res) => {
        setAnnouncementList(res.data);
        setDisplayList(res.data.slice(0, ITEMS_PER_PAGE));
      })
      .finally(() => setIsRetrieving(false))
      .catch((err) => console.log(err));
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      announcementList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  useEffect(() => getClassAnnouncements(classID), [classID]);

  return (
    isRetrieving || (
      <>
        <div>
          <div className={classes.header}>
            <Typography variant="h5" className={classes.title}>
              Announcements
            </Typography>
            {curUserRole === ClassRoles.MENTOR && (
              <Tooltip
                title="Make an announcement to the class"
                placement="top"
              >
                <Button
                  className={classes.button}
                  onClick={handleDialogOpen}
                  disabled={isCompleted}
                >
                  <AddIcon />
                </Button>
              </Tooltip>
            )}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
              <AnnouncementForm
                classID={classID}
                handleAlert={handleAlert}
                setDisplayAlert={setDisplayAlert}
                getClassAnnouncements={getClassAnnouncements}
                handleDialogClose={handleDialogClose}
              />
            </Dialog>
          </div>
          <div>
            {displayList.length === 0 ? (
              <Typography>No announcements yet.</Typography>
            ) : (
              displayList.map((ann) => (
                <Card variant="outlined" className={classes.root} key={ann.id}>
                  <CardContent>
                    <Typography className={classes.announceTitle}>
                      {ann.attributes.title}
                    </Typography>
                    <Typography className={classes.announceText}>
                      {ann.attributes.content}
                    </Typography>
                    <Typography variant="caption">
                      {`Made by ${
                        ann.attributes.createdBy.attributes.username
                      } in
                      ${ann.attributes.classId.attributes.name} on
                      ${ann.attributes.creationDate.slice(0, 10)}, 
                      ${ann.attributes.creationDate.slice(11, 19)}`}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
            {numPages < 2 || (
              <Pagination
                count={numPages}
                page={page}
                onChange={handleChange}
                className={classes.pagination}
              />
            )}
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={displayAlert}
          onClose={() => setDisplayAlert(false)}
        >
          <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
            <AlertTitle>{alertTitleText}</AlertTitle>
            {alertText}
          </Alert>
        </Snackbar>
      </>
    )
  );
}

export default ClassAnnouncements;
