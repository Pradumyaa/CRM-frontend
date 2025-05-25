// pages/components/sidebar/Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 md:px-6 py-3">
        {/* Left section - Search */}
        <div className="w-full max-w-xs">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Right section - User menu & notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">
                    Notifications
                  </h3>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {/* Notification items */}
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          New message from John
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          5 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Task assigned to you
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                          <Bell className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Meeting reminder
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Tomorrow at 10:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-center w-full text-indigo-600 hover:text-indigo-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={toggleProfileMenu}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {isAdmin ? "Administrator" : "Employee"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <User className="h-4 w-4 mr-3 text-gray-500" />
                  Profile
                </button>

                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Settings className="h-4 w-4 mr-3 text-gray-500" />
                  Settings
                </button>

                <div className="border-t border-gray-200"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-3 text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
