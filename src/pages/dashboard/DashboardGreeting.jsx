import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { BellRing, Calendar, Search } from "lucide-react";

const DashboardGreeting = ({ loading, employee, error }) => {
  const [greeting, setGreeting] = useState("Good Day");
  const [currentTime, setCurrentTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      // Update greeting based on time of day
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }

      // Update time string
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );

      // Update date string
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-6 rounded-xl shadow-md animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 rounded-xl shadow-md bg-red-50 border border-red-200">
        <p className="text-red-600 font-medium">Error: {error}</p>
        <p className="text-red-500 text-sm mt-1">
          Please refresh or contact support.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-xl shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {`${greeting}, ${employee?.name || "User"}!`}
          </h1>
          <p className="text-gray-600 mt-1">
            {date} | {currentTime}
          </p>
        </div>

        <div className="flex mt-4 md:mt-0 space-x-3">
          <Button className="relative bg-indigo-200 text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg px-3">
            <BellRing className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Schedule</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DashboardGreeting;
