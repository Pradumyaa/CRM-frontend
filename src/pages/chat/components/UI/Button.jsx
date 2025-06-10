// src/pages/chat/components/UI/Button.jsx
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = "left",
  className = "",
  fullWidth = false,
  rounded = "xl",
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-[#5932EA] to-purple-600 hover:from-purple-600 hover:to-[#5932EA] text-white shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 border-transparent",
    secondary:
      "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 shadow-md hover:shadow-lg hover:border-[#5932EA]/50",
    success:
      "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border-transparent",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl border-transparent",
    warning:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl border-transparent",
    ghost:
      "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white border-transparent",
    outline:
      "border-2 border-[#5932EA] text-[#5932EA] dark:text-purple-400 hover:bg-[#5932EA] hover:text-white dark:hover:bg-purple-600 bg-transparent transition-all duration-300",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs min-h-[28px] gap-1",
    sm: "px-3 py-2 text-sm min-h-[36px] gap-1.5",
    md: "px-4 py-2.5 text-sm min-h-[44px] gap-2",
    lg: "px-6 py-3 text-base min-h-[52px] gap-2.5",
    xl: "px-8 py-4 text-lg min-h-[60px] gap-3",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const roundedSizes = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const isDisabled = loading || disabled;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 ease-out focus:outline-none 
        focus:ring-2 focus:ring-[#5932EA]/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800
        transform hover:scale-[1.02] active:scale-[0.98] 
        disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:hover:scale-100
        ${variants[variant]} 
        ${sizes[size]} 
        ${roundedSizes[rounded]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <Loader2 className={`${iconSizes[size]} animate-spin flex-shrink-0`} />
      )}

      {/* Left Icon */}
      {!loading && Icon && iconPosition === "left" && (
        <Icon className={`${iconSizes[size]} flex-shrink-0`} />
      )}

      {/* Button Text */}
      {children && (
        <span
          className={
            loading || (Icon && !children) ? "sr-only" : "flex-shrink-0"
          }
        >
          {children}
        </span>
      )}

      {/* Right Icon */}
      {!loading && Icon && iconPosition === "right" && (
        <Icon className={`${iconSizes[size]} flex-shrink-0`} />
      )}
    </button>
  );
};

export default Button;
