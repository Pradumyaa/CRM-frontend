// src/pages/chat/components/UI/Avatar.jsx
import { User } from "lucide-react";

const Avatar = ({
  src,
  alt,
  size = "md",
  status = null,
  className = "",
  onClick = null,
  showStatus = true,
  isOnline = false,
  customStatus = null,
  variant = "default",
  badge = null,
}) => {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
    "3xl": "w-24 h-24 text-3xl",
  };

  const statusColors = {
    online: "bg-emerald-500 border-emerald-400 shadow-emerald-500/50",
    away: "bg-amber-500 border-amber-400 shadow-amber-500/50",
    busy: "bg-red-500 border-red-400 shadow-red-500/50",
    offline: "bg-gray-400 border-gray-300 shadow-gray-400/50",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5 border",
    sm: "w-2 h-2 border",
    md: "w-2.5 h-2.5 border-2",
    lg: "w-3 h-3 border-2",
    xl: "w-4 h-4 border-2",
    "2xl": "w-5 h-5 border-2",
    "3xl": "w-6 h-6 border-2",
  };

  const variants = {
    default: "ring-2 ring-white dark:ring-gray-800 shadow-lg",
    gradient: "ring-2 ring-white dark:ring-gray-800 shadow-xl",
    glass: "ring-1 ring-white/20 backdrop-blur-sm shadow-2xl",
    outlined: "ring-2 ring-gray-200 dark:ring-gray-700 shadow-md",
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const actualStatus = isOnline ? "online" : status || "offline";

  const gradients = [
    "from-[#5932EA] via-purple-600 to-blue-600",
    "from-emerald-500 via-green-600 to-teal-600",
    "from-pink-500 via-rose-600 to-red-600",
    "from-amber-500 via-orange-600 to-yellow-600",
    "from-indigo-500 via-blue-600 to-cyan-600",
  ];

  const getGradient = (name) => {
    if (!name) return gradients[0];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full overflow-hidden transition-all duration-300 ease-out
          ${variants[variant]}
          ${
            onClick
              ? "cursor-pointer hover:ring-[#5932EA] hover:scale-105 transform active:scale-95"
              : ""
          }
          `}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {src ? (
          <>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
            <div
              className={`w-full h-full bg-gradient-to-br ${getGradient(
                alt
              )} flex items-center justify-center text-white font-bold hidden animate-fade-in`}
            >
              {getInitials(alt)}
            </div>
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${getGradient(
              alt
            )} flex items-center justify-center text-white font-bold shadow-inner`}
          >
            {alt ? (
              getInitials(alt)
            ) : (
              <User className="w-1/2 h-1/2 text-white/90" />
            )}
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {(status || isOnline) && showStatus && (
        <div
          className={`absolute bottom-0 right-0 transform translate-x-1 translate-y-1
            ${statusSizes[size]}
            ${statusColors[actualStatus]} 
            rounded-full border-white dark:border-gray-800
            ${
              actualStatus === "online"
                ? "animate-pulse shadow-lg"
                : "shadow-md"
            }
            transition-all duration-1500
          `}
          title={actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
        />
      )}

      {/* Custom Status Emoji */}
      {customStatus && (
        <div
          className={`absolute -bottom-1 -right-1 
            ${size === "xs" || size === "sm" ? "text-xs" : "text-sm"} 
            bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg 
            ring-2 ring-white dark:ring-gray-800 hover:scale-110 transition-transform`}
        >
          {customStatus}
        </div>
      )}

      {/* Badge (for notifications, admin, etc) */}
      {badge && (
        <div
          className={`absolute -top-1 -right-1 
            ${
              size === "xs" || size === "sm"
                ? "text-xs px-1.5 py-0.5"
                : "text-xs px-2 py-1"
            } 
            bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full 
            font-bold shadow-lg min-w-[20px] flex items-center justify-center
            animate-bounce`}
        >
          {badge}
        </div>
      )}
    </div>
  );
};

export default Avatar;
