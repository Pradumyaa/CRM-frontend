// components/DayOffRequestModal.jsx
import React, { useState } from "react";
import { Calendar, X, Check } from "lucide-react";
import { calendarApi } from "@/utils/apiClient";

const DayOffRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
    if (error) setError("");
  };

  // Handle reason change
  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!date) {
      setError("Please select a date");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) {
        throw new Error("Employee ID not found");
      }
      
      // Call API to request day off
      await calendarApi.requestDayOff(employeeId, date, reason);
      
      // Close modal and refresh data
      onSubmit();
      resetForm();
    } catch (error) {
      console.error("Error requesting day off:", error);
      setError(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setDate("");
    setReason("");
    setError("");
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Request Day Off</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={handleReasonChange}
                placeholder="Please provide a reason for your day off request"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DayOffRequestModal;