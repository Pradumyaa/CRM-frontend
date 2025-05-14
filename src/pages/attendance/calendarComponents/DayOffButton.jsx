import React, { useState } from "react";
import { Calendar } from "lucide-react";
import DayOffRequestModal from "./DayOffRequestModal";

/**
 * DayOffButton component for requesting days off
 * @param {Object} props - Component props
 * @param {Function} props.onDayOffRequested - Function to call when day off is requested
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Day off button component
 */
const DayOffButton = ({ onDayOffRequested, className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Handle opening the modal
  const handleOpenModal = () => {
    setSelectedDay(new Date()); // Default to today
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle day off submission
  const handleDayOffSubmit = (day, reason) => {
    // Call the onDayOffRequested callback
    if (onDayOffRequested) {
      onDayOffRequested(day, reason);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors shadow ${className}`}
      >
        <Calendar size={18} />
        <span>Request Day Off</span>
      </button>

      <DayOffRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDay={selectedDay}
        onSubmit={handleDayOffSubmit}
      />
    </>
  );
};

export default DayOffButton;
