// utils/workspaceInit.js - Initialize workspace with sample data
import useSpacesStore from "../store/useSpacesStore.js";
import { colorOptions, spaceTemplates } from "./theme.js";

// Sample data for workspace initialization
const sampleSpaces = [
  {
    id: "space-1",
    name: "Marketing Team",
    color: colorOptions[0].value, // Indigo
    templateType: "marketing",
    description: "Marketing campaigns and initiatives",
    folders: [
      {
        id: "folder-1-1",
        name: "Q1 Campaigns",
        color: colorOptions[1].value, // Sky
        icon: "folder",
        projectLists: [
          {
            id: "list-1-1-1",
            name: "Social Media Campaign",
            templateType: "kanban",
            tasks: [
              {
                id: "task-1-1-1-1",
                name: "Create content calendar",
                description: "Plan social media posts for Q1",
                priority: "high",
                status: "in_progress",
                completed: false,
                assignee: "John Doe",
                dueDate: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
                tags: ["social-media", "planning"],
                createdAt: new Date().toISOString(),
              },
              {
                id: "task-1-1-1-2",
                name: "Design campaign visuals",
                description: "Create graphics for social media posts",
                priority: "medium",
                status: "to_do",
                completed: false,
                assignee: "Jane Smith",
                dueDate: new Date(
                  Date.now() + 10 * 24 * 60 * 60 * 1000
                ).toISOString(),
                tags: ["design", "graphics"],
                createdAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: "list-1-1-2",
            name: "Email Marketing",
            templateType: "todo",
            tasks: [
              {
                id: "task-1-1-2-1",
                name: "Write newsletter template",
                description: "Create responsive email template",
                priority: "medium",
                status: "completed",
                completed: true,
                assignee: "Mike Johnson",
                dueDate: new Date(
                  Date.now() - 2 * 24 * 60 * 60 * 1000
                ).toISOString(),
                tags: ["email", "template"],
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
      {
        id: "folder-1-2",
        name: "Content Strategy",
        color: colorOptions[2].value, // Emerald
        icon: "file",
        projectLists: [
          {
            id: "list-1-2-1",
            name: "Blog Content",
            templateType: "timeline",
            tasks: [
              {
                id: "task-1-2-1-1",
                name: "Research industry trends",
                description: "Identify trending topics for blog posts",
                priority: "high",
                status: "to_do",
                completed: false,
                assignee: "Sarah Williams",
                dueDate: new Date(
                  Date.now() + 5 * 24 * 60 * 60 * 1000
                ).toISOString(),
                tags: ["research", "trends"],
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "space-2",
    name: "Development Team",
    color: colorOptions[4].value, // Amber
    templateType: "development",
    description: "Software development projects",
    folders: [
      {
        id: "folder-2-1",
        name: "Frontend Projects",
        color: colorOptions[5].value, // Violet
        icon: "code",
        projectLists: [
          {
            id: "list-2-1-1",
            name: "User Dashboard",
            templateType: "kanban",
            tasks: [
              {
                id: "task-2-1-1-1",
                name: "Implement user authentication",
                description: "Add login/logout functionality",
                priority: "high",
                status: "in_progress",
                completed: false,
                assignee: "John Doe",
                dueDate: new Date(
                  Date.now() + 14 * 24 * 60 * 60 * 1000
                ).toISOString(),
                tags: ["authentication", "security"],
                createdAt: new Date().toISOString(),
              },
              {
                id: "task-2-1-1-2",
                name: "Create responsive layout",
                description: "Make dashboard mobile-friendly",
                priority: "medium",
                status: "to_do",
                completed: false,
                assignee: "Jane Smith",
                dueDate: new Date(
                  Date.now() + 21 * 24 * 60 * 60 * 1000
                ).toISOString(),
                tags: ["responsive", "ui"],
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
      {
        id: "folder-2-2",
        name: "Backend Services",
        color: colorOptions[6].value, // Slate
        icon: "database",
        projectLists: [
          {
            id: "list-2-2-1",
            name: "API Development",
            templateType: "sprint",
            tasks: [
              {
                id: "task-2-2-1-1",
                name: "Design REST API endpoints",
                description: "Define API structure and endpoints",
                priority: "high",
                status: "completed",
                completed: true,
                assignee: "Mike Johnson",
                dueDate: new Date(
                  Date.now() - 5 * 24 * 60 * 60 * 1000
                ).toISOString(),
                tags: ["api", "design"],
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
    ],
  },
];

// Initialize workspace with sample data
export const initializeWorkspace = async () => {
  try {
    const { spaces, addSpace, addFolder, addProjectList, addTask } =
      useSpacesStore.getState();

    // Check if workspace is already initialized
    if (spaces && spaces.length > 0) {
      console.log("Workspace already initialized");
      return;
    }

    console.log("Initializing workspace with sample data...");

    // Add spaces one by one to avoid overwhelming the store
    for (const spaceData of sampleSpaces) {
      try {
        // Add the space
        await addSpace(
          spaceData.name,
          spaceData.color,
          spaceData.templateType,
          spaceData.id
        );

        // Add folders for this space
        for (const folderData of spaceData.folders) {
          try {
            await addFolder(
              spaceData.id,
              folderData.name,
              folderData.color,
              folderData.icon
            );

            // Add project lists for this folder
            for (const listData of folderData.projectLists) {
              try {
                await addProjectList(
                  spaceData.id,
                  folderData.id,
                  listData.name,
                  listData.templateType,
                  listData.id
                );

                // Add tasks for this project list
                for (const taskData of listData.tasks) {
                  try {
                    await addTask(
                      spaceData.id,
                      folderData.id,
                      listData.id,
                      taskData
                    );
                  } catch (taskError) {
                    console.warn(
                      "Error adding task:",
                      taskData.name,
                      taskError
                    );
                  }
                }
              } catch (listError) {
                console.warn(
                  "Error adding project list:",
                  listData.name,
                  listError
                );
              }
            }
          } catch (folderError) {
            console.warn("Error adding folder:", folderData.name, folderError);
          }
        }
      } catch (spaceError) {
        console.warn("Error adding space:", spaceData.name, spaceError);
      }
    }

    console.log("Workspace initialized successfully");
  } catch (error) {
    console.error("Error initializing workspace:", error);
  }
};

// Create a demo task for testing
export const createDemoTask = async (spaceId, folderId, projectListId) => {
  const { addTask } = useSpacesStore.getState();

  const demoTask = {
    id: `demo-task-${Date.now()}`,
    name: "Demo Task",
    description: "This is a demo task for testing purposes",
    priority: "medium",
    status: "to_do",
    completed: false,
    assignee: "Demo User",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["demo", "test"],
    createdAt: new Date().toISOString(),
  };

  try {
    await addTask(spaceId, folderId, projectListId, demoTask);
    console.log("Demo task created successfully");
  } catch (error) {
    console.error("Error creating demo task:", error);
  }
};

// Reset workspace (useful for development)
export const resetWorkspace = () => {
  const { spaces } = useSpacesStore.getState();

  // Clear the store
  useSpacesStore.setState({
    spaces: [],
    loading: false,
    error: null,
  });

  console.log("Workspace reset complete");
};

// Get workspace statistics
export const getWorkspaceStats = () => {
  const { spaces } = useSpacesStore.getState();

  let totalFolders = 0;
  let totalProjectLists = 0;
  let totalTasks = 0;
  let completedTasks = 0;

  spaces.forEach((space) => {
    totalFolders += space.folders?.length || 0;

    space.folders?.forEach((folder) => {
      totalProjectLists += folder.projectLists?.length || 0;

      folder.projectLists?.forEach((projectList) => {
        totalTasks += projectList.tasks?.length || 0;
        completedTasks +=
          projectList.tasks?.filter((task) => task.completed).length || 0;
      });
    });
  });

  return {
    totalSpaces: spaces.length,
    totalFolders,
    totalProjectLists,
    totalTasks,
    completedTasks,
    completionRate:
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
};

export default {
  initializeWorkspace,
  createDemoTask,
  resetWorkspace,
  getWorkspaceStats,
};
