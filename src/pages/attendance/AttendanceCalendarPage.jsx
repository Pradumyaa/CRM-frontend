// AttendanceCalendarPage.jsx - Main component with improved UI and logic
import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import CalendarHeader from "./calendarComponents/CalendarHeader";
import StatsOverview from "./calendarComponents/StatsOverview";
import AttendanceTimeline from "./calendarComponents/AttendanceTimeline";
import ClockInOutSection from "./calendarComponents/ClockInOutSection";
import Spinner from "./calendarComponents/Spinner";
import DaysNavigation from "./calendarComponents/DaysNavigation";
import { fetchIndianHolidays } from "@/utils/holidayAPI";

// Constants for work hours - centralized for easy configuration
const WORK_HOURS = {
  START: {
    HOUR: 9,
    MINUTE: 0,
  },
  END: {
    HOUR: 17,
    MINUTE: 0,
  },
  // Grace period (in minutes) before marking late
  LATE_THRESHOLD: 15,
  // Minimum overtime minutes to record
  OVERTIME_THRESHOLD: 15,
  // Minimum early departure minutes to record
  EARLY_THRESHOLD: 15,
};

// Enhanced status colors with opacity variants for better UI
const statusColors = {
  working: {
    bg: "bg-green-500",
    text: "text-green-700",
    light: "bg-green-100",
  },
  overtime: {
    bg: "bg-orange-500",
    text: "text-orange-700",
    light: "bg-orange-100",
  },
  late: {
    bg: "bg-red-500",
    text: "text-red-700",
    light: "bg-red-100",
  },
  early: {
    bg: "bg-red-500",
    text: "text-red-700",
    light: "bg-red-100",
  },
  "early-arrival": {
    bg: "bg-blue-500",
    text: "text-blue-700",
    light: "bg-blue-100",
  },
  dayoff: {
    bg: "bg-yellow-500",
    text: "text-yellow-700",
    light: "bg-yellow-100",
  },
  holiday: {
    bg: "bg-purple-500",
    text: "text-purple-700",
    light: "bg-purple-100",
  },
  absent: {
    bg: "bg-gray-500",
    text: "text-gray-700",
    light: "bg-gray-100",
  },
};

// Helper function for tooltip content
const getTooltipContent = (type, clockIn, clockOut) => {
  switch (type) {
    case "working":
      return `Regular working hours from ${formatTime(clockIn)} to ${
        clockOut ? formatTime(clockOut) : "now"
      }`;
    case "overtime":
      return `Working overtime after regular hours (past ${
        WORK_HOURS.END.HOUR
      }:${String(WORK_HOURS.END.MINUTE).padStart(2, "0")})`;
    case "late":
      return `Late arrival at ${formatTime(clockIn)} (expected by ${
        WORK_HOURS.START.HOUR
      }:${String(WORK_HOURS.START.MINUTE).padStart(2, "0")})`;
    case "early":
      return `Left early at ${formatTime(clockOut)} (expected until ${
        WORK_HOURS.END.HOUR
      }:${String(WORK_HOURS.END.MINUTE).padStart(2, "0")})`;
    case "early-arrival":
      return `Arrived early at ${formatTime(clockIn)} (before ${
        WORK_HOURS.START.HOUR
      }:${String(WORK_HOURS.START.MINUTE).padStart(2, "0")})`;
    case "dayoff":
      return "Scheduled day off";
    case "holiday":
      return "Holiday or weekend";
    case "absent":
      return "Absent";
    default:
      return "No attendance data";
  }
};

