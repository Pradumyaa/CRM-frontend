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
  const [isStarred, setIsStarred] = useState(false);
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

  const handleDeleteFolder = (e) => {
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${folder.name}" folder? This action cannot be undone.`
      )
    ) {
      deleteFolder(spaceId, folder.id);
    }
    setShowMenu(false);
  };

  const toggleStar = (e) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
    setShowMenu(false);
  };

  return (
    <li
      className={`mb-1 rounded-md overflow-hidden transition-colors duration-200 
        ${matchesSearch ? "bg-indigo-50/50" : ""}`}
    >
      {/* Folder Header */}
      <div
        className={`flex items-center px-3 py-2 cursor-pointer rounded-md transition-colors duration-150 ${
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
        {activeHover && (
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
