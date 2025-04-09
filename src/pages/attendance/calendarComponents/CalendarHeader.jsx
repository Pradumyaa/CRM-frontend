import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const CalendarHeader = ({ currentDate, formatMonthYear, changeMonth }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="h-6 w-6 text-blue-600" />
        <span>Attendance Calendar</span>
      </h1>

      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border p-1">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-semibold px-4">
          {formatMonthYear(currentDate)}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
