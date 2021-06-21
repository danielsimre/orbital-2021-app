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

function DashboardComments(props) {
  const { userCommentList } = props;

  const classes = useStyles();

  return (
    <div>
      {userCommentList.map((comment) => (
        <Card variant="outlined">
          <CardContent>
            <Typography className={classes.title}>{comment.title}</Typography>
            <Typography className={classes.text}>{comment.content}</Typography>
            <Typography variant="caption">
              Made By: {comment.createdBy} on {comment.creationDate}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DashboardComments;
