// theme.js - Centralized theme configuration for the application

// Color palette
export const colors = {
    // Primary brand colors
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',  // Main primary color
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },

    // Secondary brand colors (indigo)
    secondary: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',  // Main secondary color
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
    },

    // Success/Green colors
    success: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
    },

    // Warning/Amber colors
    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },

    // Error/Red colors
    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },

    // Info/Sky colors
    info: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
    },

    // Neutral/Gray colors
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },

    // Additional accent colors
    rose: {
        500: '#f43f5e',
        600: '#e11d48',
    },
    violet: {
        500: '#8b5cf6',
        600: '#7c3aed',
    },
    teal: {
        500: '#14b8a6',
        600: '#0d9488',
    },
    orange: {
        500: '#f97316',
        600: '#ea580c',
    },
};

// Color options for pickers (folders, spaces, etc.)
export const colorOptions = [
    { name: "Indigo", value: colors.secondary[600] },
    { name: "Sky", value: colors.info[500] },
    { name: "Emerald", value: colors.success[500] },
    { name: "Rose", value: colors.rose[500] },
    { name: "Amber", value: colors.warning[500] },
    { name: "Violet", value: colors.violet[500] },
    { name: "Slate", value: colors.gray[600] },
    { name: "Red", value: colors.error[500] },
    { name: "Green", value: colors.success[600] },
    { name: "Blue", value: colors.primary[500] },
    { name: "Orange", value: colors.orange[500] },
    { name: "Teal", value: colors.teal[500] },
];

// Icon options for folders
export const folderIconOptions = [
    { name: "Default", value: "folder" },
    { name: "Star", value: "star" },
    { name: "Heart", value: "heart" },
    { name: "Bookmark", value: "bookmark" },
    { name: "Archive", value: "archive" },
    { name: "Lock", value: "lock" },
    { name: "File", value: "file" },
    { name: "Code", value: "code" },
];

// Space template options
export const spaceTemplates = [
    {
        id: "blank",
        name: "Blank Space",
        description: "Start from scratch with an empty space",
        icon: "layout",
        iconColor: colors.secondary[600],
        isDefault: true
    },
    {
        id: "work",
        name: "Work Space",
        description: "Pre-configured for work projects",
        icon: "briefcase",
        iconColor: colors.primary[500],
        isDefault: false
    },
    {
        id: "personal",
        name: "Personal Space",
        description: "Organize your personal tasks and projects",
        icon: "clipboard",
        iconColor: colors.success[500],
        isDefault: false
    },
];

// Animation durations
export const animation = {
    fast: "150ms",
    medium: "300ms",
    slow: "500ms",
};

// Border radiuses
export const borderRadius = {
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
};

// Shadow styles
export const shadows = {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

export default {
    colors,
    colorOptions,
    folderIconOptions,
    spaceTemplates,
    animation,
    borderRadius,
    shadows,
};