import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const colorOptions = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Slate", value: "#64748b" },
];

const EditSpaceModal = ({ space, isOpen, onClose }) => {
  const { updateSpace, deleteSpace } = useSpacesStore();
  const [spaceName, setSpaceName] = useState("");
  const [spaceColor, setSpaceColor] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (space && isOpen) {
      setSpaceName(space.name || "");
      setSpaceColor(space.color || "#4f46e5");
      // Focus the input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [space, isOpen]);

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

  const handleUpdateSpace = () => {
    if (spaceName.trim() !== "") {
      updateSpace(space.id, { name: spaceName, color: spaceColor });
      onClose();
    }
  };

  const handleDeleteSpace = () => {
    if (showDeleteConfirm) {
      deleteSpace(space.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUpdateSpace();
    }
  };

  if (!isOpen || !space) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-96 max-w-[90vw] animate-fade-in-up"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Space</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Space Color
            </label>
            <div className="grid grid-cols-7 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    spaceColor === color.value
                      ? "ring-2 ring-offset-2 ring-indigo-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSpaceColor(color.value)}
                  title={color.name}
                ></button>
              ))}
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
              <p className="text-red-800 font-medium mb-2">
                Are you sure you want to delete "{space.name}"?
              </p>
              <p className="text-red-700 mb-2">
                This will permanently delete the space and all its contents.
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteSpace(space.id);
                    onClose();
                  }}
                  className="px-3 py-1 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <button
            onClick={handleDeleteSpace}
            className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Space
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSpace}
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={!spaceName.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSpaceModal;
