function ProjectMain(props) {
    const { projName, projDescription, projDueDate } = props;
    
    return (
        <>
        <h1>Project Main Page for {projName} due {projDueDate}.</h1>
        <p>Description: {projDescription}</p>
        </>
    );
}

export default ProjectMain;