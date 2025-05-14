import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Clock4,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Maximize,
  Minimize,
} from "lucide-react";
import { statusColors, formatTime } from "../../../utils/calendarStyles";

const AttendanceTimeline = ({
  daysToDisplay,
  attendanceData,
  formatDateLabel,
  getStatusSegments,
  getTimePosition,
  getTimeRangeWidth,
  getStatusColor,
  holidays,
  onDayClick,
  className = "",
}) => {
  // State for tooltip
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // State for expanded view
  const [isExpanded, setIsExpanded] = useState(true);

  // State for animation
  const [isAnimating, setIsAnimating] = useState(false);

  // Current time marker ref
  const [currentTimeMarker, setCurrentTimeMarker] = useState(null);

  // Time columns for the timeline - from 8:00 to 20:00
  const timeColumns = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`);

  // Current time position effect
  useEffect(() => {
    // Update current time marker position every minute
    const updateMarker = () => {
      setCurrentTimeMarker(new Date());
    };

    // Initial update
    updateMarker();

    // Set interval for updates
    const interval = setInterval(updateMarker, 60000);

    return () => clearInterval(interval);
  }, []);

  // Animate on first render
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Show tooltip
  const showTooltip = (event, content) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setTooltip({
      visible: true,
      content: content,
      x: x,
      y: y,
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
        return <Clock4 className="h-4 w-4" />;
      case "working":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-6 ${className} transition-all duration-300 ease-in-out`}
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Attendance Timeline</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 hidden sm:inline-block">
            <span>Click on any day to request time off or view details</span>
          </div>
          <div className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <HelpCircle size={16} />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
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
                  } hover:bg-gray-50 transition-colors cursor-pointer transform ${
                    isAnimating
                      ? "transition-transform duration-300 ease-out"
                      : ""
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    transform: isAnimating
                      ? `translateX(${(1 - index * 0.1) * 20}px)`
                      : "translateX(0)",
                    opacity: isAnimating ? 0.8 : 1,
                  }}
                  onClick={() => onDayClick && onDayClick(day)}
                >
                  <div
                    className={`min-w-[180px] font-medium px-3 ${
                      status ? statusColors[status].text : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {isToday && (
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                      )}
                      {formatDateLabel(day)}
                      {status && (
                        <span
                          className={`ml-2 ${statusColors[status].text}`}
                          title={
                            status.charAt(0).toUpperCase() + status.slice(1)
                          }
                        >
                          {getStatusIcon(status)}
                        </span>
                      )}
                    </div>
                    {isHoliday && (
                      <span
                        className={`text-xs italic ${statusColors.holiday.text}`}
                      >
                        {holidays[dateKey]?.description || "Weekend"}
                      </span>
                    )}
                    {dayData.clockIn && (
                      <div className="text-xs mt-1 bg-gray-50 px-2 py-1 rounded inline-block shadow-sm">
                        {formatTime(dayData.clockIn)}
                        {dayData.clockOut &&
                          ` - ${formatTime(dayData.clockOut)}`}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 relative h-10 bg-gray-100 rounded-md overflow-hidden shadow-inner">
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
                        )} rounded-sm transition-all duration-200 hover:opacity-100 ${
                          isAnimating ? "scale-x-0" : "scale-x-100"
                        }`}
                        style={{
                          left: `${getTimePosition(segment.start)}%`,
                          width: `${getTimeRangeWidth(
                            segment.start,
                            segment.end
                          )}%`,
                          opacity: 0.85,
                          transformOrigin: "left",
                          transition: `transform 500ms ${
                            sIndex * 150
                          }ms ease-out, opacity 300ms ease-in-out`,
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
                    {isToday && currentTimeMarker && (
                      <div
                        className="absolute h-full w-0.5 bg-red-500 z-10 shadow-md"
                        style={{
                          left: `${getTimePosition(
                            `${currentTimeMarker.getHours()}:${currentTimeMarker.getMinutes()}`
                          )}%`,
                        }}
                        onMouseEnter={(e) => showTooltip(e, "Current time")}
                        onMouseLeave={hideTooltip}
                      >
                        <div className="absolute -top-1 -ml-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
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
      )}

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed bg-gray-900 text-white p-2 rounded text-sm z-50 pointer-events-none shadow-lg"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 30}px`,
            transform: "translateX(-50%)",
            maxWidth: "300px",
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div
        className={`p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 transition-all duration-300 opacity-100 max-h-96`}
      >
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusColors).map(([type, colors]) => {
            // Skip types with underscore for legend display
            if (type.includes("_")) return null;

            return (
              <div key={type} className="flex items-center">
                <div
                  className={`w-4 h-4 rounded ${colors.bg} mr-1 shadow-sm`}
                ></div>
                <span className="text-xs capitalize">
                  {type.replace("-", " ")}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-gray-500 border-t border-gray-200 pt-2">
          <p>
            <strong>Hours:</strong> Standard work day is 09:00 - 17:00. Early
            arrivals before 09:00 are tracked. Late arrivals after 09:15 are
            marked as late. Departures before 17:00 are early. Work after 17:00
            is overtime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTimeline;
