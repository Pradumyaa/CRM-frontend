import { useState, useEffect } from "react";
import {
  Activity,
  Check,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  MessageSquare,
  Plus,
  Trash2,
  User,
  Users,
  Calendar,
  Tag,
  RefreshCw,
  Circle,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

// Mock activity types
const ACTIVITY_TYPES = {
  TASK_CREATED: "task_created",
  TASK_UPDATED: "task_updated",
  TASK_COMPLETED: "task_completed",
  TASK_DELETED: "task_deleted",
  COMMENT_ADDED: "comment_added",
  MEMBER_ADDED: "member_added",
  ASSIGNMENT_CHANGED: "assignment_changed",
};

const ActivityView = ({ projectListId }) => {
  const { spaces } = useSpacesStore();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all"); // all, tasks, comments, members
  const [isLoading, setIsLoading] = useState(true);

  // Find project list and related data
  let projectList = null;
  let spaceId = null;
  let folderId = null;
  let spaceName = "";
  let folderName = "";

  for (const space of spaces) {
    for (const folder of space.folders) {
      const foundList = folder.projectLists.find(
        (list) => list.id === projectListId
      );
      if (foundList) {
        projectList = foundList;
        spaceId = space.id;
        folderId = folder.id;
        spaceName = space.name;
        folderName = folder.name;
        break;
      }
    }
    if (projectList) break;
  }

  useEffect(() => {
    if (projectList) {
      // In a real app, you would fetch activities from an API
      // Here, we'll generate mock activities based on the tasks
      generateMockActivities();
      setIsLoading(false);
    }
  }, [projectList, filter]);

  const generateMockActivities = () => {
    if (!projectList || !projectList.tasks) {
      setActivities([]);
      return;
    }

    const mockActivities = [];
    const now = new Date();

    // Create activities for each task
    projectList.tasks.forEach((task, index) => {
      // Task creation (older activity)
      const creationDate = new Date(now);
      creationDate.setDate(now.getDate() - Math.floor(Math.random() * 30)); // Random date within the last 30 days

      mockActivities.push({
        id: `activity-${task.id}-creation`,
        type: ACTIVITY_TYPES.TASK_CREATED,
        taskId: task.id,
        taskName: task.name,
        userId: "person1",
        userName: "John Doe",
        userAvatar:
          "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
        timestamp: creationDate.toISOString(),
        data: {
          taskPriority: task.priority,
        },
      });

      // Task updates (more recent)
      if (Math.random() > 0.3) {
        // 70% chance of having an update
        const updateDate = new Date(creationDate);
        updateDate.setDate(
          creationDate.getDate() + Math.floor(Math.random() * 5) + 1
        );

        mockActivities.push({
          id: `activity-${task.id}-update`,
          type: ACTIVITY_TYPES.TASK_UPDATED,
          taskId: task.id,
          taskName: task.name,
          userId: "person2",
          userName: "Jane Smith",
          userAvatar:
            "https://ui-avatars.com/api/?name=Jane+Smith&background=0DBC8A&color=fff",
          timestamp: updateDate.toISOString(),
          data: {
            field: Math.random() > 0.5 ? "description" : "due date",
          },
        });
      }

      // Task completion (if completed)
      if (task.completed) {
        const completionDate = new Date(now);
        completionDate.setDate(now.getDate() - Math.floor(Math.random() * 7)); // Within the last week

        mockActivities.push({
          id: `activity-${task.id}-completion`,
          type: ACTIVITY_TYPES.TASK_COMPLETED,
          taskId: task.id,
          taskName: task.name,
          userId: task.assignee === "John Doe" ? "person1" : "person3",
          userName: task.assignee || "Mike Johnson",
          userAvatar:
            "https://ui-avatars.com/api/?name=Mike+Johnson&background=BC0D8A&color=fff",
          timestamp: completionDate.toISOString(),
        });
      }

      // Comments
      if (Math.random() > 0.6) {
        // 40% chance of having a comment
        const commentDate = new Date(now);
        commentDate.setDate(now.getDate() - Math.floor(Math.random() * 3)); // Within the last 3 days

        mockActivities.push({
          id: `activity-${task.id}-comment`,
          type: ACTIVITY_TYPES.COMMENT_ADDED,
          taskId: task.id,
          taskName: task.name,
          userId: "person4",
          userName: "Sarah Williams",
          userAvatar:
            "https://ui-avatars.com/api/?name=Sarah+Williams&background=8A0DBC&color=fff",
          timestamp: commentDate.toISOString(),
          data: {
            commentText: `This is a sample comment on the task "${task.name}".`,
          },
        });
      }

      // Assignment changes
      if (task.assignee && Math.random() > 0.7) {
        // 30% chance of assignment change
        const assignmentDate = new Date(now);
        assignmentDate.setDate(now.getDate() - Math.floor(Math.random() * 10)); // Within the last 10 days

        mockActivities.push({
          id: `activity-${task.id}-assignment`,
          type: ACTIVITY_TYPES.ASSIGNMENT_CHANGED,
          taskId: task.id,
          taskName: task.name,
          userId: "person2",
          userName: "Jane Smith",
          userAvatar:
            "https://ui-avatars.com/api/?name=Jane+Smith&background=0DBC8A&color=fff",
          timestamp: assignmentDate.toISOString(),
          data: {
            assignee: task.assignee,
            previousAssignee: "Unassigned",
          },
        });
      }
    });

    // Filter activities based on user selection
    let filteredActivities = [...mockActivities];
    if (filter === "tasks") {
      filteredActivities = mockActivities.filter((activity) =>
        [
          ACTIVITY_TYPES.TASK_CREATED,
          ACTIVITY_TYPES.TASK_UPDATED,
          ACTIVITY_TYPES.TASK_COMPLETED,
          ACTIVITY_TYPES.TASK_DELETED,
        ].includes(activity.type)
      );
    } else if (filter === "comments") {
      filteredActivities = mockActivities.filter(
        (activity) => activity.type === ACTIVITY_TYPES.COMMENT_ADDED
      );
    } else if (filter === "members") {
      filteredActivities = mockActivities.filter((activity) =>
        [
          ACTIVITY_TYPES.MEMBER_ADDED,
          ACTIVITY_TYPES.ASSIGNMENT_CHANGED,
        ].includes(activity.type)
      );
    }

    // Sort by timestamp (newest first)
    filteredActivities.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setActivities(filteredActivities);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffDays > 7) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else if (diffHr > 0) {
      return `${diffHr} ${diffHr === 1 ? "hour" : "hours"} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "just now";
    }
  };

  // Get icon for activity type
  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case ACTIVITY_TYPES.TASK_CREATED:
        return <Plus className="text-green-500" size={18} />;
      case ACTIVITY_TYPES.TASK_UPDATED:
        return <Edit className="text-blue-500" size={18} />;
      case ACTIVITY_TYPES.TASK_COMPLETED:
        return <CheckCircle className="text-emerald-500" size={18} />;
      case ACTIVITY_TYPES.TASK_DELETED:
        return <Trash2 className="text-red-500" size={18} />;
      case ACTIVITY_TYPES.COMMENT_ADDED:
        return <MessageSquare className="text-indigo-500" size={18} />;
      case ACTIVITY_TYPES.MEMBER_ADDED:
        return <User className="text-purple-500" size={18} />;
      case ACTIVITY_TYPES.ASSIGNMENT_CHANGED:
        return <RefreshCw className="text-amber-500" size={18} />;
      default:
        return <Circle className="text-gray-500" size={18} />;
    }
  };

  // Get description for activity
  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case ACTIVITY_TYPES.TASK_CREATED:
        return (
          <>
            <span className="font-medium">{activity.userName}</span> created
            task <span className="font-medium">"{activity.taskName}"</span> with
            priority{" "}
            <span className="font-medium">{activity.data.taskPriority}</span>
          </>
        );
      case ACTIVITY_TYPES.TASK_UPDATED:
        return (
          <>
            <span className="font-medium">{activity.userName}</span> updated{" "}
            <span className="font-medium">{activity.data.field}</span> for task{" "}
            <span className="font-medium">"{activity.taskName}"</span>
          </>
        );
      case ACTIVITY_TYPES.TASK_COMPLETED:
        return (
          <>
            <span className="font-medium">{activity.userName}</span> marked task{" "}
            <span className="font-medium">"{activity.taskName}"</span> as
            complete
          </>
        );
      case ACTIVITY_TYPES.TASK_DELETED:
        return (
          <>
            <span className="font-medium">{activity.userName}</span> deleted
            task <span className="font-medium">"{activity.taskName}"</span>
          </>
        );
      case ACTIVITY_TYPES.COMMENT_ADDED:
        return (
          <>
            <span className="font-medium">{activity.userName}</span> commented
            on <span className="font-medium">"{activity.taskName}"</span>:
            <div className="bg-gray-50 p-2 mt-1 rounded text-gray-600 text-sm border-l-2 border-indigo-300">
              {activity.data.commentText}
            </div>
          </>
        );
      case ACTIVITY_TYPES.MEMBER_ADDED:
        return (
          <>
            <span className="font-medium">{activity.userName}</span> added{" "}
            <span className="font-medium">{activity.data.memberName}</span> to
            the project
          </>
        );
      case ACTIVITY_TYPES.ASSIGNMENT_CHANGED:
        return (
          <>
            <span className="font-medium">{activity.userName}</span> assigned
            task <span className="font-medium">"{activity.taskName}"</span> to{" "}
            <span className="font-medium">{activity.data.assignee}</span>
          </>
        );
      default:
        return "Unknown activity";
    }
  };

  if (!projectList) {
    return (
      <div className="p-6 text-center text-gray-500">
        Project list not found
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with project info */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{spaceName}</span>
          <span className="mx-2">›</span>
          <span>{folderName}</span>
          <span className="mx-2">›</span>
          <span className="font-medium">{projectList.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md text-sm ${
                filter === "all"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilter("tasks")}
              className={`px-3 py-1.5 rounded-md text-sm ${
                filter === "tasks"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setFilter("comments")}
              className={`px-3 py-1.5 rounded-md text-sm ${
                filter === "comments"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setFilter("members")}
              className={`px-3 py-1.5 rounded-md text-sm ${
                filter === "members"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Members
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {activities.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex">
                  {/* User avatar */}
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {activity.userAvatar ? (
                        <img
                          src={activity.userAvatar}
                          alt={activity.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User
                          size={40}
                          className="w-full h-full p-2 text-gray-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Activity content */}
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <div className="mr-2">{getActivityIcon(activity)}</div>
                      <div className="text-sm text-gray-800">
                        {getActivityDescription(activity)}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 text-center">
          <Activity size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No activity yet
          </h3>
          <p className="text-gray-500 mb-6">
            There are no activities matching your current filter
          </p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
            >
              View All Activity
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityView;
