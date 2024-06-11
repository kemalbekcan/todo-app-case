import { useState } from "react";
import axios from "../lib/axios";
import { Button, Form, Input } from "antd";

// eslint-disable-next-line react/prop-types
const Task = ({ setRefresh }) => {
  const onFinish = (values) => {
    axios
      .post("/task/add", { text: values.message })
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

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Task;
