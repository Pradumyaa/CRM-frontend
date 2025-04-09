import React from "react";

const Spinner = ({ message = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-2",
    lg: "h-16 w-16 border-3",
  };

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent mb-4`}></div>
      {message && <p className="text-gray-600 font-medium">{message}</p>}
    </div>
  );
};

export default Spinner;