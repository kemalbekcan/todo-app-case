import { useState } from "react";
import axios from "../lib/axios";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
const Task = ({ setRefresh }) => {
  const [fileList, setFileList] = useState([]);
  const formData = new FormData();

  const onFinish = async (values) => {
    formData.append("text", values.message);
    fileList.forEach((file) => {
      formData.append("file", file.originFileObj);
    });

    await axios
      .post("/task/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("res", response);
        setRefresh((prev) => !prev);
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

  return (
    <div className="mx-10 mb-10">
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
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Task;
