// pages/dashboard/MetricsOverview.jsx
import React from "react";
import { Card } from "../../components/ui/card";
import { Users, TrendingUp, CheckCircle, DollarSign } from "lucide-react";

const MetricsOverview = ({ metrics, loading }) => {
  if (!metrics || !Array.isArray(metrics)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="p-4 border rounded-xl shadow-sm bg-gray-50 border-gray-200 animate-pulse"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((card, index) => (
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
                    card.trend === "up"
                      ? "text-green-600"
                      : card.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }
                >
                  {card.change}
                </span>
                {card.change !== "-" && (
                  <span className="text-xs text-gray-500 ml-1">this month</span>
                )}
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;
