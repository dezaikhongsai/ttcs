import React from 'react';
import { Calendar, Modal, Form, Select, message  } from 'antd';
import dayjs from 'dayjs';

const CalendarView = ({
  isModalVisible,
  setIsModalVisible,
  selectedDate,
  setSelectedDate,
  form,
  workSchedule,
  handleOk,
  handleCancel,
  dateCellRender,
}) => {
  const handleDateSelect = (value) => {
    setSelectedDate(value);
    setIsModalVisible(true);
  };

  return (
    <>
      <Calendar
        onSelect={handleDateSelect}
        disabledDate={(current) => current && current < dayjs().startOf('day')}
        dateCellRender={dateCellRender}
      />
      <Modal
        title={`Đăng ký ca làm việc cho ngày ${selectedDate?.format('DD/MM/YYYY')}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đăng ký"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="workSchedule"
            label="Chọn ca"
            rules={[{ required: true, message: 'Vui lòng chọn ca!' }]}
          >
            <Select placeholder="Chọn ca làm việc">
              {Array.isArray(workSchedule) &&
                workSchedule.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {`${item.workSchedule} (${item.timeStart} - ${item.timeEnd})`}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="position"
            label="Chọn vị trí"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
          >
            <Select placeholder="Chọn vị trí làm việc">
              <Select.Option value="position1">Pha chế</Select.Option>
              <Select.Option value="position2">Phục vụ</Select.Option>
              <Select.Option value="position3">Thu ngân</Select.Option>
            </Select>
            </Form.Item>          
        
        </Form>
      </Modal>
    </>
  );
};

export default CalendarView;