import { useState } from "react";

const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 300,
  className = "",
  theme = "dark",
  disabled = false,
  maxWidth = "200px",
  showArrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const positions = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    "top-start": "bottom-full left-0 mb-2",
    "top-end": "bottom-full right-0 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    "bottom-start": "top-full left-0 mt-2",
    "bottom-end": "top-full right-0 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    "left-start": "right-full top-0 mr-2",
    "left-end": "right-full bottom-0 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    "right-start": "left-full top-0 ml-2",
    "right-end": "left-full bottom-0 ml-2",
  };

  const arrows = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-current",
    "top-start":
      "top-full left-3 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-current",
    "top-end":
      "top-full right-3 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-current",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-current",
    "bottom-start":
      "bottom-full left-3 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-current",
    "bottom-end":
      "bottom-full right-3 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-current",
    left: "left-full top-1/2 -translate-y-1/2 border-t-6 border-b-6 border-l-6 border-t-transparent border-b-transparent border-l-6",
    "left-start":
      "left-full top-3 border-t-6 border-b-6 border-l-6 border-t-transparent border-b-transparent border-l-6",
    "left-end":
      "left-full bottom-3 border-t-6 border-b-6 border-l-6 border-t-transparent border-b-transparent border-l-6",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-6",
    "right-start":
      "right-full top-3 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-6",
    "right-end":
      "right-full bottom-3 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-6",
  };

  const themes = {
    dark: {
      tooltip: "bg-slate-900 text-white border-slate-700 shadow-2xl",
      arrow: "text-slate-900",
    },
    light: {
      tooltip: "bg-white text-gray-800 border-gray-200 shadow-2xl",
      arrow: "text-white",
    },
    accent: {
      tooltip:
        "bg-gradient-to-br from-[#5932EA] to-purple-600 text-white border-purple-500 shadow-2xl",
      arrow: "text-[#5932EA]",
    },
    success: {
      tooltip: "bg-emerald-600 text-white border-emerald-500 shadow-2xl",
      arrow: "text-emerald-600",
    },
    error: {
      tooltip: "bg-red-600 text-white border-red-500 shadow-2xl",
      arrow: "text-red-600",
    },
    warning: {
      tooltip: "bg-amber-600 text-white border-amber-500 shadow-2xl",
      arrow: "text-amber-600",
    },
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  if (disabled || !content) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50 ${positions[position]} 
            px-3 py-2 text-sm font-medium rounded-lg border whitespace-nowrap
            backdrop-blur-sm transition-all duration-200 animate-in fade-in-0 zoom-in-95
            ${themes[theme].tooltip}
          `}
          style={{ maxWidth }}
          role="tooltip"
        >
          {content}
          {showArrow && (
            <div
              className={`
                absolute w-0 h-0 ${arrows[position]} ${themes[theme].arrow}
              `}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
