import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Success:", values);
    axios
      .post("/user/login", {
        email: values.username,
        password: values.password,
      })
      .then((response) => {
        // Başarılı yanıt işlemleri
        console.log("Success:", response.data);

        if (values.remember) {
          // "Remember Me" seçiliyse token'ı çerezde sakla
          Cookies.set("token", response.data.accessToken, { expires: 7 }); // 7 gün boyunca sakla
        } else {
          // "Remember Me" seçili değilse token'ı localStorage'da sakla
          localStorage.setItem("token", response.data.accessToken);
        }
        navigate("/");
      })
      .catch((err) => {
        console.error(
          "Login failed:",
          err.response ? err.response.data : err.message
        );
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
      </Form>
    </div>
  );
};

export default Register;
