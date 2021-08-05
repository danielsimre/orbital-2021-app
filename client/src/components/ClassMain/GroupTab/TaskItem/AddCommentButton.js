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
  Tooltip,
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
  deleteButton: {
    color: "red",
  },
  commentAction: {
    display: "flex",
    margin: "auto",
  },
});

function AddCommentButton(props) {
  // Queried values
  const { refreshGroupData, taskId, isCompleted } = props;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRetriving, setIsRetrieving] = useState(true);
  const [curCommentId, setCurCommentId] = useState(null); // track which comment is in 'focus' for edit/delete
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
          setCurUserId(userData.data.id);
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
    setCurCommentId(commentToEdit.id);
    setEditDialogOpen(true);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  function handleDeleteOpen(index) {
    const commentToEdit = commentList[index];
    setCurCommentId(commentToEdit.id);
    setDeleteDialogOpen(true);
  }

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
  }

  // handles communication with backend
  function handlePostComment(event) {
    event.preventDefault();
    axios
      .post(
        `/api/v1/tasks/${taskId}/comments`,
        {
          title: commentTitle.trim(),
          content: commentText.trim(),
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
        // clean up state
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
        // clean up state
        setEditText("");
        setEditTitle("");
        setCurCommentId(null);
        setEditDialogOpen(false);
        queryComments();
      });
  }

  function handleDeleteComment(event) {
    event.preventDefault();
    axios
      .delete(`/api/v1/comments/${curCommentId}/`, { withCredentials: true })
      .then((res) => console.log(res.data.msg))
      .catch((err) => console.log(err))
      .finally(() => {
        // clean up state
        setCurCommentId(null);
        setDeleteDialogOpen(false);
        queryComments();
      });
  }

  return (
    <>
      <Button
        onClick={handleDialogOpen}
        className={classes.button}
        disabled={isCompleted}
      >
        View Comments
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
                  {comment.attributes.creationDate.slice(0, 10)}
                </Typography>
                <Typography variant="caption" display="block">
                  Last Edited: {comment.attributes.lastEditDate.slice(0, 10)}
                </Typography>
                {curUserId === comment.attributes.createdBy.id && (
                  <div className={classes.commentAction}>
                    <Tooltip title="Edit comment" placement="top">
                      <Button onClick={() => handleEditOpen(index)}>
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete comment" placement="top">
                      <Button onClick={() => handleDeleteOpen(index)}>
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </div>
                )}
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
                onChange={(event) => {
                  // Do not allow spaces at the beginning, one space between words
                  const regex = /^[^\s]+(\s?[^\s]+)*(\s)?$/g;
                  const value = event.target.value;
                  if (value === "" || regex.test(value)) {
                    setCommentTitle(value);
                  }
                }}
              />
              <TextField
                id="commentContent"
                label="Comment"
                variant="outlined"
                required
                multiline
                value={commentText}
                onChange={(event) => {
                  // Do not allow spaces at the beginning
                  const regex = /^[^\s]+(\s+[^\s]+)*(\s)*$/g;
                  const value = event.target.value;
                  if (value === "" || regex.test(value)) {
                    setCommentText(value);
                  }
                }}
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
        <DialogTitle>Edit Comment</DialogTitle>
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
                  onChange={(event) => {
                    // Do not allow spaces at the beginning, one space between words
                    const regex = /^[^\s]+(\s?[^\s]+)*(\s)?$/g;
                    const value = event.target.value;
                    if (value === "" || regex.test(value)) {
                      setEditTitle(value);
                    }
                  }}
                />
                <TextField
                  id="commentContent"
                  label="Comment"
                  variant="outlined"
                  required
                  multiline
                  value={editText}
                  onChange={(event) => {
                    // Do not allow spaces at the beginning
                    const regex = /^[^\s]+(\s+[^\s]+)*(\s)*$/g;
                    const value = event.target.value;
                    if (value === "" || regex.test(value)) {
                      setEditText(value);
                    }
                  }}
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
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            type="submit"
            className={classes.deleteButton}
            onClick={(event) => handleDeleteComment(event)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* End of Delete Comment Dialog */}
    </>
  );
}

export default AddCommentButton;
