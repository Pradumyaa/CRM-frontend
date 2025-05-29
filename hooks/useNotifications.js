// hooks/useNotifications.js - Notification management hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    (message, type = "info", duration = 5000) => {
      const notification = {
        id: Date.now() + Math.random(),
        message,
        type,
        timestamp: new Date(),
        duration,
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, duration);
      }

      return notification.id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};

// hooks/useRealTimeData.js - Real-time data updates
export const useRealTimeData = (interval = 30000) => {
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    currentlyWorking: 0,
    todayPresent: 0,
    pendingRequests: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const { user, hasRoleLevel } = useAuth();

  const fetchRealTimeData = useCallback(async () => {
    if (!hasRoleLevel(3)) return; // Admin level required

    try {
      const response = await adminApiService.getAttendanceDashboard(
        user?.employeeId || user?.id
      );

      setRealTimeData({
        activeUsers: response.dashboard?.today?.stats?.present || 0,
        currentlyWorking:
          response.dashboard?.today?.stats?.currentlyWorking || 0,
        todayPresent: response.dashboard?.today?.stats?.present || 0,
        pendingRequests: response.dashboard?.today?.stats?.pendingRequests || 0,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    }
  }, [user, hasRoleLevel]);

  useEffect(() => {
    fetchRealTimeData();

    const intervalId = setInterval(fetchRealTimeData, interval);

    return () => clearInterval(intervalId);
  }, [fetchRealTimeData, interval]);

  return {
    realTimeData,
    lastUpdated,
    refresh: fetchRealTimeData,
  };
};
