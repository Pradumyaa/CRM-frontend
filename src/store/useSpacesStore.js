// /store/useSpacesStore.js
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useSpacesStore = create((set) => ({
  spaces: [
    {
      id: "space1",
      name: "Personal",
      color: "#4f46e5", // Indigo color
      templateType: "personal", // Added template type
      folders: [
        {
          id: "folder1",
          name: "Home",
          color: "#10b981", // Green color
          icon: "folder",
          projectLists: [
            {
              id: "list1",
              name: "Chores",
              tasks: [
                {
                  id: "task1",
                  name: "Clean kitchen",
                  description: "Deep clean all kitchen surfaces and appliances",
                  completed: false,
                  priority: "medium",
                  startDate: "2025-04-05",
                  dueDate: "2025-04-07",
                  assignee: "John Doe",
                  tags: ["home", "cleaning"],
                  status: "in_progress"
                }
              ]
            },
            {
              id: "list-habit",
              name: "Habit Tracker",
              tasks: [
                {
                  id: "habit1",
                  name: "Morning Workout",
                  description: "30 minutes exercise every morning",
                  completed: false,
                  priority: "high",
                  recurring: true,
                  tags: ["health", "exercise"],
                  status: "in_progress"
                },
                {
                  id: "habit2",
                  name: "Read 20 pages",
                  description: "Read at least 20 pages of a book daily",
                  completed: true,
                  priority: "medium",
                  recurring: true,
                  tags: ["learning", "reading"],
                  status: "completed"
                }
              ]
            }
          ]
        },
        {
          id: "folder-finance",
          name: "Finances",
          color: "#0ea5e9", // Sky color 
          icon: "star",
          projectLists: [
            {
              id: "list-budget",
              name: "Monthly Budget",
              tasks: [
                {
                  id: "budget1",
                  name: "Review monthly expenses",
                  description: "Go through bank statements and categorize expenses",
                  completed: false,
                  priority: "high",
                  dueDate: "2025-04-10",
                  tags: ["finance", "budget"],
                  status: "to_do"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "space2",
      name: "Work",
      color: "#0ea5e9", // Sky color
      templateType: "work", // Added template type
      folders: [
        {
          id: "folder2",
          name: "Current Projects",
          color: "#8b5cf6", // Violet color
          icon: "folder",
          projectLists: [
            {
              id: "list2",
              name: "Website Redesign",
              tasks: [
                {
                  id: "task2",
                  name: "Design new homepage",
                  description: "Create wireframes for the new homepage design",
                  completed: false,
                  priority: "high",
                  startDate: "2025-04-08",
                  dueDate: "2025-04-15",
                  assignee: "Jane Smith",
                  tags: ["design", "homepage"],
                  status: "to_do"
                },
                {
                  id: "task3",
                  name: "Mobile responsiveness",
                  description: "Ensure all pages work well on mobile devices",
                  completed: false,
                  priority: "medium",
                  startDate: "2025-04-10",
                  dueDate: "2025-04-18",
                  assignee: "Mike Johnson",
                  tags: ["development", "mobile"],
                  status: "in_progress"
                }
              ]
            },
            {
              id: "list-sprint",
              name: "Sprint Planning",
              tasks: [
                {
                  id: "sprint1",
                  name: "Backlog refinement",
                  description: "Review and prioritize backlog items",
                  completed: true,
                  priority: "medium",
                  dueDate: "2025-04-05",
                  assignee: "John Doe",
                  tags: ["planning", "agile"],
                  status: "completed"
                }
              ]
            }
          ]
        },
        {
          id: "folder-meetings",
          name: "Meetings",
          color: "#f43f5e", // Rose color
          icon: "calendar",
          projectLists: [
            {
              id: "list-notes",
              name: "Meeting Notes",
              tasks: [
                {
                  id: "meeting1",
                  name: "Weekly team standup",
                  description: "Discuss progress and blockers",
                  completed: false,
                  priority: "medium",
                  dueDate: "2025-04-07",
                  recurring: true,
                  assignee: "John Doe",
                  tags: ["meeting", "team"],
                  status: "to_do"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "space3",
      name: "Marketing",
      color: "#8b5cf6", // Violet color
      templateType: "marketing", // Added template type
      folders: [
        {
          id: "folder3",
          name: "Q2 Campaigns",
          color: "#f59e0b", // Amber color
          icon: "star",
          projectLists: [
            {
              id: "list3",
              name: "Social Media Plan",
              tasks: [
                {
                  id: "task3",
                  name: "Create content calendar",
                  description: "Plan social media posts for next month",
                  completed: false,
                  priority: "medium",
                  startDate: "2025-04-10",
                  dueDate: "2025-04-20",
                  assignee: "Sarah Johnson",
                  tags: ["marketing", "social"],
                  status: "to_do"
                }
              ]
            },
            {
              id: "list-email",
              name: "Email Newsletter",
              tasks: [
                {
                  id: "email1",
                  name: "Draft monthly newsletter",
                  description: "Create content for April newsletter",
                  completed: false,
                  priority: "high",
                  dueDate: "2025-04-12",
                  assignee: "Jane Smith",
                  tags: ["email", "content"],
                  status: "in_progress"
                }
              ]
            }
          ]
        },
        {
          id: "folder-analytics",
          name: "Analytics",
          color: "#10b981", // Green color
          icon: "chart",
          projectLists: [
            {
              id: "list-reports",
              name: "Monthly Reports",
              tasks: [
                {
                  id: "report1",
                  name: "March performance analysis",
                  description: "Analyze KPIs and create report",
                  completed: true,
                  priority: "high",
                  dueDate: "2025-04-05",
                  assignee: "Mike Johnson",
                  tags: ["analytics", "report"],
                  status: "completed"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  team: [
    { id: "person1", name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" },
    { id: "person2", name: "Jane Smith", avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=0DBC8A&color=fff" },
    { id: "person3", name: "Mike Johnson", avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=BC0D8A&color=fff" },
    { id: "person4", name: "Sarah Williams", avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=8A0DBC&color=fff" }
  ],

  // Add a new space
  addSpace: (name, color = "#4f46e5", templateType = "blank") => set((state) => ({
    spaces: [...state.spaces, {
      id: uuidv4(),
      name,
      color,
      templateType, // Store the template type
      folders: []
    }]
  })),

  // Update a space
  updateSpace: (spaceId, updates) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? { ...space, ...updates }
        : space
    )
  })),

  // Delete a space
  deleteSpace: (spaceId) => set((state) => ({
    spaces: state.spaces.filter(space => space.id !== spaceId)
  })),

  // Reorder spaces
  reorderSpaces: (sourceIndex, targetIndex) => set((state) => {
    const newSpaces = [...state.spaces];
    const [removedSpace] = newSpaces.splice(sourceIndex, 1);
    newSpaces.splice(targetIndex, 0, removedSpace);
    return { spaces: newSpaces };
  }),

  // Add a folder to a space
  addFolder: (spaceId, name, color = "#4f46e5", icon = "folder") => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: [...space.folders, {
            id: uuidv4(),
            name,
            color,
            icon,
            projectLists: []
          }]
        }
        : space
    )
  })),

  // Update a folder
  updateFolder: (spaceId, folderId, updates) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.map(folder =>
            folder.id === folderId
              ? { ...folder, ...updates }
              : folder
          )
        }
        : space
    )
  })),

  // Delete a folder
  deleteFolder: (spaceId, folderId) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.filter(folder => folder.id !== folderId)
        }
        : space
    )
  })),

  // Reorder folders
  reorderFolders: (spaceId, sourceIndex, targetIndex) => set((state) => {
    const newSpaces = [...state.spaces];
    const spaceIndex = newSpaces.findIndex(space => space.id === spaceId);

    if (spaceIndex !== -1) {
      const newFolders = [...newSpaces[spaceIndex].folders];
      const [removedFolder] = newFolders.splice(sourceIndex, 1);
      newFolders.splice(targetIndex, 0, removedFolder);
      newSpaces[spaceIndex].folders = newFolders;
    }

    return { spaces: newSpaces };
  }),

  // Add a project list to a folder
  addProjectList: (spaceId, folderId, name, templateType = "blank") => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.map(folder =>
            folder.id === folderId
              ? {
                ...folder,
                projectLists: [...folder.projectLists, {
                  id: uuidv4(),
                  name,
                  templateType, // Store the template type
                  tasks: []
                }]
              }
              : folder
          )
        }
        : space
    )
  })),

  // Update a project list
  updateProjectList: (spaceId, folderId, projectListId, updates) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.map(folder =>
            folder.id === folderId
              ? {
                ...folder,
                projectLists: folder.projectLists.map(list =>
                  list.id === projectListId
                    ? { ...list, ...updates }
                    : list
                )
              }
              : folder
          )
        }
        : space
    )
  })),

  // Delete a project list
  deleteProjectList: (spaceId, folderId, projectListId) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.map(folder =>
            folder.id === folderId
              ? {
                ...folder,
                projectLists: folder.projectLists.filter(list => list.id !== projectListId)
              }
              : folder
          )
        }
        : space
    )
  })),

  // Add a task to a project list
  addTask: (spaceId, folderId, projectListId, task) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.map(folder =>
            folder.id === folderId
              ? {
                ...folder,
                projectLists: folder.projectLists.map(list =>
                  list.id === projectListId
                    ? {
                      ...list,
                      tasks: [...list.tasks, {
                        id: uuidv4(),
                        name: "",
                        description: "",
                        completed: false,
                        priority: "medium",
                        startDate: null,
                        dueDate: null,
                        assignee: null,
                        tags: [],
                        status: "to_do",
                        ...task
                      }]
                    }
                    : list
                )
              }
              : folder
          )
        }
        : space
    )
  })),

  // Update a task
  updateTask: (spaceId, folderId, projectListId, taskId, updatedTask) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.map(folder =>
            folder.id === folderId
              ? {
                ...folder,
                projectLists: folder.projectLists.map(list =>
                  list.id === projectListId
                    ? {
                      ...list,
                      tasks: list.tasks.map(task =>
                        task.id === taskId
                          ? { ...task, ...updatedTask }
                          : task
                      )
                    }
                    : list
                )
              }
              : folder
          )
        }
        : space
    )
  })),

  // Delete a task
  deleteTask: (spaceId, folderId, projectListId, taskId) => set((state) => ({
    spaces: state.spaces.map(space =>
      space.id === spaceId
        ? {
          ...space,
          folders: space.folders.map(folder =>
            folder.id === folderId
              ? {
                ...folder,
                projectLists: folder.projectLists.map(list =>
                  list.id === projectListId
                    ? {
                      ...list,
                      tasks: list.tasks.filter(task => task.id !== taskId)
                    }
                    : list
                )
              }
              : folder
          )
        }
        : space
    )
  })),

  // Add a team member
  addTeamMember: (name) => set((state) => ({
    team: [...state.team, {
      id: uuidv4(),
      name,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`
    }]
  })),

  // Update a team member
  updateTeamMember: (memberId, updates) => set((state) => ({
    team: state.team.map(member =>
      member.id === memberId
        ? { ...member, ...updates }
        : member
    )
  })),

  // Delete a team member
  deleteTeamMember: (memberId) => set((state) => ({
    team: state.team.filter(member => member.id !== memberId)
  }))
}));

export default useSpacesStore;