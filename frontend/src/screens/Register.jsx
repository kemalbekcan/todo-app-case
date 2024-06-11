import axios from "../lib/axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Checkbox, Form, Input, Alert } from "antd";

import Cookies from "js-cookie";

const Register = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: "",
    type: "",
    show: "none",
  });

  const onFinish = (values) => {
    console.log("Success:", values);
    axios
      .post("/user/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        console.log("Success:", response.data);

        if (values.remember) {
          Cookies.set("token", response.data.accessToken, { expires: 7 }); // 7 gün boyunca sakla
        } else {
          localStorage.setItem("token", response.data.accessToken);
        }
        navigate("/");
      })
      .catch((err) => {
        setAlert({
          message: err.response ? err.response.data : err.message,
          show: "block",
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="height-100vh flex flex-col justify-center item-center">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
          <Link to={"/login"}>Login</Link>
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
        <Alert
          message={
            alert.message.error ? alert.message.error : alert.message.message
          }
          type="error"
          style={{ display: alert.show }}
        />
      </Form>
    </div>
  );
};

export default Register;
