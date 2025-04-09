// utils/calendarStyles.js

// This file defines consistent styling for the calendar components
// to ensure visual cohesion and appealing design

// Text styles
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
    "early-arrival": {
        bg: "bg-blue-400",
        text: "text-blue-600",
        lightBg: "bg-blue-100",
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

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
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