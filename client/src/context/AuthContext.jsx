import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");

  // Kiểm tra user khi component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      console.log("User từ localStorage khi refresh:", storedUser);
      setUser(storedUser);
      setRole(storedUser.role);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      console.log("User cập nhật trong AuthContext:", user);
      localStorage.setItem("user", JSON.stringify(user));
      setRole(user.role || "staff"); // Đảm bảo có giá trị role hợp lệ
      localStorage.setItem("role", user.role || "staff");
    } else {
      localStorage.removeItem("user");
      setRole("");
      localStorage.removeItem("role");
    }
  }, [user]);

  const login = (userData, authToken) => {
    console.log("Dữ liệu user khi login:", userData);
    setUser(userData);
    setToken(authToken);
    setRole(userData.role || "staff"); // Nếu role không có, mặc định là "staff"
    localStorage.setItem("role", userData.role || "staff");
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

