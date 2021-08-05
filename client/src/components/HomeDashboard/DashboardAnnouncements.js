import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { Link } from "react-router-dom";

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
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    marginLeft: "auto",
    height: "50%",
    marginTop: "auto",
    marginBottom: "auto",
  },
});

function DashboardAnnouncements(props) {
  const { userAnnouncementList } = props;

  // Pagination values
  const ITEMS_PER_PAGE = 3;
  const numPages = Math.ceil(userAnnouncementList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState(
    userAnnouncementList.slice(0, ITEMS_PER_PAGE)
  );

  const classes = useStyles();

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      userAnnouncementList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  return userAnnouncementList.length === 0 ? (
    <Typography>No announcements!</Typography>
  ) : (
    <div>
      {displayList.map((ann) => (
        <Card
          variant="outlined"
          className={classes.root}
          key={ann.attributes.title}
        >
          <CardContent className={classes.cardContent}>
            <div>
              <Typography className={classes.title}>
                {ann.attributes.title}
              </Typography>
              <Typography className={classes.text}>
                {ann.attributes.content}
              </Typography>
              <Typography variant="caption">
                {`Made by ${ann.attributes.createdBy.attributes.username} in
              ${ann.attributes.classId.attributes.name} on
              ${ann.attributes.creationDate.slice(0, 10)}, 
              ${ann.attributes.creationDate.slice(11, 19)}`}
              </Typography>
            </div>
            <Button
              component={Link}
              to={`/classes/${ann.attributes.classId.id}/announcements`}
              className={classes.button}
            >
              View
            </Button>
          </CardContent>
        </Card>
      ))}
      {numPages < 2 || (
        <Pagination
          count={numPages}
          page={page}
          onChange={handleChange}
          className={classes.pagination}
        />
      )}
    </div>
  );
}

export default DashboardAnnouncements;
