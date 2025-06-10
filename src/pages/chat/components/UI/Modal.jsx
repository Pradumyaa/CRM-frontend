import { useEffect, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  showCloseButton = true,
  className = "",
  centered = true,
  variant = "glass", // default glass for premium look
  maxHeight = "90vh",
  preventClose = false,
  onBeforeClose = null,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const sizes = {
    xs: "max-w-sm",
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    "3xl": "max-w-7xl",
    full: "max-w-[95vw]",
  };

  const variants = {
    default: "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600",
    glass: "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/30 dark:border-slate-600/40 shadow-2xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-600",
    elevated: "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-2xl",
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    if (!isOpen) setIsMaximized(false);
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = async (e) => {
      if (e.key === "Escape" && isOpen && !preventClose) {
        if (onBeforeClose && !(await onBeforeClose())) return;
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, preventClose, onBeforeClose]);

  const tryClose = async () => {
    if (preventClose) return;
    if (onBeforeClose && !(await onBeforeClose())) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => closeOnOverlay && tryClose()}
      />

      {/* Container */}
      <div className={`flex min-h-screen p-6 ${centered ? "items-center justify-center" : "items-start pt-16 justify-center"}`}>
        <div
          className={`
            relative w-full rounded-2xl overflow-hidden transition-all duration-300 ease-out
            ${isMaximized ? "max-w-[95vw] h-[95vh]" : sizes[size]}
            ${variants[variant]} ${className}
          `}
          style={{ maxHeight: isMaximized ? "95vh" : maxHeight }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-t-2xl">
              {/* Accent Gradient Bar */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#5932EA] to-purple-500" />

              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}

              {/* Controls */}
              <div className="flex items-center gap-1">
                {size !== "xs" && size !== "sm" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                    icon={isMaximized ? Minimize2 : Maximize2}
                  />
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={tryClose}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1.5 hover:bg-red-100/60 dark:hover:bg-red-900/40 rounded-md"
                    icon={X}
                  />
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: isMaximized ? "calc(95vh - 130px)" : `calc(${maxHeight} - 130px)`,
            }}
          >
            <div className="p-6">{children}</div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 rounded-b-2xl flex justify-end items-center gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
