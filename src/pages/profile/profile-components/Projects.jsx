import { useState, useEffect } from "react";
import {
  ChevronRight,
  BarChart2,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";

const Projects = ({ employeeId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, this would be an API call to fetch projects data
    // For now, we'll simulate loading project data
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Sample projects data
        const sampleProjects = [
          {
            id: 1,
            name: "CRM System Redesign",
            budget: "₹40,000",
            completion: 75,
            members: Array.from({ length: 5 }, (_, i) => ({
              id: i + 1,
              name: `User ${i + 1}`,
            })),
            status: "In Progress",
            deadline: "2025-06-20",
          },
          {
            id: 2,
            name: "Mobile App Development",
            budget: "₹85,000",
            completion: 30,
            members: Array.from({ length: 2 }, (_, i) => ({
              id: i + 2,
              name: `User ${i + 2}`,
            })),
            status: "In Progress",
            deadline: "2025-07-15",
          },
          {
            id: 3,
            name: "Website Optimization",
            budget: "₹25,000",
            completion: 100,
            members: Array.from({ length: 3 }, (_, i) => ({
              id: i + 1,
              name: `User ${i + 1}`,
            })),
            status: "Completed",
            deadline: "2025-05-01",
          },
          {
            id: 4,
            name: "Marketing Campaign",
            budget: "₹60,000",
            completion: 25,
            members: [{ id: 1, name: "User 1" }],
            status: "In Progress",
            deadline: "2025-08-10",
          },
          {
            id: 5,
            name: "UI/UX Improvements",
            budget: "₹35,000",
            completion: 50,
            members: Array.from({ length: 2 }, (_, i) => ({
              id: i + 1,
              name: `User ${i + 1}`,
            })),
            status: "In Progress",
            deadline: "2025-06-30",
          },
        ];

        // Filter projects that include the current employee
        // In a real app, this would be done by the backend
        setProjects(sampleProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load project data. Please try again.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, [employeeId]);

  // Show loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-7 bg-gray-200 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded w-40"></div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="p-4">
              <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded w-full mb-3"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Failed to Load Projects
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Show empty state if no projects
  if (projects.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
        <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No Projects Found
        </h3>
        <p className="text-gray-500 mb-6">
          This employee is not currently assigned to any projects.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-indigo-600" />
          Projects
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <span className="bg-green-100 w-3 h-3 rounded-full mr-2"></span>
          <span>
            {projects.filter((p) => p.status === "Completed").length} completed
            this year
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 text-sm bg-white"
                >
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">
                      {project.name}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : project.status === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : project.status === "On Hold"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{project.budget}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            project.completion === 100
                              ? "bg-green-500"
                              : "bg-indigo-600"
                          }`}
                          style={{
                            width: `${project.completion}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-9">
                        {project.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex -space-x-2">
                      {project.members.map((member, mIndex) => (
                        <div
                          key={mIndex}
                          className="w-7 h-7 rounded-full text-white text-xs flex items-center justify-center border-2 border-white tooltip-container"
                          style={{
                            backgroundColor: [
                              "#5932EA",
                              "#FF4A55",
                              "#FFAA2C",
                              "#2ED478",
                              "#985EFF",
                            ][mIndex % 5],
                          }}
                          title={member.name}
                        >
                          {member.id}
                          <span className="tooltip-text">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="mt-4 text-indigo-600 text-sm font-medium hover:underline flex items-center">
        View All Projects
        <ChevronRight size={16} className="ml-1" />
      </button>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.5) rgba(243, 244, 246, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.3);
          border-radius: 8px;
          margin: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.6);
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.8);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }

        .tooltip-container {
          position: relative;
        }

        .tooltip-text {
          visibility: hidden;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          text-align: center;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
        }

        .tooltip-container:hover .tooltip-text {
          visibility: visible;
        }
      `}</style>
    </div>
  );
};

export default Projects;
