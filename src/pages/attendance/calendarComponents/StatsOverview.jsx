import React from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  TimerOff,
  Briefcase,
} from "lucide-react";

const StatsOverview = ({ stats }) => {
  const statItems = [
    {
      title: "Day Offs",
      value: stats.dayOff,
      icon: <Calendar size={20} />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      title: "Late Clock-ins",
      value: stats.lateClockIn,
      icon: <Clock size={20} />,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
    },
    {
      title: "Early Clock-outs",
      value: stats.earlyClockOut,
      icon: <TimerOff size={20} />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Overtime",
      value: stats.overTime,
      icon: <Clock size={20} />,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
    },
    {
      title: "Absents",
      value: stats.absent,
      icon: <AlertTriangle size={20} />,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      iconBg: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`${item.bgColor} p-4 rounded-lg border ${item.borderColor} flex items-center gap-3 shadow-sm transition-all duration-200 hover:shadow`}
        >
          <div className={`${item.iconBg} p-2 rounded-full ${item.textColor}`}>
            {item.icon}
          </div>
          <div>
            <p className={`text-sm font-medium ${item.textColor}`}>
              {item.title}
            </p>
            <h3 className={`text-2xl font-bold ${item.textColor}`}>
              {item.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
