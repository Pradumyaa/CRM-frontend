import React from "react";
import { Card } from "../components/ui/card";
import { Calendar, Phone, Clock } from "lucide-react";

const UpcomingEvents = ({ events = [] }) => {
  // Function to get icon based on event type
  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "meeting":
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      case "call":
        return <Phone className="h-4 w-4 text-green-500" />;
      case "deadline":
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to get border color based on event type
  const getEventBorder = (type) => {
    switch (type?.toLowerCase()) {
      case "meeting":
        return "border-l-indigo-500";
      case "call":
        return "border-l-green-500";
      case "deadline":
        return "border-l-red-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <Card className="p-5 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View Calendar
        </button>
      </div>

      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-3 bg-white border-l-4 ${getEventBorder(
                event.type
              )} rounded-r-lg shadow-sm hover:shadow transition-shadow duration-200`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500">with {event.contact}</p>
                </div>
                <div className="flex items-center">
                  {getEventIcon(event.type)}
                  <span className="text-xs text-gray-500 ml-1">
                    {event.date}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No upcoming events
          </div>
        )}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-center text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-lg">
        + Add New Event
      </button>
    </Card>
  );
};

export default UpcomingEvents;
