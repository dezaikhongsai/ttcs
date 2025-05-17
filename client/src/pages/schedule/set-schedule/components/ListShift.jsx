import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import vi from 'date-fns/locale/vi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Spin, Typography } from 'antd';

const { Title } = Typography;

const locales = {
  'vi': vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const ListShift = ({ data, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 32 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <Title level={4}>Không có dữ liệu ca làm việc</Title>
      </div>
    );
  }

  // Chuyển đổi data sang dạng event cho calendar
  const events = [];
  data.forEach(dayData => {
    dayData.shifts.forEach(shift => {
      events.push({
        title: `${shift.workSchedule.workSchedule} - ${shift.employees.map(e => e.employees).join(', ')}`,
        start: new Date(`${dayData.day.slice(0, 10)}T${shift.workSchedule.timeStart}`),
        end: new Date(`${dayData.day.slice(0, 10)}T${shift.workSchedule.timeEnd}`),
        resource: shift,
      });
    });
  });

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['week', 'day']}
        culture="vi"
        messages={{
          week: 'Tuần',
          day: 'Ngày',
          today: 'Hôm nay',
          previous: 'Trước',
          next: 'Sau',
        }}
        style={{ height: 600 }}
      />
    </div>
  );
};

export default ListShift;