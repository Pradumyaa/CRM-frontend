import { Globe, Users, DollarSign, TrendingUp } from "lucide-react";

const BETDashboardPreview = () => {
  return (
    <div>
      <div className="relative">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
          <div className="bg-gradient-to-r from-[#5932EA] to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-white font-semibold">BET Dashboard</div>
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Globe className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-[#5932EA]/10 p-4 rounded-xl border border-blue-200/50">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-[#5932EA]" />
                  <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">
                    +12%
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#5932EA]">1,240</div>
                <div className="text-sm text-gray-600">Active Employees</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-200/50">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">
                    +28%
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">₹5.2M</div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-900">
                  Performance Overview
                </div>
                <div className="flex items-center text-green-600 text-sm font-bold">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Task Completion</span>
                  <span className="text-xs font-bold text-[#5932EA]">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#5932EA] to-purple-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BETDashboardPreview;
