import React from "react";
import { Card } from "../components/ui/card";
import { Users, TrendingUp, CheckCircle, DollarSign } from "lucide-react";

const MetricsOverview = ({ metrics, loading }) => {
  const metricCards = [
    {
      title: "Total Clients",
      value: metrics.totalClients,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: "+5.2%",
      trend: "up",
      background: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Active Deals",
      value: metrics.activeDeals,
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      change: "+12.3%",
      trend: "up",
      background: "bg-green-50",
      border: "border-green-100",
    },
    {
      title: "Completed Tasks",
      value: metrics.completedTasks,
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      change: "+8.7%",
      trend: "up",
      background: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
      change: "+2.4%",
      trend: "up",
      background: "bg-amber-50",
      border: "border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card, index) => (
        <Card
          key={index}
          className={`p-4 border rounded-xl shadow-sm ${card.background} ${card.border}`}
        >
          {loading ? (
            <div className="animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {card.title}
                </h3>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">
                {card.value}
              </p>
              <div className="flex items-center">
                <span
                  className={
                    card.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {card.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;
