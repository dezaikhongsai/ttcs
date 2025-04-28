// src/pages/ManagerDashboard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const nav = useNavigate();
  return (
    <Card className="m-6 p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Manager Dashboard</h1>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        <Button onClick={() => nav("/staff")}>Quản lý nhân viên</Button>
        <Button onClick={() => nav("/schedule")}>Xếp lịch làm việc</Button>
        <Button onClick={() => nav("/payroll")}>Bảng lương</Button>
        <Button variant="secondary" onClick={() => nav("/stats")}>Thống kê nhanh</Button>
      </CardContent>
    </Card>
  );
}
