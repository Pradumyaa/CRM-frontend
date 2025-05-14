import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  TimerOff,
  Briefcase,
  UserCheck,
  TrendingUp,
  Award,
} from "lucide-react";

const StatsOverview = ({ stats, className = "" }) => {
  // State for animation
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});

  // Default stats if not provided
  const defaultStats = {
    dayOff: 0,
    lateClockIn: 0,
    earlyClockOut: 0,
    overTime: 0,
    absent: 0,
    present: 0,
  };

  // Merge provided stats with defaults
  const mergedStats = { ...defaultStats, ...stats };

  // Animate stats on mount and when stats change
  useEffect(() => {
    setIsVisible(true);

    // Reset animated stats
    setAnimatedStats({
      dayOff: 0,
      lateClockIn: 0,
      earlyClockOut: 0,
      overTime: 0,
      absent: 0,
      present: 0,
    });

    // Animate each stat over time
    const duration = 1000; // ms
    const steps = 20;
    const interval = duration / steps;

    let step = 0;

    const timer = setInterval(() => {
      step++;

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats(mergedStats);
      } else {
        // Calculate intermediate values
        const progress = step / steps;
        const intermediate = {};

        for (const key in mergedStats) {
          const target = mergedStats[key];
          intermediate[key] = Math.round(target * progress);
        }

        setAnimatedStats(intermediate);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [JSON.stringify(mergedStats)]);

  // Define stat items with icons, colors, and labels
  const statItems = [
    {
      title: "Present Days",
      value: animatedStats.present,
      icon: <UserCheck size={20} />,
      bgColorClass: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      textColorClass: "text-indigo-700",
      borderColorClass: "border-indigo-200",
      iconBgClass: "bg-indigo-100",
      description: "Total days present",
    },
    {
      title: "Day Offs",
      value: animatedStats.dayOff,
      icon: <Calendar size={20} />,
      bgColorClass: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColorClass: "text-blue-700",
      borderColorClass: "border-blue-200",
      iconBgClass: "bg-blue-100",
      description: "Approved time off",
    },
    {
      title: "Late Clock-ins",
      value: animatedStats.lateClockIn,
      icon: <Clock size={20} />,
      bgColorClass: "bg-gradient-to-br from-red-50 to-red-100",
      textColorClass: "text-red-700",
      borderColorClass: "border-red-200",
      iconBgClass: "bg-red-100",
      description: "Arrivals after 9:00 AM",
    },
    {
      title: "Early Clock-outs",
      value: animatedStats.earlyClockOut,
      icon: <TimerOff size={20} />,
      bgColorClass: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      textColorClass: "text-yellow-700",
      borderColorClass: "border-yellow-200",
      iconBgClass: "bg-yellow-100",
      description: "Departures before 5:00 PM",
    },
    {
      title: "Overtime",
      value: animatedStats.overTime,
      icon: <TrendingUp size={20} />,
      bgColorClass: "bg-gradient-to-br from-green-50 to-green-100",
      textColorClass: "text-green-700",
      borderColorClass: "border-green-200",
      iconBgClass: "bg-green-100",
      description: "Work beyond 5:00 PM",
    },
    {
      title: "Absents",
      value: animatedStats.absent,
      icon: <AlertTriangle size={20} />,
      bgColorClass: "bg-gradient-to-br from-gray-50 to-gray-100",
      textColorClass: "text-gray-700",
      borderColorClass: "border-gray-200",
      iconBgClass: "bg-gray-100",
      description: "Unexcused absences",
    },
  ];

  // Calculate overall performance score (simplified)
  const calculatePerformanceScore = () => {
    const totalDays =
      mergedStats.present + mergedStats.absent + mergedStats.dayOff;
    if (totalDays === 0) return 0;

    // Positive factors
    const presentScore = (mergedStats.present / totalDays) * 100;
    const overtimeScore = Math.min(mergedStats.overTime * 5, 20); // Cap at 20 points

    // Negative factors
    const lateScore = Math.min(mergedStats.lateClockIn * 5, 30);
    const earlyScore = Math.min(mergedStats.earlyClockOut * 5, 30);
    const absentScore = Math.min(mergedStats.absent * 10, 40);

    // Calculate total (100 base score)
    const score = 100 + overtimeScore - lateScore - earlyScore - absentScore;

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const performanceScore = calculatePerformanceScore();

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Briefcase className="mr-2 text-blue-600" size={20} />
          <span>Attendance Overview</span>
        </h3>

        {/* Performance indicator */}
        <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
          <Award size={18} className="text-blue-600 mr-2" />
          <div>
            <span className="text-xs text-gray-600">Performance</span>
            <div className="flex items-center">
              <div className="w-20 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    performanceScore >= 80
                      ? "bg-green-500"
                      : performanceScore >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${performanceScore}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-700">
                {performanceScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColorClass} p-4 rounded-lg border ${item.borderColorClass} flex flex-col shadow-sm transition-all duration-300 hover:shadow-md hover:transform hover:-translate-y-1`}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`${item.iconBgClass} p-2 rounded-full ${item.textColorClass}`}
              >
                {item.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${item.textColorClass}`}>
                  {item.title}
                </p>
                <h3 className={`text-2xl font-bold ${item.textColorClass}`}>
                  {item.value}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 border-t border-gray-200 pt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;
