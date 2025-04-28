import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";

/**
 * EmployeeHome – Trang chủ cho nhân viên
 * Hiển thị lịch làm việc và cho phép tick (xác nhận) từng ca.
 *
 * API:
 *   GET  /api/schedule                -> [{ _id, date: ISOString, shift: "Sáng | Chiều | Tối", confirmed: Boolean }]
 *   PUT  /api/schedule/:id/confirm    -> { success: true, confirmed: Boolean }
 */
export default function EmployeeHome() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const token = localStorage.getItem("token");

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sắp xếp theo ngày gần nhất
      setSchedule(
        data.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } catch {
      toast.error("Không lấy được lịch làm việc");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const confirmShift = async (id) => {
    try {
      await axios.put(
        `/api/schedule/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đã xác nhận");
      // Cập nhật trạng thái local
      setSchedule((prev) =>
        prev.map((s) => (s._id === id ? { ...s, confirmed: true } : s))
      );
    } catch {
      toast.error("Xác nhận thất bại");
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải lịch làm việc...</p>;

  return (
    <Card className="max-w-3xl mx-auto mt-8 p-6 space-y-6">
      <h2 className="text-2xl font-bold">Lịch làm việc của bạn</h2>
      <CardContent>
        {schedule.length === 0 ? (
          <p>Hiện chưa có lịch làm việc nào.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Ngày</TableHead>
                <TableHead className="w-24">Ca</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map(({ _id, date, shift, confirmed }) => (
                <TableRow key={_id}>
                  <TableCell>{new Date(date).toLocaleDateString()}</TableCell>
                  <TableCell>{shift}</TableCell>
                  <TableCell>
                    {confirmed ? (
                      <span className="text-green-600 font-medium">Đã xác nhận</span>
                    ) : (
                      <span className="text-yellow-600">Chưa xác nhận</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!confirmed && (
                      <Button size="sm" onClick={() => confirmShift(_id)}>
                        Tick ✔
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
