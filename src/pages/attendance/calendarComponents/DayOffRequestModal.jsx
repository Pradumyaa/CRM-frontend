import React, { useState, useEffect } from "react";
import { X, Calendar, Check, AlertCircle, Clock, User } from "lucide-react";
import { formatDateToString } from "../../../utils/calendarStyles";

const DayOffRequestModal = ({
  isOpen,
  onClose,
  selectedDay,
  dayData = {},
  onSubmit,
  isAdmin = false,
  onApprove,
  onReject,
}) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
      setShowSuccess(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen || !selectedDay) return null;

  // Format date for display
  const formattedDate = selectedDay.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Controlled close with animation
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Handle day off request submission
  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      // Require reason for day off request
      if (!reason.trim()) {
        setError("Please provide a reason for your day off request");
        setIsLoading(false);
        return;
      }

      // Submit the request
      await onSubmit(selectedDay, reason);

      // Show success message
      setShowSuccess(true);
      setReason("");

      // Close after delay
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  // Admin approval/rejection handlers
  const handleApprove = async () => {
    if (isLoading || !isAdmin) return;

    try {
      setIsLoading(true);
      setError("");

      await onApprove(formatDateToString(selectedDay), dayData.employeeId);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to approve request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (isLoading || !isAdmin) return;

    try {
      setIsLoading(true);
      setError("");

      await onReject(formatDateToString(selectedDay), dayData.employeeId);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to reject request");
    } finally {
      setIsLoading(false);
    }
  };

  // Get day status badge
  const getDayStatusBadge = () => {
    if (dayData.dayOffRequested && dayData.approved === true) {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Approved
        </span>
      );
    }

    if (dayData.dayOffRequested && dayData.approved === false) {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          Pending Approval
        </span>
      );
    }

    if (dayData.clockIn && dayData.clockOut) {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Completed
        </span>
      );
    }

    if (dayData.clockIn) {
      return (
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
          Clocked In
        </span>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-in-out overflow-hidden ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="mr-2" size={20} />
            {dayData.dayOffRequested ? "Day Off Request" : "Request Day Off"}
          </h3>
          <button
            onClick={handleCloseModal}
            className="text-white hover:text-gray-200 focus:outline-none bg-white bg-opacity-20 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10 animate-fade-in rounded-xl">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <Check size={40} className="text-green-600" />
            </div>
            <p className="text-lg font-medium text-green-700 mb-2">
              {isAdmin
                ? "Request processed successfully!"
                : "Day off request submitted!"}
            </p>
            <p className="text-gray-600 text-center max-w-xs">
              {isAdmin
                ? "The employee will be notified about your decision."
                : "Your request has been submitted and is pending approval."}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">
          {/* Date Display with badge */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Selected Date:</p>
              <p className="text-lg text-blue-600 font-semibold">
                {formattedDate}
              </p>
            </div>
            {getDayStatusBadge()}
          </div>

          {/* Status Information (if exists) */}
          {dayData && dayData.dayOffRequested && (
            <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 shadow-sm">
              <h4 className="font-medium mb-2 text-yellow-700 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Day Off Request Status
              </h4>
              <div
                className={`p-4 rounded-md ${
                  dayData.approved === false
                    ? "bg-yellow-100 border-l-4 border-yellow-400"
                    : "bg-green-100 border-l-4 border-green-400"
                }`}
              >
                <p
                  className={`font-medium ${
                    dayData.approved === false
                      ? "text-yellow-700"
                      : "text-green-700"
                  }`}
                >
                  {dayData.approved === false
                    ? "Your request is pending approval"
                    : "Your request has been approved"}
                </p>
                {dayData.reason && (
                  <p className="mt-2 text-gray-600 border-l-2 pl-3 border-gray-300">
                    <span className="font-medium">Reason:</span>{" "}
                    {dayData.reason}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {dayData.approved === false
                    ? "Please wait for your manager to review your request."
                    : "Your day off has been approved and recorded in the system."}
                </p>
              </div>
            </div>
          )}

          {dayData &&
            Object.keys(dayData).length > 0 &&
            !dayData.dayOffRequested && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-medium mb-2 text-gray-700 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Day Status
                </h4>
                <ul className="text-sm space-y-1">
                  {dayData.clockIn && (
                    <li className="text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Clock in:{" "}
                      <span className="font-medium ml-1">
                        {new Date(dayData.clockIn).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </li>
                  )}
                  {dayData.clockOut && (
                    <li className="text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Clock out:{" "}
                      <span className="font-medium ml-1">
                        {new Date(dayData.clockOut).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </li>
                  )}
                  {dayData.isLate && (
                    <li className="text-red-600 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Late arrival
                    </li>
                  )}
                  {dayData.isEarly && (
                    <li className="text-red-600 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Early departure
                    </li>
                  )}
                  {dayData.hasOvertime && (
                    <li className="text-orange-600 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      Overtime
                    </li>
                  )}
                </ul>
              </div>
            )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Request Form (for regular users) */}
          {!isAdmin && !dayData.dayOffRequested && (
            <div className="mb-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 text-sm text-blue-700">
                <p className="font-medium">
                  Request time off for {formattedDate}
                </p>
                <p className="mt-1">
                  Please provide a reason for your request below.
                </p>
              </div>

              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for Day Off <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Examples: Personal leave, Medical appointment, Family event, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors shadow-sm"
                rows={3}
                disabled={isLoading}
              ></textarea>
            </div>
          )}

          {/* Admin Actions */}
          {isAdmin && dayData.dayOffRequested && dayData.approved === false && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-gray-700">Admin Actions</h4>

              {/* Employee info */}
              <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 p-2 rounded-full mr-2">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {dayData.employeeName || "Employee"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dayData.employeeId}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 border-l-2 border-gray-300 pl-2">
                  <span className="font-medium">Reason:</span>{" "}
                  {dayData.reason || "No reason provided"}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <X className="h-4 w-4 mr-1 inline-block" />
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors mr-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          >
            Cancel
          </button>

          {!isAdmin && !dayData.dayOffRequested && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayOffRequestModal;
