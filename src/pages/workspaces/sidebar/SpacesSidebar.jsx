// Updated SpacesSidebar.jsx
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  LifeBuoy,
  Users,
  Layout,
  FolderPlus,
  Star,
  Clock,
  Calendar,
  Check,
  MoreHorizontal,
  User,
  ChevronDown,
  ChevronUp,
  LogOut
} from "lucide-react";
import SpacesList from "../spaces/SpacesList";
import useSpacesStore from "@/store/useSpacesStore";
import AddSpaceModal from "../spaces/AddSpaceModal";
import { clearAuth } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const SpacesSidebar = ({
  onSelectProjectList,
  isCollapsed = false,
  toggleCollapse,
}) => {
  const navigate = useNavigate();
  const { spaces, loading, error, team } = useSpacesStore();
  const [expandedSpaces, setExpandedSpaces] = useState({});
  const [expandedFolders, setExpandedFolders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSpaceModalOpen, setIsAddSpaceModalOpen] = useState(false);
  const [showTeamSection, setShowTeamSection] = useState(true);
  const [showSpacesSection, setShowSpacesSection] = useState(true);
  const [showFavoritesSection, setShowFavoritesSection] = useState(true);
  const [showFiltersSection, setShowFiltersSection] = useState(true);
  const searchInputRef = useRef(null);

  // Expand important spaces by default
  useEffect(() => {
    if (spaces && spaces.length > 0) {
      const initialExpanded = {};
      spaces.forEach((space, index) => {
        // Expand the first couple of spaces by default
        if (index < 2) {
          initialExpanded[space.id] = true;
        }
      });
      setExpandedSpaces(initialExpanded);
    }
  }, [spaces]);

  const toggleSpaceExpand = (spaceId) => {
    setExpandedSpaces({
      ...expandedSpaces,
      [spaceId]: !expandedSpaces[spaceId],
    });
  };

  const toggleFolderExpand = (folderId) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId],
    });
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login'); // ✅ react-router-dom version
  };
  

  // Handle search with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Favorites section for quick access
  const favorites = [
    {
      id: "today",
      name: "Today",
      icon: <Calendar size={16} className="text-blue-500" />,
    },
    {
      id: "upcoming",
      name: "Upcoming",
      icon: <Clock size={16} className="text-purple-500" />,
    },
    {
      id: "completed",
      name: "Completed",
      icon: <Check size={16} className="text-green-500" />,
    },
    {
      id: "starred",
      name: "Starred",
      icon: <Star size={16} className="text-amber-500" />,
    },
  ];

  // Quick filters
  const filters = [
    { id: "my-tasks", name: "My Tasks", count: 12 },
    { id: "assigned", name: "Assigned to me", count: 5 },
    { id: "due-soon", name: "Due soon", count: 3 },
    { id: "high-priority", name: "High priority", count: 7 },
  ];

  return (
    <div
      className={`h-screen bg-white flex flex-col border-r border-gray-200 ${
        isCollapsed ? "w-16" : "w-72"
      }`}
    >
      {/* App Logo & Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">
              TM
            </div>
            <h1 className="ml-2 text-lg font-semibold text-gray-900">
              TaskMaster
            </h1>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold mx-auto">
            TM
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="absolute right-0 top-4 p-1 text-gray-500 hover:bg-gray-100 rounded-full transform translate-x-1/2"
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Main sidebar content with scroll */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {/* Search */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="bg-gray-100 w-full pl-10 pr-4 py-2 text-sm text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                  ⌘K
                </div>
              )}
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="px-2 py-3">
            <button
              onClick={toggleCollapse}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg mx-auto"
              title="Search (⌘K)"
            >
              <Search size={18} />
            </button>
          </div>
        )}

        {/* Favorites Section */}
        {!isCollapsed && (
          <div className="mb-2">
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setShowFavoritesSection(!showFavoritesSection)}
            >
              <div className="flex items-center text-sm font-medium text-gray-700">
                {showFavoritesSection ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span className="ml-1">Favorites</span>
              </div>
            </div>

            {showFavoritesSection && (
              <div className="space-y-1 px-3">
                {favorites.map((item) => (
                  <button
                    key={item.id}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isCollapsed &&
          favorites.map((item) => (
            <div key={item.id} className="mb-1 px-2">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg mx-auto"
                title={item.name}
              >
                {item.icon}
              </button>
            </div>
          ))}

        {/* Quick Filters Section */}
        {!isCollapsed && (
          <div className="mb-4">
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setShowFiltersSection(!showFiltersSection)}
            >
              <div className="flex items-center text-sm font-medium text-gray-700">
                {showFiltersSection ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span className="ml-1">Filters</span>
              </div>
            </div>

            {showFiltersSection && (
              <div className="space-y-1 px-3">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <span>{filter.name}</span>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spaces Section */}
        <div className={`${!isCollapsed ? "px-2" : "px-0"} mb-4`}>
          {!isCollapsed && (
            <div
              className="flex items-center justify-between px-3 py-2 cursor-pointer"
              onClick={() => setShowSpacesSection(!showSpacesSection)}
            >
              <div className="flex items-center text-sm font-medium text-gray-700">
                {showSpacesSection ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span className="ml-1">Spaces</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddSpaceModalOpen(true);
                }}
                className="p-1 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-700"
                id="add-project-button"
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center my-2">
              <button
                onClick={() => setIsAddSpaceModalOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Add Space"
                id="add-project-button"
              >
                <Plus size={18} />
              </button>
            </div>
          )}

          {loading && !isCollapsed && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && !isCollapsed && (
            <div className="px-4 py-3 text-red-500 text-sm">
              <p>Error loading spaces</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-indigo-600 hover:underline mt-1"
              >
                Retry
              </button>
            </div>
          )}

          {!isCollapsed && showSpacesSection && !loading && (
            <SpacesList
              spaces={spaces || []}
              expandedSpaces={expandedSpaces}
              expandedFolders={expandedFolders}
              toggleSpaceExpand={toggleSpaceExpand}
              toggleFolderExpand={toggleFolderExpand}
              onSelectProjectList={onSelectProjectList}
              searchTerm={searchTerm}
              isCollapsed={isCollapsed}
            />
          )}

          {isCollapsed && !loading && (
            <div className="flex flex-col items-center space-y-2 py-2">
              {(spaces || []).slice(0, 3).map((space) => (
                <div
                  key={space.id}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-xs cursor-pointer"
                  style={{ backgroundColor: space.color || "#4f46e5" }}
                  title={space.name}
                  onClick={() => {
                    if (
                      space.folders.length > 0 &&
                      space.folders[0].projectLists.length > 0
                    ) {
                      onSelectProjectList(space.folders[0].projectLists[0].id);
                    }
                  }}
                >
                  {space.name.substring(0, 2).toUpperCase()}
                </div>
              ))}
              {(spaces || []).length > 3 && (
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-200 text-gray-600 text-xs cursor-pointer"
                  title="More spaces"
                  onClick={toggleCollapse}
                >
                  +{(spaces || []).length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team Section */}
        {!isCollapsed && (
          <div className="mb-4">
            <div
              className="flex items-center px-4 py-2 cursor-pointer"
              onClick={() => setShowTeamSection(!showTeamSection)}
            >
              {showTeamSection ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="ml-1 text-sm font-medium text-gray-700">
                Team
              </span>
            </div>

            {showTeamSection && (
              <div className="pl-3 space-y-1">
                {(team || []).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center overflow-hidden">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={14} className="text-gray-600" />
                      )}
                    </div>
                    <span>{member.name}</span>
                  </div>
                ))}
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm text-indigo-600 rounded-md hover:bg-gray-100"
                >
                  <Plus size={16} className="mr-2" />
                  <span>Add Team Member</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Space Modal */}
      <AddSpaceModal
        isOpen={isAddSpaceModalOpen}
        onClose={() => setIsAddSpaceModalOpen(false)}
      />

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <LifeBuoy size={16} className="mr-2" />
              <span>Help & Support</span>
            </a>
            <div className="flex">
              <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-md">
                <Settings size={16} />
              </button>
              <button 
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-md ml-1"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="py-3 border-t border-gray-200 flex flex-col items-center">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full mb-2">
            <Settings size={16} />
          </button>
          <button 
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SpacesSidebar;