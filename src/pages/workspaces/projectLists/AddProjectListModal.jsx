import { useState, useEffect, useRef } from "react";
import {
  X,
  List,
  CheckSquare,
  Calendar,
  BarChart,
  Table,
  Kanban,
  FileText,
  Clipboard,
  MessageCircle,
  Clock,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";
import { colors } from "@/utils/theme";

// Project list templates for quick start
const projectTemplates = [
  {
    id: "blank",
    name: "Blank List",
    description: "Start from scratch with an empty list",
    icon: <List size={20} className="text-indigo-500" />,
    isDefault: true,
  },
  {
    id: "todo",
    name: "To-Do List",
    description: "Simple checklist for tracking tasks",
    icon: <CheckSquare size={20} className="text-emerald-500" />,
    isDefault: false,
  },
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Visualize workflow with columns",
    icon: <Kanban size={20} className="text-blue-500" />,
    isDefault: false,
  },
  {
    id: "sprint",
    name: "Sprint Board",
    description: "Agile sprint planning and tracking",
    icon: <BarChart size={20} className="text-amber-500" />,
    isDefault: false,
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Schedule tasks and milestones",
    icon: <Clock size={20} className="text-violet-500" />,
    isDefault: false,
  },
  {
    id: "documents",
    name: "Document Tracker",
    description: "Manage documents and approvals",
    icon: <FileText size={20} className="text-red-500" />,
    isDefault: false,
  },
  {
    id: "meeting",
    name: "Meeting Notes",
    description: "Track meeting agendas and action items",
    icon: <MessageCircle size={20} className="text-cyan-500" />,
    isDefault: false,
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Schedule events with deadlines",
    icon: <Calendar size={20} className="text-pink-500" />,
    isDefault: false,
  },
];

const AddProjectListModal = ({ spaceId, folderId, isOpen, onClose }) => {
  const { addProjectList } = useSpacesStore();
  const [projectListName, setProjectListName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: template selection, 2: naming
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setProjectListName("");
      setSelectedTemplate("blank");
      setIsLoading(false);
      setStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    // Focus input field when on step 2
    if (isOpen && step === 2) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, step]);

  useEffect(() => {
    // Handle click outside to close
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Handle escape key to close
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const goToNextStep = () => {
    setStep(2);

    // Set default name based on template
    const template = projectTemplates.find((t) => t.id === selectedTemplate);
    if (template && template.id !== "blank") {
      setProjectListName(template.name);
    }
  };

  const goToPreviousStep = () => {
    setStep(1);
  };

  const handleAddProjectList = () => {
    if (projectListName.trim() !== "") {
      setIsLoading(true);

      // Simulate async operation
      setTimeout(() => {
        // In a real app, we would use selectedTemplate to create different kinds of lists
        addProjectList(spaceId, folderId, projectListName, selectedTemplate);
        setProjectListName("");
        setSelectedTemplate("blank");
        setIsLoading(false);
        setStep(1);
        onClose();
      }, 300);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && step === 2) {
      handleAddProjectList();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-[480px] max-w-[90vw] animate-fade-in-up"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {step === 1 ? "Choose a template" : "Create a new project list"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 && (
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 mb-4">
              Select a template to get started quickly
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 mb-4">
              {projectTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 mr-3">{template.icon}</div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">
                        {template.name}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      {selectedTemplate === template.id ? (
                        <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 pl-8">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={goToNextStep}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="px-6 py-4">
            <div className="mb-6">
              <div className="flex items-center bg-indigo-50 border border-indigo-100 rounded-md p-3 mb-4">
                <div className="mr-3">
                  {projectTemplates.find((t) => t.id === selectedTemplate)
                    ?.icon || <List className="text-indigo-500" size={20} />}
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800">
                    {projectTemplates.find((t) => t.id === selectedTemplate)
                      ?.name || "Blank List"}
                  </h3>
                  <p className="text-xs text-indigo-600">
                    {projectTemplates.find((t) => t.id === selectedTemplate)
                      ?.description || "Start from scratch with an empty list"}
                  </p>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project List Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={projectListName}
                onChange={(e) => setProjectListName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter project list name"
                className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                disabled={isLoading}
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between">
              <button
                onClick={goToPreviousStep}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleAddProjectList}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none transition-colors relative"
                disabled={!projectListName.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Create List</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  </>
                ) : (
                  "Create List"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProjectListModal;
