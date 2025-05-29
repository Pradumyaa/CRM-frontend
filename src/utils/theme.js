// utils/theme.js - Theme utilities and constants
export const colorOptions = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Slate", value: "#64748b" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
];

export const folderIconOptions = [
  { name: "Folder", value: "folder" },
  { name: "Star", value: "star" },
  { name: "Heart", value: "heart" },
  { name: "Bookmark", value: "bookmark" },
  { name: "Archive", value: "archive" },
  { name: "Lock", value: "lock" },
  { name: "File", value: "file" },
  { name: "Code", value: "code" },
  { name: "Database", value: "database" },
  { name: "Settings", value: "settings" },
  { name: "Chart", value: "chart" },
  { name: "Calendar", value: "calendar" },
];

export const spaceTemplates = [
  {
    id: "blank",
    name: "Blank Space",
    description: "Start from scratch with an empty space",
    icon: "Layout",
  },
  {
    id: "work",
    name: "Work Projects",
    description: "Organize work tasks and projects",
    icon: "Briefcase",
  },
  {
    id: "personal",
    name: "Personal Tasks",
    description: "Manage personal goals and tasks",
    icon: "Clipboard",
  },
  {
    id: "team",
    name: "Team Collaboration",
    description: "Collaborate with team members",
    icon: "Users",
  },
  {
    id: "marketing",
    name: "Marketing Campaigns",
    description: "Plan and track marketing initiatives",
    icon: "BarChart",
  },
  {
    id: "design",
    name: "Design Projects",
    description: "Manage design workflows and assets",
    icon: "FileText",
  },
  {
    id: "event",
    name: "Event Planning",
    description: "Organize events and schedules",
    icon: "Calendar",
  },
  {
    id: "development",
    name: "Software Development",
    description: "Track development tasks and sprints",
    icon: "Kanban",
  },
];

export const taskPriorities = [
  { value: "low", label: "Low", color: "green" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "high", label: "High", color: "red" },
];

export const taskStatuses = [
  { value: "to_do", label: "To Do", color: "gray" },
  { value: "in_progress", label: "In Progress", color: "blue" },
  { value: "review", label: "In Review", color: "purple" },
  { value: "completed", label: "Completed", color: "green" },
];

export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
  yellow: {
    50: "#fefce8",
    100: "#fef3c7",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
  },
};

// Utility functions
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return colors.red[500];
    case "medium":
      return colors.yellow[500];
    case "low":
      return colors.green[500];
    default:
      return colors.gray[500];
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return colors.green[500];
    case "in_progress":
      return colors.blue[500];
    case "review":
      return colors.purple[500];
    case "to_do":
    default:
      return colors.gray[500];
  }
};

export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const generateGradient = (color1, color2, direction = "to right") => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
};

export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};
