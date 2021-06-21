import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  box: {
    flexBasis: "50%",
    flexGrow: "0",
    margin: "1rem",
    padding: "1rem",
    boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.2)",
  },
});

function CustomBox(props) {
  const { children } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.box} elevation={3}>
      {children}
    </Paper>
  );
}

export default CustomBox;
