
import React from 'react';
import CalendarView from '@/components/calendar/CalendarView';
import Navbar from '@/components/Navbar';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CalendarView />
    </div>
  );
};

export default Calendar;
