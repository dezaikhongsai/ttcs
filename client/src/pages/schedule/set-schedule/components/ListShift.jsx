import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import vi from 'date-fns/locale/vi';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
  if (loading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>Không có dữ liệu ca làm việc</div>;

  // Chuyển đổi data sang dạng event cho calendar
  const events = [];
  data.forEach(dayData => {
    dayData.shifts.forEach(shift => {
      events.push({
        title: `${shift.workSchedule.workSchedule} - ${shift.employees.map(e => e.name).join(', ')}`,
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
        views={['week', 'day', 'agenda']}
        culture="vi"
        messages={{
          week: 'Tuần',
          day: 'Ngày',
          agenda: 'Danh sách',
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