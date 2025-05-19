import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Space, Button, Tag, Tooltip, message, Popconfirm } from 'antd';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEmployeeWithPosition , updateShiftByWorkSchedule , deleteWorkScheduleInShift } from '../services/schedule.service';

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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      console.log('shiftData received:', shiftData);
      
      const values = await form.validateFields();
      console.log('Form values:', values);
      
      // Kiểm tra nhân viên trùng lặp
      const employeeIds = values.employees.map(emp => emp.employeeId);
      const uniqueEmployeeIds = new Set(employeeIds);
      if (employeeIds.length !== uniqueEmployeeIds.size) {
        message.error('Không thể có 2 nhân viên cùng một ca!');
        return;
      }

      // Kiểm tra từng nhân viên
      const invalidAssignments = values.employees.filter(
        emp => !validateEmployeeRole(emp.employeeId, emp.roleInShift)
      );

      if (invalidAssignments.length > 0) {
        const invalidEmployee = employee.find(emp => emp._id === invalidAssignments[0].employeeId);
        message.error(`Nhân viên ${invalidEmployee.name} không thể đảm nhận vai trò ${invalidAssignments[0].roleInShift}`);
        return;
      }

      // Kiểm tra dữ liệu shiftData
      if (!shiftData) {
        message.error('Không tìm thấy thông tin ca làm!');
        return;
      }

      // Lấy workScheduleId từ shiftData
      console.log('workScheduleObj:', shiftData.workScheduleObj);
      
      if (!shiftData.workScheduleObj || !shiftData.workScheduleObj._id) {
        message.error('Không tìm thấy ID ca làm!');
        return;
      }

      // Chuẩn bị dữ liệu để gửi lên server
      const payload = {
        day: shiftData.date,
        workScheduleId: shiftData.workScheduleObj._id,
        employees: values.employees.map(emp => ({
          employeeId: emp.employeeId,
          roleInShift: emp.roleInShift
        }))
      };

      console.log('Sending payload:', payload);

      // Gọi API cập nhật
      const response = await updateShiftByWorkSchedule(payload);
      console.log('API Response:', response);
      
      if (response.success) {
        message.success('Cập nhật ca làm thành công!');
        onSave(response.data); // Gọi callback onSave với dữ liệu mới
        onCancel(); // Đóng modal
      } else {
        message.error(response.message || 'Cập nhật thất bại!');
      }
    } catch (error) {
      console.error('Error saving shift:', error);
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật ca làm!');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      if (!shiftData || !shiftData.date || !shiftData.workScheduleObj?._id) {
        message.error('Không tìm thấy thông tin ca làm!');
        return;
      }
      const formattedDate = new Date(shiftData.date).toISOString();
      const payload = {
        day: formattedDate,
        workScheduleId: shiftData.workScheduleObj._id
      };
      const response = await deleteWorkScheduleInShift(payload);
      if (response.success) {
        message.success('Xóa ca làm thành công!');
        onSave(response.data);
        onCancel();
      } else {
        message.error(response.message || 'Xóa ca làm thất bại!');
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
      message.error(error.message || 'Có lỗi xảy ra khi xóa ca làm!');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Thêm useEffect để log khi shiftData thay đổi
  useEffect(() => {
    console.log('shiftData changed:', shiftData);
  }, [shiftData]);

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

  // Hàm xử lý khi thay đổi nhân viên
  const handleEmployeeChange = (value, fieldName) => {
    const roleInShift = form.getFieldValue(['employees', fieldName, 'roleInShift']);
    if (!roleInShift) return;

    const selectedEmployee = employee.find(emp => emp._id === value);
    if (!selectedEmployee) return;

    if (!validateEmployeeRole(value, roleInShift)) {
      message.warning(`Nhân viên ${selectedEmployee.name} không thể đảm nhận vai trò ${roleInShift}`);
      form.setFields([{
        name: ['employees', fieldName, 'roleInShift'],
        errors: ['Vai trò không phù hợp với chức vụ của nhân viên']
      }]);
    } else {
      form.setFields([{
        name: ['employees', fieldName, 'roleInShift'],
        errors: []
      }]);
    }
  };

  // Hàm xử lý khi thay đổi vai trò
  const handleRoleChange = (value, fieldName) => {
    const employeeId = form.getFieldValue(['employees', fieldName, 'employeeId']);
    if (!employeeId) return;

    const selectedEmployee = employee.find(emp => emp._id === employeeId);
    if (!selectedEmployee) return;

    if (!validateEmployeeRole(employeeId, value)) {
      message.warning(`Nhân viên ${selectedEmployee.name} không thể đảm nhận vai trò ${value}`);
      form.setFields([{
        name: ['employees', fieldName, 'roleInShift'],
        errors: ['Vai trò không phù hợp với chức vụ của nhân viên']
      }]);
    } else {
      form.setFields([{
        name: ['employees', fieldName, 'roleInShift'],
        errors: []
      }]);
    }
  };

  return (
    <>
      <Modal
        title="Cập nhật ca làm"
        open={visible}
        onCancel={onCancel}
        width={700}
        closable={false}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button key="save" type="primary" onClick={handleSave} loading={loading}>
            Lưu thay đổi
          </Button>
        ]}
      >
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={deleteLoading}
            onClick={() => setShowDeleteModal(true)}
          >
            Xóa ca làm
          </Button>
        </div>
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
                        onChange={(value) => handleEmployeeChange(value, name)}
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

                    <Popconfirm
                      title="Xóa nhân viên"
                      description="Bạn có chắc chắn muốn xóa nhân viên này khỏi ca làm?"
                      onConfirm={() => remove(name)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        type="text" 
                        icon={<CloseOutlined />} 
                        danger
                      />
                    </Popconfirm>
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
      <Modal
        open={showDeleteModal}
        title="Xóa ca làm"
        onCancel={() => setShowDeleteModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>,
          <Button key="delete" type="primary" danger loading={deleteLoading} onClick={handleDelete}>
            Xóa
          </Button>
        ]}
        centered
      >
        <p>Bạn có chắc chắn muốn xóa ca làm này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </>
  );
};

export default ModalEditShift;