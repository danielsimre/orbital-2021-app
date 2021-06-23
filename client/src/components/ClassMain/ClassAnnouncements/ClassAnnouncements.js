import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Modal,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";

import AnnouncementForm from "./AnnouncementForm";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 18,
  },
  text: {
    fontSize: 14,
  },
  paper: {
    width: "20%",
    margin: "0 auto",
    padding: "16px",
  },
});

function ClassAnnouncements(props) {
  const { curUserRole, classID } = props;
  const [announcementList, setAnnouncementList] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(true);
  const classes = useStyles();

  function isMentor(role) {
    return role === "MENTOR";
  }

  function openForm() {
    setFormModalOpen(true);
  }

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
        <Typography variant="h5">
          Announcements
          {isMentor(curUserRole) && (
            <Button onClick={openForm}>Make Announcement</Button>
          )}
        </Typography>
        <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
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
                  <Typography className={classes.title}>
                    {ann.attributes.title}
                  </Typography>
                  <Typography className={classes.text}>
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
