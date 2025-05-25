import { useState, useEffect } from "react";
import { CheckCircle, Award, Clock, Briefcase, TrendingUp, BarChart2 } from "lucide-react";

const PerformanceStats = ({ employeeId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call to fetch performance data
    // For now, we'll simulate with sample data
    const fetchPerformanceData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample performance data with slight variations based on selected period
      const multiplier = selectedPeriod === "3months" ? 1 : 
                         selectedPeriod === "6months" ? 1.2 : 1.5;
      
      const data = {
        completedTasks: Math.floor(27 * multiplier),
        completedTasksChange: 14,
        successRate: Math.min(98, Math.floor(92 * multiplier)),
        successRateChange: 7,
        responseTime: (2.3 / multiplier).toFixed(1),
        responseTimeChange: 0.5,
        activeProjects: Math.floor(5 * multiplier),
        activeProjectsChange: 2,
        chartData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].slice(0, selectedPeriod === "3months" ? 3 : 6),
          tasksCompleted: [50, 70, 90, 80, 110, 95].slice(0, selectedPeriod === "3months" ? 3 : 6),
          successRate: [70, 85, 100, 90, 105, 100].slice(0, selectedPeriod === "3months" ? 3 : 6),
        }
      };
      
      setPerformanceData(data);
      setLoading(false);
    };

    fetchPerformanceData();
  }, [selectedPeriod, employeeId]);

  if (loading || !performanceData) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6 animate-pulse">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
            Performance Statistics
          </h3>
          <select 
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center text-blue-600 mr-3">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed Tasks</p>
              <p className="text-xl font-bold text-gray-800">{performanceData.completedTasks}</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600">
            <span className="font-medium">+{performanceData.completedTasksChange}%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center text-green-600 mr-3">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Success Rate</p>
              <p className="text-xl font-bold text-gray-800">{performanceData.successRate}%</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600">
            <span className="font-medium">+{performanceData.successRateChange}%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center text-purple-600 mr-3">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Response Time</p>
              <p className="text-xl font-bold text-gray-800">{performanceData.responseTime}h</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-red-600">
            <span className="font-medium">+{performanceData.responseTimeChange}h</span>
            <span className="ml-1">from previous period</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-amber-500 bg-opacity-20 flex items-center justify-center text-amber-600 mr-3">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Projects</p>
              <p className="text-xl font-bold text-gray-800">{performanceData.activeProjects}</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600">
            <span className="font-medium">+{performanceData.activeProjectsChange}</span>
            <span className="ml-1">from previous period</span>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 relative h-64">
          {/* Chart Header */}
          <div className="absolute top-4 left-4 flex items-center">
            <BarChart2 className="h-5 w-5 text-indigo-600 mr-2" />
            <h4 className="font-medium text-gray-700">Performance Trend</h4>
          </div>
          
          {/* Simple chart */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full pt-12">
              {/* Chart legend */}
              <div className="absolute top-0 right-0 flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Tasks Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Success Rate</span>
                </div>
              </div>
              
              {/* Chart lines */}
              <div className="h-36 flex items-end w-full relative">
                {/* Y-axis */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between pr-2">
                  <span className="text-xs text-gray-400">100%</span>
                  <span className="text-xs text-gray-400">75%</span>
                  <span className="text-xs text-gray-400">50%</span>
                  <span className="text-xs text-gray-400">25%</span>
                  <span className="text-xs text-gray-400">0%</span>
                </div>
                
                {/* Grid lines */}
                <div className="absolute inset-0 left-6 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-gray-200 w-full h-0"></div>
                  <div className="border-b border-gray-200 w-full h-0"></div>
                  <div className="border-b border-gray-200 w-full h-0"></div>
                  <div className="border-b border-gray-200 w-full h-0"></div>
                  <div className="border-b border-gray-200 w-full h-0"></div>
                </div>
                
                {/* Chart bars/data - dynamically generated based on data */}
                <div className="flex-1 ml-6 flex justify-around items-end">
                  {performanceData.chartData.labels.map((month, index) => (
                    <div key={month} className="flex flex-col items-center gap-1 w-12">
                      <div className="flex space-x-1">
                        <div 
                          className="w-3 bg-indigo-500 rounded-t-sm" 
                          style={{height: `${performanceData.chartData.tasksCompleted[index]}px`}}
                        ></div>
                        <div 
                          className="w-3 bg-green-500 rounded-t-sm" 
                          style={{height: `${performanceData.chartData.successRate[index]}px`}}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;