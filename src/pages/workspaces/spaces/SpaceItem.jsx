import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Folder,
  Share2,
  Download,
  Star,
  Users,
  Briefcase,
  Layout,
  Clipboard,
} from "lucide-react";
import FoldersList from "../folders/FoldersList";
import AddFolderModal from "../folders/AddFolderModal";
import EditSpaceModal from "./EditSpaceModal";
import useSpacesStore from "@/store/useSpacesStore";
import { spaceTemplates } from "@/utils/theme"

const SpaceItem = ({
  space,
  isExpanded,
  toggleExpand,
  expandedFolders,
  toggleFolderExpand,
  onSelectProjectList,
  searchTerm,
}) => {
  const { deleteSpace } = useSpacesStore();
  const [activeHover, setActiveHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isEditSpaceModalOpen, setIsEditSpaceModalOpen] = useState(false);
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

  // Filter folders if search term is present
  const filteredFolders = searchTerm
    ? space.folders.filter((folder) => {
        // Check if folder name matches search
        if (folder.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }

        // Check if any project list name matches search
        return folder.projectLists.some((list) =>
          list.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : space.folders;

  // Auto-expand space if search matches any of its folders or lists
  const shouldAutoExpand = searchTerm && filteredFolders.length > 0;

  const handleAddFolder = (e) => {
    e.stopPropagation();
    setIsAddFolderModalOpen(true);
  };

  const handleEditSpace = (e) => {
    e.stopPropagation();
    setIsEditSpaceModalOpen(true);
    setShowMenu(false);
  };

  const handleDeleteSpace = (e) => {
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${space.name}" space? This action cannot be undone.`
      )
    ) {
      deleteSpace(space.id);
    }
    setShowMenu(false);
  };

  const toggleStar = (e) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
    setShowMenu(false);
  };

  // Check if space or any of its folders/projects match search
  const matchesSearch =
    searchTerm &&
    (space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filteredFolders.length > 0);

  // Get space template type icon (if any)
  const getTemplateIcon = () => {
    // In a real implementation, space would have a templateType property
    // For demo purposes, we'll assign a random template to show the feature
    const templateType =
      space.templateType ||
      (space.id === "space1"
        ? "personal"
        : space.id === "space2"
        ? "work"
        : null);

    if (!templateType) return null;

    switch (templateType) {
      case "work":
        return <Briefcase size={14} className="text-blue-500" />;
      case "personal":
        return <Clipboard size={14} className="text-emerald-500" />;
      default:
        return <Layout size={14} className="text-indigo-500" />;
    }
  };

  const TemplateIcon = getTemplateIcon();

  // Find the template to display its name as a tooltip
  const getTemplateName = () => {
    const templateType =
      space.templateType ||
      (space.id === "space1"
        ? "personal"
        : space.id === "space2"
        ? "work"
        : null);
    if (!templateType) return "";

    const template = spaceTemplates.find((t) => t.id === templateType);
    return template ? template.name : "";
  };

  return (
    <li
      className={`mb-1 rounded-md overflow-hidden transition-all duration-200
        ${matchesSearch ? "bg-indigo-50/50" : ""}`}
    >
      {/* Space Header */}
      <div
        className={`flex items-center px-3 py-2 cursor-pointer rounded-md transition-colors duration-150
          ${
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
            <ChevronDown size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500" />
          )}
        </div>

        <div
          className="w-3 h-3 rounded-full ml-2"
          style={{ backgroundColor: space.color || "#4f46e5" }}
        ></div>

        <span className="font-medium text-gray-800 ml-2 truncate max-w-[150px]">
          {space.name}
          {space.folders.length > 0 && (
            <span className="ml-1 text-xs text-gray-500">
              ({space.folders.length})
            </span>
          )}
        </span>

        {/* Template indicator icon */}
        {TemplateIcon && (
          <div className="ml-1.5" title={`${getTemplateName()} Template`}>
            {TemplateIcon}
          </div>
        )}

        {/* Controls (visible on hover) */}
        {activeHover && (
          <div className="ml-auto flex items-center gap-1">
            <button
              className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
              onClick={handleAddFolder}
              title="Add Folder"
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
                  className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1 w-48 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleEditSpace}
                  >
                    <Edit size={14} className="mr-2" />
                    Edit Space
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  >
                    <Share2 size={14} className="mr-2" />
                    Share Space
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  >
                    <Users size={14} className="mr-2" />
                    Manage Members
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  >
                    <Download size={14} className="mr-2" />
                    Export Space
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    onClick={handleDeleteSpace}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Space
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Folder Modal */}
      <AddFolderModal
        spaceId={space.id}
        isOpen={isAddFolderModalOpen}
        onClose={() => setIsAddFolderModalOpen(false)}
      />

      {/* Edit Space Modal */}
      <EditSpaceModal
        space={space}
        isOpen={isEditSpaceModalOpen}
        onClose={() => setIsEditSpaceModalOpen(false)}
      />

      {/* Space Content (Folders) */}
      {(isExpanded || shouldAutoExpand) && (
        <div className="ml-6 mt-1">
          {filteredFolders.length > 0 ? (
            <FoldersList
              spaceId={space.id}
              folders={filteredFolders}
              expandedFolders={expandedFolders}
              toggleFolderExpand={toggleFolderExpand}
              onSelectProjectList={onSelectProjectList}
              searchTerm={searchTerm}
            />
          ) : (
            space.folders.length === 0 && (
              <div className="flex flex-col items-center justify-center p-4 text-gray-500 text-sm">
                <Folder size={20} className="mb-2 opacity-50" />
                <p>No folders yet</p>
                <button
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                  onClick={handleAddFolder}
                >
                  + Add a folder
                </button>
              </div>
            )
          )}
        </div>
      )}
    </li>
  );
};

export default SpaceItem;
