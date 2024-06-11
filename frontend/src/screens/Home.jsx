import React, { useState } from "react";
import Task from "../components/Task";
import TaskList from "../components/TaskList";
import { Modal } from "antd";
import axios from "../lib/axios";

const Home = () => {
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("delete");
  const [taskId, setTaskId] = useState();

  const showModal = (e, modalTypeText) => {
    setTaskId(e);
    setModalType(modalTypeText);
    setIsModalOpen(true);
  };
  const handleOk = () => {
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
        title={`${modalType == "update" ? "Update" : "Delete"} Task`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modalType == "update" ? (
          "update"
        ) : (
          <p>Do you really want to delete?</p>
        )}
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
