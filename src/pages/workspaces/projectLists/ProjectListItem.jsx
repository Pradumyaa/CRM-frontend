import { useState, useRef, useEffect } from "react";
import {
  List,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  CheckSquare,
  Kanban,
  Calendar,
  BarChart,
  MessageCircle,
  FileText,
  Clock,
  Copy,
  Share2,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const ProjectListItem = ({
  projectList,
  onSelectProjectList,
  spaceId,
  folderId,
}) => {
  const [activeHover, setActiveHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const { deleteProjectList } = useSpacesStore();
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

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteList = (e) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete "${projectList.name}"?`)
    ) {
      deleteProjectList(spaceId, folderId, projectList.id);
    }
    setShowMenu(false);
  };

  const toggleStar = (e) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  // Calculate task stats
  const getTotalTasks = () => projectList.tasks?.length || 0;
  const getCompletedTasks = () =>
    projectList.tasks?.filter((task) => task.completed).length || 0;

  const completionPercentage =
    getTotalTasks() === 0
      ? 0
      : Math.round((getCompletedTasks() / getTotalTasks()) * 100);

  // Get template type icon
  const getTemplateIcon = () => {
    // In a real implementation, this would use projectList.templateType
    const templateType =
      projectList.templateType ||
      (projectList.name.toLowerCase().includes("to do")
        ? "todo"
        : projectList.name.toLowerCase().includes("sprint")
        ? "sprint"
        : projectList.name.toLowerCase().includes("meeting")
        ? "meeting"
        : projectList.name.toLowerCase().includes("calendar")
        ? "calendar"
        : null);

    if (!templateType)
      return (
        <List
          size={14}
          className={activeHover ? "text-indigo-600" : "text-gray-500"}
        />
      );

    switch (templateType) {
      case "todo":
        return <CheckSquare size={14} className="text-emerald-500" />;
      case "kanban":
        return <Kanban size={14} className="text-blue-500" />;
      case "sprint":
        return <BarChart size={14} className="text-amber-500" />;
      case "timeline":
        return <Clock size={14} className="text-violet-500" />;
      case "documents":
        return <FileText size={14} className="text-red-500" />;
      case "meeting":
        return <MessageCircle size={14} className="text-cyan-500" />;
      case "calendar":
        return <Calendar size={14} className="text-pink-500" />;
      default:
        return (
          <List
            size={14}
            className={activeHover ? "text-indigo-600" : "text-gray-500"}
          />
        );
    }
  };

  return (
    <li
      className={`flex flex-col px-2 py-1.5 cursor-pointer rounded-md ${
        activeHover ? "bg-indigo-100" : "hover:bg-gray-100"
      }`}
      onClick={() => onSelectProjectList(projectList.id)}
      onMouseEnter={() => setActiveHover(true)}
      onMouseLeave={() => {
        setActiveHover(false);
        if (!showMenu) setShowMenu(false);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getTemplateIcon()}
          <span
            className={`text-sm ml-2 font-medium ${
              activeHover ? "text-indigo-700" : "text-gray-700"
            }`}
          >
            {projectList.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {activeHover && (
            <>
              <button
                onClick={toggleStar}
                className={`p-1 rounded-full hover:bg-indigo-200 ${
                  isStarred ? "text-amber-400" : "text-gray-400"
                }`}
              >
                <Star size={12} />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleMenuClick}
                  className="p-1 rounded-full hover:bg-indigo-200 text-gray-500"
                >
                  <MoreVertical size={12} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10 py-1 w-40 animate-fade-in">
                    <button
                      className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                    >
                      <Edit size={12} className="mr-2" />
                      Edit List
                    </button>
                    <button
                      className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                    >
                      <Copy size={12} className="mr-2" />
                      Duplicate List
                    </button>
                    <button
                      className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                    >
                      <Share2 size={12} className="mr-2" />
                      Share List
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      className="flex items-center px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 w-full text-left"
                      onClick={handleDeleteList}
                    >
                      <Trash2 size={12} className="mr-2" />
                      Delete List
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress indicator - only show if there are tasks */}
      {getTotalTasks() > 0 && (
        <div className="mt-1.5 mb-0.5 pl-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              {getCompletedTasks()}/{getTotalTasks()}
            </span>
            <span>{completionPercentage}% complete</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                completionPercentage >= 100 ? "bg-green-500" : "bg-indigo-500"
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </li>
  );
};

export default ProjectListItem;
