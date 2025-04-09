import { useState, useEffect } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import {
  BarChart3,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  Zap,
  ListChecks,
  PieChart,
} from "lucide-react";

const OverviewView = ({ projectListId }) => {
  const { spaces } = useSpacesStore();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    highPriority: 0,
    completionRate: 0,
    upcomingDueDates: [],
    priorityDistribution: { high: 0, medium: 0, low: 0 },
  });

  // Find the project list and its parent space and folder
  let projectList = null;
  let spaceName = null;
  let folderName = null;

  // This is more complex because we need to find the path to the project list
  for (const space of spaces) {
    for (const folder of space.folders) {
      const foundList = folder.projectLists.find(
        (list) => list.id === projectListId
      );
      if (foundList) {
        projectList = foundList;
        spaceName = space.name;
        folderName = folder.name;
        break;
      }
    }
    if (projectList) break;
  }

  useEffect(() => {
    if (projectList && projectList.tasks) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate stats
      const completed = projectList.tasks.filter(
        (task) => task.completed
      ).length;
      const total = projectList.tasks.length;
      const inProgress = projectList.tasks.filter(
        (task) => !task.completed && task.status === "inProgress"
      ).length;
      const overdue = projectList.tasks.filter(
        (task) =>
          task.dueDate && !task.completed && new Date(task.dueDate) < today
      ).length;
      const highPriority = projectList.tasks.filter(
        (task) => !task.completed && task.priority === "high"
      ).length;

      // Calculate priority distribution
      const priorityDistribution = {
        high: projectList.tasks.filter((task) => task.priority === "high")
          .length,
        medium: projectList.tasks.filter((task) => task.priority === "medium")
          .length,
        low: projectList.tasks.filter((task) => task.priority === "low").length,
      };

      // Get upcoming due dates (next 7 days)
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);

      const upcomingDueDates = projectList.tasks
        .filter(
          (task) =>
            task.dueDate &&
            !task.completed &&
            new Date(task.dueDate) >= today &&
            new Date(task.dueDate) <= next7Days
        )
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5); // Only show top 5

      setStats({
        total,
        completed,
        inProgress,
        overdue,
        highPriority,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
        upcomingDueDates,
        priorityDistribution,
      });
    }
  }, [projectList]);

  if (!projectList) {
    return <div className="p-4">Project list not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Project List Info Header */}
      <div className="mb-8">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <span>{spaceName}</span>
          <span className="mx-2">›</span>
          <span>{folderName}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{projectList.name}</h1>
        <p className="text-gray-600 mt-2">
          Project overview and key metrics at a glance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <ListChecks size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Tasks
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{stats.completed} completed</span>
            <span
              className={`font-medium ${
                stats.completionRate >= 70
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {stats.completionRate}% done
            </span>
          </div>
          <div className="mt-2 bg-gray-200 h-2 rounded-full">
            <div
              className={`h-2 rounded-full ${
                stats.completionRate >= 70 ? "bg-green-500" : "bg-yellow-500"
              }`}
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-green-50 text-green-600 mr-4">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                In Progress
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.inProgress}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {stats.inProgress > 0
              ? `${Math.round(
                  (stats.inProgress / stats.total) * 100
                )}% of tasks currently active`
              : "No tasks in progress"}
          </div>
          <div className="mt-2 text-sm text-blue-600 font-medium">
            {stats.inProgress > 0
              ? "Keep up the good work!"
              : "Get started on your tasks"}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-4">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Overdue</h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.overdue}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {stats.overdue > 0
              ? `${Math.round(
                  (stats.overdue / stats.total) * 100
                )}% of tasks are overdue`
              : "No overdue tasks"}
          </div>
          <div className="mt-2 text-sm text-red-600 font-medium">
            {stats.overdue > 0 ? "Requires attention" : "You're on track!"}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mr-4">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                High Priority
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.highPriority}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {stats.highPriority > 0
              ? `${Math.round(
                  (stats.highPriority / stats.total) * 100
                )}% of tasks are high priority`
              : "No high priority tasks"}
          </div>
          <div className="mt-2 text-sm text-amber-600 font-medium">
            {stats.highPriority > 0 ? "Focus on these first" : "No urgencies"}
          </div>
        </div>
      </div>

      {/* Task visualization and upcoming tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Task Distribution
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.priorityDistribution.high}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500">
                High Priority
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">
                {stats.priorityDistribution.medium}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500">
                Medium Priority
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">
                {stats.priorityDistribution.low}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500">
                Low Priority
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <PieChart size={18} className="text-gray-500" />
            <h4 className="text-md font-medium text-gray-700">
              Priority Breakdown
            </h4>
          </div>

          <div className="h-6 flex rounded-full overflow-hidden">
            {stats.total > 0 ? (
              <>
                <div
                  className="bg-blue-500 h-full"
                  style={{
                    width: `${
                      (stats.priorityDistribution.high / stats.total) * 100
                    }%`,
                  }}
                  title={`High Priority: ${stats.priorityDistribution.high} tasks`}
                ></div>
                <div
                  className="bg-yellow-500 h-full"
                  style={{
                    width: `${
                      (stats.priorityDistribution.medium / stats.total) * 100
                    }%`,
                  }}
                  title={`Medium Priority: ${stats.priorityDistribution.medium} tasks`}
                ></div>
                <div
                  className="bg-green-500 h-full"
                  style={{
                    width: `${
                      (stats.priorityDistribution.low / stats.total) * 100
                    }%`,
                  }}
                  title={`Low Priority: ${stats.priorityDistribution.low} tasks`}
                ></div>
              </>
            ) : (
              <div className="bg-gray-200 h-full w-full"></div>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
              <span>High</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
              <span>Low</span>
            </div>
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Upcoming Deadlines
            </h3>
            <Calendar size={20} className="text-gray-400" />
          </div>

          {stats.upcomingDueDates.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingDueDates.map((task) => {
                const dueDate = new Date(task.dueDate);
                const isToday =
                  new Date().toDateString() === dueDate.toDateString();
                const isTomorrow =
                  new Date(
                    new Date().setDate(new Date().getDate() + 1)
                  ).toDateString() === dueDate.toDateString();

                let dateLabel = dueDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                if (isToday) dateLabel = "Today";
                else if (isTomorrow) dateLabel = "Tomorrow";

                return (
                  <div key={task.id} className="flex items-start">
                    <div
                      className={`mt-0.5 ${
                        isToday ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      <Clock size={16} />
                    </div>
                    <div className="ml-3 flex-1">
                      <div
                        className={`font-medium ${
                          isToday ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        {task.name}
                      </div>
                      <div className="text-sm flex justify-between mt-1">
                        <span
                          className={`${
                            isToday
                              ? "text-red-500 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {dateLabel}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No upcoming deadlines</p>
              <p className="text-sm text-gray-400 mt-1">All caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
