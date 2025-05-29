// services/adminApiService.js - Comprehensive API service for SuperAdmin panel
class AdminApiService {
  constructor() {
    this.baseURL =
      process.env.REACT_APP_API_URL || "https://getmax-backend.vercel.app/api";
    this.token = localStorage.getItem("token");
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Employee Management APIs
  async getAllEmployees() {
    return this.apiCall("/employees");
  }

  async getEmployeeById(employeeId) {
    return this.apiCall(`/employees/${employeeId}`);
  }

  async createEmployee(employeeData) {
    return this.apiCall("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(employeeId, employeeData) {
    return this.apiCall(`/employees/${employeeId}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(employeeId) {
    return this.apiCall(`/employees/${employeeId}`, {
      method: "DELETE",
    });
  }

  async searchEmployees(searchTerm) {
    return this.apiCall("/employees/search", {
      method: "POST",
      body: JSON.stringify({ name: searchTerm }),
    });
  }

  async checkAdminStatus(employeeId) {
    return this.apiCall(`/employees/admin/${employeeId}`);
  }

  // Attendance Management APIs
  async getAttendanceDashboard(adminId) {
    return this.apiCall(`/calendar/dashboard?adminId=${adminId}`);
  }

  async getAllAttendance(adminId, startDate, endDate) {
    const params = new URLSearchParams({
      adminId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    return this.apiCall(`/calendar/attendance/all?${params}`);
  }

  async getAttendanceByEmployee(employeeId, startDate, endDate) {
    const params = new URLSearchParams({
      employeeId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    return this.apiCall(`/calendar/attendance?${params}`);
  }

  async getAttendanceSummary(employeeId, period = "month") {
    return this.apiCall(
      `/calendar/attendance/summary?employeeId=${employeeId}&period=${period}`
    );
  }

  async bulkUpdateAttendance(updates, adminId) {
    return this.apiCall("/calendar/attendance/bulk-update", {
      method: "PUT",
      body: JSON.stringify({ updates, adminId }),
    });
  }

  async generateAttendanceReport(
    employeeId,
    startDate,
    endDate,
    format = "json"
  ) {
    const params = new URLSearchParams({
      employeeId,
      startDate,
      endDate,
      format,
    });
    return this.apiCall(`/calendar/report?${params}`);
  }

  // Day Off Management APIs
  async getPendingDayOffRequests(adminId, filters = {}) {
    const params = new URLSearchParams({
      adminId,
      ...filters,
    });
    return this.apiCall(`/calendar/attendance/day-off/pending?${params}`);
  }

  async approveDayOffRequest(
    adminId,
    employeeId,
    date,
    approved,
    comments = ""
  ) {
    return this.apiCall("/calendar/attendance/day-off/approve", {
      method: "POST",
      body: JSON.stringify({
        adminId,
        employeeId,
        date,
        approved,
        comments,
        notifyEmployee: true,
      }),
    });
  }

  async bulkProcessDayOffRequests(adminId, requests, approved, comments = "") {
    return this.apiCall("/calendar/attendance/day-off/bulk-process", {
      method: "POST",
      body: JSON.stringify({
        adminId,
        requests,
        approved,
        comments,
      }),
    });
  }

  async getDayOffRequestDetails(requestId, adminId) {
    return this.apiCall(
      `/calendar/attendance/day-off/details/${requestId}?adminId=${adminId}`
    );
  }

  async getDayOffAnalytics(adminId, period = "month") {
    return this.apiCall(
      `/calendar/analytics?adminId=${adminId}&period=${period}`
    );
  }

  // Holiday Management APIs
  async getHolidays(startDate, endDate) {
    const params = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    return this.apiCall(`/calendar/holidays?${params}`);
  }

  async setHoliday(date, description, isHoliday = true, type = "public") {
    return this.apiCall("/calendar/holidays", {
      method: "POST",
      body: JSON.stringify({
        date,
        description,
        isHoliday,
        type,
      }),
    });
  }

  // Document Management APIs
  async getAllDocuments() {
    return this.apiCall("/documents/all");
  }

  async getEmployeeDocuments(employeeId) {
    return this.apiCall(`/documents/${employeeId}`);
  }

  async uploadDocument(formData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseURL}/documents/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData, // FormData for file upload
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteDocument(documentId) {
    return this.apiCall(`/documents/${documentId}`, {
      method: "DELETE",
    });
  }

  async getDocumentStats() {
    return this.apiCall("/documents/stats");
  }

  // Analytics and Statistics APIs
  async getOverviewStats(adminId) {
    return this.apiCall(`/calendar/stats/overview?adminId=${adminId}`);
  }

  async getAttendanceTrends(adminId, period = "month", granularity = "daily") {
    return this.apiCall(
      `/calendar/stats/trends?adminId=${adminId}&period=${period}&granularity=${granularity}`
    );
  }

  async getSystemHealth() {
    return this.apiCall("/calendar/health");
  }

  // Export and Reporting APIs
  async exportData(format = "csv", startDate, endDate, employeeIds = []) {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(employeeIds.length > 0 && { employeeIds: employeeIds.join(",") }),
    });

    const response = await fetch(
      `${this.baseURL}/calendar/report/export/${format}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    // Handle different response types
    if (format === "csv") {
      return response.text();
    } else {
      return response.blob();
    }
  }

  // Notification APIs
  async sendNotification(
    recipients,
    title,
    message,
    type = "info",
    actionRequired = false
  ) {
    return this.apiCall("/calendar/notifications/send", {
      method: "POST",
      body: JSON.stringify({
        recipients,
        title,
        message,
        type,
        actionRequired,
      }),
    });
  }

  async getNotificationTemplates() {
    return this.apiCall("/calendar/notifications/templates");
  }

  // System Configuration APIs
  async getSystemConfig() {
    return this.apiCall("/calendar/config");
  }

  async updateSystemConfig(config) {
    return this.apiCall("/calendar/config", {
      method: "PUT",
      body: JSON.stringify({ config }),
    });
  }

  // Real-time Data APIs
  async getTodayAttendance(employeeId) {
    return this.apiCall(`/calendar/attendance/today?employeeId=${employeeId}`);
  }

  async clockIn(employeeId) {
    return this.apiCall("/calendar/attendance/clock-in", {
      method: "POST",
      body: JSON.stringify({ employeeId }),
    });
  }

  async clockOut(employeeId, isAutoLogout = false) {
    return this.apiCall("/calendar/attendance/clock-out", {
      method: "POST",
      body: JSON.stringify({ employeeId, isAutoLogout }),
    });
  }

  async requestDayOff(employeeId, date, reason, requestType = "personal") {
    return this.apiCall("/calendar/attendance/day-off/request", {
      method: "POST",
      body: JSON.stringify({
        employeeId,
        date,
        reason,
        requestType,
      }),
    });
  }

  // Advanced Analytics APIs
  async getDepartmentAnalytics(adminId, departmentId = null, period = "month") {
    const params = new URLSearchParams({
      adminId,
      period,
      ...(departmentId && { departmentId }),
    });
    return this.apiCall(`/calendar/analytics/department?${params}`);
  }

  async getRoleAnalytics(adminId, roleId = null, period = "month") {
    const params = new URLSearchParams({
      adminId,
      period,
      ...(roleId && { roleId }),
    });
    return this.apiCall(`/calendar/analytics/role?${params}`);
  }

  async getPerformanceMetrics(adminId, employeeId = null, period = "month") {
    const params = new URLSearchParams({
      adminId,
      period,
      ...(employeeId && { employeeId }),
    });
    return this.apiCall(`/calendar/analytics/performance?${params}`);
  }

  // Batch Operations
  async batchOperations(operations) {
    return this.apiCall("/admin/batch", {
      method: "POST",
      body: JSON.stringify({ operations }),
    });
  }

  // Audit and Logging
  async getAuditLogs(adminId, startDate, endDate, action = null) {
    const params = new URLSearchParams({
      adminId,
      startDate,
      endDate,
      ...(action && { action }),
    });
    return this.apiCall(`/admin/audit-logs?${params}`);
  }

  async logActivity(action, details) {
    return this.apiCall("/admin/log-activity", {
      method: "POST",
      body: JSON.stringify({
        action,
        details,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // User Management Advanced Features
  async resetEmployeePassword(employeeId) {
    return this.apiCall(`/admin/reset-password/${employeeId}`, {
      method: "POST",
    });
  }

  async toggleEmployeeStatus(employeeId, status) {
    return this.apiCall(`/admin/toggle-status/${employeeId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async assignRole(employeeId, role) {
    return this.apiCall(`/admin/assign-role`, {
      method: "POST",
      body: JSON.stringify({ employeeId, role }),
    });
  }

  async bulkAssignRole(employeeIds, role) {
    return this.apiCall("/admin/bulk-assign-role", {
      method: "POST",
      body: JSON.stringify({ employeeIds, role }),
    });
  }

  // Department Management
  async createDepartment(departmentData) {
    return this.apiCall("/admin/departments", {
      method: "POST",
      body: JSON.stringify(departmentData),
    });
  }

  async updateDepartment(departmentId, departmentData) {
    return this.apiCall(`/admin/departments/${departmentId}`, {
      method: "PUT",
      body: JSON.stringify(departmentData),
    });
  }

  async deleteDepartment(departmentId) {
    return this.apiCall(`/admin/departments/${departmentId}`, {
      method: "DELETE",
    });
  }

  async getDepartmentEmployees(departmentId) {
    return this.apiCall(`/admin/departments/${departmentId}/employees`);
  }

  // Permission Management
  async getUserPermissions(employeeId) {
    return this.apiCall(`/admin/permissions/${employeeId}`);
  }

  async updateUserPermissions(employeeId, permissions) {
    return this.apiCall(`/admin/permissions/${employeeId}`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  }

  async getRolePermissions(role) {
    return this.apiCall(`/admin/role-permissions/${role}`);
  }

  async updateRolePermissions(role, permissions) {
    return this.apiCall(`/admin/role-permissions/${role}`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  }

  // System Monitoring
  async getSystemStatus() {
    return this.apiCall("/admin/system-status");
  }

  async getActiveUsers() {
    return this.apiCall("/admin/active-users");
  }

  async getSystemMetrics() {
    return this.apiCall("/admin/system-metrics");
  }

  // Data Import/Export
  async importEmployees(csvData) {
    return this.apiCall("/admin/import-employees", {
      method: "POST",
      body: JSON.stringify({ csvData }),
    });
  }

  async exportEmployees(format = "csv", filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(
      `${this.baseURL}/admin/export-employees/${format}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return format === "csv" ? response.text() : response.blob();
  }

  // Backup and Restore
  async createBackup() {
    return this.apiCall("/admin/backup", {
      method: "POST",
    });
  }

  async getBackupList() {
    return this.apiCall("/admin/backups");
  }

  async restoreBackup(backupId) {
    return this.apiCall(`/admin/restore/${backupId}`, {
      method: "POST",
    });
  }

  // Error handling and retry logic
  async retryApiCall(endpoint, options = {}, maxRetries = 3) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.apiCall(endpoint, options);
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    throw lastError;
  }

  // Utility methods
  formatErrorMessage(error) {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    return error.message || "An unexpected error occurred";
  }

  isNetworkError(error) {
    return !error.response || error.code === "NETWORK_ERROR";
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Create singleton instance
const adminApiService = new AdminApiService();

export default adminApiService;
