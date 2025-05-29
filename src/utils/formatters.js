// utils/formatters.js
export const formatters = {
  currency: (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  },

  number: (num) => {
    return new Intl.NumberFormat("en-US").format(num || 0);
  },

  percentage: (num) => {
    return `${(num || 0).toFixed(1)}%`;
  },

  date: (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  dateTime: (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  time: (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  duration: (seconds) => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  },

  status: (status) => {
    const statusMap = {
      active: { text: "Active", class: "bg-green-100 text-green-800" },
      inactive: { text: "Inactive", class: "bg-red-100 text-red-800" },
      pending: { text: "Pending", class: "bg-yellow-100 text-yellow-800" },
      approved: { text: "Approved", class: "bg-blue-100 text-blue-800" },
      rejected: { text: "Rejected", class: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { text: status, class: "bg-gray-100 text-gray-800" }
    );
  },

  truncate: (text, length = 50) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  },

  initials: (name) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },
};
