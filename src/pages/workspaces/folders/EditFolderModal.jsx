import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";
import { colorOptions, folderIconOptions } from "@/utils/theme";

const EditFolderModal = ({ spaceId, folder, isOpen, onClose }) => {
  const { updateFolder, deleteFolder } = useSpacesStore();
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#4f46e5");
  const [folderIcon, setFolderIcon] = useState("folder");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (folder && isOpen) {
      setFolderName(folder.name || "");
      setFolderColor(folder.color || "#4f46e5");
      setFolderIcon(folder.icon || "folder");
      setErrorMessage("");
      setShowDeleteConfirm(false);
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

  const handleUpdateFolder = async () => {
    if (folderName.trim() !== "") {
      try {
        setIsSubmitting(true);
        setErrorMessage("");
        
        await updateFolder(spaceId, folder.id, {
          name: folderName,
          color: folderColor,
          icon: folderIcon,
        });
        
        onClose();
      } catch (err) {
        setErrorMessage(err.message || "Failed to update folder. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteFolder = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      
      await deleteFolder(spaceId, folder.id);
      
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete folder. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !showDeleteConfirm) {
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
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {errorMessage}
            </div>
          )}
          
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
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
                ></button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Folder Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {folderIconOptions.map((icon) => (
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
                  disabled={isSubmitting}
                >
                  {icon.name}
                </button>
              ))}
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm mt-4">
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteFolder}
                  className="px-3 py-1 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : "Delete"}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <button
            onClick={!showDeleteConfirm ? handleDeleteFolder : null}
            className={`px-4 py-2 bg-white border ${
              showDeleteConfirm ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-red-300 text-red-600 hover:bg-red-50"
            } rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            disabled={isSubmitting || showDeleteConfirm}
          >
            Delete Folder
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateFolder}
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              disabled={!folderName.trim() || isSubmitting || showDeleteConfirm}
            >
              {isSubmitting && !showDeleteConfirm ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFolderModal;