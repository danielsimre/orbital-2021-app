import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Modal,
  Paper,
  Typography,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import AnnouncementForm from "./AnnouncementForm";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  header: {
    padding: "16px",
    marginRight: "0.5em",
    flex: "0 1",
  },
  announceTitle: {
    fontSize: 18,
  },
  announceText: {
    fontSize: 14,
  },
  paper: {
    width: "20%",
    margin: "0 auto",
    padding: "16px",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function ClassAnnouncements(props) {
  // Queried values
  const { curUserRole, classID } = props;
  const [announcementList, setAnnouncementList] = useState([]);

  // Form values
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(true);

  const classes = useStyles();

  const isMentor = (role) => {
    return role === "MENTOR";
  };

  const openForm = () => {
    setFormModalOpen(true);
  };

  const closeForm = () => {
    setFormModalOpen(false);
  };

  function getClassAnnouncements(classId) {
    axios
      .get(`/api/v1/classes/${classId}/announcement`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setAnnouncementList(res.data);
      })
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => getClassAnnouncements(classID), [classID]);

  return (
    isRetrieving || (
      <div>
        <Typography variant="h5" className={classes.header}>
          Announcements
          {isMentor(curUserRole) && (
            <Tooltip title="Make an announcement to the class" placement="top">
              <Button className={classes.button} onClick={openForm}>
                <AddIcon />
              </Button>
            </Tooltip>
          )}
        </Typography>
        <Modal open={formModalOpen} onClose={closeForm}>
          <Paper elevation={1} className={classes.paper}>
            <AnnouncementForm
              classID={classID}
              getClassAnnouncements={getClassAnnouncements}
            />
          </Paper>
        </Modal>
        <div>
          {announcementList.length === 0 ? (
            <Typography>No announcements yet!</Typography>
          ) : (
            announcementList.map((ann) => (
              <Card variant="outlined" className={classes.root} key={ann.id}>
                <CardContent>
                  <Typography className={classes.announceTitle}>
                    {ann.attributes.title}
                  </Typography>
                  <Typography className={classes.announceText}>
                    {ann.attributes.content}
                  </Typography>
                  <Typography variant="caption">
                    Made By: {ann.attributes.createdBy} on{" "}
                    {ann.attributes.creationDate}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  );
}

export default ClassAnnouncements;
