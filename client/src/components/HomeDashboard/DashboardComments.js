import { useState } from "react";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

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

  // Pagination values
  const ITEMS_PER_PAGE = 2;
  const numPages = Math.ceil(userCommentList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState(
    userCommentList.slice(0, ITEMS_PER_PAGE)
  );

  const classes = useStyles();

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      userCommentList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  return userCommentList.length === 0 ? (
    <Typography>No comments!</Typography>
  ) : (
    <div>
      {displayList.map((comment) => (
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
      {numPages < 2 || (
        <Pagination count={numPages} page={page} onChange={handleChange} />
      )}
    </div>
  );
}

export default DashboardComments;
