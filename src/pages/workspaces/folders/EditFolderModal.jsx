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

const iconOptions = [
  { name: "Default", value: "folder" },
  { name: "Star", value: "star" },
  { name: "Heart", value: "heart" },
  { name: "Bookmark", value: "bookmark" },
  { name: "Archive", value: "archive" },
  { name: "Lock", value: "lock" },
  { name: "File", value: "file" },
  { name: "Code", value: "code" },
];

const EditFolderModal = ({ spaceId, folder, isOpen, onClose }) => {
  const { updateFolder, deleteFolder } = useSpacesStore();
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#4f46e5");
  const [folderIcon, setFolderIcon] = useState("folder");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (folder && isOpen) {
      setFolderName(folder.name || "");
      setFolderColor(folder.color || "#4f46e5");
      setFolderIcon(folder.icon || "folder");
      // Focus the input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [folder, isOpen]);

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

  const handleUpdateFolder = () => {
    if (folderName.trim() !== "") {
      updateFolder(spaceId, folder.id, {
        name: folderName,
        color: folderColor,
        icon: folderIcon,
      });
      onClose();
    }
  };

  const handleDeleteFolder = () => {
    if (showDeleteConfirm) {
      deleteFolder(spaceId, folder.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUpdateFolder();
    }
  };

  if (!isOpen || !folder) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-96 max-w-[90vw] animate-fade-in-up"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Folder</h2>
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
              Folder Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter folder name"
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Folder Color
            </label>
            <div className="grid grid-cols-7 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    folderColor === color.value
                      ? "ring-2 ring-offset-2 ring-indigo-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFolderColor(color.value)}
                  title={color.name}
                ></button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Folder Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  className={`flex items-center justify-center w-16 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    folderIcon === icon.value
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setFolderIcon(icon.value)}
                  title={icon.name}
                >
                  {icon.name}
                </button>
              ))}
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
              <p className="text-red-800 font-medium mb-2">
                Are you sure you want to delete "{folder.name}"?
              </p>
              <p className="text-red-700 mb-2">
                This will permanently delete the folder and all its project
                lists. This action cannot be undone.
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
                    deleteFolder(spaceId, folder.id);
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
            onClick={handleDeleteFolder}
            className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Folder
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateFolder}
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={!folderName.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFolderModal;