// Helper function to format time
const formatTime = (date) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const AttendanceCalendarPage = () => {
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
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);
  const [holidays, setHolidays] = useState({});
  const [notificationMessage, setNotificationMessage] = useState(null);

  // Stats object with enhanced tracking metrics
  const [stats, setStats] = useState({
    dayOff: 0,
    lateClockIn: 0,
    earlyClockOut: 0,
    overTime: 0,
    absent: 0,
    perfectAttendance: 0,
    totalWorkHours: 0,
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

    // Fetch holidays for the current month and year
    fetchHolidays(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, today]);

  // Enhanced fetch holidays with better error handling
  const fetchHolidays = async (year, month) => {
    try {
      const holidayData = await fetchIndianHolidays(year, month);
      setHolidays(holidayData);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setNotificationMessage({
        type: "error",
        message:
          "Failed to fetch holidays. Using basic weekend detection only.",
      });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
      fetchAttendanceData(storedEmployeeId, currentDate);
    } else {
      setIsLoading(false);
      setNotificationMessage({
        type: "warning",
        message: "Employee ID not found. Please log in again.",
      });
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [currentDate]);

  // Auto clock-out check on component unmount (safety feature)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isClockIn) {
        handleClockOut(true); // Auto logout
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (isClockIn) {
        handleClockOut(true); // Safety auto-logout on component unmount
      }
    };
  }, [isClockIn]);

  // Enhanced keyboard navigation
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
      } else if (event.key === "c" && event.ctrlKey) {
        // Ctrl+C shortcut for clock in/out toggle
        if (isClockIn) {
          handleClockOut(false);
        } else {
          handleClockIn();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentDate, isClockIn]);

  // Improved fetch attendance data with better error handling
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

      console.log(
        `Fetching attendance for ${empId} from ${startDate} to ${endDate}`
      );

      // For demo purposes, generate mock data if API call fails
      try {
        const response = await fetch(
          `https://crm-backend-6gcl.onrender.com/api/calendar/attendance?employeeId=${empId}&startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch attendance data: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Received attendance data:", data);

        // Update state with the fetched data
        setAttendanceData(data.attendanceData || {});
        setStats(
          data.stats || {
            dayOff: 0,
            lateClockIn: 0,
            earlyClockOut: 0,
            overTime: 0,
            absent: 0,
            perfectAttendance: 0,
            totalWorkHours: 0,
          }
        );

        // Check if clocked in today
        const todayKey = new Date().toISOString().split("T")[0];
        const todayData = data.attendanceData?.[todayKey];

        if (todayData && todayData.clockIn && !todayData.clockOut) {
          setIsClockIn(true);
          setStartTime(new Date(todayData.clockIn));
          const elapsedTime = Math.floor(
            (new Date() - new Date(todayData.clockIn)) / 1000
          );
          setTimer(elapsedTime);
          startTimer(elapsedTime);
        } else {
          setIsClockIn(false);
          if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
          }
        }
      } catch (error) {
        console.error("API error, using mock data:", error);
        // Use mock data as fallback
        const mockData = generateMockData(empId, year, month);
        processMockData(mockData, year, month);

        setNotificationMessage({
          type: "info",
          message:
            "Using demo data for attendance visualization. In production, this would use real API data.",
        });

        // Clear notification after 5 seconds
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetch attendance:", error);
      setIsLoading(false);
      setNotificationMessage({
        type: "error",
        message: "Failed to load attendance data. Please try again.",
      });
    }
  };

  // Enhanced mock data generation with improved business logic
  const generateMockData = (empId, year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};

    let perfectDaysCount = 0;
    let totalMonthHours = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split("T")[0];

      // Skip future dates
      const now = new Date();
      if (date > now) {
        continue;
      }

      // Check if this day is a holiday in our holiday data
      const isHoliday = holidays[dateKey] !== undefined;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      if (isWeekend || isHoliday) {
        data[dateKey] = {
          status: "holiday",
          isHoliday: true,
          holidayName: isHoliday ? holidays[dateKey] : "Weekend",
        };
        continue;
      }

      // Today's data for testing
      const isToday = date.toDateString() === new Date().toDateString();
      if (isToday) {
        // Check if it's within working hours
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const workStartTotalMinutes =
          WORK_HOURS.START.HOUR * 60 + WORK_HOURS.START.MINUTE;
        const workEndTotalMinutes =
          WORK_HOURS.END.HOUR * 60 + WORK_HOURS.END.MINUTE;

        if (
          currentTotalMinutes >= workStartTotalMinutes &&
          currentTotalMinutes < workEndTotalMinutes
        ) {
          // During work hours, show as clocked in
          const clockInTime = new Date(
            year,
            month,
            day,
            currentTotalMinutes < workStartTotalMinutes + 30
              ? Math.max(8, WORK_HOURS.START.HOUR - 1)
              : WORK_HOURS.START.HOUR,
            currentTotalMinutes < workStartTotalMinutes + 30
              ? Math.floor(Math.random() * 60)
              : WORK_HOURS.START.MINUTE
          );

          const isLate =
            clockInTime.getHours() > WORK_HOURS.START.HOUR ||
            (clockInTime.getHours() === WORK_HOURS.START.HOUR &&
              clockInTime.getMinutes() >
                WORK_HOURS.START.MINUTE + WORK_HOURS.LATE_THRESHOLD);

          data[dateKey] = {
            status: "present",
            clockIn: clockInTime,
            isLate: isLate,
            earlyArrival:
              clockInTime.getHours() < WORK_HOURS.START.HOUR ||
              (clockInTime.getHours() === WORK_HOURS.START.HOUR &&
                clockInTime.getMinutes() < WORK_HOURS.START.MINUTE),
          };
        } else if (currentTotalMinutes >= workEndTotalMinutes) {
          // After work hours, show as completed day
          const clockInTime = new Date(
            year,
            month,
            day,
            Math.floor(Math.random() * 2) + (WORK_HOURS.START.HOUR - 1),
            Math.floor(Math.random() * 60)
          );

          const clockOutTime = new Date(
            year,
            month,
            day,
            WORK_HOURS.END.HOUR + Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 60)
          );

          const isLate =
            clockInTime.getHours() > WORK_HOURS.START.HOUR ||
            (clockInTime.getHours() === WORK_HOURS.START.HOUR &&
              clockInTime.getMinutes() >
                WORK_HOURS.START.MINUTE + WORK_HOURS.LATE_THRESHOLD);

          const hasOvertime =
            clockOutTime.getHours() > WORK_HOURS.END.HOUR ||
            (clockOutTime.getHours() === WORK_HOURS.END.HOUR &&
              clockOutTime.getMinutes() >
                WORK_HOURS.END.MINUTE + WORK_HOURS.OVERTIME_THRESHOLD);

          const workHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);
          totalMonthHours += workHours;

          if (!isLate && hasOvertime) {
            perfectDaysCount++;
          }

          data[dateKey] = {
            status: "present",
            clockIn: clockInTime,
            clockOut: clockOutTime,
            isLate: isLate,
            hasOvertime: hasOvertime,
            earlyArrival:
              clockInTime.getHours() < WORK_HOURS.START.HOUR ||
              (clockInTime.getHours() === WORK_HOURS.START.HOUR &&
                clockInTime.getMinutes() < WORK_HOURS.START.MINUTE),
            workHours: workHours,
          };
        } else {
          // Before work hours, show as not clocked in yet
          data[dateKey] = {
            status: "pending",
          };
        }
        continue;
      }

      // Random status for past days with weighted distribution for more realistic data
      const randomStatus = Math.random();
      if (randomStatus < 0.1) {
        // Absent
        data[dateKey] = { status: "absent" };
      } else if (randomStatus < 0.2) {
        // Requested day off
        data[dateKey] = {
          status: "present",
          dayOffRequested: true,
        };
      } else {
        // Present with various clock-in/out patterns
        // Generate realistic clock-in time
        let clockInHour, clockInMinute;
        if (randomStatus < 0.3) {
          // Late arrival
          clockInHour = WORK_HOURS.START.HOUR + (randomStatus < 0.15 ? 1 : 0);
          clockInMinute =
            WORK_HOURS.START.MINUTE + Math.floor(Math.random() * 45);
          if (clockInMinute >= 60) {
            clockInHour += 1;
            clockInMinute -= 60;
          }
        } else if (randomStatus < 0.6) {
          // Early arrival
          clockInHour = WORK_HOURS.START.HOUR - 1;
          clockInMinute = Math.floor(Math.random() * 60);
        } else {
          // On-time arrival
          clockInHour = WORK_HOURS.START.HOUR;
          clockInMinute = Math.floor(Math.random() * WORK_HOURS.LATE_THRESHOLD);
        }

        const clockIn = new Date(year, month, day, clockInHour, clockInMinute);

        // Generate realistic clock-out time
        let clockOutHour, clockOutMinute;
        if (randomStatus < 0.4) {
          // Early leave
          clockOutHour = WORK_HOURS.END.HOUR - (randomStatus < 0.25 ? 2 : 1);
          clockOutMinute = Math.floor(Math.random() * 60);
        } else if (randomStatus < 0.7) {
          // Overtime
          clockOutHour = WORK_HOURS.END.HOUR + (randomStatus < 0.55 ? 1 : 2);
          clockOutMinute = Math.floor(Math.random() * 60);
        } else {
          // Regular end time
          clockOutHour = WORK_HOURS.END.HOUR;
          clockOutMinute = Math.floor(Math.random() * 30);
        }

        const clockOut = new Date(
          year,
          month,
          day,
          clockOutHour,
          clockOutMinute
        );

        // Calculate work hours
        const workHours = (clockOut - clockIn) / (1000 * 60 * 60);
        totalMonthHours += workHours;

        const isLate =
          clockIn.getHours() > WORK_HOURS.START.HOUR ||
          (clockIn.getHours() === WORK_HOURS.START.HOUR &&
            clockIn.getMinutes() >
              WORK_HOURS.START.MINUTE + WORK_HOURS.LATE_THRESHOLD);

        const isEarly =
          clockOut.getHours() < WORK_HOURS.END.HOUR ||
          (clockOut.getHours() === WORK_HOURS.END.HOUR &&
            clockOut.getMinutes() <
              WORK_HOURS.END.MINUTE - WORK_HOURS.EARLY_THRESHOLD);

        const hasOvertime =
          clockOut.getHours() > WORK_HOURS.END.HOUR ||
          (clockOut.getHours() === WORK_HOURS.END.HOUR &&
            clockOut.getMinutes() >
              WORK_HOURS.END.MINUTE + WORK_HOURS.OVERTIME_THRESHOLD);

        const earlyArrival =
          clockIn.getHours() < WORK_HOURS.START.HOUR ||
          (clockIn.getHours() === WORK_HOURS.START.HOUR &&
            clockIn.getMinutes() < WORK_HOURS.START.MINUTE);

        // Perfect attendance: early/on-time arrival and at least standard working hours
        if (!isLate && !isEarly && (hasOvertime || earlyArrival)) {
          perfectDaysCount++;
        }

        data[dateKey] = {
          status: "present",
          clockIn: clockIn,
          clockOut: clockOut,
          isLate: isLate,
          isEarly: isEarly,
          hasOvertime: hasOvertime,
          earlyArrival: earlyArrival,
          workHours: workHours,
        };
      }
    }

    // Calculate additional stats
    const enhancedStats = {
      perfectAttendance: perfectDaysCount,
      totalWorkHours: Math.round(totalMonthHours * 10) / 10, // Round to 1 decimal place
    };

    return {
      attendanceData: data,
      enhancedStats: enhancedStats,
    };
  };

  // Process attendance data and calculate stats with enhanced metrics
  const processMockData = (mockData, year, month) => {
    const { attendanceData: data, enhancedStats } = mockData;

    const monthStats = {
      dayOff: 0,
      lateClockIn: 0,
      earlyClockOut: 0,
      overTime: 0,
      absent: 0,
      perfectAttendance: enhancedStats.perfectAttendance || 0,
      totalWorkHours: enhancedStats.totalWorkHours || 0,
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
      setStartTime(new Date(todayData.clockIn));
      const elapsedTime = Math.floor(
        (new Date() - new Date(todayData.clockIn)) / 1000
      );
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

  // Improved timer with better precision
  const startTimer = useCallback(
    (startValue = 0) => {
      setTimer(startValue);
      // Clear any existing timer
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      // Use more accurate timing mechanism
      const startTime = Date.now() - startValue * 1000;
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimer(elapsed);
      }, 1000);

      setTimerInterval(interval);
    },
    [timerInterval]
  );

  // Enhanced time formatters for better display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  const formatTimeWithSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Improved clock-in function with enhanced time tracking logic
  const handleClockIn = async () => {
    if (!employeeId || isClockIn || clockInLoading) return;

    try {
      setClockInLoading(true);

      let clockInData;
      try {
        const response = await fetch(
          "https://crm-backend-6gcl.onrender.com/api/calendar/attendance/clock-in",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ employeeId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to clock in");
        }

        clockInData = await response.json();
      } catch (error) {
        console.error("API error, using mock clock in:", error);

        // Create mock clock in response with enhanced time tracking
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Calculate if late based on configured work hours
        const isLate =
          currentHour > WORK_HOURS.START.HOUR ||
          (currentHour === WORK_HOURS.START.HOUR &&
            currentMinute >
              WORK_HOURS.START.MINUTE + WORK_HOURS.LATE_THRESHOLD);

        // Calculate if early arrival
        const isEarlyArrival =
          currentHour < WORK_HOURS.START.HOUR ||
          (currentHour === WORK_HOURS.START.HOUR &&
            currentMinute < WORK_HOURS.START.MINUTE);

        clockInData = {
          clockIn: now.toISOString(),
          isLate: isLate,
          earlyArrival: isEarlyArrival,
        };

        // Show simulation message for demo
        setNotificationMessage({
          type: "info",
          message: "Using simulated clock-in data in demo mode",
        });

        setTimeout(() => {
          setNotificationMessage(null);
        }, 3000);
      }

      const now = new Date(clockInData.clockIn);
      const today = now.toISOString().split("T")[0];

      setStartTime(now);
      setIsClockIn(true);
      startTimer();

      // Update local data with enhanced properties
      setAttendanceData((prev) => ({
        ...prev,
        [today]: {
          ...prev[today],
          status: "present",
          clockIn: now,
          isLate: clockInData.isLate,
          earlyArrival: clockInData.earlyArrival,
        },
      }));

      // Update stats if needed with proper conditions
      if (clockInData.isLate) {
        setStats((prev) => ({
          ...prev,
          lateClockIn: prev.lateClockIn + 1,
        }));

        setNotificationMessage({
          type: "warning",
          message: `You've clocked in late at ${formatTime(
            now
          )}. Expected time was ${WORK_HOURS.START.HOUR}:${String(
            WORK_HOURS.START.MINUTE
          ).padStart(2, "0")}.`,
        });
      } else if (clockInData.earlyArrival) {
        setNotificationMessage({
          type: "success",
          message: `You've clocked in early at ${formatTime(now)}. Great job!`,
        });
      } else {
        setNotificationMessage({
          type: "success",
          message: "You have successfully clocked in on time!",
        });
      }

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Error in clock in:", error);
      setNotificationMessage({
        type: "error",
        message: "Error clocking in. Please try again.",
      });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } finally {
      setClockInLoading(false);
    }
  };

  const handleClockOut = async (isAutoLogout = false) => {
    if (!employeeId || !isClockIn || !startTime || clockOutLoading) return;

    try {
      setClockOutLoading(true);

      let clockOutData;
      try {
        const response = await fetch(
          "https://crm-backend-6gcl.onrender.com/api/calendar/attendance/clock-out",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              employeeId,
              isAutoLogout,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to clock out");
        }

        clockOutData = await response.json();
      } catch (error) {
        console.error("API error, using mock clock out:", error);
        // Create mock clock out response
        const now = new Date();
        clockOutData = {
          clockOut: now.toISOString(),
          isEarly: now.getHours() < 17,
          hasOvertime: now.getHours() >= 17 && now.getMinutes() > 0,
        };
      }

      const now = new Date(clockOutData.clockOut);
      const today = now.toISOString().split("T")[0];

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
          isEarly: clockOutData.isEarly,
          hasOvertime: clockOutData.hasOvertime,
        },
      }));

      // Update stats if needed
      const statsUpdate = {};
      if (clockOutData.isEarly) {
        statsUpdate.earlyClockOut = stats.earlyClockOut + 1;
      }
      if (clockOutData.hasOvertime) {
        statsUpdate.overTime = stats.overTime + 1;
      }

      if (Object.keys(statsUpdate).length > 0) {
        setStats((prev) => ({
          ...prev,
          ...statsUpdate,
        }));
      }

      // Visual feedback
      if (!isAutoLogout) {
        alert("You have successfully clocked out!");
      }
    } catch (error) {
      console.error("Error in clock out:", error);
      if (!isAutoLogout) {
        alert("Error clocking out. Please try again.");
      }
    } finally {
      setClockOutLoading(false);
    }
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
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

    // Check if holiday from API
    if (holidays[dateKey]) {
      segments.push({
        type: "holiday",
        start: "09:00",
        end: "17:00",
        label: holidays[dateKey],
        fullLabel: `Holiday: ${holidays[dateKey]}`,
      });
      return segments;
    }

    // Check if weekend/holiday
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend || dayData.isHoliday) {
      segments.push({
        type: "holiday",
        start: "09:00",
        end: "17:00",
        label: dayData.holidayName || "Weekend",
        fullLabel: dayData.holidayName
          ? `Holiday: ${dayData.holidayName}`
          : "Weekend - Not A Working Day",
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
    const clockInTime =
      typeof dayData.clockIn === "string"
        ? new Date(dayData.clockIn)
        : dayData.clockIn;

    const clockOutTime = dayData.clockOut
      ? typeof dayData.clockOut === "string"
        ? new Date(dayData.clockOut)
        : dayData.clockOut
      : null;

    // Validate date objects
    if (!(clockInTime instanceof Date) || isNaN(clockInTime.getTime())) {
      console.error("Invalid clockIn date:", dayData.clockIn);
      return segments;
    }

    const clockInHour = clockInTime.getHours();
    const clockInMinute = clockInTime.getMinutes();
    const clockInStr = `${clockInHour
      .toString()
      .padStart(2, "0")}:${clockInMinute.toString().padStart(2, "0")}`;

    let clockOutStr = "17:00";
    if (clockOutTime) {
      if (!(clockOutTime instanceof Date) || isNaN(clockOutTime.getTime())) {
        console.error("Invalid clockOut date:", dayData.clockOut);
      } else {
        const clockOutHour = clockOutTime.getHours();
        const clockOutMinute = clockOutTime.getMinutes();
        clockOutStr = `${clockOutHour
          .toString()
          .padStart(2, "0")}:${clockOutMinute.toString().padStart(2, "0")}`;
      }
    }

    // Check for early arrival
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

  // Calculate time column positions
  const getTimePosition = (timeStr) => {
    if (!timeStr || timeStr === "-") return 0;

    const [hours, minutes] = timeStr.split(":").map(Number);
    // Scale starts at 8:00 (0%) and ends at 20:00 (100%)
    const totalMinutes = hours * 60 + minutes - 8 * 60;
    const totalPeriod = 12 * 60; // 12 hours in minutes (8:00 to 20:00)

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

  // Check if today's attendance is already completed
  const isTodayCompleted = () => {
    const todayKey = new Date().toISOString().split("T")[0];
    const todayData = attendanceData[todayKey];

    return todayData && todayData.clockIn && todayData.clockOut;
  };

  // Generate days to display based on current month
  const daysToDisplay = generateDaysToDisplay();

  // Loading state
  if (isLoading) {
    return <Spinner message="Loading your attendance data..." />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header with Month Navigation */}
      <CalendarHeader
        currentDate={currentDate}
        formatMonthYear={formatMonthYear}
        changeMonth={changeMonth}
      />

      {/* Clock In/Out Button (Only for today) */}
      {new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear() && (
          <ClockInOutSection
            isClockIn={isClockIn}
            timer={timer}
            formatTime={formatTime}
            isTodayCompleted={isTodayCompleted}
            handleClockIn={handleClockIn}
            handleClockOut={handleClockOut}
            clockInLoading={clockInLoading}
            clockOutLoading={clockOutLoading}
          />
        )}

      {/* Stats Section */}
      <StatsOverview stats={stats} />

      {/* Days navigation buttons */}
      <DaysNavigation
        hasPreviousDays={hasPreviousDays}
        hasMoreDays={hasMoreDays}
        changeDaysPage={changeDaysPage}
        currentDate={currentDate}
        setStartDate={setStartDate}
      />

      {/* Attendance Timeline - Dynamic Days */}
      <AttendanceTimeline
        daysToDisplay={daysToDisplay}
        attendanceData={attendanceData}
        formatDateLabel={formatDateLabel}
        getStatusSegments={getStatusSegments}
        getTimePosition={getTimePosition}
        getTimeRangeWidth={getTimeRangeWidth}
        getStatusColor={(type) => statusColors[type]?.bg || "bg-gray-200"}
        holidays={holidays}
      />
    </div>
  );
};

export default AttendanceCalendarPage;
