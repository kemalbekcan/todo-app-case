import React, { useState } from "react";
import Task from "../components/Task";
import TaskList from "../components/TaskList";
import { Modal } from "antd";
import axios from "../lib/axios";

const Home = () => {
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskId, setTaskId] = useState();

  const showModal = (e) => {
    setTaskId(e);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log("taskId", taskId);
    axios
      .delete(`/task/delete/${taskId}`)
      .then((response) => {
        setRefresh((prev) => !prev);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title="Delete Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Do you really want to delete?</p>
      </Modal>
      <div className="height-100vh flex flex-col justify-between">
        <div className="">
          <TaskList refresh={refresh} showModal={showModal} />
        </div>
        <Task setRefresh={setRefresh} />
      </div>
    </>
  );
};

export default Home;
