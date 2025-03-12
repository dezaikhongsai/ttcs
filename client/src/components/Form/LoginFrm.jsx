import { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import "antd/dist/reset.css";

const Login = () => {
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

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

    console.log(isRegistering ? "Đăng ký thành công với:" : "Đăng nhập thành công với:", values);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">{isRegistering ? "Đăng ký" : "Đăng nhập"}</h2>
        {error && <Alert message={error} type="error" showIcon className="mb-4" />}
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
          {isRegistering && (
            <Form.Item
              label={<span className="font-medium">Xác nhận mật khẩu</span>}
              name="confirmPassword"
              rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu" }]}
            >
              <Input.Password className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
              {isRegistering ? "Đăng ký" : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          <button className="text-blue-500 hover:underline" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Quay lại đăng nhập" : "Chưa có tài khoản? Đăng ký ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
