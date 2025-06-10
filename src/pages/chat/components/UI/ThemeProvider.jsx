// src/pages/chat/components/UI/ThemeProvider.jsx
import React, { createContext, useContext, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import Button from "./Button";
import Tooltip from "./Tooltip";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("chat-theme");
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        return savedTheme;
      }
      return "system";
    }
    return "light";
  });

  const [systemTheme, setSystemTheme] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const currentTheme = theme === "system" ? systemTheme : theme;

  const setThemeAndSave = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("chat-theme", newTheme);
  };

  const toggleTheme = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeAndSave(themes[nextIndex]);
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setSystemTheme(e.matches ? "dark" : "light");
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (currentTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Add enhanced global styles
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --animate-duration: 0.3s;
      }

      /* Enhanced scrollbars */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-track {
        background: ${currentTheme === "dark" ? "#1f2937" : "#f3f4f6"};
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 3px;
        transition: all 0.3s ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
      }

      /* Animations */
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      @keyframes wave {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.5); }
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-wave {
        animation: wave 1.4s ease-in-out infinite;
      }

      .animate-shimmer {
        animation: shimmer 1.5s infinite;
      }

      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }

      /* Glass morphism */
      .glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .glass-dark {
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Hover effects */
      .hover-lift {
        transition: transform 0.2s ease;
      }

      .hover-lift:hover {
        transform: translateY(-2px);
      }

      /* Loading skeleton */
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      .skeleton-dark {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
    `;

    const existingStyle = document.head.querySelector("#chat-theme-styles");
    if (existingStyle) document.head.removeChild(existingStyle);

    style.id = "chat-theme-styles";
    document.head.appendChild(style);

    return () => {
      const styleEl = document.head.querySelector("#chat-theme-styles");
      if (styleEl) document.head.removeChild(styleEl);
    };
  }, [currentTheme]);

  const value = {
    theme,
    currentTheme,
    systemTheme,
    setTheme: setThemeAndSave,
    toggleTheme,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
    isSystem: theme === "system",
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`${currentTheme} transition-all duration-300 ease-in-out`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const ThemeToggle = ({
  variant = "ghost",
  size = "sm",
  className = "",
  showLabel = false,
}) => {
  const { theme, currentTheme, toggleTheme, isDark, isSystem } = useTheme();

  const getIcon = () => {
    if (theme === "system") return Monitor;
    if (isDark) return Sun;
    return Moon;
  };

  const getTooltipText = () => {
    if (theme === "system") return `System theme (currently ${currentTheme})`;
    return `Switch to ${isDark ? "light" : "dark"} mode`;
  };

  const getLabel = () => {
    if (theme === "system") return "System";
    return isDark ? "Dark" : "Light";
  };

  const Icon = getIcon();

  return (
    <Tooltip content={getTooltipText()} disabled={showLabel}>
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden transition-all duration-300 ${className}`}
        onClick={toggleTheme}
        icon={Icon}
      >
        {showLabel && <span className="ml-2">{getLabel()}</span>}
        {isSystem && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
      </Button>
    </Tooltip>
  );
}

export default ThemeProvider;