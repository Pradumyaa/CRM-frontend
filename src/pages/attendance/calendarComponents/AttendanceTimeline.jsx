import React, { useState } from "react";
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";
import { statusColors, formatTime } from "@/utils/calendarStyles";

const AttendanceTimeline = ({
  daysToDisplay,
  attendanceData,
  formatDateLabel,
  getStatusSegments,
  getTimePosition,
  getTimeRangeWidth,
  getStatusColor,
  holidays,
}) => {
  // State for tooltip
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // Time columns for the timeline - from 8:00 to 20:00
  const timeColumns = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`);

  // Show tooltip
  const showTooltip = (event, content) => {
    setTooltip({
      visible: true,
      content: content,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // Hide tooltip
  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // Get day status for styling the left column
  const getDayStatus = (day) => {
    const dateKey = day.toISOString().split("T")[0];
    const dayData = attendanceData[dateKey] || {};

    // Check if holiday
    if (holidays[dateKey] || day.getDay() === 0 || day.getDay() === 6) {
      return "holiday";
    }

    // Check if day off requested
    if (dayData.dayOffRequested) {
      return "dayoff";
    }

    // Check if absent
    if (dayData.status === "absent") {
      return "absent";
    }

    // Check if late
    if (dayData.isLate) {
      return "late";
    }

    // Check if early departure
    if (dayData.isEarly) {
      return "early";
    }

    // Check if overtime
    if (dayData.hasOvertime) {
      return "overtime";
    }

    // Default - if clocked in and out
    if (dayData.clockIn && dayData.clockOut) {
      return "working";
    }

    // If currently clocked in
    if (dayData.clockIn && !dayData.clockOut) {
      return "working";
    }

    return "";
  };

  // Map status to icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "holiday":
        return <Calendar className="h-4 w-4" />;
      case "dayoff":
        return <Calendar className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      case "late":
        return <AlertTriangle className="h-4 w-4" />;
      case "early":
        return <Clock className="h-4 w-4" />;
      case "overtime":
        return <Clock className="h-4 w-4" />;
      case "working":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Attendance Timeline</span>
        </h3>
      </div>

      <div className="p-4 overflow-x-auto">
        {/* Time header */}
        <div className="relative flex border-b border-gray-200 mb-4 pb-2">
          <div className="min-w-[180px]"></div>
          <div className="flex-1 relative">
            {timeColumns.map((time, index) => (
              <div
                key={index}
                className="absolute text-xs text-gray-500 font-medium"
                style={{ left: `${(index / 12) * 100}%` }}
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Days and timeline */}
        {daysToDisplay.length > 0 ? (
          daysToDisplay.map((day, index) => {
            const dateKey = day.toISOString().split("T")[0];
            const dayData = attendanceData[dateKey] || {};
            const isHoliday =
              holidays[dateKey] !== undefined ||
              day.getDay() === 0 ||
              day.getDay() === 6;
            const segments = getStatusSegments(day);
            const status = getDayStatus(day);
            const isToday = new Date().toDateString() === day.toDateString();

            return (
              <div
                key={index}
                className={`flex items-center py-3 ${
                  isToday ? "bg-blue-50" : ""
                } ${
                  index !== daysToDisplay.length - 1
                    ? "border-b border-gray-200"
                    : ""
                } hover:bg-gray-50 transition-colors`}
              >
                <div
                  className={`min-w-[180px] font-medium px-3 ${
                    status ? statusColors[status].text : ""
                  }`}
                >
                  <div className="flex items-center">
                    {isToday && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    )}
                    {formatDateLabel(day)}
                    {status && (
                      <span
                        className={`ml-2 ${statusColors[status].text}`}
                        title={status.charAt(0).toUpperCase() + status.slice(1)}
                      >
                        {getStatusIcon(status)}
                      </span>
                    )}
                  </div>
                  {isHoliday && (
                    <span
                      className={`text-xs italic ${statusColors.holiday.text}`}
                    >
                      {holidays[dateKey] || "Weekend"}
                    </span>
                  )}
                  {dayData.clockIn && (
                    <div className="text-xs mt-1 bg-gray-50 px-2 py-1 rounded inline-block">
                      {formatTime(dayData.clockIn)}
                      {dayData.clockOut && `- ${formatTime(dayData.clockOut)}`}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative h-10 bg-gray-100 rounded overflow-hidden">
                  {/* Workday time blocks 9:00 - 17:00 (standard work hours) */}
                  <div
                    className="absolute h-full bg-gray-50 border-l border-r border-gray-200"
                    style={{
                      left: `${getTimePosition("09:00")}%`,
                      width: `${getTimeRangeWidth("09:00", "17:00")}%`,
                    }}
                  ></div>

                  {/* Status segments */}
                  {segments.map((segment, sIndex) => (
                    <div
                      key={sIndex}
                      className={`absolute h-full ${getStatusColor(
                        segment.type
                      )} rounded-sm transition-opacity hover:opacity-100 cursor-help`}
                      style={{
                        left: `${getTimePosition(segment.start)}%`,
                        width: `${getTimeRangeWidth(
                          segment.start,
                          segment.end
                        )}%`,
                        opacity: 0.85,
                      }}
                      onMouseEnter={(e) => showTooltip(e, segment.fullLabel)}
                      onMouseLeave={hideTooltip}
                    >
                      {getTimeRangeWidth(segment.start, segment.end) > 10 && (
                        <span
                          className="text-xs text-white mx-2 whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ lineHeight: "2.5rem" }}
                        >
                          {segment.label}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Current time indicator */}
                  {new Date().toDateString() === day.toDateString() && (
                    <div
                      className="absolute h-full w-0.5 bg-red-500 z-10"
                      style={{
                        left: `${getTimePosition(
                          `${new Date().getHours()}:${new Date().getMinutes()}`
                        )}%`,
                      }}
                      onMouseEnter={(e) => showTooltip(e, "Current time")}
                      onMouseLeave={hideTooltip}
                    ></div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-gray-500">
            <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No days to display for the selected month.</p>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed bg-gray-900 text-white p-2 rounded text-sm z-50 pointer-events-none shadow-lg"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            maxWidth: "300px",
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusColors).map(([type, colors]) => (
            <div key={type} className="flex items-center">
              <div className={`w-4 h-4 rounded ${colors.bg} mr-1`}></div>
              <span className="text-xs capitalize">
                {type.replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTimeline;
