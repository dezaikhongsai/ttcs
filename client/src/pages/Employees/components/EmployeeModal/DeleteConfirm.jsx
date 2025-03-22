import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const DeleteConfirmModal = ({ visible, onConfirm, onCancel, title, content }) => {
  return (
    <Modal
      title={title || "Xác nhận xóa"}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="OK"
      cancelText="Hủy"
      okType="danger"
    >
      <p><ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} /> {content || "Bạn có chắc chắn muốn xóa không?"}</p>
    </Modal>
  );
};

export default DeleteConfirmModal;
