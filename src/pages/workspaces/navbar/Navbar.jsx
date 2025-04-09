import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  List,
  BarChart2,
  Calendar,
  Columns,
  Table,
  Clock,
  Users,
  Activity,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const Navbar = ({ activeView, setActiveView, projectListId }) => {
  const { spaces } = useSpacesStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Get project list name for title
  let projectListName = "Project";
  if (projectListId) {
    for (const space of spaces) {
      for (const folder of space.folders) {
        const foundList = folder.projectLists.find(
          (list) => list.id === projectListId
        );
        if (foundList) {
          projectListName = foundList.name;
          break;
        }
      }
    }
  }

  const views = [
    { id: "overview", name: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "list", name: "List", icon: <List size={18} /> },
    { id: "gantt", name: "Gantt", icon: <BarChart2 size={18} /> },
    { id: "calendar", name: "Calendar", icon: <Calendar size={18} /> },
    { id: "kanban", name: "Kanban", icon: <Columns size={18} /> },
    { id: "table", name: "Table", icon: <Table size={18} /> },
    { id: "timeline", name: "Timeline", icon: <Clock size={18} /> },
    { id: "workload", name: "Workload", icon: <Users size={18} /> },
    { id: "activity", name: "Activity", icon: <Activity size={18} /> },
  ];

  // Sample notifications - in a real app, these would come from an API
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: "mention",
        content: "John mentioned you in Website Redesign",
        time: "5 minutes ago",
        read: false,
      },
      {
        id: 2,
        type: "task",
        content: "New task assigned: Update documentation",
        time: "1 hour ago",
        read: false,
      },
      {
        id: 3,
        type: "comment",
        content: "Sarah commented on your task",
        time: "3 hours ago",
        read: true,
      },
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm flex flex-col">
      {/* Top navbar with search, notifications, etc. */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="lg:hidden mr-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <h1 className="text-lg font-bold text-indigo-700 mr-6 whitespace-nowrap">
            TaskMaster
          </h1>

          <div
            className={`relative ${
              isSearchFocused ? "flex-grow max-w-lg" : "w-64"
            } 
              transition-all duration-200 ease-in-out`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks, projects, or team members..."
                className="border border-gray-300 rounded-md pl-8 pr-4 py-1.5 w-full text-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {isSearchFocused && searchQuery && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                rounded-md shadow-lg z-50 py-2 max-h-80 overflow-y-auto"
              >
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                  Quick Filters
                </div>
                <div className="px-3 py-2 grid grid-cols-3 gap-2">
                  <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                    <Filter size={12} className="mr-1 text-gray-500" />
                    My Tasks
                  </button>
                  <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                    <Filter size={12} className="mr-1 text-gray-500" />
                    Assigned
                  </button>
                  <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                    <Filter size={12} className="mr-1 text-gray-500" />
                    Due Soon
                  </button>
                </div>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase mt-1">
                    Recent Searches
                  </div>
                  <button className="px-3 py-2 hover:bg-gray-50 w-full text-left text-sm">
                    dashboard redesign
                  </button>
                  <button className="px-3 py-2 hover:bg-gray-50 w-full text-left text-sm">
                    quarterly report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full relative"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                            !notification.read ? "bg-indigo-50" : ""
                          }`}
                        >
                          <div className="text-sm">{notification.content}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
            <HelpCircle size={18} />
          </button>

          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
            <Settings size={18} />
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                JD
              </div>
              <ChevronDown size={16} className="text-gray-500 mr-1" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
                <div className="p-4 border-b border-gray-100">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-500">
                    john.doe@example.com
                  </div>
                </div>
                <div className="py-1">
                  <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Your Profile
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Account Settings
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Preferences
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Help & Support
                  </button>
                  <button className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project title bar (shows when a project is selected) */}
      {projectListId && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">
            {projectListName}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-1">
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white">
                JD
              </div>
              <div className="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white">
                SA
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white">
                TK
              </div>
              <button className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-medium border-2 border-white hover:bg-gray-200">
                +
              </button>
            </div>
            <div className="text-sm text-gray-500">Updated 2h ago</div>
          </div>
        </div>
      )}

      {/* View selector navbar */}
      <div className="flex items-center border-t border-gray-200 px-4 overflow-x-auto">
        {views.map((view) => (
          <button
            key={view.id}
            className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeView === view.id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveView(view.id)}
          >
            {view.icon}
            <span className="ml-2">{view.name}</span>
          </button>
        ))}
      </div>

      {/* Mobile menu (only visible on small screens) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="py-2">
            {views.map((view) => (
              <button
                key={view.id}
                className={`flex items-center px-4 py-3 text-sm font-medium w-full ${
                  activeView === view.id
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setActiveView(view.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                {view.icon}
                <span className="ml-2">{view.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
