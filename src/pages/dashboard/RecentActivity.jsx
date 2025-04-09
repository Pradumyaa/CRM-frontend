import React from "react";
import { Card } from "../components/ui/card";
import {
  Users,
  DollarSign,
  CheckCircle,
  UserPlus,
  Folder,
  List,
} from "lucide-react";

const RecentActivity = ({ activities }) => {
  // Function to get appropriate icon based on activity type
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case "lead":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "deal":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "client":
        return <Users className="h-5 w-5 text-purple-500" />;
      case "task":
        return <CheckCircle className="h-5 w-5 text-amber-500" />;
      case "folder":
        return <Folder className="h-5 w-5 text-indigo-500" />;
      case "project":
        return <List className="h-5 w-5 text-cyan-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get background color based on activity type
  const getActivityBackground = (type) => {
    switch (type.toLowerCase()) {
      case "lead":
        return "bg-blue-50";
      case "deal":
        return "bg-green-50";
      case "client":
        return "bg-purple-50";
      case "task":
        return "bg-amber-50";
      case "folder":
        return "bg-indigo-50";
      case "project":
        return "bg-cyan-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <Card className="p-5 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div
                className={`p-2 rounded-lg mr-3 ${getActivityBackground(
                  activity.type
                )}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {activity.name}
                </p>
                <p className="text-xs text-gray-500">{activity.action}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.space && (
                    <span className="text-indigo-500">{activity.space}</span>
                  )}
                  {activity.folder && <span> • {activity.folder}</span>}
                  {activity.list && <span> • {activity.list}</span>}
                  {activity.time && <span> • {activity.time}</span>}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No recent activities
          </div>
        )}
      </div>

      <button className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 pt-2 border-t">
        Load More
      </button>
    </Card>
  );
};

export default RecentActivity;
