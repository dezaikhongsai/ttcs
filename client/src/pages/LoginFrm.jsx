import { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import "../styles/loginForm.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { email, password } = values;
    setError("");

    if (!email.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    console.log("Đăng nhập thành công với:", values);
    navigate("/home");
  };

  return (
    <div
      id="bgr"
      className="flex items-center justify-center h-screen bg-gray-100"
    >
      <div id="mainForm" className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="font-medium">Email</span>}
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
