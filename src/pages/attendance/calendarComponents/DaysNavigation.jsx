import React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

/**
 * DaysNavigation component for navigating through days in the timeline
 * @param {Object} props - Component props
 * @param {Function} props.hasPreviousDays - Function to check if there are previous days
 * @param {Function} props.hasMoreDays - Function to check if there are more days
 * @param {Function} props.changeDaysPage - Function to change days page
 * @param {Date} props.currentDate - Current selected date
 * @param {Function} props.setStartDate - Function to set start date
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Day navigation component
 */
const DaysNavigation = ({
  hasPreviousDays,
  hasMoreDays,
  changeDaysPage,
  currentDate,
  setStartDate,
  className = "",
}) => {
  // Navigate to previous page of days
  const goToPreviousPage = () => changeDaysPage(-1);

  // Navigate to next page of days
  const goToNextPage = () => changeDaysPage(1);

  // Go to today or first day of month
  const goToToday = () => {
    const today = new Date();
    if (
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    ) {
      setStartDate(today);
    } else {
      setStartDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      );
    }
  };

  // Go to start of month
  const goToStartOfMonth = () => {
    setStartDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    );
  };

  // Go to end of month
  const goToEndOfMonth = () => {
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    setStartDate(lastDay);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 ${className}`}
    >
      <div className="flex items-center space-x-2">
        <button
          onClick={goToStartOfMonth}
          disabled={!hasPreviousDays()}
          className={`p-2 rounded-md flex items-center transition-colors ${
            hasPreviousDays()
              ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }`}
          aria-label="First day of month"
          title="First day of month"
        >
          <ArrowLeft size={16} />
        </button>

        <button
          onClick={goToPreviousPage}
          disabled={!hasPreviousDays()}
          className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
            hasPreviousDays()
              ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }`}
          aria-label="Previous days"
        >
          <ChevronLeft size={16} className="mr-1" />
          <span>Previous</span>
        </button>

        <button
          onClick={goToNextPage}
          disabled={!hasMoreDays()}
          className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
            hasMoreDays()
              ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }`}
          aria-label="Next days"
        >
          <span>Next</span>
          <ChevronRight size={16} className="ml-1" />
        </button>

        <button
          onClick={goToEndOfMonth}
          disabled={!hasMoreDays()}
          className={`p-2 rounded-md flex items-center transition-colors ${
            hasMoreDays()
              ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }`}
          aria-label="Last day of month"
          title="Last day of month"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <button
        onClick={goToToday}
        className="flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 border border-blue-600 transition-colors shadow-sm transform hover:-translate-y-0.5 hover:shadow-md duration-300"
        aria-label="Go to today"
      >
        <Calendar size={16} />
        <span className="font-medium">Today</span>
      </button>
    </div>
  );
};

export default DaysNavigation;
