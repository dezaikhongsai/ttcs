import React from 'react';
import { Descriptions, Card } from 'antd';

const EmployeePayroll = () => {
  // Hardcoded payroll data for the logged-in employee
  const employeeData = {
    name: 'Nguyễn Tuấn Anh',
    hoursWorked: 160,
    hourlyRate: 28000,
    baseSalary: 4000000,
    bonus: 500000,
    penalty: 0,
    totalSalary: 4500000,
  };

  return (
    <div className="p-6">
      <Card title="Thông tin lương chi tiết" className="shadow-md">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên nhân viên">
            {employeeData.name}
          </Descriptions.Item>
          <Descriptions.Item label="Số giờ làm">
            {employeeData.hoursWorked}
          </Descriptions.Item>
          <Descriptions.Item label="Lương/ giờ">
            {employeeData.hourlyRate.toLocaleString('vi-VN')} VND
          </Descriptions.Item>
          <Descriptions.Item label="Lương cơ bản">
            {employeeData.baseSalary.toLocaleString('vi-VN')} VND
          </Descriptions.Item>
          <Descriptions.Item label="Thưởng">
            {employeeData.bonus.toLocaleString('vi-VN')} VND
          </Descriptions.Item>
          <Descriptions.Item label="Phạt">
            {employeeData.penalty.toLocaleString('vi-VN')} VND
          </Descriptions.Item>
          <Descriptions.Item label="Tổng lương">
            {employeeData.totalSalary.toLocaleString('vi-VN')} VND
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default EmployeePayroll;