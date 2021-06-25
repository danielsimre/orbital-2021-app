import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";

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
});

function DashboardAnnouncements(props) {
  const { userAnnouncementList } = props;

  const classes = useStyles();

  return userAnnouncementList.length === 0 ? (
    <Typography>No announcements!</Typography>
  ) : (
    <div>
      {userAnnouncementList.map((ann) => (
        <Card
          variant="outlined"
          className={classes.root}
          key={ann.attributes.title}
        >
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
      ))}
    </div>
  );
}

export default DashboardAnnouncements;
