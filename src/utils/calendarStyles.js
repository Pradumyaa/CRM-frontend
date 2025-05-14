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

// Status colors for attendance timeline
export const statusColors = {
    working: {
        bg: "bg-green-500",
        text: "text-green-600",
        lightBg: "bg-green-100",
    },
    overtime: {
        bg: "bg-orange-500",
        text: "text-orange-600",
        lightBg: "bg-orange-100",
    },
    active_overtime: {
        bg: "bg-orange-300",
        text: "text-orange-600",
        lightBg: "bg-orange-50",
    },
    late: {
        bg: "bg-red-500",
        text: "text-red-600",
        lightBg: "bg-red-100",
    },
    early: {
        bg: "bg-red-500",
        text: "text-red-600",
        lightBg: "bg-red-100",
    },
    dayoff: {
        bg: "bg-yellow-400",
        text: "text-yellow-600",
        lightBg: "bg-yellow-100",
    },
    dayoff_pending: {
        bg: "bg-yellow-300",
        text: "text-yellow-600",
        lightBg: "bg-yellow-50",
    },
    holiday: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        lightBg: "bg-purple-100",
    },
    absent: {
        bg: "bg-gray-400",
        text: "text-gray-600",
        lightBg: "bg-gray-100",
    },
    early_arrival: {
        bg: "bg-blue-400",
        text: "text-blue-600",
        lightBg: "bg-blue-100",
    },
    pending: {
        bg: "bg-gray-300",
        text: "text-gray-500",
        lightBg: "bg-gray-50",
    },
    error: {
        bg: "bg-red-300",
        text: "text-red-500",
        lightBg: "bg-red-50",
    },
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