import React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const DaysNavigation = ({ 
  hasPreviousDays, 
  hasMoreDays, 
  changeDaysPage, 
  currentDate, 
  setStartDate 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => changeDaysPage(-1)}
          disabled={!hasPreviousDays()}
          className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
            hasPreviousDays()
              ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => changeDaysPage(1)}
          disabled={!hasMoreDays()}
          className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
            hasMoreDays()
              ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }`}
        >
          <span>Next</span>
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      <button
        onClick={() => {
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
        }}
        className="flex items-center space-x-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm"
      >
        <Calendar size={16} />
        <span className="font-medium">Today</span>
      </button>
    </div>
  );
};

export default DaysNavigation;