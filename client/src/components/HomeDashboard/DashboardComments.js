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

  return userCommentList.length === 0 ? (
    <Typography>No comments!</Typography>
  ) : (
    <div>
      {userCommentList.map((comment) => (
        <Card variant="outlined" key={comment.attributes.title}>
          <CardContent>
            <Typography className={classes.title}>
              {comment.attributes.title}
            </Typography>
            <Typography className={classes.text}>
              {comment.attributes.content}
            </Typography>
            <Typography variant="caption">
              {`Made by ${comment.attributes.createdBy.attributes.username} in
              ${comment.attributes.taskId.attributes.name} (Class ${
                comment.attributes.taskId.attributes.classId.attributes.name
              }) on
              ${comment.attributes.creationDate.slice(0, 10)}, 
              ${comment.attributes.creationDate.slice(11, 19)}`}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DashboardComments;
