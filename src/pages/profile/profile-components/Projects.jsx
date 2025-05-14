import { useState } from "react";
import { ChevronRight, BarChart2 } from "lucide-react";

const Projects = () => {
  // Sample projects data - replace with actual data
  const [projects, setProjects] = useState([
    {
      name: "CRM System Redesign",
      budget: "₹40,000",
      completion: 75,
      members: [1, 2, 3, 4, 5],
      status: "In Progress",
      deadline: "2025-06-20",
    },
    {
      name: "Mobile App Development",
      budget: "₹85,000",
      completion: 30,
      members: [2, 3],
      status: "In Progress",
      deadline: "2025-07-15",
    },
    {
      name: "Website Optimization",
      budget: "₹25,000",
      completion: 100,
      members: [1, 2, 3],
      status: "Completed",
      deadline: "2025-05-01",
    },
    {
      name: "Marketing Campaign",
      budget: "₹60,000",
      completion: 25,
      members: [1],
      status: "In Progress",
      deadline: "2025-08-10",
    },
    {
      name: "UI/UX Improvements",
      budget: "₹35,000",
      completion: 50,
      members: [1, 2],
      status: "In Progress",
      deadline: "2025-06-30",
    },
  ]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-indigo-600" />
          Projects
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <span className="bg-green-100 w-3 h-3 rounded-full mr-2"></span>
          <span>20 completed this year</span>
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
              {projects.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50 text-sm bg-white">
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
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    {new Date(project.deadline).toLocaleDateString()}
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
                          className="w-7 h-7 rounded-full text-white text-xs flex items-center justify-center border-2 border-white"
                          style={{
                            backgroundColor: [
                              "#5932EA",
                              "#FF4A55",
                              "#FFAA2C",
                              "#2ED478",
                              "#985EFF",
                            ][mIndex % 5],
                          }}
                        >
                          {member}
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
      `}</style>
    </div>
  );
};

export default Projects;