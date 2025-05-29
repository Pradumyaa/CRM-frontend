// src/utils/calendarStyles.js

// Text styles for consistent typography
export const textStyles = {
    title: "text-2xl font-bold text-gray-900",
    subtitle: "text-xl font-semibold text-gray-800",
    heading: "text-lg font-medium text-gray-800",
    body: "text-base text-gray-700",
    small: "text-sm text-gray-600",
    tiny: "text-xs text-gray-500",
};

// Card and container styles
export const containerStyles = {
    card: "bg-white rounded-lg shadow-md p-4 transition-shadow hover:shadow-lg",
    section: "mb-6",
    sectionDivider: "border-b border-gray-200 my-4",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
};

// Button styles
export const buttonStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors",
    success: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors",
    danger: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors",
    icon: "p-2 rounded-full hover:bg-gray-100 transition-colors",
    iconActive: "p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed px-4 py-2 rounded-md",
};
// utils/calendarStyles.js - Add rejected status colors

export const statusColors = {
  // Existing colors...
  working: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200"
  },
  overtime: {
    bg: "bg-orange-100", 
    text: "text-orange-700",
    border: "border-orange-200"
  },
  late: {
    bg: "bg-red-100",
    text: "text-red-700", 
    border: "border-red-200"
  },
  early: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200"
  },
  dayoff: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200"
  },
  dayoff_pending: {
    bg: "bg-amber-100",
    text: "text-amber-700", 
    border: "border-amber-200"
  },
  // NEW: Add rejected status
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200"
  },
  holiday: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200"
  },
  absent: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200"
  },
  early_arrival: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200"
  }
};

// Also update the getStatusColor function in your calendar component:
const getStatusColor = (type) => {
  const statusColorMap = {
    working: "bg-green-500",
    overtime: "bg-orange-500",
    active_overtime: "bg-orange-300",
    late: "bg-red-500",
    early: "bg-red-400",
    dayoff: "bg-blue-400",
    dayoff_pending: "bg-amber-400",
    rejected: "bg-red-600", // NEW: Darker red for rejected
    holiday: "bg-purple-500",
    absent: "bg-gray-500",
    early_arrival: "bg-blue-400",
    pending: "bg-gray-300",
    error: "bg-red-300",
  };

  return statusColorMap[type] || "bg-gray-200";
};

// Animation classes
export const animations = {
    pulse: "animate-pulse",
    spin: "animate-spin",
    bounce: "animate-bounce",
    fadeIn: "animate-fade-in", // custom animation class
};

// Time formatting functions
export const formatTime = (date) => {
    if (!date) return "";

    if (typeof date === "string") {
        date = new Date(date);
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date) => {
    if (!date) return "";

    if (typeof date === "string") {
        date = new Date(date);
    }

    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

// Format date to YYYY-MM-DD string
export const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Format time for timeline display HH:MM:SS
export const formatTimeWithSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format hours and minutes only
export const formatHoursMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}h:${minutes
        .toString().padStart(2, '0')}m`;
};

// Format date for month display
export const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
};

// Format date for day display
export const formatDayLabel = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return `${date.toLocaleString("default", {
        weekday: "long",
    })}, ${date.getDate()}`;
};

// Function to get tooltip content based on status
export const getTooltipContent = (dayData) => {
    if (!dayData) return "";

    let content = "";

    if (dayData.isHoliday) {
        return `Holiday: ${dayData.holidayName || 'Public Holiday'}`;
    }

    if (dayData.status === "absent") {
        return "Absent";
    }

    if (dayData.dayOffRequested) {
        return "Requested Day Off";
    }

    if (dayData.clockIn) {
        content += `Clock in: ${formatTime(dayData.clockIn)}`;
        if (dayData.isLate) {
            content += " (Late)";
        }
    }

    if (dayData.clockOut) {
        content += content ? "\n" : "";
        content += `Clock out: ${formatTime(dayData.clockOut)}`;
        if (dayData.isEarly) {
            content += " (Early)";
        }
        if (dayData.hasOvertime) {
            content += " (Overtime)";
        }
    }

    return content;
};