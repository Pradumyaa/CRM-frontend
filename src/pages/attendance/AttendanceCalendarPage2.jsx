// AttendanceCalendarPage.jsx - Main component
import React, { useState, useEffect } from "react";
import CalendarHeader from "./calendarComponents/CalendarHeader";
import StatsOverview from "./calendarComponents/StatsOverview";
import AttendanceTimeline from "./calendarComponents/AttendanceTimeline";
import ClockInOutSection from "./calendarComponents/ClockInOutSection";
import Spinner from "./calendarComponents/Spinner";
import DaysNavigation from "./calendarComponents/DaysNavigation";

// Utility functions for calendar
const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function AttendanceCalendarPage() {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState(() => localStorage.getItem("employeeId") || "");
  const [isClockIn, setIsClockIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);
  const [holidays, setHolidays] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Day click handler
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [dayOffReason, setDayOffReason] = useState("");

  // Stats object
  const [stats, setStats] = useState({
    dayOff: 0,
    lateClockIn: 0,
    earlyClockOut: 0,
    overTime: 0,
    absent: 0,
  });
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
      checkIfAdmin(storedEmployeeId);
    }
  }, []);
  
  const checkIfAdmin = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${id}`);
      if (response.ok) {
        const data = await response.json();
        // setIsAdmin(data.employee.isAdmin || false);
        setIsAdmin( false);
        console.log("Admin status set to:", data.isAdmin);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  // Reset startDate to first day of month when currentDate changes
  useEffect(() => {
    const isCurrentMonth =
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth();
    
    const newStartDate = isCurrentMonth
      ? today
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    setStartDate(newStartDate);
    
    // Fetch holidays when month changes
    fetchHolidays();
  }, []);

  // Check for employee ID in localStorage on mount
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId && storedEmployeeId !== employeeId) {
      setEmployeeId(storedEmployeeId);
    }
  }, [employeeId]);

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
          alert("Warning: You're still clocked in. Please clock out before leaving or you'll be automatically clocked out at 7:00 PM.");
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
      if (event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA' || 
          event.target.isContentEditable) {
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
          setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
          break;
        case "End":
          // Last day of month
          setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
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
          if (!isClockIn && !isTodayCompleted() && 
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()) {
            handleClockIn();
          }
          break;
        case "o":
        case "O":
          // Clock Out shortcut
          if (isClockIn && 
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()) {
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

  // Fetch holidays for the current month
  const fetchHolidays = async () => {
    try {
      // Don't set loading to true here, as it causes flickering
      // Calculate first and last day of month for the API request
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const startDateStr = formatDateToString(firstDay);
      const endDateStr = formatDateToString(lastDay);
      
      const response = await fetch(
        `/api/calendar/holidays?startDate=${startDateStr}&endDate=${endDateStr}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch holidays: ${response.status}`);
      }
      
      const data = await response.json();
      setHolidays(data.holidays || {});
    } catch (error) {
      console.error("Error fetching holidays:", error);
      // Continue with empty holidays object if API fails
      setHolidays({});
    }
  };

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

      // Construct API URL based on admin status
      let apiUrl = `http://localhost:3000/api/calendar/attendance?employeeId=${employeeId}&startDate=${startDateStr}&endDate=${endDateStr}`;
      
      // If admin, fetch all employees or allow filtering
      if (isAdmin) {
        apiUrl = `http://localhost:3000/api/calendar/attendance/all?startDate=${startDateStr}&endDate=${endDateStr}`;
      }

      // Fetch attendance data from API
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with fetched data
      setAttendanceData(data.attendanceData || {});
      setStats(data.stats || {
        dayOff: 0,
        lateClockIn: 0,
        earlyClockOut: 0,
        overTime: 0,
        absent: 0,
      });

      // Check if currently clocked in
      checkClockInStatus(data.attendanceData || {});
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setIsLoading(false);
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
    setSelectedDay(day);
    setDayOffReason("");
    setShowDayModal(true);
  };

  const handleDayModalClose = () => {
    setShowDayModal(false);
    setSelectedDay(null);
    setDayOffReason("");
  };

  const handleDayOffSubmit = () => {
    if (selectedDay) {
      requestDayOff(selectedDay, dayOffReason);
      handleDayModalClose();
    }
  };

  // Admin function to approve day off request
  const handleDayOffApproval = async (dateKey, employeeId, approved) => {
    if (!isAdmin) return;

    try {
      const response = await fetch("http://localhost:3000/api/calendar/attendance/day-off/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: localStorage.getItem("employeeId"),
          employeeId,
          date: dateKey,
          approved,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update day off request: ${response.status}`);
      }

      // Refresh data after approval/rejection
      fetchAttendanceData();
      alert(`Day off request ${approved ? "approved" : "rejected"} successfully.`);
    } catch (error) {
      console.error("Error updating day off request:", error);
      alert(`Error updating day off request: ${error.message}`);
    }
  };

  // Request a day off
  const requestDayOff = async (date, reason) => {
    if (!employeeId) {
      alert("Employee ID not found. Please log in again.");
      return;
    }

    try {
      const dateStr = formatDateToString(date);
      
      // Check if the date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        alert("Cannot request day off for past dates.");
        return;
      }

      // Check if it's already a holiday or weekend
      if (holidays[dateStr] || date.getDay() === 0 || date.getDay() === 6) {
        alert("This is already a holiday or weekend. No need to request day off.");
        return;
      }

      // Check if already has a status for this day
      const dayData = attendanceData[dateStr];
      if (dayData && (dayData.clockIn || dayData.status === 'absent')) {
        alert("Cannot request day off for a day you've already clocked in or were marked absent.");
        return;
      }

      // Call API to request day off
      const response = await fetch(
        "http://localhost:3000/api/calendar/attendance/day-off",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            date: dateStr,
            reason: reason || "Personal reasons"
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to request day off");
      }

      const responseData = await response.json();

      // Update local data
      setAttendanceData((prev) => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          id: responseData.id,
          dayOffRequested: true,
          status: "dayoff",
          approved: false, // Default to pending approval
          reason: reason || "Personal reasons"
        }
      }));

      // Update stats
      setStats((prev) => ({
        ...prev,
        dayOff: prev.dayOff + 1
      }));

      alert("Day off request submitted successfully! Waiting for approval.");
      
      // Refresh data
      fetchAttendanceData();
      
    } catch (error) {
      console.error("Error requesting day off:", error);
      alert(`Error requesting day off: ${error.message}`);
    }
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

  // Format timer for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  // Handle clock in action
  const handleClockIn = async () => {
    if (!employeeId || isClockIn || clockInLoading) {
      if (!employeeId) {
        alert("Employee ID not found. Please log in again.");
        return;
      }
      if (isClockIn) {
        alert("You are already clocked in for today.");
        return;
      }
      return;
    }

    try {
      setClockInLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/calendar/attendance/clock-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId }),
        }
      );

      // Handle different error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400 && errorData.error === "Already clocked in today") {
          // If already clocked in, update UI state to match
          setIsClockIn(true);
          // Refresh data to get the correct state
          fetchAttendanceData();
          alert("You are already clocked in for today.");
          return;
        } else {
          throw new Error(errorData.error || "Failed to clock in");
        }
      }

      const clockInData = await response.json();
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
      alert("You have successfully clocked in!");
    } catch (error) {
      console.error("Error clocking in:", error);
      alert(`Error clocking in: ${error.message || "Please try again."}`);
    } finally {
      setClockInLoading(false);
    }
  };

  // Handle clock out action
  const handleClockOut = async (isAutoLogout = false) => {
    if (!employeeId || !isClockIn || clockOutLoading) {
      if (!employeeId) {
        alert("Employee ID not found. Please log in again.");
        return;
      }
      if (!isClockIn) {
        alert("You need to clock in first before clocking out.");
        return;
      }
      return;
    }

    try {
      setClockOutLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/calendar/attendance/clock-out",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            isAutoLogout,
          }),
        }
      );

      // Handle different error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 400 && errorData.error === "Already clocked out today") {
          // If already clocked out, update UI state
          setIsClockIn(false);
          if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
          }
          // Refresh data to get correct state
          fetchAttendanceData();
          alert("You are already clocked out for today.");
          return;
        } else if (response.status === 404) {
          // No clock-in record found
          setIsClockIn(false);
          fetchAttendanceData();
          alert("No clock-in record found for today. Please clock in first.");
          return;
        } else {
          throw new Error(errorData.error || "Failed to clock out");
        }
      }

      const clockOutData = await response.json();
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
        alert("You have successfully clocked out!");
      }
    } catch (error) {
      console.error("Error clocking out:", error);
      if (!isAutoLogout) {
        alert(`Error clocking out: ${error.message || "Please try again."}`);
      }
    } finally {
      setClockOutLoading(false);
    }
  };

  // Format date for month display
  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
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
    const dateKey = formatDateToString(date);
    const dayData = attendanceData[dateKey] || {};
    const segments = [];

    try {
      // Check if holiday from API
      if (holidays[dateKey]) {
        segments.push({
          type: "holiday",
          start: "09:00",
          end: "17:00",
          label: holidays[dateKey].description || "Holiday",
          fullLabel: `Holiday: ${holidays[dateKey].description || "Public Holiday"}`,
        });
        return segments;
      }

      // Check if weekend
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

      // Check if requested day off and its status
      if (dayData.dayOffRequested) {
        segments.push({
          type: dayData.approved === false ? "dayoff-pending" : "dayoff",
          start: "09:00",
          end: "17:00",
          label: dayData.approved === false ? "Day Off (Pending)" : "Day Off",
          fullLabel: `Day Off ${dayData.approved === false ? "(Pending Approval)" : ""}: ${dayData.reason || "Employee Requested A Day Off"}`,
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
        if (date < new Date().setHours(0, 0, 0, 0)) {
          segments.push({
            type: "absent",
            start: "09:00",
            end: "17:00",
            label: "Absent",
            fullLabel: "Employee Was Absent On This Day",
          });
        } else if (date.toDateString() === new Date().toDateString()) {
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
      const clockInStr = `${clockInHour.toString().padStart(2, "0")}:${clockInMinute.toString().padStart(2, "0")}`;

      let clockOutStr = "17:00";
      if (clockOutTime) {
        const clockOutHour = clockOutTime.getHours();
        const clockOutMinute = clockOutTime.getMinutes();
        clockOutStr = `${clockOutHour.toString().padStart(2, "0")}:${clockOutMinute.toString().padStart(2, "0")}`;
      }

      // Check for early arrival
      if (clockInHour < 9 || (clockInHour === 9 && clockInMinute === 0)) {
        segments.push({
          type: "early-arrival",
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
      if (!clockOutTime && date.toDateString() === new Date().toDateString()) {
        // Add "currently working" indicator
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
        
        // Only if current time is after 17:00, show active overtime
        if (now.getHours() >= 17) {
          segments.push({
            type: "active-overtime",
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

    return (totalMinutes / totalPeriod) * 100;
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
      "active-overtime": "bg-orange-300",
      late: "bg-red-500",
      early: "bg-red-400",
      dayoff: "bg-yellow-400",
      "dayoff-pending": "bg-yellow-300",
      holiday: "bg-purple-500",
      absent: "bg-gray-500",
      "early-arrival": "bg-blue-400",
      pending: "bg-gray-300",
      error: "bg-red-300"
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

  // Fetch pending day off requests (admin only)
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  const fetchPendingDayOffRequests = async () => {
    if (!isAdmin || !employeeId) return;
    
    try {
      const response = await fetch(
        `http://localhost:3000/api/attendance/pending-requests?adminId=${employeeId}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pending requests: ${response.status}`);
      }
      
      const data = await response.json();
      setPendingRequests(data.pendingRequests || []);
    } catch (error) {
      console.error("Error fetching pending day off requests:", error);
      alert(`Error fetching pending requests: ${error.message}`);
    }
  };
  

  // Fetch pending requests when admin status changes
  useEffect(() => {
    if (isAdmin) {
      fetchPendingDayOffRequests();
    }
  }, [isAdmin]);

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
      {/* Admin Panel */}
      {isAdmin && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-blue-800">Admin Panel</h3>
            <button 
              onClick={() => {
                setShowPendingRequests(!showPendingRequests);
                fetchPendingDayOffRequests();
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showPendingRequests ? "Hide" : "Show"} Pending Requests 
              {pendingRequests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

          {showPendingRequests && (
            <div className="mt-3">
              <h4 className="font-medium mb-2">Pending Day Off Requests</h4>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 italic">No pending requests</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="py-2 px-3 text-left">Employee</th>
                        <th className="py-2 px-3 text-left">Date</th>
                        <th className="py-2 px-3 text-left">Reason</th>
                        <th className="py-2 px-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((request) => (
                        <tr key={request.id} className="border-t border-gray-200">
                          <td className="py-2 px-3">{request.employeeName}</td>
                          <td className="py-2 px-3">
                            {new Date(request.date).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-3 max-w-xs truncate">{request.reason}</td>
                          <td className="py-2 px-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDayOffApproval(request.date, request.employeeId, true)}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDayOffApproval(request.date, request.employeeId, false)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Clock In/Out Button (Only for today) */}
      {!isAdmin && new Date().getMonth() === currentDate.getMonth() &&
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
        getStatusColor={getStatusColor}
        holidays={holidays}
        onDayClick={handleDayClick}
      />

      {/* Day Action Modal */}
      {showDayModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {selectedDay.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            
            <div className="mb-4">
              {/* Show day details if they exist */}
              {attendanceData[formatDateToString(selectedDay)] && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Day Status</h4>
                  <ul className="text-sm">
                    {attendanceData[formatDateToString(selectedDay)].clockIn && (
                      <li>Clock in: {new Date(attendanceData[formatDateToString(selectedDay)].clockIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</li>
                    )}
                    {attendanceData[formatDateToString(selectedDay)].clockOut && (
                      <li>Clock out: {new Date(attendanceData[formatDateToString(selectedDay)].clockOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</li>
                    )}
                    {attendanceData[formatDateToString(selectedDay)].isLate && <li className="text-red-600">Late arrival</li>}
                    {attendanceData[formatDateToString(selectedDay)].isEarly && <li className="text-red-600">Early departure</li>}
                    {attendanceData[formatDateToString(selectedDay)].hasOvertime && <li className="text-orange-600">Overtime</li>}
                    {attendanceData[formatDateToString(selectedDay)].dayOffRequested && (
                      <li className={attendanceData[formatDateToString(selectedDay)].approved === false ? "text-yellow-600" : "text-green-600"}>
                        Day off {attendanceData[formatDateToString(selectedDay)].approved === false ? "requested (pending)" : "approved"}
                        {attendanceData[formatDateToString(selectedDay)].reason && (
                          <span className="block text-xs italic">
                            Reason: {attendanceData[formatDateToString(selectedDay)].reason}
                          </span>
                        )}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Request Day Off form for regular users */}
              {!isAdmin && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Day Off</label>
                  <textarea
                    placeholder="Reason for day off request (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    value={dayOffReason}
                    onChange={(e) => setDayOffReason(e.target.value)}
                  ></textarea>
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && attendanceData[formatDateToString(selectedDay)] && attendanceData[formatDateToString(selectedDay)].dayOffRequested && 
                attendanceData[formatDateToString(selectedDay)].approved === false && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Admin Actions</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        handleDayOffApproval(
                          formatDateToString(selectedDay), 
                          attendanceData[formatDateToString(selectedDay)].employeeId, 
                          true
                        );
                        handleDayModalClose();
                      }}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve Day Off
                    </button>
                    <button
                      onClick={() => {
                        handleDayOffApproval(
                          formatDateToString(selectedDay), 
                          attendanceData[formatDateToString(selectedDay)].employeeId, 
                          false
                        );
                        handleDayModalClose();
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject Day Off
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDayModalClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              {!isAdmin && (
                <button
                  onClick={handleDayOffSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Request Day Off
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceCalendarPage;