import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    marginLeft: "auto",
  },
  box: {
    flexBasis: "50%",
    flexGrow: "0",
    margin: "1rem",
    padding: "1rem",
    boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.2)",
  },
});

function AddCommentButton(props) {
  // Queried values
  const { refreshGroupData, taskId } = props;
  const [commentList, setCommentList] = useState([]);
  const [curUserId, setCurUserId] = useState(null);

  // Form values
  const [commentTitle, setCommentTitle] = useState("");
  const [commentText, setCommentText] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  // Misc values
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isRetriving, setIsRetrieving] = useState(true);
  const [curCommentId, setcurCommentId] = useState(null);
  const classes = useStyles();

  function queryComments() {
    axios
      .all([
        axios.get(`/api/v1/tasks/${taskId}/comments`, {
          withCredentials: true,
        }),
        axios.get(`/api/v1/users/`, {
          withCredentials: true,
        }),
      ])
      .then(
        axios.spread((comments, userData) => {
          setCommentList(comments.data);
          setCurUserId(userData.id);
        })
      )
      .catch((err) => console.error(err))
      .finally(() => setIsRetrieving(false));
  }

  // control state of the comments, edit, delete dialogs
  function handleDialogOpen() {
    queryComments();
    setCommentDialogOpen(true);
  }

  function handleDialogClose() {
    setCommentDialogOpen(false);
  }

  function handleEditOpen(index) {
    const commentToEdit = commentList[index];
    setEditTitle(commentToEdit.attributes.title);
    setEditText(commentToEdit.attributes.content);
    setcurCommentId(commentToEdit.id);
    setEditDialogOpen(true);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  // handles communication with backend
  function handlePostComment(event) {
    event.preventDefault();
    axios
      .post(
        `/api/v1/tasks/${taskId}/comments`,
        {
          title: commentTitle,
          content: commentText,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        refreshGroupData();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setCommentText("");
        setCommentTitle("");
        queryComments();
      });
  }

  function handleEditComment(event) {
    event.preventDefault();
    axios
      .put(
        `/api/v1/comments/${curCommentId}/`,
        {
          title: editTitle,
          content: editText,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.msg);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setEditText("");
        setEditTitle("");
        queryComments();
      });
  }

  function handleDeleteComment(index) {}

  return (
    <>
      <Button onClick={handleDialogOpen} className={classes.button}>
        {" "}
        Add Comment{" "}
      </Button>
      {/* Start of Comment List Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={handleDialogClose}
        scroll="paper"
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {isRetriving ? (
            <div>Loading...</div>
          ) : (
            commentList.map((comment, index) => (
              <Paper
                key={comment.attributes.id}
                elevation={1}
                className={classes.box}
              >
                <Typography variant="h6" display="block">
                  {comment.attributes.title}
                </Typography>
                <Typography variant="body2" display="block">
                  {comment.attributes.content}
                </Typography>
                <Typography variant="caption" display="block">
                  Made by: {comment.attributes.createdBy.attributes.username} on{" "}
                  {comment.attributes.creationDate}.
                </Typography>
                <Typography variant="caption" display="block">
                  Last Edited: {comment.attributes.lastEditDate}
                </Typography>
                <Button onClick={() => handleEditOpen(index)}>
                  <EditIcon />
                </Button>
                <Button onClick={() => handleDeleteComment(index)}>
                  <DeleteIcon />
                </Button>
              </Paper>
            ))
          )}
        </DialogContent>
        <Paper className={classes.box}>
          <Typography variant="body1">Add a comment below</Typography>
          <form>
            <div className={classes.root}>
              <TextField
                id="commentTitle"
                label="Title"
                variant="outlined"
                required
                size="small"
                value={commentTitle}
                onChange={(event) => setCommentTitle(event.target.value)}
              />
              <TextField
                id="commentContent"
                label="Comment"
                variant="outlined"
                required
                multiline
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
            </div>
          </form>
        </Paper>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button type="submit" onClick={(event) => handlePostComment(event)}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
      {/* End of Comment List Dialog */}
      {/* Start of Comment Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit comment</DialogTitle>
        <DialogContent>
          <Paper className={classes.box}>
            <form>
              <div className={classes.root}>
                <TextField
                  id="commentTitle"
                  label="Title"
                  variant="outlined"
                  required
                  size="small"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                />
                <TextField
                  id="commentContent"
                  label="Comment"
                  variant="outlined"
                  required
                  multiline
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                />
              </div>
            </form>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button type="submit" onClick={(event) => handleEditComment(event)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* End of Edit Comment Dialog */}
      {/* Start of Delete Comment Dialog */}
      {/* End of Delete Comment Dialog */}
    </>
  );
}

export default AddCommentButton;
