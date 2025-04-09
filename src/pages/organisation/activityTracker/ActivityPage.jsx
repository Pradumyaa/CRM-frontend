import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

// Base API URL from environment variable
const API_BASE_URL = 'https://crm-backend-6gcl.onrender.com';

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    onLeave: 0
  });

  // Fetch all employee data
  const fetchEmployees = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/employees`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setEmployees(data.employees);
      setStats(prev => ({
        ...prev,
        totalEmployees: data.employees.length
      }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employee data. Please try again later.');
    }
  };

  // Fetch pending day off requests
  const fetchPendingRequests = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/admin/pending-requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pending requests: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setPendingRequests(data.requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setError('Failed to load pending requests. Please try again later.');
    }
  };

  // Fetch today's stats
  const fetchTodayStats = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/admin/today-stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch today's stats: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setStats(prev => ({
        ...prev,
        presentToday: data.present,
        lateToday: data.late,
        onLeave: data.onLeave
      }));
    } catch (error) {
      console.error('Error fetching today stats:', error);
      setError('Failed to load today\'s statistics. Please try again later.');
    }
  };

  // Handle day off approval/rejection
  const handleRequestAction = async (requestId, action) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/admin/process-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          requestId,
          action, // 'approve' or 'reject'
          adminId: localStorage.getItem('employeeId')
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to process request: ${response.status} ${response.statusText}`);
      }

      // Refresh data after successful action
      await Promise.all([
        fetchPendingRequests(),
        fetchEmployees()
      ]);
      
    } catch (error) {
      console.error('Error processing request:', error);
      setError(`Failed to ${action} request. Please try again.`);
    }
  };

  // Function to fetch employee attendance details
  const fetchEmployeeAttendance = async (employeeId) => {
    try {
      setError(null);
      // Get current month's date range
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      const response = await fetch(
        `${API_BASE_URL}/api/calendar/attendance?employeeId=${employeeId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Format the data for display
      const recentAttendance = Object.entries(data.attendanceData).map(([date, details]) => ({
        date,
        status: details.status,
        clockIn: details.clockIn,
        clockOut: details.clockOut,
        isLate: details.isLate,
        isEarly: details.isEarly
      })).sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Update the selected employee with attendance data
      setSelectedEmployee(prev => ({
        ...prev,
        recentAttendance: recentAttendance.slice(0, 10) // Show only last 10 days
      }));
      
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      setError('Failed to load attendance details. Please try again later.');
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchEmployees(),
          fetchPendingRequests(),
          fetchTodayStats()
        ]);
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Auto-refresh data every 5 minutes
    const refreshInterval = setInterval(loadData, 300000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Fetch employee attendance when an employee is selected
  useEffect(() => {
    if (selectedEmployee && !selectedEmployee.recentAttendance) {
      fetchEmployeeAttendance(selectedEmployee.id);
    }
  }, [selectedEmployee]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalEmployees}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Present Today</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.presentToday}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Late Today</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.lateToday}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">On Leave</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.onLeave}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`${activeTab === 'employees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Employee Management
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`${activeTab === 'requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {employees.slice(0, 5).map(employee => (
                <div key={employee.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {employee.lastActivity || 'No recent activity'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Employee Attendance</h3>
              <p className="mt-1 text-sm text-gray-500">View and manage employee attendance records.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Worked</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Days</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Off</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {employee.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.daysWorked}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.lateDays}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.daysOff}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Day Off Requests</h3>
              <p className="mt-1 text-sm text-gray-500">Approve or reject employee day off requests.</p>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pending day off requests
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {request.employeeName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">{request.employeeName}</h4>
                            <p className="text-sm text-gray-500">{request.employeePosition}</p>
                          </div>
                        </div>
                        <div className="mt-2 ml-14">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Request Date:</span> {format(parseISO(request.date), 'MMMM d, yyyy')}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Submitted on {format(parseISO(request.submittedAt), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRequestAction(request.id, 'approve')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'reject')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{selectedEmployee.name}'s Attendance Details</h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Employee Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {selectedEmployee.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Position:</span> {selectedEmployee.position}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {selectedEmployee.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Employee ID:</span> {selectedEmployee.id}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Attendance Summary</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Days Worked:</span> {selectedEmployee.daysWorked}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Late Arrivals:</span> {selectedEmployee.lateDays}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Early Departures:</span> {selectedEmployee.earlyDays || 0}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Days Off:</span> {selectedEmployee.daysOff}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Attendance</h4>
                {selectedEmployee.recentAttendance ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEmployee.recentAttendance.map((record) => (
                          <tr key={record.date} className={`hover:bg-gray-50 ${record.isLate ? 'bg-red-50' : ''}`}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {format(parseISO(record.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                record.status === 'present' ? 'bg-green-100 text-green-800' :
                                record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                record.status === 'leave' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                              {record.isLate && (
                                <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Late
                                </span>
                              )}
                              {record.isEarly && (
                                <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Left Early
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {record.clockIn ? format(parseISO(record.clockIn), 'h:mm a') : '-'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {record.clockOut ? format(parseISO(record.clockOut), 'h:mm a') : '-'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {record.notes || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 text-sm text-gray-500">
                    Loading attendance data...
                  </div>
                )}
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedEmployee(null)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;