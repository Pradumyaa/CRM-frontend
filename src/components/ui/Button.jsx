// src/components/ui/Button.jsx
import React from "react";

export const Button = ({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
