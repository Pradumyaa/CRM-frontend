import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  ArrowLeft,
  X,
} from "lucide-react";
import { formatMonthYear } from "../../../utils/calendarStyles";

/**
 * CalendarHeader component for month navigation and display
 * @param {Object} props - Component props
 * @param {Date} props.currentDate - Current selected date
 * @param {Function} props.changeMonth - Function to change month
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Calendar header component
 */
const CalendarHeader = ({ currentDate, changeMonth, className = "" }) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [yearView, setYearView] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [animation, setAnimation] = useState("");

  // Go to previous month with animation
  const goToPreviousMonth = () => {
    setAnimation("slide-right");
    setTimeout(() => {
      changeMonth(-1);
      setTimeout(() => setAnimation(""), 50);
    }, 200);
  };

  // Go to next month with animation
  const goToNextMonth = () => {
    setAnimation("slide-left");
    setTimeout(() => {
      changeMonth(1);
      setTimeout(() => setAnimation(""), 50);
    }, 200);
  };

  // Go to current month
  const goToCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Calculate difference in months to move
    const monthDiff = (year - currentYear) * 12 + (month - currentMonth);

    // Set animation direction based on moving forward or backward
    if (monthDiff > 0) {
      setAnimation("slide-left");
    } else if (monthDiff < 0) {
      setAnimation("slide-right");
    }

    setTimeout(() => {
      changeMonth(monthDiff);
      setTimeout(() => setAnimation(""), 50);
    }, 200);
  };

  // Generate months for the month picker
  const getMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentDate.getFullYear(), i, 1);
      return {
        index: i,
        name: date.toLocaleString("default", { month: "short" }),
      };
    });

    return months;
  };

  // Generate years for the year picker
  const getYears = () => {
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    return years;
  };

  // Handle month selection
  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(currentDate);
    const currentMonth = currentDate.getMonth();

    // Set animation direction based on moving forward or backward
    if (monthIndex > currentMonth) {
      setAnimation("slide-left");
    } else if (monthIndex < currentMonth) {
      setAnimation("slide-right");
    }

    newDate.setMonth(monthIndex);

    setTimeout(() => {
      changeMonth(monthIndex - currentMonth);
      setShowMonthPicker(false);
      setTimeout(() => setAnimation(""), 50);
    }, 200);
  };

  // Handle year selection
  const handleYearClick = (year) => {
    const newDate = new Date(currentDate);
    const currentYear = currentDate.getFullYear();

    // Set animation direction based on moving forward or backward
    if (year > currentYear) {
      setAnimation("slide-left");
    } else if (year < currentYear) {
      setAnimation("slide-right");
    }

    newDate.setFullYear(year);

    setTimeout(() => {
      const yearDiff = year - currentYear;
      changeMonth(yearDiff * 12);
      setYearView(false);
      setShowMonthPicker(false);
      setTimeout(() => setAnimation(""), 50);
    }, 200);
  };

  // Handle month dropdown toggle
  const toggleMonthPicker = () => {
    setShowMonthPicker(!showMonthPicker);
    setYearView(false);
  };

  // Check if current view is the current month/year
  const isCurrentMonth = () => {
    const today = new Date();
    return (
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 ${className}`}
    >
      <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
        <Calendar className="h-6 w-6 text-blue-600" />
        <span>Attendance Calendar</span>
      </h1>

      <div className="flex flex-col items-end">
        <div className="flex items-center bg-white rounded-lg shadow-md border p-1 relative z-10">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={toggleMonthPicker}
            className={`text-lg font-semibold px-4 py-1 text-gray-800 rounded-md hover:bg-blue-50 transition-colors ${
              animation ? `animate-${animation}` : ""
            }`}
          >
            {formatMonthYear(currentDate)}
          </button>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>

          <button
            onClick={goToCurrentMonth}
            disabled={isCurrentMonth()}
            className={`ml-1 p-2 rounded-md transition-colors ${
              isCurrentMonth()
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
            aria-label="Go to current month"
            title="Go to current month"
          >
            <Calendar size={18} />
          </button>
        </div>

        {/* Month/Year Picker Dropdown */}
        {showMonthPicker && (
          <div className="absolute mt-12 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-20 animate-fade-in">
            {yearView ? (
              <>
                {/* Year View */}
                <div className="p-2 mb-2 border-b border-gray-200 flex items-center">
                  <button
                    onClick={() => setYearView(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className="ml-2 font-medium">Select Year</span>
                </div>

                <div className="grid grid-cols-3 gap-2 w-48">
                  {getYears().map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearClick(year)}
                      className={`p-2 rounded-md text-sm ${
                        year === currentDate.getFullYear()
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Month View */}
                <div className="p-2 mb-2 border-b border-gray-200 flex justify-between">
                  <button
                    onClick={() => setYearView(true)}
                    className="font-medium text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {currentDate.getFullYear()}
                  </button>

                  <button
                    onClick={() => setShowMonthPicker(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 w-48">
                  {getMonths().map((month) => (
                    <button
                      key={month.index}
                      onClick={() => handleMonthClick(month.index)}
                      className={`p-2 rounded-md text-sm ${
                        month.index === currentDate.getMonth()
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {month.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
