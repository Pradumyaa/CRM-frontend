import { useState } from "react";
import { Plus, Inbox, PlusCircle, Search } from "lucide-react";
import SpaceItem from "./SpaceItem";
import AddSpaceModal from "./AddSpaceModal";
import useSpacesStore from "@/store/useSpacesStore";

const SpacesList = ({
  spaces,
  expandedSpaces,
  expandedFolders,
  toggleSpaceExpand,
  toggleFolderExpand,
  onSelectProjectList,
  searchTerm,
  isCollapsed = false,
}) => {
  const [isAddSpaceModalOpen, setIsAddSpaceModalOpen] = useState(false);
  const [draggingSpace, setDraggingSpace] = useState(null);
  const [dragOverSpace, setDragOverSpace] = useState(null);

  // Handle drag start
  const handleDragStart = (e, spaceId) => {
    setDraggingSpace(spaceId);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", spaceId);
  };

  const handleDragOver = (e, spaceId) => {
    e.preventDefault();
    if (draggingSpace === spaceId) return;
    setDragOverSpace(spaceId);
  };

  const handleDragLeave = () => {
    setDragOverSpace(null);
  };

  const handleDrop = (e, targetSpaceId) => {
    e.preventDefault();
    if (draggingSpace === targetSpaceId) return;

    // Here you would implement the reordering logic
    // For now we'll just reset the state
    setDraggingSpace(null);
    setDragOverSpace(null);
  };

  // Filter spaces based on search term
  const filteredSpaces = searchTerm
    ? spaces.filter((space) => {
        // Check if space name matches search
        if (space.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }

        // Check if any folder name matches search
        if (
          space.folders.some((folder) =>
            folder.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ) {
          return true;
        }

        // Check if any project list name matches search
        return space.folders.some((folder) =>
          folder.projectLists.some((list) =>
            list.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      })
    : spaces;

  // If collapsed, we don't need to render space items
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="py-1">
      {/* Spaces List */}
      {filteredSpaces.length > 0 ? (
        <div>
          <ul className="space-y-1">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                draggable
                onDragStart={(e) => handleDragStart(e, space.id)}
                onDragOver={(e) => handleDragOver(e, space.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, space.id)}
                className={`
                  ${
                    dragOverSpace === space.id
                      ? "border-t-2 border-indigo-400"
                      : "border-t-2 border-transparent"
                  } 
                  ${draggingSpace === space.id ? "opacity-50" : "opacity-100"}
                `}
              >
                <SpaceItem
                  space={space}
                  isExpanded={expandedSpaces[space.id]}
                  toggleExpand={() => toggleSpaceExpand(space.id)}
                  expandedFolders={expandedFolders}
                  toggleFolderExpand={toggleFolderExpand}
                  onSelectProjectList={onSelectProjectList}
                  searchTerm={searchTerm}
                />
              </div>
            ))}
          </ul>

          <div className="mt-2 px-3">
            <button
              onClick={() => setIsAddSpaceModalOpen(true)}
              className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <PlusCircle size={16} className="mr-2 text-indigo-500" />
              Add Space
            </button>
          </div>
        </div>
      ) : searchTerm ? (
        <div className="flex flex-col items-center justify-center p-6 text-gray-500">
          <Search size={24} className="mb-2 opacity-60" />
          <p className="text-sm text-center">
            No spaces found for "{searchTerm}"
          </p>
          <button
            onClick={() => setIsAddSpaceModalOpen(true)}
            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Create a new space
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-gray-500">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <PlusCircle size={24} className="text-indigo-500" />
          </div>
          <p className="font-medium mb-1">No spaces yet</p>
          <p className="text-sm text-center mb-4">
            Create your first space to organize your work
          </p>
          <button
            onClick={() => setIsAddSpaceModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} className="inline mr-1" />
            Create a space
          </button>
        </div>
      )}

      {/* Add Space Modal */}
      <AddSpaceModal
        isOpen={isAddSpaceModalOpen}
        onClose={() => setIsAddSpaceModalOpen(false)}
      />
    </div>
  );
};

export default SpacesList;
