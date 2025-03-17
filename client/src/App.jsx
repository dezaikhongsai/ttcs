import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginFrm from "./pages/LoginFrm";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ScheduleManage from "./pages/Schedule/ScheduleManage";
import ScheduleSubmit from "./pages/Schedule/ScheduleSubmit";
import PayrollsEmployees from "./pages/Payrolls/PayrollsEmployees";
import PayrollsPersonal from "./pages/Payrolls/PayrollsPersonal";
import EmployeeInfor from "./pages/Employees/EmployeeInfor";
import EmployeePersonal from "./pages/Employees/EmployeePersonal";
import ProtectedRoute from "./routes/ProtectedRoute"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Đăng nhập */}
          <Route path="/" element={<LoginFrm />} />

          {/* Route Home (bọc các route con bên trong) */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>}>
            {/* Nội dung con của HomePage */}
            <Route index element={<Dashboard />} /> {/* Khi vào /home mặc định hiển thị Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schedule/submit" element={<ScheduleSubmit />} />
            <Route path="schedule/manage" element={
              <ProtectedRoute requiredRoles={["admin", "manager"]}>
                <ScheduleManage />
              </ProtectedRoute>
            }/>
            <Route path="payrolls/personal" element={<PayrollsPersonal />} />
            <Route path="payrolls/employees" element={
              <ProtectedRoute requiredRoles={["admin", "manager"]}>
                <PayrollsEmployees />
              </ProtectedRoute>
            }/>
            <Route path="employees/personal" element={<EmployeePersonal />} />
            <Route path="employees/infor" element={
              <ProtectedRoute requiredRoles={["admin", "manager"]}>
                <EmployeeInfor />
              </ProtectedRoute>
            }/>
          </Route>

          {/* Nếu route không hợp lệ, điều hướng về Home */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
