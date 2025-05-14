import { useEffect, useState } from "react";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdMenu,
} from "react-icons/md";
import {
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
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/GetMaxLogo.svg";

const Sidebar = ({ selectedItem, onItemSelect }) => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [user, setUser] = useState({ name: "Guest", isAdmin: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const employeeId = localStorage.getItem("employeeId");
      if (employeeId) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/employees/isAdminOrNot/${employeeId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUser({
            name: data.name || "Guest",
            isAdmin: data.isAdmin || false,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const navigationItems = [
    { label: "Dashboard", icon: <MdDashboard size={18} />, key: "dashboard" },
    { label: "Profile", icon: <MdPerson size={18} />, key: "profile" },
    // {
    //   label: "Product",
    //   icon: <MdShoppingBag size={18} />,
    //   hasDropdown: true,
    //   key: "product",
    //   subItems: [
    //     { label: "All Products", key: "allProducts" },
    //     { label: "Categories", key: "categories" },
    //     { label: "Orders", key: "orders" },
    //   ],
    // },
    // { label: "Income", icon: <MdAttachMoney size={18} />, key: "income" },
    ...(user.isAdmin
      ? [
          {
            label: "Organisation",
            icon: <MdBusinessCenter size={18} />,
            hasDropdown: true,
            key: "organisation",
            subItems: [
              { label: "Employee List", key: "employeeList" },
              { label: "Activity Tracker", key: "activityTracker" },
              { label: "Documents", key: "documents" },
            ],
          },
        ]
      : []),
    { label: "Attendance", icon: <MdDateRange size={18} />, key: "help" },
    // { label: "Chat", icon: <MdChat size={18} />, key: "chat" },
    // { label: "Spaces", icon: <MdWorkspaces size={18} />, key: "spaces" },
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

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg border-r border-gray-200 fixed md:relative transition-all duration-300 ease-in-out flex flex-col h-screen ${
          isSidebarOpen ? "w-[220px]" : "w-[60px]"
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

        {/* Sidebar Content */}
        <div className="py-2 px-2 flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <div key={item.key} className="relative">
                {/* Main menu item */}
                <div className="group relative">
                  <button
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex justify-between items-center gap-2 py-2 px-2 rounded-md transition-all duration-50 ${
                      selectedItem === item.key || openDropdown === item.label
                        ? "bg-[#5932EA] text-white hover:bg-white hover:text-[#5932EA]"
                        : "text-[#9197b3] hover:bg-[#F6F4FF] hover:text-[#5932EA] group-hover:bg-[#F6F4FF] group-hover:text-[#5932EA]"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        isSidebarOpen ? "" : "justify-center w-full"
                      }`}
                    >
                      <div
                        className={`transition-colors duration-50 ${
                          selectedItem === item.key ||
                          openDropdown === item.label
                            ? "text-white group-hover:text-[#5932EA]"
                            : "text-[#5932EA]"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={`font-medium text-sm transition-all duration-50 ${
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
                            className={`transition-colors duration-50 ${
                              selectedItem === item.key ||
                              openDropdown === item.label
                                ? "text-white group-hover:text-[#5932EA]"
                                : "text-[#5932EA]"
                            }`}
                          />
                        ) : (
                          <MdKeyboardArrowRight
                            size={16}
                            className={`transition-colors duration-50 ${
                              selectedItem === item.key ||
                              openDropdown === item.label
                                ? "text-white group-hover:text-[#5932EA]"
                                : "text-[#5932EA]"
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Tooltip using portal to render outside the sidebar to prevent scrollbars */}
                  {!isSidebarOpen &&
                    hoveredItem &&
                    hoveredItem.key === item.key && (
                      <div
                        style={{
                          position: "fixed",
                          left: "50px", // Adjusted to be slightly to the right of the icon
                          top: (() => {
                            const element = document.getElementById(item.key);
                            if (element) {
                              const rect = element.getBoundingClientRect();
                              return `${
                                rect.top + window.scrollY + rect.height / 2 - 10
                              }px`; // Adjusted for better centering
                            }
                            return "0px";
                          })(),
                          zIndex: 1000,
                        }}
                        className="bg-white shadow-md rounded-md py-2 px-3 min-w-[100px] text-[#5932EA] text-sm font-medium"
                        id={`tooltip-${item.key}`}
                      >
                        {item.label}
                        <div className="absolute left-0 top-[50%] transform -translate-x-[5px] -translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                      </div>
                    )}
                </div>

                {/* Dropdown content with visual indicators */}
                {item.hasDropdown &&
                  openDropdown === item.label &&
                  isSidebarOpen && (
                    <div className="mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.key} className="relative pl-6 pr-2">
                          {/* Visual connection line */}
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-400"></div>

                          <button
                            onClick={() =>
                              handleSubItemClick(item.label, subItem.key)
                            }
                            className={`w-full flex justify-start items-center px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-slate-300 ${
                              selectedItem === subItem.key
                                ? "bg-[#F6F4FF] text-[#5932EA] font-medium shadow-sm"
                                : "text-[#9197b3] hover:text-[#5932EA]"
                            }`}
                          >
                            <div className="flex items-center">
                              {/* Horizontal connection line */}
                              <div className="absolute left-3 top-1/2 w-2.5 h-0.5 bg-gray-400"></div>

                              {/* Visual indicator for selection */}
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  selectedItem === subItem.key
                                    ? "bg-[#5932EA]"
                                    : "border border-gray-300"
                                }`}
                              ></div>

                              <span
                                className={`${
                                  selectedItem === subItem.key
                                    ? "text-[#5932EA]"
                                    : "text-gray-600"
                                }`}
                              >
                                {subItem.label}
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

        {/* Bottom Section */}
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
                onClick={() => {
                  localStorage.removeItem("employeeId");
                  localStorage.removeItem("userData");
                  navigate("/login");
                }}
                onMouseEnter={() =>
                  handleMouseEnter({ key: "logout", label: "Logout" })
                }
                onMouseLeave={handleMouseLeave}
                className="flex items-center gap-2 text-[#9197b3] hover:text-[#5932EA] hover:bg-[#F6F4FF] transition-all duration-200 p-2 rounded-md w-full justify-center"
              >
                <MdLogout size={18} />
                <span
                  className={`text-sm ${isSidebarOpen ? "block" : "hidden"}`}
                >
                  Logout
                </span>
              </button>

              {/* Tooltip for logout */}
              {!isSidebarOpen &&
                hoveredItem &&
                hoveredItem.key === "logout" && (
                  <div className="absolute left-full top-1/2 ml-2 bg-white shadow-md rounded-md py-2 px-3 z-10 text-[#5932EA] text-sm font-medium -translate-y-1/2">
                    Logout
                    <div className="absolute left-0 top-[50%] transform -translate-x-[5px] -translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                  </div>
                )}
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 text-[#9197b3] hover:text-[#5932EA] hover:bg-[#F6F4FF] transition-all duration-200 p-2 rounded-md w-full justify-center"
                onMouseEnter={() =>
                  handleMouseEnter({ key: "settings", label: "Settings" })
                }
                onMouseLeave={handleMouseLeave}
              >
                <MdSettings size={18} />
                <span
                  className={`text-sm ${isSidebarOpen ? "block" : "hidden"}`}
                >
                  Settings
                </span>
              </button>

              {/* Tooltip for settings */}
              {!isSidebarOpen &&
                hoveredItem &&
                hoveredItem.key === "settings" && (
                  <div className="absolute left-full top-1/2 ml-2 bg-white shadow-md rounded-md py-2 px-3 z-10 text-[#5932EA] text-sm font-medium -translate-y-1/2">
                    Settings
                    <div className="absolute left-0 top-[50%] transform -translate-x-[5px] -translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                  </div>
                )}
            </div>
          </div>

          {isSidebarOpen && (
            <div className="mt-3 text-center text-xs text-gray-400">
              <p>&copy; Dashboard. All rights reserved.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
