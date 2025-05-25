import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock4,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Maximize,
  Minimize,
} from "lucide-react";
import { calendarApi } from "../../utils/apiClient";
import {
  formatDateToString,
  formatDayLabel,
  formatTimeWithSeconds,
  formatHoursMinutes,
} from "../../utils/calendarStyles";
import { fetchHolidays } from "../../utils/holidayAPI";
import { Calendar, Clock, AlertCircle, Info } from "lucide-react";

// Import components
import CalendarHeader from "./calendarComponents/CalendarHeader";
import StatsOverview from "./calendarComponents/StatsOverview";
import AttendanceTimeline from "./calendarComponents/AttendanceTimeline";
import ClockInOutSection from "./calendarComponents/ClockInOutSection";
import DaysNavigation from "./calendarComponents/DaysNavigation";
import Spinner from "./calendarComponents/Spinner";
import DayOffRequestModal from "./calendarComponents/DayOffRequestModal";
import AdminPanel from "./calendarComponents/AdminPanel";

const AttendanceCalendarPage = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState(
    () => localStorage.getItem("employeeId") || ""
  );
  const [isClockIn, setIsClockIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);
  const [holidays, setHolidays] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState(null);

  // Day click handler state
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState({});

  // Stats object
  const [stats, setStats] = useState({
    dayOff: 0,
    lateClockIn: 0,
    earlyClockOut: 0,
    overTime: 0,
    absent: 0,
    present: 0,
  });

  // Check for employee ID and admin status on mount
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
      checkIfAdmin(storedEmployeeId);
    }
  }, []);

  // Display notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });

    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Check if employee is an admin
  const checkIfAdmin = async (id) => {
    try {
      const response = await calendarApi.checkAdminStatus(id);
      const isAdmin = response.employee?.isAdmin || false;
      setIsAdmin(isAdmin);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  // Reset startDate to appropriate date when currentDate changes
  useEffect(() => {
    const isCurrentMonth =
      currentDate.getFullYear() === new Date().getFullYear() &&
      currentDate.getMonth() === new Date().getMonth();

    const newStartDate = isCurrentMonth
      ? new Date() // Today for current month
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day for other months

    setStartDate(newStartDate);

    // Fetch holidays when month changes
    fetchMonthHolidays();
  }, [currentDate]);

  // Fetch holidays for the current month
  const fetchMonthHolidays = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 1-12

      const holidaysData = await fetchHolidays(year, month);
      setHolidays(holidaysData);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setHolidays({});
    }
  };

  // Fetch employee attendance data when month or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchAttendanceData();
    } else {
      setIsLoading(false);
    }

    // Cleanup timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [currentDate, employeeId]);

  // Check for auto-logout at end of day
  useEffect(() => {
    if (isClockIn) {
      // Check current time to warn or auto-logout if necessary
      const checkEndOfDay = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Warn at 6:45 PM if still clocked in
        if (hours === 18 && minutes === 45) {
          showNotification(
            "Warning: You're still clocked in. Please clock out before leaving or you'll be automatically clocked out at 7:00 PM.",
            "warning"
          );
        }

        // Auto-logout at 7:00 PM
        if (hours === 19 && minutes === 0) {
          handleClockOut(true);
        }
      };

      // Run the check immediately
      checkEndOfDay();

      // Set up a periodic check every minute
      const endOfDayTimer = setInterval(checkEndOfDay, 60000);

      return () => clearInterval(endOfDayTimer);
    }
  }, [isClockIn]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keyboard shortcuts if not typing in an input field
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          // Previous month
          if (event.ctrlKey || event.metaKey) {
            changeMonth(-1);
          }
          break;
        case "ArrowRight":
          // Next month
          if (event.ctrlKey || event.metaKey) {
            changeMonth(1);
          }
          break;
        case "ArrowUp":
          // Previous week
          if (!event.ctrlKey && !event.metaKey) {
            changeDaysPage(-1);
          }
          break;
        case "ArrowDown":
          // Next week
          if (!event.ctrlKey && !event.metaKey) {
            changeDaysPage(1);
          }
          break;
        case "Home":
          // First day of month
          setStartDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          );
          break;
        case "End":
          // Last day of month
          setStartDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          );
          break;
        case "t":
        case "T":
          // Today
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault(); // Prevent browser's "New Tab" shortcut
            setCurrentDate(new Date());
            setStartDate(new Date());
          }
          break;
        case "i":
        case "I":
          // Clock In shortcut
          if (
            !isClockIn &&
            !isTodayCompleted() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()
          ) {
            handleClockIn();
          }
          break;
        case "o":
        case "O":
          // Clock Out shortcut
          if (
            isClockIn &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()
          ) {
            handleClockOut(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentDate, isClockIn, startDate]);

  // Fetch attendance data from API
  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);

      // Get first and last day of month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Format dates for query
      const startDateStr = formatDateToString(firstDay);
      const endDateStr = formatDateToString(lastDay);

      let data;

      // Use appropriate API based on admin status
      if (isAdmin) {
        const response = await calendarApi.getAllAttendance(
          startDateStr,
          endDateStr
        );
        data = response;
      } else {
        const response = await calendarApi.getAttendance(
          employeeId,
          startDateStr,
          endDateStr
        );
        data = response;
      }

      // Update state with fetched data
      setAttendanceData(data.attendanceData || {});
      setStats(
        data.stats || {
          dayOff: 0,
          lateClockIn: 0,
          earlyClockOut: 0,
          overTime: 0,
          absent: 0,
          present: 0,
        }
      );

      // Check if currently clocked in
      checkClockInStatus(data.attendanceData || {});

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setIsLoading(false);
      showNotification(
        "Failed to fetch attendance data. Please try again.",
        "error"
      );
    }
  };

  // Check if user is currently clocked in
  const checkClockInStatus = (data) => {
    const todayKey = formatDateToString(new Date());
    const todayData = data[todayKey];

    if (todayData && todayData.clockIn && !todayData.clockOut) {
      setIsClockIn(true);
      const clockInTime = new Date(todayData.clockIn);
      const elapsedTime = Math.floor((new Date() - clockInTime) / 1000);
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

  // Handle day click
  const handleDayClick = (day) => {
    const dateKey = formatDateToString(day);
    const dayData = attendanceData[dateKey] || {};

    setSelectedDay(day);
    setSelectedDayData(dayData);
    setShowDayModal(true);
  };

  // Handle day modal close
  const handleDayModalClose = () => {
    setShowDayModal(false);
    setSelectedDay(null);
    setSelectedDayData({});
  };

  // Handle day off request submit
  const handleDayOffSubmit = async (day, reason, requestEmployeeId = null) => {
    if (!day) return;

    try {
      // Use the provided employee ID or fall back to current employee ID
      const empId = requestEmployeeId || employeeId;

      if (!empId) {
        throw new Error("Employee ID not found. Please log in again.");
      }

      await requestDayOff(day, reason, empId);
      fetchAttendanceData(); // Refresh data
      showNotification(
        "Day off request submitted successfully. Awaiting approval.",
        "success"
      );
    } catch (error) {
      console.error("Error submitting day off request:", error);
      showNotification(
        error.message || "Failed to submit day off request",
        "error"
      );
      throw error;
    }
  };

  // Admin function to approve day off request
  const handleDayOffApproval = async (date, empId, approved) => {
    if (!isAdmin) {
      showNotification("Only admins can approve/reject requests.", "error");
      return;
    }

    try {
      await calendarApi.processDayOffRequest(
        employeeId, // Admin ID
        empId, // Employee ID
        date, // Date
        approved // Approval status
      );

      // Refresh data
      fetchAttendanceData();
      showNotification(
        `Successfully ${approved ? "approved" : "rejected"} day off request`,
        "success"
      );
      return true;
    } catch (error) {
      console.error("Error processing day off request:", error);
      showNotification(
        `Failed to ${approved ? "approve" : "reject"} day off request: ${
          error.message
        }`,
        "error"
      );
      throw error;
    }
  };
  // Request a day off
  const requestDayOff = async (date, reason, requestEmployeeId) => {
    if (!requestEmployeeId) {
      throw new Error("Employee ID not found. Please log in again.");
    }

    const dateStr = formatDateToString(date);

    // Check if the date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      throw new Error("Cannot request day off for past dates.");
    }

    // Check if it's already a holiday or weekend
    if (holidays[dateStr] || date.getDay() === 0 || date.getDay() === 6) {
      throw new Error(
        "This is already a holiday or weekend. No need to request day off."
      );
    }

    // Check if already has a status for this day
    const dayData = attendanceData[dateStr];
    if (dayData && (dayData.clockIn || dayData.status === "absent")) {
      throw new Error(
        "Cannot request day off for a day you've already clocked in or were marked absent."
      );
    }

    // Check if already requested
    if (dayData && dayData.dayOffRequested) {
      throw new Error("Day off request already submitted for this date.");
    }

    // Call API to request day off
    await calendarApi.requestDayOff(requestEmployeeId, dateStr, reason);

    // Success
    return true;
  };
  // Start timer for clocked in time
  const startTimer = (startValue = 0) => {
    setTimer(startValue);
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Handle clock in action
  const handleClockIn = async () => {
    if (!employeeId || isClockIn || clockInLoading) {
      if (!employeeId) {
        showNotification(
          "Employee ID not found. Please log in again.",
          "error"
        );
        return;
      }
      if (isClockIn) {
        showNotification("You are already clocked in for today.", "warning");
        return;
      }
      return;
    }

    try {
      setClockInLoading(true);

      const clockInData = await calendarApi.clockIn(employeeId);

      const now = new Date(clockInData.clockIn || Date.now());
      const today = formatDateToString(now);

      // Update UI state
      setIsClockIn(true);
      startTimer();

      // Update attendance data
      setAttendanceData((prev) => ({
        ...prev,
        [today]: {
          ...prev[today],
          id: clockInData.id,
          status: "present",
          clockIn: now.toISOString(),
          isLate: clockInData.isLate,
        },
      }));

      // Update stats if needed
      if (clockInData.isLate) {
        setStats((prev) => ({
          ...prev,
          lateClockIn: prev.lateClockIn + 1,
        }));
      }

      // Visual feedback
      showNotification("You have successfully clocked in!", "success");
    } catch (error) {
      console.error("Error clocking in:", error);
      showNotification(
        `Error clocking in: ${error.message || "Please try again."}`,
        "error"
      );
    } finally {
      setClockInLoading(false);
    }
  };

  // Handle clock out action
  const handleClockOut = async (isAutoLogout = false) => {
    if (!employeeId || !isClockIn || clockOutLoading) {
      if (!employeeId) {
        showNotification(
          "Employee ID not found. Please log in again.",
          "error"
        );
        return;
      }
      if (!isClockIn) {
        showNotification(
          "You need to clock in first before clocking out.",
          "warning"
        );
        return;
      }
      return;
    }

    try {
      setClockOutLoading(true);

      const clockOutData = await calendarApi.clockOut(employeeId, isAutoLogout);

      const now = new Date(clockOutData.clockOut || Date.now());
      const today = formatDateToString(now);

      // Update UI state
      setIsClockIn(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      // Update attendance data
      setAttendanceData((prev) => ({
        ...prev,
        [today]: {
          ...prev[today],
          clockOut: now.toISOString(),
          isEarly: clockOutData.isEarly,
          hasOvertime: clockOutData.hasOvertime,
          duration: clockOutData.duration,
        },
      }));

      // Update stats
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
        showNotification("You have successfully clocked out!", "success");
      } else {
        showNotification(
          "You have been automatically clocked out at the end of day.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error clocking out:", error);
      if (!isAutoLogout) {
        showNotification(
          `Error clocking out: ${error.message || "Please try again."}`,
          "error"
        );
      }
    } finally {
      setClockOutLoading(false);
    }
  };

  // Change month handler
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Generate days to display for timeline
  const generateDaysToDisplay = () => {
    const daysToShow = [];

    // Display up to 8 days starting from the startDate
    for (let i = 0; i < 8; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);

      // Ensure we're only showing days within the current month
      if (day.getMonth() === currentDate.getMonth()) {
        daysToShow.push(day);
      } else {
        // Stop if we reach end of month
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

  // Get status segments for a specific day
  const getStatusSegments = (day) => {
    const dateKey = formatDateToString(day);
    const dayData = attendanceData[dateKey] || {};
    const segments = [];

    try {
      // Check if holiday from API
      if (holidays[dateKey]) {
        segments.push({
          type: "holiday",
          start: "09:00",
          end: "17:00",
          label: "Holiday",
          fullLabel: `Holiday: ${
            holidays[dateKey].description || "Public Holiday"
          }`,
        });
        return segments;
      }

      // Check if weekend
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      if (isWeekend || dayData.isHoliday) {
        segments.push({
          type: "holiday",
          start: "09:00",
          end: "17:00",
          label: "Weekend",
          fullLabel: dayData.holidayName
            ? `Holiday: ${dayData.holidayName}`
            : "Weekend - Not A Working Day",
        });
        return segments;
      }

      // Check if requested day off and its status
      if (dayData.dayOffRequested) {
        segments.push({
          type: dayData.approved === false ? "dayoff_pending" : "dayoff",
          start: "09:00",
          end: "17:00",
          label: dayData.approved === false ? "Day Off (Pending)" : "Day Off",
          fullLabel: `Day Off ${
            dayData.approved === false ? "(Pending Approval)" : ""
          }: ${dayData.reason || "Employee Requested A Day Off"}`,
        });
        return segments;
      }

      // If marked absent explicitly
      if (dayData.status === "absent") {
        segments.push({
          type: "absent",
          start: "09:00",
          end: "17:00",
          label: "Absent",
          fullLabel: dayData.notes
            ? `Absent: ${dayData.notes}`
            : "Employee Was Absent On This Day",
        });
        return segments;
      }

      // If no clock in data
      if (!dayData.clockIn) {
        // If date is in the past and no data, mark as absent
        if (day < new Date().setHours(0, 0, 0, 0)) {
          segments.push({
            type: "absent",
            start: "09:00",
            end: "17:00",
            label: "Absent",
            fullLabel: "Employee Was Absent On This Day",
          });
        } else if (day.toDateString() === new Date().toDateString()) {
          // If it's today and no clock in yet
          segments.push({
            type: "pending",
            start: "09:00",
            end: "17:00",
            label: "Not Clocked In",
            fullLabel: "Employee Has Not Clocked In Yet Today",
          });
        }
        return segments;
      }

      // Process clock in/out data
      let clockInTime;
      try {
        clockInTime = new Date(dayData.clockIn);
        if (isNaN(clockInTime.getTime())) {
          throw new Error("Invalid date");
        }
      } catch (err) {
        console.error("Invalid clock in time:", dayData.clockIn);
        segments.push({
          type: "error",
          start: "09:00",
          end: "17:00",
          label: "Data Error",
          fullLabel: "There was an error processing attendance data",
        });
        return segments;
      }

      let clockOutTime = null;
      if (dayData.clockOut) {
        try {
          clockOutTime = new Date(dayData.clockOut);
          if (isNaN(clockOutTime.getTime())) {
            throw new Error("Invalid date");
          }
        } catch (err) {
          console.error("Invalid clock out time:", dayData.clockOut);
        }
      }

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

      // Check for early arrival
      if (clockInHour < 9 || (clockInHour === 9 && clockInMinute === 0)) {
        segments.push({
          type: "early_arrival",
          start: clockInStr,
          end: "09:00",
          label: "Early",
          fullLabel: `Early arrival at ${clockInStr} (Before 09:00)`,
        });

        // For early arrivals, adjust the working hours start time
        segments.push({
          type: "working",
          start: "09:00",
          end: dayData.isEarly && clockOutTime ? clockOutStr : "17:00",
          label: "Working",
          fullLabel: `Working hours: 09:00 to ${
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
            fullLabel: `Late arrival at ${clockInStr} (After 09:00)`,
          });
        }

        // Normal working hours
        segments.push({
          type: "working",
          start: clockInStr,
          end: dayData.isEarly && clockOutTime ? clockOutStr : "17:00",
          label: "Working",
          fullLabel: `Working hours: ${clockInStr} to ${
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
          fullLabel: `Early departure at ${clockOutStr} (Before 17:00)`,
        });
      }

      // Overtime
      if (dayData.hasOvertime && clockOutTime) {
        segments.push({
          type: "overtime",
          start: "17:00",
          end: clockOutStr,
          label: "Overtime",
          fullLabel: `Overtime: 17:00 to ${clockOutStr}`,
        });
      }

      // If clocked in but not clocked out yet (current day)
      if (!clockOutTime && day.toDateString() === new Date().toDateString()) {
        // Add "currently working" indicator
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeStr = `${currentHour
          .toString()
          .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

        // Only if current time is after 17:00, show active overtime
        if (now.getHours() >= 17) {
          segments.push({
            type: "active_overtime",
            start: "17:00",
            end: currentTimeStr,
            label: "Active Overtime",
            fullLabel: "Currently working overtime (after 17:00)",
          });
        }
      }
    } catch (error) {
      console.error("Error generating status segments:", error);
      segments.push({
        type: "error",
        start: "09:00",
        end: "17:00",
        label: "Error",
        fullLabel: "An error occurred while processing attendance data",
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

    return Math.max(0, Math.min(100, (totalMinutes / totalPeriod) * 100));
  };

  // Calculate width of time range
  const getTimeRangeWidth = (start, end) => {
    if (!start || !end || start === "-" || end === "-") return 0;

    const startPos = getTimePosition(start);
    const endPos = getTimePosition(end);

    // Ensure width is never negative and cap at 100%
    return Math.min(100, Math.max(0, endPos - startPos));
  };

  // Get color class based on status type
  const getStatusColor = (type) => {
    const statusColorMap = {
      working: "bg-green-500",
      overtime: "bg-orange-500",
      active_overtime: "bg-orange-300",
      late: "bg-red-500",
      early: "bg-red-400",
      dayoff: "bg-yellow-400",
      dayoff_pending: "bg-yellow-300",
      holiday: "bg-purple-500",
      absent: "bg-gray-500",
      early_arrival: "bg-blue-400",
      pending: "bg-gray-300",
      error: "bg-red-300",
    };

    return statusColorMap[type] || "bg-gray-200";
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
    const todayKey = formatDateToString(new Date());
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
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-fade-in ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : notification.type === "warning"
              ? "bg-yellow-500 text-white"
              : "bg-blue-500 text-white"
          }`}
          style={{ maxWidth: "400px" }}
        >
          <div className="flex items-center">
            {notification.type === "success" && (
              <div className="mr-3 bg-white bg-opacity-30 rounded-full p-1">
                <CheckCircle size={18} />
              </div>
            )}
            {notification.type === "error" && (
              <div className="mr-3 bg-white bg-opacity-30 rounded-full p-1">
                <AlertCircle size={18} />
              </div>
            )}
            {notification.type === "warning" && (
              <div className="mr-3 bg-white bg-opacity-30 rounded-full p-1">
                <AlertCircle size={18} />
              </div>
            )}
            {notification.type === "info" && (
              <div className="mr-3 bg-white bg-opacity-30 rounded-full p-1">
                <Info size={18} />
              </div>
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded shadow-sm animate-fade-in">
        <h3 className="font-bold mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center">
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm mr-2">
              Ctrl+←/→
            </kbd>
            <span>Previous/Next Month</span>
          </div>
          <div className="flex items-center">
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm mr-2">
              Ctrl+T
            </kbd>
            <span>Go to Today</span>
          </div>
          <div className="flex items-center">
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm mr-2">
              I/O
            </kbd>
            <span>Clock In/Out</span>
          </div>
        </div>
      </div>

      {/* Header with Month Navigation */}
      <CalendarHeader currentDate={currentDate} changeMonth={changeMonth} />

      {/* Day Off Request Button */}
      {!isAdmin && (
        <div className="flex items-center justify-end mr-5 mb-6">
          <button
            onClick={() => {
              setSelectedDay(new Date());
              setSelectedDayData(
                attendanceData[formatDateToString(new Date())] || {}
              );
              setShowDayModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <Calendar size={18} />
            <span>Request Day Off</span>
          </button>
        </div>
      )}

      {/* Admin Panel (only shown for admins) */}
      <AdminPanel
        isAdmin={isAdmin}
        employeeId={employeeId}
        onApproveRequest={handleDayOffApproval}
        onRejectRequest={handleDayOffApproval}
        refreshData={fetchAttendanceData}
      />

      {/* Clock In/Out Button (Only for today) */}
      {!isAdmin &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear() && (
          <ClockInOutSection
            isClockIn={isClockIn}
            timer={timer}
            formatTime={formatTimeWithSeconds}
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
        formatDateLabel={formatDayLabel}
        getStatusSegments={getStatusSegments}
        getTimePosition={getTimePosition}
        getTimeRangeWidth={getTimeRangeWidth}
        getStatusColor={getStatusColor}
        holidays={holidays}
        onDayClick={handleDayClick}
      />

      {/* Day Action Modal */}
      <DayOffRequestModal
        isOpen={showDayModal}
        onClose={handleDayModalClose}
        selectedDay={selectedDay}
        dayData={selectedDayData}
        onSubmit={handleDayOffSubmit}
        isAdmin={isAdmin}
        onApprove={(date, empId) => handleDayOffApproval(date, empId, true)}
        onReject={(date, empId) => handleDayOffApproval(date, empId, false)}
      />
    </div>
  );
};

export default AttendanceCalendarPage;
