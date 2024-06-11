import React, { Fragment, useState } from "react";
import Task from "../components/Task";
import TaskList from "../components/TaskList";
import { Modal, Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "../lib/axios";

const Home = () => {
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("delete");
  const [taskId, setTaskId] = useState();
  const [fileList, setFileList] = useState([]);

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

  const onFinish = async (values) => {
    console.log("values", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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
          <Form
            name="basic"
            className="flex gap-10"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            encType="multipart/form-data"
            autoComplete="off"
          >
            <Form.Item
              name="message"
              className="w-100 h-32"
              rules={[
                {
                  required: true,
                  message: "Please input your message!",
                },
              ]}
            >
              <Input placeholder="Message" />
            </Form.Item>

            <Upload
              fileList={fileList}
              onChange={onChange}
              listType="picture"
              beforeUpload={() => false} // Prevent upload before submit
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>

            {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
          </Form>
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
