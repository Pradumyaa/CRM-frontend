// store/useDashboardStore.js
import { create } from "zustand";
import { dashboardService } from "../api/apiClient";

const useDashboardStore = create((set, get) => ({
  // Dashboard data
  adminMetrics: {
    totalEmployees: 0,
    activeEmployees: 0,
    activeRate: 0,
  },
  employeeMetrics: {
    dayOff: 0,
    lateClockIn: 0,
    earlyClockOut: 0,
    overTime: 0,
    absent: 0,
    totalDaysWorked: 0,
    totalDaysOff: 0,
  },
  employee: null,
  recentActivities: [],
  upcomingEvents: [],
  loading: false,
  error: null,

  // Actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch admin dashboard data
  fetchAdminDashboard: async () => {
    try {
      set({ loading: true, error: null });

      // Fetch admin metrics
      const adminMetrics = await dashboardService.getAdminMetrics();
      set({ adminMetrics });

      // For now, we're returning the state but in a real app, you might want
      // to return the data directly from the function
      return get();
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      set({ error: error.message || "Failed to load admin dashboard" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch employee dashboard data
  fetchEmployeeDashboard: async (employeeId) => {
    try {
      set({ loading: true, error: null });

      // Fetch employee metrics
      const employeeMetrics = await dashboardService.getEmployeeMetrics(
        employeeId
      );
      set({ employeeMetrics });

      return get();
    } catch (error) {
      console.error("Error fetching employee dashboard:", error);
      set({ error: error.message || "Failed to load employee dashboard" });
    } finally {
      set({ loading: false });
    }
  },

  // Update dashboard data
  updateRecentActivities: (activities) => set({ recentActivities: activities }),
  updateUpcomingEvents: (events) => set({ upcomingEvents: events }),

  // Reset store
  resetStore: () =>
    set({
      adminMetrics: {
        totalEmployees: 0,
        activeEmployees: 0,
        activeRate: 0,
      },
      employeeMetrics: {
        dayOff: 0,
        lateClockIn: 0,
        earlyClockOut: 0,
        overTime: 0,
        absent: 0,
        totalDaysWorked: 0,
        totalDaysOff: 0,
      },
      employee: null,
      recentActivities: [],
      upcomingEvents: [],
      loading: false,
      error: null,
    }),
}));

export default useDashboardStore;
