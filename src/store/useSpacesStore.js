// store/useSpacesStore.js
import { create } from 'zustand';
import spaceService from '@/api/spaceService';
import folderService from '@/api/folderService';
import projectListService from '@/api/projectListService';
import taskService from '@/api/taskService';

const useSpacesStore = create((set, get) => ({
  spaces: [],
  loading: false,
  error: null,
  selectedSpace: null,
  selectedProjectList: null,

  // Fetch all spaces
  fetchSpaces: async () => {
    set({ loading: true, error: null });
    try {
      const spaces = await spaceService.getSpaces();
      set({ spaces, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Select a space
  selectSpace: (spaceId) => {
    const spaces = get().spaces;
    const selectedSpace = spaces.find(space => space.id === spaceId) || null;
    set({ selectedSpace });
  },

  // Select a project list
  selectProjectList: (projectListId) => {
    set({ selectedProjectList: projectListId });
  },

  // Add a new space
  addSpace: async (spaceData) => {
    set({ loading: true, error: null });
    try {
      const newSpace = await spaceService.createSpace(spaceData);
      set(state => ({ 
        spaces: [...state.spaces, newSpace], 
        loading: false 
      }));
      return newSpace;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update a space
  updateSpace: async (spaceId, updateData) => {
    set({ loading: true, error: null });
    try {
      const updatedSpace = await spaceService.updateSpace(spaceId, updateData);
      set(state => ({
        spaces: state.spaces.map(space => 
          space.id === spaceId ? { ...space, ...updatedSpace } : space
        ),
        loading: false
      }));
      return updatedSpace;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete a space
  deleteSpace: async (spaceId) => {
    set({ loading: true, error: null });
    try {
      await spaceService.deleteSpace(spaceId);
      set(state => ({
        spaces: state.spaces.filter(space => space.id !== spaceId),
        loading: false,
        selectedSpace: state.selectedSpace?.id === spaceId ? null : state.selectedSpace
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Add a folder to a space
  addFolder: async (spaceId, name, color, icon) => {
    set({ loading: true, error: null });
    try {
      const folderData = { name, color, icon };
      const newFolder = await folderService.createFolder(spaceId, folderData);
      
      set(state => ({
        spaces: state.spaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              folders: [...(space.folders || []), newFolder]
            };
          }
          return space;
        }),
        loading: false
      }));
      return newFolder;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update a folder
  updateFolder: async (spaceId, folderId, updateData) => {
    set({ loading: true, error: null });
    try {
      const updatedFolder = await folderService.updateFolder(spaceId, folderId, updateData);
      
      set(state => ({
        spaces: state.spaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              folders: space.folders.map(folder => 
                folder.id === folderId ? { ...folder, ...updatedFolder } : folder
              )
            };
          }
          return space;
        }),
        loading: false
      }));
      return updatedFolder;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete a folder
  deleteFolder: async (spaceId, folderId) => {
    set({ loading: true, error: null });
    try {
      await folderService.deleteFolder(spaceId, folderId);
      
      set(state => ({
        spaces: state.spaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              folders: space.folders.filter(folder => folder.id !== folderId)
            };
          }
          return space;
        }),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Reorder folders
  reorderFolders: async (spaceId, draggedIndex, targetIndex) => {
    const space = get().spaces.find(s => s.id === spaceId);
    if (!space) return;

    // Create a new array with the updated order
    const newFolders = [...space.folders];
    const [movedFolder] = newFolders.splice(draggedIndex, 1);
    newFolders.splice(targetIndex, 0, movedFolder);
    
    // Update state immediately for a responsive UI
    set(state => ({
      spaces: state.spaces.map(s => 
        s.id === spaceId ? { ...s, folders: newFolders } : s
      )
    }));
    
    // Then send the request to the server
    try {
      const folderIds = newFolders.map(folder => folder.id);
      await folderService.reorderFolders(spaceId, folderIds);
    } catch (error) {
      console.error('Error reordering folders:', error);
      // If there's an error, revert to the original order by re-fetching
      get().fetchSpaces();
    }
  },

  // Add a project list to a folder
  addProjectList: async (spaceId, folderId, name, templateType) => {
    set({ loading: true, error: null });
    try {
      const projectListData = { name, templateType };
      const newProjectList = await projectListService.createProjectList(
        spaceId, 
        folderId, 
        projectListData
      );
      
      set(state => ({
        spaces: state.spaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              folders: space.folders.map(folder => {
                if (folder.id === folderId) {
                  return {
                    ...folder,
                    projectLists: [...(folder.projectLists || []), newProjectList]
                  };
                }
                return folder;
              })
            };
          }
          return space;
        }),
        loading: false
      }));
      return newProjectList;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update a project list
  updateProjectList: async (spaceId, folderId, projectListId, updateData) => {
    set({ loading: true, error: null });
    try {
      const updatedProjectList = await projectListService.updateProjectList(
        spaceId, 
        folderId, 
        projectListId, 
        updateData
      );
      
      set(state => ({
        spaces: state.spaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              folders: space.folders.map(folder => {
                if (folder.id === folderId) {
                  return {
                    ...folder,
                    projectLists: folder.projectLists.map(list => 
                      list.id === projectListId ? { ...list, ...updatedProjectList } : list
                    )
                  };
                }
                return folder;
              })
            };
          }
          return space;
        }),
        loading: false
      }));
      return updatedProjectList;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete a project list
  deleteProjectList: async (spaceId, folderId, projectListId) => {
    set({ loading: true, error: null });
    try {
      await projectListService.deleteProjectList(spaceId, folderId, projectListId);
      
      set(state => ({
        spaces: state.spaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              folders: space.folders.map(folder => {
                if (folder.id === folderId) {
                  return {
                    ...folder,
                    projectLists: folder.projectLists.filter(list => list.id !== projectListId)
                  };
                }
                return folder;
              })
            };
          }
          return space;
        }),
        selectedProjectList: state.selectedProjectList === projectListId ? null : state.selectedProjectList,
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get detailed project list with tasks
  fetchProjectList: async (projectListId) => {
    set({ loading: true, error: null });
    try {
      const projectList = await projectListService.getProjectList(projectListId);
      
      // Update the project list in the state with the fetched data
      set(state => {
        let updatedSpaces = [...state.spaces];
        let projectListUpdated = false;

        // Find and update the project list in our state
        updatedSpaces = updatedSpaces.map(space => {
          const updatedFolders = space.folders.map(folder => {
            const updatedLists = folder.projectLists.map(list => {
              if (list.id === projectListId) {
                projectListUpdated = true;
                return { ...list, ...projectList };
              }
              return list;
            });
            return { ...folder, projectLists: updatedLists };
          });
          return { ...space, folders: updatedFolders };
        });

        return {
          spaces: updatedSpaces,
          loading: false
        };
      });
      
      return projectList;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Add a task to a project list
  addTask: async (spaceId, folderId, projectListId, taskData) => {
    set({ loading: true, error: null });
    try {
      const newTask = await taskService.createTask(spaceId, folderId, projectListId, taskData);
      
      // Update the tasks in the project list
      set(state => {
        const updatedSpaces = state.spaces.map(space => {
          if (space.id === spaceId) {
            const updatedFolders = space.folders.map(folder => {
              if (folder.id === folderId) {
                const updatedLists = folder.projectLists.map(list => {
                  if (list.id === projectListId) {
                    return {
                      ...list,
                      tasks: [...(list.tasks || []), newTask]
                    };
                  }
                  return list;
                });
                return { ...folder, projectLists: updatedLists };
              }
              return folder;
            });
            return { ...space, folders: updatedFolders };
          }
          return space;
        });
        
        return {
          spaces: updatedSpaces,
          loading: false
        };
      });
      
      return newTask;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update a task
  updateTask: async (spaceId, folderId, projectListId, taskId, updateData) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(
        spaceId, 
        folderId, 
        projectListId, 
        taskId, 
        updateData
      );
      
      // Update the task in the project list
      set(state => {
        const updatedSpaces = state.spaces.map(space => {
          if (space.id === spaceId) {
            const updatedFolders = space.folders.map(folder => {
              if (folder.id === folderId) {
                const updatedLists = folder.projectLists.map(list => {
                  if (list.id === projectListId) {
                    return {
                      ...list,
                      tasks: list.tasks?.map(task => 
                        task.id === taskId ? { ...task, ...updatedTask } : task
                      ) || []
                    };
                  }
                  return list;
                });
                return { ...folder, projectLists: updatedLists };
              }
              return folder;
            });
            return { ...space, folders: updatedFolders };
          }
          return space;
        });
        
        return {
          spaces: updatedSpaces,
          loading: false
        };
      });
      
      return updatedTask;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (spaceId, folderId, projectListId, taskId) => {
    set({ loading: true, error: null });
    try {
      await taskService.deleteTask(spaceId, folderId, projectListId, taskId);
      
      // Remove the task from the project list
      set(state => {
        const updatedSpaces = state.spaces.map(space => {
          if (space.id === spaceId) {
            const updatedFolders = space.folders.map(folder => {
              if (folder.id === folderId) {
                const updatedLists = folder.projectLists.map(list => {
                  if (list.id === projectListId) {
                    return {
                      ...list,
                      tasks: list.tasks?.filter(task => task.id !== taskId) || []
                    };
                  }
                  return list;
                });
                return { ...folder, projectLists: updatedLists };
              }
              return folder;
            });
            return { ...space, folders: updatedFolders };
          }
          return space;
        });
        
        return {
          spaces: updatedSpaces,
          loading: false
        };
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Helper function to find a project list in the state
  findProjectList: (projectListId) => {
    const { spaces } = get();
    for (const space of spaces) {
      for (const folder of space.folders || []) {
        const list = folder.projectLists?.find(list => list.id === projectListId);
        if (list) {
          return {
            projectList: list,
            folder,
            space
          };
        }
      }
    }
    return null;
  },

  // Get upcoming tasks
  fetchUpcomingTasks: async () => {
    set({ loading: true, error: null });
    try {
      const upcomingTasks = await taskService.getUpcomingTasks();
      set({ upcomingTasks, loading: false });
      return upcomingTasks;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get assigned tasks
  fetchAssignedTasks: async () => {
    set({ loading: true, error: null });
    try {
      const assignedTasks = await taskService.getAssignedTasks();
      set({ assignedTasks, loading: false });
      return assignedTasks;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get high priority tasks
  fetchHighPriorityTasks: async () => {
    set({ loading: true, error: null });
    try {
      const highPriorityTasks = await taskService.getHighPriorityTasks();
      set({ highPriorityTasks, loading: false });
      return highPriorityTasks;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));

export default useSpacesStore;