// src/pages/chat/components/UI/LoadingSpinner.jsx
import { useState, useEffect } from "react";

const LoadingSpinner = ({
  type = "gradient",
  size = "md",
  text = "",
  className = "",
  color = "primary",
  centered = false,
  overlay = false,
  progress = null,
  messages = [],
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [messages.length]);

  const sizes = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };

  const colors = {
    primary: {
      border: "border-[#5932EA]",
      bg: "bg-[#5932EA]",
      gradient: "from-[#5932EA] to-purple-600",
      text: "text-[#5932EA]",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-500",
      gradient: "from-purple-500 to-violet-600",
      text: "text-purple-500",
    },
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-500",
      gradient: "from-blue-500 to-indigo-600",
      text: "text-blue-500",
    },
    green: {
      border: "border-emerald-500",
      bg: "bg-emerald-500",
      gradient: "from-emerald-500 to-green-600",
      text: "text-emerald-500",
    },
    red: {
      border: "border-red-500",
      bg: "bg-red-500",
      gradient: "from-red-500 to-rose-600",
      text: "text-red-500",
    },
    white: {
      border: "border-white",
      bg: "bg-white",
      gradient: "from-white to-gray-100",
      text: "text-white",
    },
  };

  const animations = {
    spinner: (
      <div
        className={`${sizes[size]} border-2 border-gray-200 dark:border-gray-700 ${colors[color].border} border-t-transparent rounded-full animate-spin`}
      />
    ),

    gradient: (
      <div className={`${sizes[size]} relative overflow-hidden rounded-full`}>
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colors[color].gradient} rounded-full animate-spin`}
          style={{
            background: `conic-gradient(from 0deg, transparent, ${
              color === "primary" ? "#5932EA" : colors[color].bg.split("-")[1]
            }, transparent)`,
          }}
        />
        <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full" />
      </div>
    ),

    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 ${colors[color].bg} rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    ),

    pulse: (
      <div className="relative">
        <div
          className={`${sizes[size]} ${colors[color].bg} rounded-full animate-pulse`}
        />
        <div
          className={`absolute inset-0 ${colors[color].bg} rounded-full animate-ping opacity-75`}
        />
      </div>
    ),

    wave: (
      <div className="flex items-end space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1 ${colors[color].bg} rounded-full animate-bounce`}
            style={{
              height: `${12 + i * 2}px`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
    ),

    ring: (
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 border-2 border-gray-200 dark:border-gray-700 rounded-full" />
        <div
          className={`absolute inset-0 border-2 ${colors[color].border} border-t-transparent rounded-full animate-spin`}
        />
      </div>
    ),

    orbit: (
      <div className={`${sizes[size]} relative`}>
        <div
          className={`absolute inset-0 border-2 border-gray-200 dark:border-gray-700 rounded-full`}
        />
        <div
          className={`absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 ${colors[color].bg} rounded-full animate-spin`}
          style={{
            transformOrigin: "50% 100%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    ),

    morphing: (
      <div className={`${sizes[size]} relative`}>
        <div
          className={`w-full h-full bg-gradient-to-r ${colors[color].gradient} rounded-full animate-pulse`}
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            animation: "morph 2s ease-in-out infinite",
          }}
        />
      </div>
    ),
  };

  const currentText =
    messages.length > 0 ? messages[currentMessageIndex] : text;

  const spinnerContent = (
    <div
      className={`flex flex-col items-center space-y-4 ${
        centered ? "justify-center min-h-[200px]" : ""
      } ${className}`}
    >
      {/* Spinner Animation */}
      <div className="relative">
        {animations[type]}

        {/* Progress Circle Overlay */}
        {progress !== null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className={`${sizes[size]} transform -rotate-90`}>
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                className={colors[color].text}
                style={{
                  transition: "stroke-dashoffset 0.5s ease-in-out",
                }}
              />
            </svg>
            {progress !== null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${colors[color].text}`}>
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading Text */}
      {currentText && (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium animate-pulse">
            {currentText}
          </p>
          {progress !== null && (
            <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className={`h-1.5 bg-gradient-to-r ${colors[color].gradient} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
};

// Pre-configured loading states
export const PageLoader = ({ message = "Loading..." }) => (
  <LoadingSpinner
    type="gradient"
    size="lg"
    text={message}
    centered
    color="primary"
  />
);

export const InlineLoader = ({ size = "sm", color = "primary" }) => (
  <LoadingSpinner type="spinner" size={size} color={color} />
);

export const ProgressLoader = ({ progress, message = "Processing..." }) => (
  <LoadingSpinner
    type="ring"
    size="lg"
    text={message}
    progress={progress}
    centered
    color="primary"
  />
);

export const ChatLoader = () => (
  <LoadingSpinner
    type="dots"
    size="sm"
    color="primary"
    messages={["Typing...", "Thinking...", "Almost there..."]}
  />
);

// Add required CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes morph {
    0%, 100% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
    25% { clip-path: polygon(50% 0%, 85% 15%, 85% 85%, 50% 100%, 15% 85%, 15% 15%); }
    50% { clip-path: polygon(50% 0%, 80% 20%, 80% 80%, 50% 100%, 20% 80%, 20% 20%); }
    75% { clip-path: polygon(50% 0%, 75% 25%, 75% 75%, 50% 100%, 25% 75%, 25% 25%); }
  }
`;
if (!document.head.querySelector("#loading-animations")) {
  style.id = "loading-animations";
  document.head.appendChild(style);
}

export default LoadingSpinner;
