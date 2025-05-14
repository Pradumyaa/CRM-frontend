// Updated AddSpaceModal.jsx
import { useState, useEffect, useRef } from "react";
import {
  X,
  Layout,
  Briefcase,
  Clipboard,
  CheckCircle,
  FileText,
  Users,
  BarChart,
  Calendar,
  Kanban,
  Globe,
  Book,
  AlertCircle
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";
import { colorOptions, spaceTemplates } from "@/utils/theme";
import spaceService from "@/api/spaceService";

const AddSpaceModal = ({ isOpen, onClose }) => {
  const { addSpace } = useSpacesStore();
  const [spaceName, setSpaceName] = useState("");
  const [spaceColor, setSpaceColor] = useState(colorOptions[0].value);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1); // 1: template, 2: details
  const modalRef = useRef(null);
  const inputRef = useRef(null);
 
  useEffect(() => {
    if (isOpen) {
      setSpaceName("");
      setSpaceColor(colorOptions[0].value);
      setSelectedTemplate("blank");
      setStep(1);
      setIsSubmitting(false);
      setErrorMessage("");
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

  const handleAddSpace = async () => {
    if (spaceName.trim() === "") {
      setErrorMessage("Space name is required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Create space data object
      const spaceData = {
        name: spaceName.trim(),
        color: spaceColor,
        templateType: selectedTemplate,
        employeeId: localStorage.getItem("employeeId"),
      }

      // Call the API
      const newSpace = await spaceService.createSpace(spaceData);

      // Update the local store
      addSpace(spaceName, spaceColor, selectedTemplate, newSpace.id);
      
      // Reset and close modal
      setSpaceName("");
      setSpaceColor(colorOptions[0].value);
      setSelectedTemplate("blank");
      setStep(1);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Error creating space:", err);
      setErrorMessage(err.response?.data?.message || "Failed to create space. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && step === 2) {
      handleAddSpace();
    }
  };

  const getTemplateIcon = (iconName) => {
    const icons = {
      Layout: <Layout size={20} className="text-indigo-500" />,
      Briefcase: <Briefcase size={20} className="text-blue-500" />,
      Clipboard: <Clipboard size={20} className="text-emerald-500" />,
      BarChart: <BarChart size={20} className="text-purple-500" />,
      FileText: <FileText size={20} className="text-red-500" />,
      Users: <Users size={20} className="text-amber-500" />,
      Calendar: <Calendar size={20} className="text-pink-500" />,
      Kanban: <Kanban size={20} className="text-cyan-500" />,
    };
    
    return icons[iconName] || <Layout size={20} className="text-indigo-500" />;
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
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            <AlertCircle size={16} className="flex-shrink-0 mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}

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
                  <div className="flex-shrink-0 mr-3">
                    {getTemplateIcon(template.icon)}
                  </div>
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
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={goToNextStep}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={isSubmitting}
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
                  {getTemplateIcon(spaceTemplates.find(t => t.id === selectedTemplate)?.icon || 'Layout')}
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800">
                    {spaceTemplates.find(t => t.id === selectedTemplate)?.name || "Blank Space"}
                  </h3>
                  <p className="text-xs text-indigo-600">
                    {spaceTemplates.find(t => t.id === selectedTemplate)?.description || "Start from scratch with an empty space"}
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
                onChange={(e) => {
                  setSpaceName(e.target.value);
                  if (errorMessage && e.target.value.trim()) {
                    setErrorMessage("");
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter space name"
                className={`border ${errorMessage ? "border-red-300 bg-red-50" : "border-gray-300"} p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Color
              </label>
              <div className="grid grid-cols-7 gap-3">
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
                    disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                onClick={handleAddSpace}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                disabled={!spaceName.trim() || isSubmitting}
              >
                {isSubmitting ? (
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
                disabled={isSubmitting}
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