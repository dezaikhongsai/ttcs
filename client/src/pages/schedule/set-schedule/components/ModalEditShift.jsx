import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Space, Button, Tag, Tooltip, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { getEmployeeWithPosition } from '../services/schedule.service';

const ModalEditShift = ({ 
  visible, 
  onCancel, 
  onSave,
  shiftData,
  loading 
}) => {
  const [form] = Form.useForm();
  const [employee, setEmployee] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Khởi tạo form với dữ liệu ban đầu
  useEffect(() => {
    if (shiftData) {
      form.setFieldsValue({
        employees: shiftData.employees.map(emp => ({
          employeeId: emp.employee._id,
          employeeName: emp.employee.name,
          roleInShift: emp.roleInShift
        }))
      });
    }
  }, [shiftData, form]);

  // Fetch danh sách nhân viên
  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        setLoadingEmployees(true);
        const response = await getEmployeeWithPosition();
        console.log("API Response:", response);
        setEmployee(response);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    if (visible) {
      fetchEmployeeList();
    }
  }, [visible]);

  // Hàm kiểm tra vị trí nhân viên có phù hợp với vai trò không
  const validateEmployeeRole = (employeeId, role) => {
    const selectedEmployee = employee.find(emp => emp._id === employeeId);
    if (!selectedEmployee) return false;

    // Admin và Pha chế có thể làm mọi vai trò
    if (selectedEmployee.position === 'Admin' || selectedEmployee.position === 'Pha chế') {
      return true;
    }

    // Các vị trí khác phải trùng với chức vụ
    return selectedEmployee.position === role;
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // Kiểm tra từng nhân viên
      const invalidAssignments = values.employees.filter(
        emp => !validateEmployeeRole(emp.employeeId, emp.roleInShift)
      );

      if (invalidAssignments.length > 0) {
        const invalidEmployee = employee.find(emp => emp._id === invalidAssignments[0].employeeId);
        message.error(`Nhân viên ${invalidEmployee.name} không thể đảm nhận vai trò ${invalidAssignments[0].roleInShift}`);
        return;
      }

      onSave(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Render thông tin ca làm cố định
  const renderShiftInfo = () => (
    <div style={{ marginBottom: 20 }}>
      <h4>Thông tin ca làm:</h4>
      <Space direction="vertical">
        <Tag color="blue">{shiftData?.workSchedule}</Tag>
        <div>
          <Tag color="success">Bắt đầu: {shiftData?.timeStart}</Tag>
          <Tag color="error">Kết thúc: {shiftData?.timeEnd}</Tag>
        </div>
      </Space>
    </div>
  );

  // Tạo options cho Select nhân viên
  const employeeOptions = React.useMemo(() => {
    return employee.map(emp => ({
      value: emp._id,
      label: emp.name,
      key: emp._id,
      title: `${emp.name} - ${emp.position}`
    }));
  }, [employee]);

  // Hàm xử lý khi thay đổi vai trò
  const handleRoleChange = (value, fieldName) => {
    const employeeId = form.getFieldValue(['employees', fieldName, 'employeeId']);
    if (!employeeId) return; // Nếu chưa chọn nhân viên thì không cần kiểm tra

    const selectedEmployee = employee.find(emp => emp._id === employeeId);
    if (!selectedEmployee) return; // Nếu không tìm thấy nhân viên thì không cần kiểm tra

    if (!validateEmployeeRole(employeeId, value)) {
      message.warning(`Nhân viên ${selectedEmployee.name} không thể đảm nhận vai trò ${value}`);
    }
  };

  return (
    <Modal
      title="Cập nhật ca làm"
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          Lưu thay đổi
        </Button>
      ]}
    >
      {renderShiftInfo()}
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{ employees: [] }}
      >
        <Form.List name="employees">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space 
                  key={key} 
                  align="baseline" 
                  style={{ display: 'flex', marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'employeeId']}
                    rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                  >
                    <Select
                      style={{ width: 200 }}
                      placeholder="Chọn nhân viên"
                      loading={loadingEmployees}
                      options={employeeOptions}
                      showSearch
                      optionFilterProp="label"
                      optionLabelProp="label"
                      dropdownRender={menu => (
                        <Tooltip title="Chọn nhân viên" placement="top">
                          {menu}
                        </Tooltip>
                      )}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'roleInShift']}
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                  >
                    <Select
                      style={{ width: 150 }}
                      placeholder="Chọn vai trò"
                      options={[
                        { value: 'Pha chế', label: 'Pha chế' },
                        { value: 'Phục vụ', label: 'Phục vụ' },
                        { value: 'Thu ngân', label: 'Thu ngân' }
                      ]}
                      onChange={(value) => handleRoleChange(value, name)}
                    />
                  </Form.Item>

                  <Button 
                    type="text" 
                    icon={<CloseOutlined />} 
                    onClick={() => remove(name)}
                    danger
                  />
                </Space>
              ))}

              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block
                >
                  Thêm nhân viên
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalEditShift;