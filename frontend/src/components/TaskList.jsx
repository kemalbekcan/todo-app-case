import React, { useEffect, useState } from "react";
import axios from "../lib/axios";

const TaskList = () => {
  const [tasks, setTasks] = useState();
  useEffect(() => {
    axios
      .get("/task/list")
      .then((response) => {
        console.log("response", response);
        setTasks(response.data.results);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return (
    <div>
      {tasks?.map((item) => {
        return (
          <div key={item._id}>
            <p>{item.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
