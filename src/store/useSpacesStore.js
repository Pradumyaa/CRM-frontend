// store/useSpacesStore.js - Complete functional workspace store
import { create } from "zustand";
import spaceService from "../api/spaceService";
import folderService from "../api/folderService";
import projectListService from "../api/projectListService";
import taskService from "../api/taskService";
import teamService from "../api/teamService";

const useSpacesStore = create((set, get) => ({
  // State
  spaces: [],
  team: [
    {
      id: "person1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
    },
    {
      id: "person2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar:
        "https://ui-avatars.com/api/?name=Jane+Smith&background=0DBC8A&color=fff",
    },
    {
      id: "person3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Johnson&background=BC0D8A&color=fff",
    },
    {
      id: "person4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Williams&background=8A0DBC&color=fff",
    },
  ],
  loading: false,
  error: null,

  // Space Actions
  fetchSpaces: async () => {
    set({ loading: true, error: null });
    try {
      const spaces = await spaceService.getSpaces();

      // For each space, get its folders with project lists and tasks
      const spacesWithData = await Promise.all(
        spaces.map(async (space) => {
          try {
            const folders = await folderService.getFolders(space.id);

            const foldersWithData = await Promise.all(
              folders.map(async (folder) => {
                try {
                  const projectLists = await projectListService.getProjectLists(
                    space.id,
                    folder.id,
                    localStorage.getItem("employeeId")
                  );

                  const projectListsWithTasks = await Promise.all(
                    projectLists.map(async (projectList) => {
                      try {
                        const tasks = await taskService.getTasks(
                          space.id,
                          folder.id,
                          projectList.id,
                          localStorage.getItem("employeeId")
                        );
                        return { ...projectList, tasks: tasks || [] };
                      } catch (error) {
                        console.error(
                          `Error fetching tasks for project list ${projectList.id}:`,
                          error
                        );
                        return { ...projectList, tasks: [] };
                      }
                    })
                  );

                  return { ...folder, projectLists: projectListsWithTasks };
                } catch (error) {
                  console.error(
                    `Error fetching project lists for folder ${folder.id}:`,
                    error
                  );
                  return { ...folder, projectLists: [] };
                }
              })
            );

            return { ...space, folders: foldersWithData };
          } catch (error) {
            console.error(
              `Error fetching folders for space ${space.id}:`,
              error
            );
            return { ...space, folders: [] };
          }
        })
      );

      set({ spaces: spacesWithData, loading: false });
    } catch (error) {
      console.error("Error fetching spaces:", error);
      set({ error: error.message, loading: false });
    }
  },

  addSpace: async (name, color, templateType, spaceId = null) => {
    set({ loading: true, error: null });
    try {
      const newSpace = {
        id: spaceId || `space-${Date.now()}`,
        name,
        color,
        templateType,
        folders: [],
        createdAt: new Date().toISOString(),
        createdBy: localStorage.getItem("employeeId"),
      };

      set((state) => ({
        spaces: [...state.spaces, newSpace],
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding space:", error);
      set({ error: error.message, loading: false });
    }
  },

  updateSpace: async (spaceId, updateData) => {
    set({ loading: true, error: null });
    try {
      await spaceService.updateSpace(spaceId, updateData);

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId ? { ...space, ...updateData } : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating space:", error);
      set({ error: error.message, loading: false });
    }
  },

  deleteSpace: async (spaceId) => {
    set({ loading: true, error: null });
    try {
      await spaceService.deleteSpace(spaceId);

      set((state) => ({
        spaces: state.spaces.filter((space) => space.id !== spaceId),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting space:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Folder Actions
  addFolder: async (spaceId, name, color, icon) => {
    set({ loading: true, error: null });
    try {
      const folderData = { name, color, icon };
      const newFolder = await folderService.createFolder(spaceId, folderData);

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: [...space.folders, { ...newFolder, projectLists: [] }],
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding folder:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateFolder: async (spaceId, folderId, updateData) => {
    set({ loading: true, error: null });
    try {
      await folderService.updateFolder(spaceId, folderId, updateData);

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.map((folder) =>
                  folder.id === folderId ? { ...folder, ...updateData } : folder
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating folder:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteFolder: async (spaceId, folderId) => {
    set({ loading: true, error: null });
    try {
      await folderService.deleteFolder(spaceId, folderId);

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.filter(
                  (folder) => folder.id !== folderId
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting folder:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  reorderFolders: async (spaceId, fromIndex, toIndex) => {
    const state = get();
    const space = state.spaces.find((s) => s.id === spaceId);
    if (!space) return;

    const newFolders = [...space.folders];
    const [movedFolder] = newFolders.splice(fromIndex, 1);
    newFolders.splice(toIndex, 0, movedFolder);

    set((state) => ({
      spaces: state.spaces.map((s) =>
        s.id === spaceId ? { ...s, folders: newFolders } : s
      ),
    }));

    try {
      const folderIds = newFolders.map((folder) => folder.id);
      await folderService.reorderFolders(spaceId, folderIds);
    } catch (error) {
      console.error("Error reordering folders:", error);
      // Revert on error
      get().fetchSpaces();
    }
  },

  // Project List Actions
  addProjectList: async (
    spaceId,
    folderId,
    name,
    templateType,
    projectListId = null
  ) => {
    set({ loading: true, error: null });
    try {
      const projectListData = { name, templateType };
      const newProjectList = await projectListService.createProjectList(
        spaceId,
        folderId,
        projectListData
      );

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.map((folder) =>
                  folder.id === folderId
                    ? {
                        ...folder,
                        projectLists: [
                          ...folder.projectLists,
                          { ...newProjectList, tasks: [] },
                        ],
                      }
                    : folder
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding project list:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProjectList: async (spaceId, folderId, projectListId, updateData) => {
    set({ loading: true, error: null });
    try {
      await projectListService.updateProjectList(
        spaceId,
        folderId,
        projectListId,
        updateData,
        localStorage.getItem("employeeId")
      );

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.map((folder) =>
                  folder.id === folderId
                    ? {
                        ...folder,
                        projectLists: folder.projectLists.map((projectList) =>
                          projectList.id === projectListId
                            ? { ...projectList, ...updateData }
                            : projectList
                        ),
                      }
                    : folder
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating project list:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProjectList: async (spaceId, folderId, projectListId) => {
    set({ loading: true, error: null });
    try {
      await projectListService.deleteProjectList(
        spaceId,
        folderId,
        projectListId,
        localStorage.getItem("employeeId")
      );

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.map((folder) =>
                  folder.id === folderId
                    ? {
                        ...folder,
                        projectLists: folder.projectLists.filter(
                          (projectList) => projectList.id !== projectListId
                        ),
                      }
                    : folder
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting project list:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Task Actions
  addTask: async (spaceId, folderId, projectListId, taskData) => {
    set({ loading: true, error: null });
    try {
      const newTask = await taskService.createTask(
        spaceId,
        folderId,
        projectListId,
        taskData
      );

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.map((folder) =>
                  folder.id === folderId
                    ? {
                        ...folder,
                        projectLists: folder.projectLists.map((projectList) =>
                          projectList.id === projectListId
                            ? {
                                ...projectList,
                                tasks: [...(projectList.tasks || []), newTask],
                              }
                            : projectList
                        ),
                      }
                    : folder
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding task:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTask: async (spaceId, folderId, projectListId, taskId, updateData) => {
    set({ loading: true, error: null });
    try {
      await taskService.updateTask(
        spaceId,
        folderId,
        projectListId,
        taskId,
        updateData
      );

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.map((folder) =>
                  folder.id === folderId
                    ? {
                        ...folder,
                        projectLists: folder.projectLists.map((projectList) =>
                          projectList.id === projectListId
                            ? {
                                ...projectList,
                                tasks: (projectList.tasks || []).map((task) =>
                                  task.id === taskId
                                    ? { ...task, ...updateData }
                                    : task
                                ),
                              }
                            : projectList
                        ),
                      }
                    : folder
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating task:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteTask: async (spaceId, folderId, projectListId, taskId) => {
    set({ loading: true, error: null });
    try {
      await taskService.deleteTask(
        spaceId,
        folderId,
        projectListId,
        taskId,
        localStorage.getItem("employeeId")
      );

      set((state) => ({
        spaces: state.spaces.map((space) =>
          space.id === spaceId
            ? {
                ...space,
                folders: space.folders.map((folder) =>
                  folder.id === folderId
                    ? {
                        ...folder,
                        projectLists: folder.projectLists.map((projectList) =>
                          projectList.id === projectListId
                            ? {
                                ...projectList,
                                tasks: (projectList.tasks || []).filter(
                                  (task) => task.id !== taskId
                                ),
                              }
                            : projectList
                        ),
                      }
                    : folder
                ),
              }
            : space
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useSpacesStore;
