import TaskBoard from "../components/TaskBoard/index.js";

function GroupMainPage() {
  return (
    <div style={{ textAlign: "flex" }}>
      <p>Group Main Page: Show users and tasks to be done</p>
      <TaskBoard />
    </div>
  );
}

export default GroupMainPage;
