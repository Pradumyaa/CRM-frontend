// Updated Sidebar.jsx with complete super_admin access
import { useState } from "react";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdMenu,
  MdSettings,
  MdLogout,
  MdDashboard,
  MdPerson,
  MdShoppingBag,
  MdAttachMoney,
  MdBusinessCenter,
  MdDateRange,
  MdChat,
  MdWorkspaces,
  MdSupervisorAccount,
  MdAssignment,
  MdBarChart,
  MdAnalytics,
  MdRequestPage,
  MdPeople,
  MdFolderOpen,
  MdTrackChanges,
  MdAdminPanelSettings,
  MdSecurity,
  MdBusiness,
  MdVerifiedUser,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/GetMaxLogo.svg";

const Sidebar = ({ selectedItem, onItemSelect }) => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  // Use authentication context
  const { user, isAdmin, logout, userRole, isSuperAdmin } = useAuth();

  // Role hierarchy for access control
  const ROLE_LEVELS = {
    super_admin: 1,
    product_owner: 2,
    admin: 3,
    cxo_director: 4,
    senior_manager: 5,
    manager: 6,
    assistant_manager: 7,
    senior_team_lead: 8,
    team_lead: 9,
    assistant_team_lead: 10,
    senior_associate: 11,
    associate: 12,
    intern: 13,
    viewer: 14,
  };

  const currentUserLevel = ROLE_LEVELS[userRole] || 14;

  // Check if user has access to a feature based on role level
  // Super admin gets access to everything
  const hasAccess = (requiredLevel) => {
    if (isSuperAdmin || userRole === "super_admin") return true;
    return currentUserLevel <= requiredLevel;
  };

  // Build navigation items with role-based access control
  const baseItems = [
    { label: "Dashboard", icon: <MdDashboard size={18} />, key: "dashboard" },
    { label: "Profile", icon: <MdPerson size={18} />, key: "profile" },
    { label: "Attendance", icon: <MdDateRange size={18} />, key: "help" },
  ];

  // Organization section with ALL possible sub-items
  const organizationItems = {
    label: "Organisation",
    icon: <MdBusinessCenter size={18} />,
    hasDropdown: true,
    key: "organisation",
    subItems: [
      // Employee Management
      {
        label: "Employee List",
        key: "employeeList",
        icon: <MdPeople size={16} />,
        requiredLevel: 3,
      },

      // Super Admin Panel - Only for super_admin
      {
        label: "Super Admin Panel",
        key: "superAdminPanel",
        icon: <MdAdminPanelSettings size={16} />,
        requiredLevel: 1,
      },

      // Role Management - Super Admin and Product Owner
      {
        label: "Role Management",
        key: "roleManagement",
        icon: <MdSecurity size={16} />,
        requiredLevel: 2,
      },

      // Documents
      {
        label: "Documents",
        key: "documents",
        icon: <MdFolderOpen size={16} />,
        requiredLevel: 6,
      },

      // Activity Tracker
      {
        label: "Activity Tracker",
        key: "activityTracker",
        icon: <MdTrackChanges size={16} />,
        requiredLevel: 9,
      },

      // Analytics
      {
        label: "Analytics",
        key: "analytics",
        icon: <MdAnalytics size={16} />,
        requiredLevel: 5,
      },

      // Reports
      {
        label: "Reports",
        key: "reports",
        icon: <MdBarChart size={16} />,
        requiredLevel: 6,
      },

      // Requests
      {
        label: "Requests",
        key: "requests",
        icon: <MdRequestPage size={16} />,
        requiredLevel: 7,
      },

      // Department Management
      {
        label: "Departments",
        key: "departments",
        icon: <MdBusiness size={16} />,
        requiredLevel: 4,
      },

      // Permissions - Super Admin only
      {
        label: "Permissions",
        key: "permissions",
        icon: <MdVerifiedUser size={16} />,
        requiredLevel: 1,
      },
    ],
  };

  // Filter items based on access (super_admin sees everything)
  const filteredOrganizationItems = {
    ...organizationItems,
    subItems: organizationItems.subItems.filter((item) =>
      hasAccess(item.requiredLevel)
    ),
  };

  // Additional sections - super_admin gets access to all
  const additionalItems = [];

  // Chat and Workspaces (Team leads and above, but super_admin gets all)
  if (hasAccess(8)) {
    additionalItems.push(
      { label: "Chat", icon: <MdChat size={18} />, key: "chat" },
      { label: "Workspaces", icon: <MdWorkspaces size={18} />, key: "spaces" }
    );
  }

  // Income section (Managers and above, but super_admin gets all)
  if (hasAccess(6)) {
    additionalItems.push({
      label: "Income",
      icon: <MdAttachMoney size={18} />,
      key: "income",
    });
  }

  // Build final navigation items
  const navigationItems = [
    ...baseItems,
    ...(filteredOrganizationItems.subItems.length > 0
      ? [filteredOrganizationItems]
      : []),
    ...additionalItems,
  ];

  const handleItemClick = (item) => {
    if (item.hasDropdown) {
      setOpenDropdown(openDropdown === item.label ? "" : item.label);
    } else {
      setOpenDropdown("");
      if (onItemSelect) {
        onItemSelect(item.key);
      }
    }
  };

  const handleSubItemClick = (parentLabel, subItemKey) => {
    setOpenDropdown(parentLabel);
    if (onItemSelect) {
      onItemSelect(subItemKey);
    }
  };

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      super_admin: "Super Admin",
      product_owner: "Product Owner",
      admin: "Administrator",
      cxo_director: "CXO/Director",
      senior_manager: "Senior Manager",
      manager: "Manager",
      assistant_manager: "Assistant Manager",
      senior_team_lead: "Senior Team Lead",
      team_lead: "Team Lead",
      assistant_team_lead: "Assistant Team Lead",
      senior_associate: "Senior Associate",
      associate: "Associate",
      intern: "Intern",
      viewer: "Viewer/Auditor",
    };
    return roleNames[role] || "Employee";
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg border-r border-gray-200 fixed md:relative transition-all duration-300 ease-in-out flex flex-col h-screen ${
          isSidebarOpen ? "w-[280px]" : "w-[60px]"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center border-b border-gray-200 py-3 ${
            isSidebarOpen ? "px-4 justify-between" : "justify-center"
          }`}
        >
          {/* Hide logo when collapsed */}
          {isSidebarOpen && (
            <div className="transition-opacity duration-300">
              <img src={logo} alt="Company Logo" className="h-6" />
            </div>
          )}

          {/* Sidebar Toggle Button - centered when collapsed */}
          <button
            className={`text-gray-500 hover:text-[#5932EA] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 ${
              isSidebarOpen ? "ml-auto" : ""
            }`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <MdMenu size={18} />
          </button>
        </div>

        {/* User info section with role badge */}
        {isSidebarOpen && (
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-600">
                  {getRoleDisplayName(userRole)}
                </p>
                {/* Super Admin Badge */}
                {isSuperAdmin && (
                  <p className="text-xs text-purple-600 font-medium">
                    ⭐ Full Access
                  </p>
                )}
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isSuperAdmin
                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                    : currentUserLevel <= 3
                    ? "bg-purple-100 text-purple-800"
                    : currentUserLevel <= 6
                    ? "bg-blue-100 text-blue-800"
                    : currentUserLevel <= 9
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isSuperAdmin ? "SA" : `L${currentUserLevel}`}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Content */}
        <div className="py-2 px-2 flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <div key={item.key} className="relative">
                {/* Main menu item */}
                <div className="group relative">
                  <button
                    id={item.key}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex justify-between items-center gap-2 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                      selectedItem === item.key || openDropdown === item.label
                        ? "bg-[#5932EA] text-white shadow-md"
                        : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#5932EA]"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 ${
                        isSidebarOpen ? "" : "justify-center w-full"
                      }`}
                    >
                      <div
                        className={`transition-colors duration-200 ${
                          selectedItem === item.key ||
                          openDropdown === item.label
                            ? "text-white"
                            : "text-[#5932EA]"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={`font-medium text-sm transition-all duration-200 ${
                          isSidebarOpen
                            ? "block opacity-100"
                            : "hidden opacity-0 w-0"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {item.hasDropdown && isSidebarOpen && (
                      <div className="text-sm">
                        {openDropdown === item.label ? (
                          <MdKeyboardArrowDown
                            size={16}
                            className={`transition-all duration-200 ${
                              selectedItem === item.key ||
                              openDropdown === item.label
                                ? "text-white"
                                : "text-[#5932EA]"
                            }`}
                          />
                        ) : (
                          <MdKeyboardArrowRight
                            size={16}
                            className={`transition-all duration-200 ${
                              selectedItem === item.key ||
                              openDropdown === item.label
                                ? "text-white"
                                : "text-[#5932EA]"
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Tooltip for collapsed sidebar */}
                  {!isSidebarOpen &&
                    hoveredItem &&
                    hoveredItem.key === item.key && (
                      <div
                        style={{
                          position: "fixed",
                          left: "65px",
                          top: (() => {
                            const element = document.getElementById(item.key);
                            if (element) {
                              const rect = element.getBoundingClientRect();
                              return `${
                                rect.top + window.scrollY + rect.height / 2 - 20
                              }px`;
                            }
                            return "0px";
                          })(),
                          zIndex: 1000,
                        }}
                        className="bg-gray-900 text-white shadow-lg rounded-md py-2 px-3 min-w-[120px] text-sm font-medium"
                        id={`tooltip-${item.key}`}
                      >
                        {item.label}
                        <div className="absolute left-0 top-[50%] transform -translate-x-[4px] -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                      </div>
                    )}
                </div>

                {/* Enhanced Dropdown content with visual indicators */}
                {item.hasDropdown &&
                  openDropdown === item.label &&
                  isSidebarOpen && (
                    <div className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-2 ml-2 border-l-2 border-[#5932EA]">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.key} className="relative">
                          <button
                            onClick={() =>
                              handleSubItemClick(item.label, subItem.key)
                            }
                            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                              selectedItem === subItem.key
                                ? "bg-[#5932EA] text-white shadow-sm"
                                : "text-[#6B7280] hover:bg-white hover:text-[#5932EA] hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center w-full">
                              {/* Sub-item icon */}
                              <div
                                className={`mr-3 transition-colors duration-200 ${
                                  selectedItem === subItem.key
                                    ? "text-white"
                                    : "text-[#5932EA] group-hover:text-[#5932EA]"
                                }`}
                              >
                                {subItem.icon}
                              </div>

                              <span
                                className={`flex-1 text-left font-medium ${
                                  selectedItem === subItem.key
                                    ? "text-white"
                                    : "text-gray-700 group-hover:text-[#5932EA]"
                                }`}
                              >
                                {subItem.label}
                              </span>

                              {/* Role level indicator or Super Admin badge */}
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  selectedItem === subItem.key
                                    ? "bg-white/20 text-white"
                                    : isSuperAdmin &&
                                      subItem.requiredLevel === 1
                                    ? "bg-purple-200 text-purple-800 group-hover:bg-purple-300"
                                    : "bg-gray-200 text-gray-600 group-hover:bg-[#5932EA]/10 group-hover:text-[#5932EA]"
                                }`}
                              >
                                {isSuperAdmin && subItem.requiredLevel === 1
                                  ? "SA"
                                  : `L${subItem.requiredLevel}`}
                              </span>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        {/* Enhanced Bottom Section */}
        <div
          className={`border-t border-gray-200 transition-all duration-300 ${
            isSidebarOpen ? "p-3" : "p-2"
          }`}
        >
          <div
            className={`flex ${
              isSidebarOpen ? "justify-between" : "flex-col items-center"
            } gap-2`}
          >
            <div className="relative">
              <button
                onClick={handleLogout}
                onMouseEnter={() =>
                  handleMouseEnter({ key: "logout", label: "Logout" })
                }
                onMouseLeave={handleMouseLeave}
                className="flex items-center gap-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 transition-all duration-200 p-2.5 rounded-lg w-full justify-center group"
              >
                <MdLogout size={18} />
                <span
                  className={`text-sm font-medium ${
                    isSidebarOpen ? "block" : "hidden"
                  }`}
                >
                  Logout
                </span>
              </button>

              {/* Tooltip for logout */}
              {!isSidebarOpen &&
                hoveredItem &&
                hoveredItem.key === "logout" && (
                  <div className="absolute left-full top-1/2 ml-2 bg-gray-900 text-white shadow-lg rounded-md py-2 px-3 z-10 text-sm font-medium -translate-y-1/2">
                    Logout
                    <div className="absolute left-0 top-[50%] transform -translate-x-[4px] -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                )}
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 text-[#6B7280] hover:text-[#5932EA] hover:bg-[#F8FAFC] transition-all duration-200 p-2.5 rounded-lg w-full justify-center group"
                onMouseEnter={() =>
                  handleMouseEnter({ key: "settings", label: "Settings" })
                }
                onMouseLeave={handleMouseLeave}
              >
                <MdSettings size={18} />
                <span
                  className={`text-sm font-medium ${
                    isSidebarOpen ? "block" : "hidden"
                  }`}
                >
                  Settings
                </span>
              </button>

              {/* Tooltip for settings */}
              {!isSidebarOpen &&
                hoveredItem &&
                hoveredItem.key === "settings" && (
                  <div className="absolute left-full top-1/2 ml-2 bg-gray-900 text-white shadow-lg rounded-md py-2 px-3 z-10 text-sm font-medium -translate-y-1/2">
                    Settings
                    <div className="absolute left-0 top-[50%] transform -translate-x-[4px] -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                )}
            </div>
          </div>

          {isSidebarOpen && (
            <div className="mt-3 text-center text-xs text-gray-400">
              <p>&copy; 2024 Dashboard. All rights reserved.</p>
              <p className="mt-1">
                Access Level:{" "}
                <span
                  className={`font-medium ${
                    isSuperAdmin ? "text-purple-600" : "text-[#5932EA]"
                  }`}
                >
                  {isSuperAdmin ? "Super Admin" : `L${currentUserLevel}`}
                </span>
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
