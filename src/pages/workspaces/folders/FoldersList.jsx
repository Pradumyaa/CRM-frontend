import { useState } from "react";
import { Folder, PlusCircle } from "lucide-react";
import FolderItem from "./FolderItem";
import AddFolderModal from "./AddFolderModal";
import useSpacesStore from "@/store/useSpacesStore";

const FoldersList = ({
  spaceId,
  folders,
  expandedFolders,
  toggleFolderExpand,
  onSelectProjectList,
  searchTerm,
}) => {
  const { reorderFolders } = useSpacesStore();
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [draggedFolder, setDraggedFolder] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);

  // Handle drag and drop
  const handleDragStart = (e, folderId) => {
    setDraggedFolder(folderId);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", folderId);
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    if (draggedFolder === folderId) return;
    setDragOverFolder(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e, targetFolderId) => {
    e.preventDefault();
    if (draggedFolder === targetFolderId) return;

    // Find indexes of dragged and target folders
    const draggedIndex = folders.findIndex(
      (folder) => folder.id === draggedFolder
    );
    const targetIndex = folders.findIndex(
      (folder) => folder.id === targetFolderId
    );

    if (draggedIndex !== -1 && targetIndex !== -1) {
      reorderFolders(spaceId, draggedIndex, targetIndex);
    }

    setDraggedFolder(null);
    setDragOverFolder(null);
  };

  // Add folder button for non-empty list
  const renderAddFolderButton = () => (
    <div className="mt-2 px-4">
      <button
        onClick={() => setIsAddFolderModalOpen(true)}
        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
      >
        <PlusCircle size={16} className="mr-2 text-indigo-500" />
        Add Folder
      </button>
    </div>
  );

  return (
    <div className="py-1">
      {/* Folders List */}
      {folders.length > 0 ? (
        <>
          <ul className="space-y-1">
            {folders.map((folder) => (
              <div
                key={folder.id}
                draggable
                onDragStart={(e) => handleDragStart(e, folder.id)}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
                className={`${
                  dragOverFolder === folder.id
                    ? "border-t-2 border-indigo-400"
                    : "border-t-2 border-transparent"
                } ${
                  draggedFolder === folder.id ? "opacity-50" : "opacity-100"
                }`}
              >
                <FolderItem
                  spaceId={spaceId}
                  folder={folder}
                  isExpanded={expandedFolders[folder.id]}
                  toggleExpand={() => toggleFolderExpand(folder.id)}
                  onSelectProjectList={onSelectProjectList}
                  searchTerm={searchTerm}
                />
              </div>
            ))}
          </ul>
          {renderAddFolderButton()}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-gray-500">
          <div className="bg-gray-100 p-3 rounded-full mb-2">
            <Folder size={20} className="text-indigo-500" />
          </div>
          <p className="text-sm font-medium mb-1">No folders yet</p>
          <p className="text-xs text-center mb-3">
            Create a folder to organize your projects
          </p>
          <button
            onClick={() => setIsAddFolderModalOpen(true)}
            className="px-3 py-1 bg-indigo-600 rounded-md text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle size={14} className="inline mr-1" />
            Create Folder
          </button>
        </div>
      )}

      {/* Add Folder Modal */}
      <AddFolderModal
        spaceId={spaceId}
        isOpen={isAddFolderModalOpen}
        onClose={() => setIsAddFolderModalOpen(false)}
      />
    </div>
  );
};

export default FoldersList;
