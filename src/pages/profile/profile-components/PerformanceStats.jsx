import { CheckCircle, Award, Clock, Briefcase, TrendingUp, BarChart2 } from "lucide-react";

const PerformanceStats = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
            Performance Statistics
          </h3>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50">
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
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
              <p className="text-xl font-bold text-gray-800">27</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600">
            <span className="font-medium">+14%</span>
            <span className="ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center text-green-600 mr-3">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Success Rate</p>
              <p className="text-xl font-bold text-gray-800">92%</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600">
            <span className="font-medium">+7%</span>
            <span className="ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center text-purple-600 mr-3">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Response Time</p>
              <p className="text-xl font-bold text-gray-800">2.3h</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-red-600">
            <span className="font-medium">+0.5h</span>
            <span className="ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-amber-500 bg-opacity-20 flex items-center justify-center text-amber-600 mr-3">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Projects</p>
              <p className="text-xl font-bold text-gray-800">5</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600">
            <span className="font-medium">+2</span>
            <span className="ml-1">from last month</span>
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
          
          {/* Simple chart placeholder */}
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
                
                {/* Chart bars/data */}
                <div className="flex-1 ml-6 flex justify-around items-end">
                  {/* January */}
                  <div className="flex flex-col items-center gap-1 w-12">
                    <div className="flex space-x-1">
                      <div className="w-3 bg-indigo-500 rounded-t-sm" style={{height: '50px'}}></div>
                      <div className="w-3 bg-green-500 rounded-t-sm" style={{height: '70px'}}></div>
                    </div>
                    <span className="text-xs text-gray-400">Jan</span>
                  </div>
                  
                  {/* February */}
                  <div className="flex flex-col items-center gap-1 w-12">
                    <div className="flex space-x-1">
                      <div className="w-3 bg-indigo-500 rounded-t-sm" style={{height: '70px'}}></div>
                      <div className="w-3 bg-green-500 rounded-t-sm" style={{height: '85px'}}></div>
                    </div>
                    <span className="text-xs text-gray-400">Feb</span>
                  </div>
                  
                  {/* March */}
                  <div className="flex flex-col items-center gap-1 w-12">
                    <div className="flex space-x-1">
                      <div className="w-3 bg-indigo-500 rounded-t-sm" style={{height: '90px'}}></div>
                      <div className="w-3 bg-green-500 rounded-t-sm" style={{height: '100px'}}></div>
                    </div>
                    <span className="text-xs text-gray-400">Mar</span>
                  </div>
                  
                  {/* April */}
                  <div className="flex flex-col items-center gap-1 w-12">
                    <div className="flex space-x-1">
                      <div className="w-3 bg-indigo-500 rounded-t-sm" style={{height: '80px'}}></div>
                      <div className="w-3 bg-green-500 rounded-t-sm" style={{height: '90px'}}></div>
                    </div>
                    <span className="text-xs text-gray-400">Apr</span>
                  </div>
                  
                  {/* May */}
                  <div className="flex flex-col items-center gap-1 w-12">
                    <div className="flex space-x-1">
                      <div className="w-3 bg-indigo-500 rounded-t-sm" style={{height: '110px'}}></div>
                      <div className="w-3 bg-green-500 rounded-t-sm" style={{height: '105px'}}></div>
                    </div>
                    <span className="text-xs text-gray-400">May</span>
                  </div>
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