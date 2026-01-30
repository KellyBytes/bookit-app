'use client';
import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import getRoomBookings from '@/app/actions/getRoomBookings';

const ShowBookings = ({ room }) => {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const isMobile = view === 'day';

  // Localizer
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
      'en-US': enUS,
    },
  });

  const bookedEvents = bookings.map(booking => ({
    title: 'Booked',
    start: new Date(booking.check_in),
    end: new Date(booking.check_out),
  }));

  // Calendar button handler
  const moveDate = direction => {
    setDate(prev => {
      const next = new Date(prev);
      const diff = view === 'day' ? 1 : 7;
      next.setDate(next.getDate() + direction * diff);
      return next;
    });
  };

  // React Big Calendar Settings
  const formats = {
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
  };
  const scrollTime = new Date();
  scrollTime.setHours(8, 0, 0);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getRoomBookings(room.$id);
      setBookings(data);
    };

    fetchBookings();
  }, [room.$id]);

  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth < 640 ? 'day' : 'week');
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <h2 className="mt-6 text-lg font-bold">Check Availability</h2>
      {/* <p className="text-sm text-gray-500">Room ID: {room.$id}</p> */}

      {isMobile && (
        <div className="text-sm font-medium text-gray-700">
          {format(date, 'EEEE, MMM dd, yyyy')}
        </div>
      )}

      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={() => moveDate(-1)}
          className="flex justify-center pr-2 py-1 text-sm text-gray-700 rounded-md border border-gray-400 hover:bg-gray-100 cursor-pointer"
        >
          <FaAngleLeft className="text-lg text-gray-500" /> Prev{' '}
          {view === 'day' ? 'Day' : 'Week'}
        </button>
        <button
          onClick={() => moveDate(1)}
          className="flex justify-center pl-2 py-1 text-sm text-gray-700 rounded-md border border-gray-400 hover:bg-gray-100 cursor-pointer"
        >
          Next {view === 'day' ? 'Day' : 'Week'}{' '}
          <FaAngleRight className="text-lg text-gray-500" />
        </button>
      </div>
      <div className="h-80 rounded-md border border-gray-400 bg-white p-2">
        <Calendar
          localizer={localizer}
          formats={formats}
          events={bookedEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          views={['week', 'day']}
          date={date}
          onNavigate={setDate}
          scrollToTime={scrollTime}
          toolbar={false}
          selectable={false}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#d1d5db',
              color: '#374151',
              border: 'none',
              fontSize: '0.875rem',
            },
          })}
        />
      </div>
    </>
  );
};
export default ShowBookings;
