// Updated ProjectListsList.jsx
import { useState, useEffect } from "react";
import ProjectListItem from "./ProjectListItem";
import useSpacesStore from "@/store/useSpacesStore";
import projectListService from "@/api/projectListService";

const ProjectListsList = ({ projectLists, onSelectProjectList, spaceId, folderId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localProjectLists, setLocalProjectLists] = useState(projectLists || []);

  // Fetch project lists when spaceId or folderId changes
  useEffect(() => {
    const fetchProjectLists = async () => {
      if (!spaceId || !folderId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedLists = await projectListService.getProjectLists(spaceId, folderId);
        setLocalProjectLists(fetchedLists);
      } catch (err) {
        console.error("Error fetching project lists:", err);
        setError("Failed to load project lists");
      } finally {
        setIsLoading(false);
      }
    };

    // If projectLists aren't provided directly, fetch them
    if (!projectLists || projectLists.length === 0) {
      fetchProjectLists();
    } else {
      setLocalProjectLists(projectLists);
    }
  }, [spaceId, folderId, projectLists]);

  if (isLoading) {
    return (
      <div className="py-2 px-3 text-gray-500 text-xs">
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading project lists...
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-2 px-3 text-red-500 text-xs">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!localProjectLists.length) {
    return (
      <div className="py-2 px-3 text-gray-500 text-xs text-center">
        No project lists in this folder yet
      </div>
    );
  }
  
  return (
    <ul className="py-1 space-y-1">
      {localProjectLists.map((projectList) => (
        <ProjectListItem
          key={projectList.id}
          projectList={projectList}
          onSelectProjectList={onSelectProjectList}
          spaceId={spaceId}
          folderId={folderId}
        />
      ))}
    </ul>
  );
};

export default ProjectListsList;