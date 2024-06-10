import React, { useState } from "react";
import Task from "../components/Task";
import TaskList from "../components/TaskList";

const Home = () => {
  const [refresh, setRefresh] = useState(false);
  return (
    <div className="height-100vh flex flex-col justify-between">
      <div className="">
        <TaskList refresh={refresh} />
      </div>
      <Task setRefresh={setRefresh} />
    </div>
  );
};

export default Home;
