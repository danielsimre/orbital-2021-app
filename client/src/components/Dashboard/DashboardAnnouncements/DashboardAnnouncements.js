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

  return (
    <div>
      {userAnnouncementList.map((ann) => (
        <Card variant="outlined" className={classes.root}>
          <CardContent>
            <Typography className={classes.title}>{ann.title}</Typography>
            <Typography className={classes.text}>{ann.content}</Typography>
            <Typography variant="caption">
              Made By: {ann.createdBy} on {ann.creationDate}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DashboardAnnouncements;
