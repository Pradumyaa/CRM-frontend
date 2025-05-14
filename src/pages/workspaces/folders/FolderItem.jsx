// Updated FolderItem.jsx
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Heart,
  Bookmark,
  Archive,
  Lock,
  File,
  Code,
  Share2,
  Download,
} from "lucide-react";
import ProjectListsList from "../projectLists/ProjectListsList";
import AddProjectListModal from "../projectLists/AddProjectListModal";
import EditFolderModal from "./EditFolderModal";
import useSpacesStore from "@/store/useSpacesStore";

// Map of icon names to components
const iconMap = {
  folder: Folder,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  archive: Archive,
  lock: Lock,
  file: File,
  code: Code,
};

const FolderItem = ({
  spaceId,
  folder,
  isExpanded,
  toggleExpand,
  onSelectProjectList,
  searchTerm,
}) => {
  const { deleteFolder } = useSpacesStore();
  const [activeHover, setActiveHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isAddProjectListModalOpen, setIsAddProjectListModalOpen] =
    useState(false);
  const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(folder.isStarred || false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

  // Handle outside clicks for dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Get the icon component based on folder settings or default to Folder
  const FolderIcon =
    folder.icon && iconMap[folder.icon] ? iconMap[folder.icon] : Folder;

  // Filter project lists if search term is present
  const filteredProjectLists = searchTerm
    ? folder.projectLists.filter((list) =>
        list.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : folder.projectLists;

  // Auto-expand folder if search matches any of its project lists
  const shouldAutoExpand = searchTerm && filteredProjectLists.length > 0;

  // Check if folder or any of its projects match search
  const matchesSearch =
    searchTerm &&
    (folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filteredProjectLists.length > 0);

  const handleEditFolder = (e) => {
    e.stopPropagation();
    setIsEditFolderModalOpen(true);
    setShowMenu(false);
  };

  const handleDeleteFolder = async (e) => {
    e.stopPropagation();
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${folder.name}" folder? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        setError(null);
        await deleteFolder(spaceId, folder.id);
      } catch (err) {
        setError(err.message || "Failed to delete folder");
        console.error("Error deleting folder:", err);
      } finally {
        setIsDeleting(false);
        setShowMenu(false);
      }
    } else {
      setShowMenu(false);
    }
  };

  const toggleStar = async (e) => {
    e.stopPropagation();
    // In a real implementation, this would update the folder in the backend
    setIsStarred(!isStarred);
    setShowMenu(false);
    
    // We would update the folder in the backend with something like:
    // try {
    //   await updateFolder(spaceId, folder.id, { isStarred: !isStarred });
    // } catch (err) {
    //   console.error("Error starring folder:", err);
    //   setIsStarred(isStarred); // Revert on error
    // }
  };
  
  // Show error message if delete failed
  if (error) {
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  }

  return (
    <li
      className={`mb-1 rounded-md overflow-hidden transition-colors duration-200 
        ${matchesSearch ? "bg-indigo-50/50" : ""}`}
    >
      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-1 mb-1 rounded">
          {error}
        </div>
      )}
      
      {/* Folder Header */}
      <div
        className={`flex items-center px-3 py-2 cursor-pointer rounded-md transition-colors duration-150 ${
          isDeleting ? "opacity-50 pointer-events-none" : ""
        } ${
          activeHover
            ? "bg-gray-100"
            : matchesSearch
            ? "hover:bg-indigo-100/50"
            : "hover:bg-gray-100"
        }`}
        onClick={toggleExpand}
        onMouseEnter={() => setActiveHover(true)}
        onMouseLeave={() => {
          setActiveHover(false);
          if (!showMenu) setShowMenu(false);
        }}
      >
        <div className="flex-shrink-0">
          {isExpanded || shouldAutoExpand ? (
            <ChevronDown size={14} className="text-gray-500" />
          ) : (
            <ChevronRight size={14} className="text-gray-500" />
          )}
        </div>

        <FolderIcon
          size={14}
          className="ml-1"
          style={{ color: folder.color || "#64748b" }}
        />

        <span className="text-sm font-medium text-gray-700 ml-2 truncate max-w-[150px]">
          {folder.name}
          {folder.projectLists.length > 0 && (
            <span className="ml-1 text-xs text-gray-500">
              ({folder.projectLists.length})
            </span>
          )}
        </span>

        {/* Controls (visible on hover) */}
        {activeHover && !isDeleting && (
          <div className="ml-auto flex items-center gap-1">
            <button
              className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddProjectListModalOpen(true);
              }}
              title="Add Project List"
            >
              <Plus size={14} />
            </button>

            <button
              className={`p-1 rounded-full hover:bg-gray-200 ${
                isStarred ? "text-amber-400" : "text-gray-400"
              }`}
              onClick={toggleStar}
              title={isStarred ? "Unstar" : "Star"}
            >
              <Star size={14} />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                title="More Options"
              >
                <MoreVertical size={14} />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10 py-1 w-44 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleEditFolder}
                  >
                    <Edit size={14} className="mr-2" />
                    Edit Folder
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      // Would implement share functionality here
                      alert("Share functionality would open here");
                    }}
                  >
                    <Share2 size={14} className="mr-2" />
                    Share Folder
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      // Would implement export functionality here
                      alert("Export functionality would open here");
                    }}
                  >
                    <Download size={14} className="mr-2" />
                    Export Folder
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    onClick={handleDeleteFolder}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Folder
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Loading indicator when deleting */}
        {isDeleting && (
          <div className="ml-auto">
            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Add Project List Modal */}
      <AddProjectListModal
        spaceId={spaceId}
        folderId={folder.id}
        isOpen={isAddProjectListModalOpen}
        onClose={() => setIsAddProjectListModalOpen(false)}
      />

      {/* Edit Folder Modal */}
      <EditFolderModal
        spaceId={spaceId}
        folder={folder}
        isOpen={isEditFolderModalOpen}
        onClose={() => setIsEditFolderModalOpen(false)}
      />

      {/* Folder Content (Project Lists) */}
      {(isExpanded || shouldAutoExpand) && (
        <div className="ml-6">
          {filteredProjectLists.length > 0 ? (
            <ProjectListsList
              projectLists={filteredProjectLists}
              onSelectProjectList={onSelectProjectList}
              spaceId={spaceId}
              folderId={folder.id}
            />
          ) : (
            folder.projectLists.length === 0 && (
              <div className="flex flex-col items-center justify-center p-3 text-gray-500 text-xs">
                <p>No project lists yet</p>
                <button
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddProjectListModalOpen(true);
                  }}
                >
                  + Add a project list
                </button>
              </div>
            )
          )}
        </div>
      )}
    </li>
  );
};

export default FolderItem;