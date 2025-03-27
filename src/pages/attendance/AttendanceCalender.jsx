import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";

// Firebase configuration - Replace with your own config
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState(null);
  const [isClockIn, setIsClockIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [tooltipData, setTooltipData] = useState(null);

  // Stats object
  const [stats, setStats] = useState({
    dayOff: 0,
    lateClockIn: 0,
    earlyClockOut: 0,
    overTime: 0,
    absent: 0,
  });

  // Reset startDate to first day of month when currentDate changes
  useEffect(() => {
    const isCurrentMonth =
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth();
    const newStartDate = isCurrentMonth
      ? today
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    setStartDate(newStartDate);
  }, [currentDate]);

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
      fetchAttendanceData(storedEmployeeId, currentDate);
    } else {
      setIsLoading(false);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        if (isClockIn) {
          handleClockOut(true);
        }
      }
    };
  }, [currentDate]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        // Move back one day
        setStartDate((prev) => {
          const newDate = new Date(prev);
          newDate.setDate(prev.getDate() + 1);
          return newDate;
        });
      } else if (event.key === "ArrowDown") {
        // Move forward one day
        setStartDate((prev) => {
          const newDate = new Date(prev);
          newDate.setDate(prev.getDate() - 1);
          return newDate;
        });
      } else if (event.key === "Home") {
        // Go to first day of month
        const firstDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        setStartDate(firstDay);
      } else if (event.key === "End") {
        // Go to last day of month
        const lastDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        setStartDate(lastDay);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentDate]);

  const fetchAttendanceData = async (empId, date) => {
    try {
      setIsLoading(true);

      // Get first and last day of month
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Format to ISO for query
      const startDate = firstDay.toISOString().split("T")[0];
      const endDate = lastDay.toISOString().split("T")[0];

      // Mock data for development (replace with your actual Firebase query)
      const mockData = generateMockData(empId, year, month);
      processMockData(mockData, year, month);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data: ", error);
      setIsLoading(false);
    }
  };

  // Generate mock data for development/testing
  const generateMockData = (empId, year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const dateKey = date.toISOString().split("T")[0];

      if (isWeekend) {
        data[dateKey] = {
          status: "holiday",
          isHoliday: true,
        };
        continue;
      }

      // Random status for sample data
      const randomStatus = Math.random();
      if (randomStatus < 0.1) {
        data[dateKey] = { status: "absent" };
      } else if (randomStatus < 0.2) {
        data[dateKey] = {
          status: "present",
          dayOffRequested: true,
        };
      } else {
        const clockIn = new Date(
          year,
          month,
          day,
          randomStatus < 0.3
            ? 9 + Math.floor(Math.random() * 2)
            : 8 + Math.floor(Math.random() * 2),
          Math.floor(Math.random() * 60)
        );

        let clockOut;
        if (randomStatus < 0.4) {
          // Early leave
          clockOut = new Date(
            year,
            month,
            day,
            15 + Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 60)
          );
        } else if (randomStatus < 0.6) {
          // Overtime
          clockOut = new Date(
            year,
            month,
            day,
            17 + Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 60)
          );
        } else {
          // Normal
          clockOut = new Date(
            year,
            month,
            day,
            17,
            Math.floor(Math.random() * 30)
          );
        }

        data[dateKey] = {
          status: "present",
          clockIn: clockIn,
          clockOut: clockOut,
          isLate: clockIn.getHours() * 60 + clockIn.getMinutes() > 9 * 60,
          isEarly: clockOut.getHours() * 60 + clockOut.getMinutes() < 17 * 60,
          hasOvertime: clockOut.getHours() >= 17 && clockOut.getMinutes() > 0,
        };
      }
    }

    return data;
  };

  // Process attendance data and calculate stats
  const processMockData = (data, year, month) => {
    const monthStats = {
      dayOff: 0,
      lateClockIn: 0,
      earlyClockOut: 0,
      overTime: 0,
      absent: 0,
    };

    // Count stats from the data
    Object.entries(data).forEach(([dateKey, dayData]) => {
      if (dayData.status === "absent") monthStats.absent++;
      if (dayData.isLate) monthStats.lateClockIn++;
      if (dayData.isEarly) monthStats.earlyClockOut++;
      if (dayData.hasOvertime) monthStats.overTime++;
      if (dayData.dayOffRequested || dayData.isHoliday) monthStats.dayOff++;
    });

    setAttendanceData(data);
    setStats(monthStats);

    // Check if clocked in today
    const todayKey = new Date().toISOString().split("T")[0];
    const todayData = data[todayKey];

    if (todayData && todayData.clockIn && !todayData.clockOut) {
      setIsClockIn(true);
      setStartTime(todayData.clockIn);
      const elapsedTime = Math.floor((new Date() - todayData.clockIn) / 1000);
      setTimer(elapsedTime);
      startTimer(elapsedTime);
    } else {
      setIsClockIn(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  const startTimer = (startValue = 0) => {
    setTimer(startValue);
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  const handleClockIn = async () => {
    if (!employeeId) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    try {
      // If using Firebase, uncomment this
      // await addDoc(collection(db, "attendance"), {
      //   employeeId: employeeId,
      //   date: now.toISOString(),
      //   clockInTime: now.toISOString(),
      //   status: "present",
      // });

      setStartTime(now);
      setIsClockIn(true);
      startTimer();

      // Update local data
      setAttendanceData((prev) => ({
        ...prev,
        [today]: {
          ...prev[today],
          status: "present",
          clockIn: now,
          isLate: now.getHours() * 60 + now.getMinutes() > 9 * 60,
        },
      }));

      // Update stats if needed
      if (now.getHours() * 60 + now.getMinutes() > 9 * 60) {
        setStats((prev) => ({
          ...prev,
          lateClockIn: prev.lateClockIn + 1,
        }));
      }
    } catch (error) {
      console.error("Error adding clock in record: ", error);
    }
  };

  const handleClockOut = async (isAutoLogout = false) => {
    if (!employeeId || !isClockIn || !startTime) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    try {
      // If using Firebase, uncomment this
      // const attendanceRef = collection(db, "attendance");
      // const q = query(
      //   attendanceRef,
      //   where("employeeId", "==", employeeId),
      //   where("clockInTime", "==", startTime.toISOString())
      // );
      // const querySnapshot = await getDocs(q);
      // if (!querySnapshot.empty) {
      //   const docRef = querySnapshot.docs[0].ref;
      //   await updateDoc(docRef, {
      //     clockOutTime: now.toISOString(),
      //     duration: Math.floor((now - startTime) / 1000),
      //     autoLogout: isAutoLogout,
      //   });
      // }

      setIsClockIn(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      // Update local data
      setAttendanceData((prev) => ({
        ...prev,
        [today]: {
          ...prev[today],
          clockOut: now,
          isEarly: now.getHours() * 60 + now.getMinutes() < 17 * 60,
          hasOvertime: now.getHours() >= 17,
        },
      }));

      // Update stats if needed
      const statsUpdate = {};
      if (now.getHours() * 60 + now.getMinutes() < 17 * 60) {
        statsUpdate.earlyClockOut = stats.earlyClockOut + 1;
      }
      if (now.getHours() >= 17) {
        statsUpdate.overTime = stats.overTime + 1;
      }

      if (Object.keys(statsUpdate).length > 0) {
        setStats((prev) => ({
          ...prev,
          ...statsUpdate,
        }));
      }
    } catch (error) {
      console.error("Error adding clock out record: ", error);
    }
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const formatTimeString = (date) => {
    if (!date) return "-";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDurationString = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return "-";

    const diffMs = clockOut - clockIn;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs.toString().padStart(2, "0")}h:${diffMins
      .toString()
      .padStart(2, "0")}m`;
  };

  // Change month handler
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Generate days to display - Modified to display days in proper chronological order
  const generateDaysToDisplay = () => {
    const daysToShow = [];

    // Display up to 8 days starting from the startDate
    for (let i = 0; i < 8; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);

      // Ensure we're only showing days within the current month
      if (day.getMonth() === currentDate.getMonth()) {
        daysToShow.push(day);
      }

      // Stop if we reach end of month
      if (day.getMonth() !== currentDate.getMonth()) {
        break;
      }
    }

    return daysToShow;
  };

  // Navigate to next/previous page of days
  const changeDaysPage = (direction) => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + direction * 7);

      // Ensure we stay within the current month
      if (newDate.getMonth() !== currentDate.getMonth()) {
        if (direction > 0) {
          // If moving forward, set to last day of month
          return new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          );
        } else {
          // If moving backward, set to first day of month
          return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        }
      }

      return newDate;
    });
  };

  // Format date for display
  const formatDateLabel = (date) => {
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    return `${date.toLocaleString("default", {
      weekday: "long",
    })}, ${date.getDate()}`;
  };

  // Get status segments for a specific day
  const getStatusSegments = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    const dayData = attendanceData[dateKey] || {};
    const segments = [];

    // Check if weekend/holiday
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend || dayData.isHoliday) {
      segments.push({
        type: "holiday",
        start: "09:00",
        end: "17:00",
        label: "Holiday",
        fullLabel: "Weekend Or Holiday - Not A Working Day",
      });
      return segments;
    }

    // Check if requested day off
    if (dayData.dayOffRequested) {
      segments.push({
        type: "dayoff",
        start: "09:00",
        end: "17:00",
        label: "Requested Day Off",
        fullLabel: "Employee Requested A Day Off",
      });
      return segments;
    }

    // If no clock in data
    if (!dayData.clockIn) {
      // If date is in the past and no data, mark as absent
      if (date < new Date().setHours(0, 0, 0, 0)) {
        segments.push({
          type: "absent",
          start: "09:00",
          end: "17:00",
          label: "Absent",
          fullLabel: "Employee Was Absent On This Day",
        });
      }
      return segments;
    }

    // Process clock in/out data
    const clockInTime = dayData.clockIn;
    const clockOutTime = dayData.clockOut;

    const clockInHour = clockInTime.getHours();
    const clockInMinute = clockInTime.getMinutes();
    const clockInStr = `${clockInHour
      .toString()
      .padStart(2, "0")}:${clockInMinute.toString().padStart(2, "0")}`;

    let clockOutStr = "17:00";
    if (clockOutTime) {
      const clockOutHour = clockOutTime.getHours();
      const clockOutMinute = clockOutTime.getMinutes();
      clockOutStr = `${clockOutHour
        .toString()
        .padStart(2, "0")}:${clockOutMinute.toString().padStart(2, "0")}`;
    }

    // Check for early arrival (new addition)
    if (clockInHour < 9 || (clockInHour === 9 && clockInMinute === 0)) {
      segments.push({
        type: "early-arrival",
        start: clockInStr,
        end: "09:00",
        label: "Early",
        fullLabel: `Employee arrived early at ${clockInStr} (Regular hours start: 09:00)`,
      });

      // For early arrivals, adjust the working hours start time
      segments.push({
        type: "working",
        start: "09:00",
        end: dayData.isEarly && clockOutTime ? clockOutStr : "17:00",
        label: "Working time",
        fullLabel: `Regular working hours from 09:00 to ${
          dayData.isEarly && clockOutTime ? clockOutStr : "17:00"
        }`,
      });
    } else {
      // Check for late arrival
      if (dayData.isLate) {
        segments.push({
          type: "late",
          start: "09:00",
          end: clockInStr,
          label: "Late",
          fullLabel: `Employee arrived late at ${clockInStr} (Expected: 09:00)`,
        });
      }

      // Normal working hours (for on-time or late arrival)
      segments.push({
        type: "working",
        start: clockInStr,
        end: dayData.isEarly && clockOutTime ? clockOutStr : "17:00",
        label: "Working time",
        fullLabel: `Regular working hours from ${clockInStr} to ${
          dayData.isEarly && clockOutTime ? clockOutStr : "17:00"
        }`,
      });
    }

    // Early departure
    if (dayData.isEarly && clockOutTime) {
      segments.push({
        type: "early",
        start: clockOutStr,
        end: "17:00",
        label: "Early",
        fullLabel: `Employee left early at ${clockOutStr} (Expected: 17:00)`,
      });
    }

    // Overtime
    if (dayData.hasOvertime && clockOutTime) {
      segments.push({
        type: "overtime",
        start: "17:00",
        end: clockOutStr,
        label: "Over time",
        fullLabel: `Employee worked overtime until ${clockOutStr} (Regular hours end: 17:00)`,
      });
    }

    return segments;
  };

  // Time slot markers
  const renderTimeSlots = () => {
    return (
      <div className="grid grid-cols-12 w-full text-xs text-gray-500">
        {Array.from({ length: 12 }, (_, i) => {
          const hour = i + 8;
          return (
            <div key={hour} className="text-center">
              {hour}:00
            </div>
          );
        })}
      </div>
    );
  };

  // Handle mouse enter for tooltip
  const handleSegmentMouseEnter = (event, segmentData) => {
    setTooltipData({
      text: segmentData.fullLabel,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // Handle mouse leave for tooltip
  const handleSegmentMouseLeave = () => {
    setTooltipData(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700">Loading your attendance data...</p>
      </div>
    );
  }

  // Calculate time column positions - FIXED
  const getTimePosition = (timeStr) => {
    if (!timeStr || timeStr === "-") return 0;

    const [hours, minutes] = timeStr.split(":").map(Number);
    // Scale starts at 8:00 (0%) and ends at 20:00 (100%)
    const totalMinutes = hours * 60 + minutes - 8 * 60;
    const totalPeriod = 11 * 60; // 11 hours in minutes (8:00 to 19:00)

    return (totalMinutes / totalPeriod) * 100;
  };

  // Fixed width calculation
  const getTimeRangeWidth = (start, end) => {
    if (!start || !end || start === "-" || end === "-") return 0;

    const startPos = getTimePosition(start);
    const endPos = getTimePosition(end);

    // Ensure width is never negative and cap at 100%
    return Math.min(100, Math.max(0, endPos - startPos));
  };

  // Get color class based on status type
  const getStatusColor = (type) => {
    switch (type) {
      case "working":
        return "bg-green-500"; // #00B087
      case "overtime":
        return "bg-orange-500"; // #FF8300
      case "late":
        return "bg-red-500"; // #E54C0B
      case "early":
        return "bg-red-500"; // #E54C0B
      case "dayoff":
        return "bg-yellow-400"; // #FCDA45
      case "holiday":
        return "bg-yellow-400"; // #FCDA45
      case "absent":
        return "bg-gray-400";
      default:
        return "bg-gray-200";
    }
  };

  // Check if there are more days to show
  const hasMoreDays = () => {
    if (daysToDisplay.length === 0) return false;

    const lastVisibleDay = daysToDisplay[daysToDisplay.length - 1];
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    return lastVisibleDay.getDate() < lastDayOfMonth.getDate();
  };

  // Check if there are previous days to show
  const hasPreviousDays = () => {
    if (daysToDisplay.length === 0) return false;

    const firstVisibleDay = daysToDisplay[0];
    return firstVisibleDay.getDate() > 1;
  };

  // Generate days to display based on current month
  const daysToDisplay = generateDaysToDisplay();

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      {/* Header with Month Navigation */}
      <div className="flex justify-center items-center mb-6 relative">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="hover:bg-gray-100 rounded-full p-1"
          >
            <ChevronLeft size={20} />
          </button>
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold">
            {formatMonthYear(currentDate)}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="hover:bg-gray-100 rounded-full p-1"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-between items-center mb-4 text-center border-b border-gray-300">
        <div className="flex-1">
          <div className="font-medium text-sm">Day Off</div>
          <div className="text-lg font-semibold">{stats.dayOff}</div>
        </div>
        <div className="flex-1 py-2 border-l-2 border-gray-200">
          <div className="font-medium text-sm">Late Clock-in</div>
          <div className="text-lg font-semibold">{stats.lateClockIn}</div>
        </div>
        <div className="flex-1 py-2 border-l-2 border-gray-200">
          <div className="font-medium text-sm">Early Clock-out</div>
          <div className="text-lg font-semibold">{stats.earlyClockOut}</div>
        </div>
        <div className="flex-1 py-2 border-l-2 border-gray-200">
          <div className="font-medium text-sm">Over time</div>
          <div className="text-lg font-semibold">{stats.overTime}</div>
        </div>
        <div className="flex-1 py-2 border-l-2 border-gray-200">
          <div className="font-medium text-sm">Absent</div>
          <div className="text-lg font-semibold">{stats.absent}</div>
        </div>
      </div>

      {/* Days navigation buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeDaysPage(-1)}
          disabled={!hasPreviousDays()}
          className={`px-3 py-1 rounded ${
            hasPreviousDays()
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          Previous Week
        </button>
        <button
          onClick={() => {
            // Reset to first day of month
            setStartDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            );
          }}
          className="px-3 py-1 rounded bg-gray-100 text-gray-700"
        >
          First Day
        </button>
        <button
          onClick={() => changeDaysPage(1)}
          disabled={!hasMoreDays()}
          className={`px-3 py-1 rounded ${
            hasMoreDays()
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          Next Week
        </button>
      </div>

      {/* Attendance Timeline - Dynamic Days */}
      <div className="space-y-6">
        {daysToDisplay.map((date, index) => {
          const dateKey = date.toISOString().split("T")[0];
          const dayData = attendanceData[dateKey] || {};
          const segments = getStatusSegments(date);

          return (
            <div key={index} className="mb-4">
              <div className="font-medium mb-1">{formatDateLabel(date)}</div>

              <div className="grid grid-cols-[80px_1fr_80px_80px] gap-2 text-xs">
                <div className="text-gray-600">Clock-in</div>
                <div className="flex gap-2 items-center">
                  {renderTimeSlots()}
                </div>
                <div className="text-gray-600 text-right">Clock-out</div>
                <div className="text-gray-600 text-right">Duration</div>
              </div>

              <div className="grid grid-cols-[80px_1fr_80px_80px] gap-2 items-center">
                <div>
                  {dayData.clockIn
                    ? formatTimeString(dayData.clockIn)
                    : dayData.status === "absent"
                    ? "Absent"
                    : "-"}
                </div>

                <div className="relative h-8 bg-gray-200 rounded overflow-hidden">
                  {segments.map((status, idx) => {
                    const startPosition = getTimePosition(status.start);
                    const width = getTimeRangeWidth(status.start, status.end);

                    return (
                      <div
                        key={idx}
                        className={`absolute top-0 h-full ${getStatusColor(
                          status.type
                        )} rounded flex items-center`}
                        style={{
                          left: `${startPosition}%`,
                          width: `${width}%`,
                          minWidth: "30px", // Ensure visibility
                          zIndex: idx + 1,
                        }}
                      >
                        <span className="text-xs text-white ml-2 truncate">
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-right">
                  {dayData.clockOut ? formatTimeString(dayData.clockOut) : "-"}
                </div>

                <div className="text-right">
                  {dayData.clockIn && dayData.clockOut
                    ? formatDurationString(dayData.clockIn, dayData.clockOut)
                    : "-"}
                </div>
              </div>
            </div>
          );
        })}

        {daysToDisplay.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No days to display for this month
          </div>
        )}
      </div>

      {/* Clock In/Out Button (Only for today) */}
      {new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear() && (
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Today's Status</h3>
                {isClockIn ? (
                  <p className="text-sm text-green-600">
                    Currently clocked in: {formatTime(timer)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Not clocked in</p>
                )}
              </div>
              <div>
                {isClockIn ? (
                  <button
                    onClick={() => handleClockOut()}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Clock Out
                  </button>
                ) : (
                  <button
                    onClick={handleClockIn}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Clock In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AttendanceCalendar;
