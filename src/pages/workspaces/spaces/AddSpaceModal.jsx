import { useState, useEffect, useRef } from "react";
import {
  X,
  Briefcase,
  Layout,
  Clipboard,
  CheckCircle,
  FileText,
  Users,
  BarChart,
  Calendar,
  Kanban,
  Globe,
  Book,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";
import { colorOptions } from "@/utils/theme"

// Professional space templates
const spaceTemplates = [
  {
    id: "blank",
    name: "Blank Space",
    description: "Start from scratch with an empty space",
    icon: <Layout className="text-indigo-500" size={20} />,
    isDefault: true,
  },
  {
    id: "work",
    name: "Work Space",
    description:
      "Pre-configured for work projects with tasks, deadlines, and reports",
    icon: <Briefcase className="text-blue-500" size={20} />,
    isDefault: false,
  },
  {
    id: "personal",
    name: "Personal Space",
    description: "Organize your personal tasks, goals, and notes",
    icon: <Clipboard className="text-emerald-500" size={20} />,
    isDefault: false,
  },
  {
    id: "marketing",
    name: "Marketing Campaigns",
    description: "Manage marketing campaigns, content calendar, and analytics",
    icon: <BarChart className="text-purple-500" size={20} />,
    isDefault: false,
  },
  {
    id: "engineering",
    name: "Software Development",
    description: "Organize sprints, track issues, and manage releases",
    icon: <FileText className="text-red-500" size={20} />,
    isDefault: false,
  },
  {
    id: "clientManagement",
    name: "Client Management",
    description: "Manage client projects, communications, and deliverables",
    icon: <Users className="text-amber-500" size={20} />,
    isDefault: false,
  },
  {
    id: "eventPlanning",
    name: "Event Planning",
    description: "Plan and coordinate events, schedules, and tasks",
    icon: <Calendar className="text-pink-500" size={20} />,
    isDefault: false,
  },
  {
    id: "productDevelopment",
    name: "Product Development",
    description: "Track product roadmap, features, and launch activities",
    icon: <Kanban className="text-cyan-500" size={20} />,
    isDefault: false,
  },
];

const AddSpaceModal = ({ isOpen, onClose }) => {
  const { addSpace } = useSpacesStore();
  const [spaceName, setSpaceName] = useState("");
  const [spaceColor, setSpaceColor] = useState(colorOptions[0].value);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: template, 2: details
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSpaceName("");
      setSpaceColor(colorOptions[0].value);
      setSelectedTemplate("blank");
      setStep(1);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Focus the input when on step 2
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
  };

  const goToPreviousStep = () => {
    setStep(1);
  };

  const handleAddSpace = () => {
    if (spaceName.trim() !== "") {
      setIsLoading(true);

      // Simulate async operation
      setTimeout(() => {
        // In a real implementation, we would pass the template type to use it later
        addSpace(spaceName, spaceColor, selectedTemplate);
        setSpaceName("");
        setSpaceColor(colorOptions[0].value);
        setSelectedTemplate("blank");
        setStep(1);
        setIsLoading(false);
        onClose();
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && step === 2) {
      handleAddSpace();
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
            {step === 1 ? "Choose a template" : "Create a new space"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 && (
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 mb-4">
              Select a template to jumpstart your workspace
            </p>

            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 mb-4">
              {spaceTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex-shrink-0 mr-3">{template.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {selectedTemplate === template.id ? (
                      <CheckCircle className="text-indigo-500" size={20} />
                    ) : (
                      <div className="w-5 h-5 border border-gray-300 rounded-full"></div>
                    )}
                  </div>
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
                  {spaceTemplates.find((t) => t.id === selectedTemplate)
                    ?.icon || <Layout className="text-indigo-500" size={20} />}
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800">
                    {spaceTemplates.find((t) => t.id === selectedTemplate)
                      ?.name || "Blank Space"}
                  </h3>
                  <p className="text-xs text-indigo-600">
                    {spaceTemplates.find((t) => t.id === selectedTemplate)
                      ?.description || "Start from scratch with an empty space"}
                  </p>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter space name"
                className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Color
              </label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform ${
                      spaceColor === color.value
                        ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSpaceColor(color.value)}
                    title={color.name}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          {step === 2 ? (
            <>
              <button
                onClick={goToPreviousStep}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                onClick={handleAddSpace}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                disabled={!spaceName.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Create Space</span>
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
                  "Create Space"
                )}
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSpaceModal;
