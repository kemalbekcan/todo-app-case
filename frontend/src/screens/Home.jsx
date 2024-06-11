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
  const [message, setMessage] = useState("");
  const [taskId, setTaskId] = useState();
  const [fileList, setFileList] = useState([]);

  const showModal = (e, modalTypeText) => {
    if (modalTypeText != "update") {
      setTaskId(e);
    } else {
      setTaskId(e._id);
      setMessage(e.text);
      if (e.image) {
        setFileList([
          {
            uid: "-1",
            name: e.image,
            status: "done",
            url: `http://localhost:3000/uploads/${e.image}`,
          },
        ]);
      }
    }
    setModalType(modalTypeText);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (modalType == "update") {
      onFinish(taskId, message, fileList);
    } else {
      axios
        .delete(`/task/delete/${taskId}`)
        .then((response) => {
          setRefresh((prev) => !prev);
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (taskId, text) => {
    const formData = new FormData();

    formData.append("text", text);

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("file", file.originFileObj);
      }
    });

    if (fileList.length == 0) {
    } else {
    }

    axios
      .put(`/task/update/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setRefresh((prev) => !prev);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleChangeText = (e) => {
    setMessage(e.target.value);
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
              message: message,
              image: fileList,
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
              <Input
                placeholder="Message"
                value={message}
                onChange={handleChangeText}
              />
            </Form.Item>

            <Upload
              fileList={fileList}
              onChange={onChange}
              value={fileList}
              listType="picture"
              beforeUpload={() => false}
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
