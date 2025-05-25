// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
