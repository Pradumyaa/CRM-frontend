import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  Maximize,
  Minimize,
} from "lucide-react";
import { formatTimeWithSeconds } from "../../../utils/calendarStyles";

const ClockInOutSection = ({
  isClockIn,
  timer,
  isTodayCompleted,
  handleClockIn,
  handleClockOut,
  clockInLoading,
  clockOutLoading,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(true);
  const [timerAnimation, setTimerAnimation] = useState(false);

  // Animate timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (isClockIn) {
        setTimerAnimation(true);
        setTimeout(() => setTimerAnimation(false), 1000);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isClockIn]);

  // Calculate if it's early, normal, or late time
  const getCurrentTimeStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Convert to minutes since midnight
    const totalMinutes = hours * 60 + minutes;

    // Early arrival (before 9:00 AM)
    if (totalMinutes < 9 * 60) {
      return {
        status: "early",
        message: "Early arrival! Your workday officially begins at 9:00 AM.",
        icon: <CheckCircle className="text-green-500" size={24} />,
        className: "bg-green-50 border-green-200 text-green-700",
      };
    }

    // Late arrival (after 9:15 AM)
    if (totalMinutes > 9 * 60 + 15) {
      return {
        status: "late",
        message: "You're checking in after the expected start time (9:00 AM).",
        icon: <AlertTriangle className="text-yellow-500" size={24} />,
        className: "bg-yellow-50 border-yellow-200 text-yellow-700",
      };
    }

    // On time
    return {
      status: "ontime",
      message: "You're right on time! Have a productive day.",
      icon: <CheckCircle className="text-blue-500" size={24} />,
      className: "bg-blue-50 border-blue-200 text-blue-700",
    };
  };

  const timeStatus = !isClockIn ? getCurrentTimeStatus() : null;

  // Calculate elapsed hours and minutes for displaying work progress
  const elapsedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
  };

  // Calculate progress percentage (8-hour workday)
  const progressPercentage = Math.min(100, (timer / (8 * 3600)) * 100);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-6 transition-all duration-300 ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <Clock className="mr-2" size={20} /> Today's Attendance
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="p-6">
          {isTodayCompleted() ? (
            <div className="text-center p-4 animate-fade-in">
              <div className="inline-flex p-4 rounded-full bg-green-100 mb-4 shadow-inner">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <div className="text-xl font-medium text-green-600 mb-2">
                Workday Completed
              </div>
              <div className="text-sm text-gray-600 max-w-md mx-auto">
                You've successfully completed your work day. Your attendance has
                been recorded.
              </div>
            </div>
          ) : (
            <>
              {isClockIn ? (
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 inline-block border border-blue-100 shadow-md w-full max-w-md">
                      <div className="flex items-center mb-2">
                        <Timer size={24} className="text-blue-600 mr-2" />
                        <div className="text-blue-600 font-medium">
                          Time Elapsed
                        </div>
                      </div>
                      <div
                        className={`text-4xl font-bold font-mono text-blue-700 text-center mb-3 ${
                          timerAnimation ? "animate-pulse" : ""
                        }`}
                      >
                        {formatTimeWithSeconds(timer)}
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Start</span>
                        <span>{progressPercentage.toFixed(0)}% complete</span>
                        <span>8 hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-gray-600 text-sm mb-6">
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">Clock-in time:</span>{" "}
                          <span className="text-blue-600">
                            {new Date(
                              Date.now() - timer * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div>
                          <span className="font-medium">Working:</span>{" "}
                          <span className="text-indigo-600">
                            {elapsedTime.hours}h {elapsedTime.minutes}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  {timeStatus && (
                    <div
                      className={`flex items-start p-4 rounded-lg border mb-6 transition-all ${timeStatus.className}`}
                    >
                      <div className="mr-3 mt-0.5 flex-shrink-0">
                        {timeStatus.icon}
                      </div>
                      <div>
                        <p>{timeStatus.message}</p>
                      </div>
                    </div>
                  )}
                  <div className="text-center text-gray-600 py-4 animate-fade-in">
                    <Clock
                      size={64}
                      className="mx-auto mb-3 text-blue-400 animate-pulse"
                    />
                    <p className="text-lg font-medium">
                      Ready to start your workday?
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click the button below to clock in
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleClockIn}
                  disabled={isClockIn || clockInLoading}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                    isClockIn || clockInLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  }`}
                >
                  {clockInLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Clock size={18} />
                      <span>Clock In</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleClockOut(false)}
                  disabled={!isClockIn || clockOutLoading}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                    !isClockIn || clockOutLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  }`}
                >
                  {clockOutLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} />
                      <span>Clock Out</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClockInOutSection;
