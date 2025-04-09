// components/DayOffButton.jsx
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import DayOffRequestModal from "./DayOffRequestModal";

const DayOffButton = ({ onDayOffRequested }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDayOffSubmitted = () => {
    setIsModalOpen(false);
    if (onDayOffRequested) {
      onDayOffRequested();
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors shadow"
      >
        <Calendar size={18} />
        <span>Request Day Off</span>
      </button>
      
      <DayOffRequestModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleDayOffSubmitted}
      />
    </>
  );
};

export default DayOffButton;