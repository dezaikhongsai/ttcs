import React, { useState } from 'react';
import { Table, Button, Space, Tag, Typography, Pagination, Row } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const payrollData = [
  {
    key: 1,
    tenNv: "Nguyễn Văn An",
    soGioLam: 160,
    mucLuongGio: "25,000",
    luongCoBan: "4,000,000",
    thuong: "500,000",
    phat: "0",
    tongLuong: "4,500,000",
    ghiChu: "Hoàn thành tốt"
  },
  {
    key: 2,
    tenNv: "Trần Thị Bình",
    soGioLam: 150,
    mucLuongGio: "30,000",
    luongCoBan: "4,500,000",
    thuong: "0",
    phat: "100,000",
    tongLuong: "4,400,000",
    ghiChu: "Đi làm muộn 2 lần"
  },
  {
    key: 3,
    tenNv: "Lê Văn Cường",
    soGioLam: 170,
    mucLuongGio: "28,000",
    luongCoBan: "4,760,000",
    thuong: "200,000",
    phat: "0",
    tongLuong: "4,960,000",
    ghiChu: "Làm tốt"
  },
  {
    key: 4,
    tenNv: "Phạm Thị Dung",
    soGioLam: 140,
    mucLuongGio: "27,000",
    luongCoBan: "3,780,000",
    thuong: "0",
    phat: "0",
    tongLuong: "3,780,000",
    ghiChu: ""
  },
  {
    key: 5,
    tenNv: "Ngô Minh Huy",
    soGioLam: 155,
    mucLuongGio: "26,000",
    luongCoBan: "4,030,000",
    thuong: "100,000",
    phat: "0",
    tongLuong: "4,130,000",
    ghiChu: ""
  },
  {
    key: 6,
    tenNv: "Đặng Thị Lan",
    soGioLam: 160,
    mucLuongGio: "25,000",
    luongCoBan: "4,000,000",
    thuong: "0",
    phat: "0",
    tongLuong: "4,000,000",
    ghiChu: ""
  },
  {
    key: 7,
    tenNv: "Vũ Quốc Bảo",
    soGioLam: 145,
    mucLuongGio: "29,000",
    luongCoBan: "4,205,000",
    thuong: "0",
    phat: "50,000",
    tongLuong: "4,155,000",
    ghiChu: "Đi làm muộn"
  },
  {
    key: 8,
    tenNv: "Nguyễn Thị Mai",
    soGioLam: 150,
    mucLuongGio: "30,000",
    luongCoBan: "4,500,000",
    thuong: "0",
    phat: "0",
    tongLuong: "4,500,000",
    ghiChu: ""
  },
  {
    key: 9,
    tenNv: "Trần Văn Sơn",
    soGioLam: 155,
    mucLuongGio: "28,000",
    luongCoBan: "4,340,000",
    thuong: "0",
    phat: "0",
    tongLuong: "4,340,000",
    ghiChu: ""
  },
  {
    key: 10,
    tenNv: "Lê Thị Hạnh",
    soGioLam: 160,
    mucLuongGio: "27,000",
    luongCoBan: "4,320,000",
    thuong: "0",
    phat: "0",
    tongLuong: "4,320,000",
    ghiChu: ""
  },
  {
    key: 11,
    tenNv: "Phan Văn Tài",
    soGioLam: 150,
    mucLuongGio: "26,000",
    luongCoBan: "3,900,000",
    thuong: "0",
    phat: "0",
    tongLuong: "3,900,000",
    ghiChu: ""
  },
  {
    key: 12,
    tenNv: "Đỗ Thị Thu",
    soGioLam: 165,
    mucLuongGio: "29,000",
    luongCoBan: "4,785,000",
    thuong: "0",
    phat: "0",
    tongLuong: "4,785,000",
    ghiChu: ""
  }
];

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center',
    render: (text, record, index) => index + 1,
    width: 50,
  },
  {
    title: 'Tên nv',
    dataIndex: 'tenNv',
    align: 'center',
    width: 150,
  },
  {
    title: 'Số giờ',
    dataIndex: 'soGioLam',
    align: 'center',
    width: 70,
  },
  {
    title: 'Lương/giờ',
    dataIndex: 'mucLuongGio',
    align: 'center',
    width: 90,
  },
  {
    title: 'Lương cơ bản',
    dataIndex: 'luongCoBan',
    align: 'center',
    width: 110,
  },
  {
    title: 'Thưởng',
    dataIndex: 'thuong',
    align: 'center',
    width: 80,
    render: (value) => value !== "0" ? <Tag color="green">{value}</Tag> : value,
  },
  {
    title: 'Phạt',
    dataIndex: 'phat',
    align: 'center',
    width: 80,
    render: (value) => value !== "0" ? <Tag color="red">{value}</Tag> : value,
  },
  {
    title: 'Tổng lương',
    dataIndex: 'tongLuong',
    align: 'center',
    width: 110,
    render: (value) => <b>{value}</b>
  },
  {
    title: 'Ghi chú',
    dataIndex: 'ghiChu',
    align: 'center',
    width: 140,
  },
  {
    title: 'Chức năng',
    key: 'action',
    align: 'center',
    width: 210,
    render: (_, record) => (
      <Space>
        <Button type="primary" size="small" icon={<EyeOutlined />}>Xem</Button>
        <Button
          size="small"
          icon={<EditOutlined />}
          style={{
            backgroundColor: "#facc15",
            color: "white",
            border: "none"
          }}
        >
          Sửa
        </Button>
        <Button
          size="small"
          icon={<DeleteOutlined />}
          style={{
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none"
          }}
        >
          Xóa
        </Button>
      </Space>
    ),
  },
];

const ListPayroll = () => {
  // Thêm state cho pageSize
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('list');

  const paginatedData = payrollData.slice((current - 1) * pageSize, current * pageSize);

  // Hàm xử lý thay đổi trang và pageSize
  const handlePaginationChange = (page, pageSizeNew) => {
    setCurrent(page);
    setPageSize(pageSizeNew);
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 0"
    }}>
      <div style={{ width: "100%", maxWidth: 1400, marginBottom: 24 }}>
        <Row gutter={8} align="middle">
          <Button
            type={viewMode === 'list' ? 'primary' : 'default'}
            icon={<UnorderedListOutlined />}
            onClick={() => setViewMode('list')}
            style={{ marginRight: 8 }}
          >
            Danh sách
          </Button>
          <Button
            type={viewMode === 'statistics' ? 'primary' : 'default'}
            icon={<BarChartOutlined />}
            onClick={() => setViewMode('statistics')}
          >
            Thống kê
          </Button>
        </Row>
      </div>

      {viewMode === 'statistics' ? (
        <Title level={3} style={{ marginBottom: 24, fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>
          Thống kê lương nhân viên
        </Title>
      ) : (
        <>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>
            Bảng lương nhân viên
          </Title>
          <div style={{ width: "100%", maxWidth: 1400 }}>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <style>
                {`
                  .payroll-table .ant-table-thead > tr > th {
                    font-size: 13px;
                    white-space: nowrap;
                  }
                `}
              </style>
              <Table
                columns={columns}
                dataSource={paginatedData}
                pagination={false}
                bordered
                tableLayout="fixed"
                style={{ fontSize: 14, minWidth: 900 }}
                className="payroll-table"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <Pagination
                current={current}
                pageSize={pageSize}
                total={payrollData.length}
                onChange={handlePaginationChange}
                showSizeChanger
                pageSizeOptions={['2', '5', '10']}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListPayroll;