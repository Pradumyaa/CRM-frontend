// components/ProfilePage.jsx - Updated Skills Section
import React, { useEffect, useState, useRef } from "react";
import {
  User,
  MapPin,
  Calendar,
  Edit2,
  FileText,
  Briefcase,
  Award,
  Clock,
  CheckCircle,
  Upload,
  Camera,
  X,
  Check,
  Download,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Info,
} from "lucide-react";

import Overview from "./profile-components/Overview";
import Projects from "./profile-components/Projects";
import Documents from "./profile-components/Documents";
import PerformanceStats from "./profile-components/PerformanceStats";
import resumeParserService from "../../services/ResumeParserservice";

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const ProfilePage = ({ profileId }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImage, setProfileImage] = useState("/api/placeholder/80/80");
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingError, setLoadingError] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState(null);
  const [hasResume, setHasResume] = useState(false);

  // Get current user's ID from localStorage
  const currentEmployeeId = localStorage.getItem("employeeId");

  // Set the employee ID to view - either the one passed in props or the current user's ID
  const employeeId = profileId || currentEmployeeId;

  // Check if viewing own profile
  useEffect(() => {
    setIsOwnProfile(employeeId === currentEmployeeId);
  }, [employeeId, currentEmployeeId]);

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token not found. Please log in again.");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/employees/admin/${currentEmployeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check admin status");
        }

        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [currentEmployeeId]);

  // Update profile image when employee data changes
  useEffect(() => {
    if (employeeData && employeeData.images && employeeData.images.length > 0) {
      setProfileImage(
        `${employeeData.images[0]}?timestamp=${new Date().getTime()}`
      );
    }
  }, [employeeData]);

  // Load skills from resume using API
  const loadSkills = async () => {
    setSkillsLoading(true);
    setSkillsError(null);

    try {
      console.log(`Loading skills for employee: ${employeeId}`);

      // Check if employee has a resume first
      const resumeExists = await resumeParserService.hasResume(employeeId);
      setHasResume(resumeExists);

      if (!resumeExists) {
        console.log("No resume found for employee, using default skills");
        setSkills(resumeParserService.getDefaultSkills());
        setSkillsError(
          "No resume uploaded. Upload a resume to extract technical skills."
        );
        setSkillsLoading(false);
        return;
      }

      // Get skills from resume using the API
      const extractedSkills = await resumeParserService.getEmployeeSkills(
        employeeId
      );

      // Format and limit skills to top 5
      const formattedSkills = resumeParserService
        .formatSkills(extractedSkills)
        .slice(0, 5);
      setSkills(formattedSkills);

      console.log(`Loaded ${formattedSkills.length} skills from resume`);
    } catch (error) {
      console.error("Error loading skills:", error);
      setSkillsError(
        "Failed to load skills from resume. Please try refreshing."
      );
      // Use default skills as fallback
      setSkills(resumeParserService.getDefaultSkills().slice(0, 5));
    } finally {
      setSkillsLoading(false);
    }
  };

  // Refresh skills from resume
  const refreshSkills = async () => {
    setSkillsLoading(true);
    setSkillsError(null);

    try {
      console.log("Refreshing skills from resume...");

      // Force refresh skills from API
      const refreshedSkills = await resumeParserService.refreshEmployeeSkills(
        employeeId
      );

      // Format and limit skills to top 5
      const formattedSkills = resumeParserService
        .formatSkills(refreshedSkills)
        .slice(0, 5);
      setSkills(formattedSkills);

      // Check if resume exists after refresh
      const resumeExists = await resumeParserService.hasResume(employeeId);
      setHasResume(resumeExists);

      if (!resumeExists) {
        setSkillsError(
          "No resume found. Upload a resume to extract technical skills."
        );
      }

      console.log(`Refreshed ${formattedSkills.length} skills`);
    } catch (error) {
      console.error("Error refreshing skills:", error);
      setSkillsError("Failed to refresh skills. Please try again.");
    } finally {
      setSkillsLoading(false);
    }
  };

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoadingError(
            "Authentication token not found. Please log in again."
          );
          return;
        }

        if (!employeeId) {
          setLoadingError("Employee ID not found");
          return;
        }

        // Fetch employee data from backend with authentication token
        const response = await fetch(
          `http://localhost:3000/api/employees/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch employee data");
        }

        const data = await response.json();
        console.log("Fetched employee data:", data);

        const employee = {
          ...data.employee,
          images: data.employee.images || [],
        };

        setEmployeeData(employee);
        setEditForm(employee);

        // Set Cloudinary Image URL with Cache Buster
        if (employee.images && employee.images.length > 0) {
          setProfileImage(
            `${employee.images[0]}?timestamp=${new Date().getTime()}`
          );
        }

        // Load skills after employee data is loaded
        loadSkills();
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setLoadingError(`Error loading profile: ${error.message}`);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  // Update employee data
  const handleEditSubmit = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:3000/api/employees/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update employee data");
      }

      const updatedData = await response.json();
      setEmployeeData(updatedData.employee || updatedData);
      setSaveSuccess(true);

      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating employee data:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle profile image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("employeeId", employeeId);

      setUploading(true);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/images/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to upload image");
        }

        const result = await response.json();
        const newImageUrl = result.imageUrl;

        // Update Profile Image
        setProfileImage(newImageUrl);

        // Update Employee Data
        setEmployeeData((prevData) => ({
          ...prevData,
          images: [newImageUrl, ...(prevData.images || [])],
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  // Show loading state
  if (loadingError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-gray-600">{loadingError}</p>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md"></div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Get today's date in a nice format
  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              {isOwnProfile ? (
                <h1 className="text-3xl font-bold mb-1">
                  {getGreeting()}, {employeeData.name} 👋
                </h1>
              ) : (
                <h1 className="text-3xl font-bold mb-1">
                  {employeeData.name}'s Profile
                </h1>
              )}
              <p className="opacity-80 text-lg">{getTodayDate()}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              {(isOwnProfile || isAdmin) && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-indigo-700 px-4 py-2 rounded-lg flex items-center transition-all hover:bg-opacity-90 shadow-lg hover:shadow-xl"
                >
                  <Edit2 className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Profile Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
                {/* Edit Button - Only show if it's own profile or admin */}
                {(isOwnProfile || isAdmin) && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 focus:outline-none"
                  >
                    <Edit2 size={18} className="text-indigo-600" />
                  </button>
                )}
              </div>

              {/* Profile Image */}
              <div className="flex flex-col items-center -mt-16 px-6 pb-6">
                <div
                  className="relative"
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Only show the camera button if it's own profile or admin */}
                  {(isOwnProfile || isAdmin) && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 ${
                          imageHover
                            ? "opacity-100 transform scale-100"
                            : "opacity-80 transform scale-90"
                        }`}
                      >
                        <Camera size={16} className="text-white" />
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                      />
                    </>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Name & Position */}
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {employeeData.name || "N/A"}
                </h2>
                <p className="text-indigo-600 font-medium">
                  {employeeData.jobTitle || "Employee"}
                </p>

                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    Joined: {formatDate(employeeData.joiningDate) || "N/A"}
                  </span>
                </div>

                <div className="w-full border-t border-gray-100 my-6"></div>

                {/* Employee Meta */}
                <div className="w-full space-y-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                      <Briefcase size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Employee ID</p>
                      <p className="text-sm font-medium">
                        {employeeData.employeeId || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                      <User size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Manager</p>
                      <p className="text-sm font-medium">
                        {employeeData.manager || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                      <Briefcase size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm font-medium">
                        {employeeData.department || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                      <MapPin size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Work Location</p>
                      <p className="text-sm font-medium">
                        {employeeData.location || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                      <Calendar size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Joining Date</p>
                      <p className="text-sm font-medium">
                        {formatDate(
                          employeeData.dateOfJoining || employeeData.joiningDate
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                      <Mail size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {employeeData.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                      <Phone size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">
                        {employeeData.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <button
                    onClick={() => {
                      setActiveTab("documents");
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-lg transition-all duration-200 flex justify-center items-center hover:shadow-md"
                  >
                    <FileText size={16} className="mr-2" />
                    View Documents
                  </button>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Award size={18} className="text-indigo-600 mr-2" />
                  Skills & Expertise
                  {skillsLoading && (
                    <Sparkles
                      size={16}
                      className="ml-2 text-yellow-500 animate-pulse"
                    />
                  )}
                </h3>

                <div className="flex items-center space-x-2">
                  {skillsError && (
                    <div className="relative group">
                      <AlertCircle size={16} className="text-amber-500" />
                      <div className="absolute right-0 top-6 w-48 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {skillsError}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={refreshSkills}
                    disabled={skillsLoading}
                    className={`text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100 transition-colors ${
                      skillsLoading ? "animate-spin" : ""
                    }`}
                    title="Refresh skills from resume"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Skills Status Info */}
              {!hasResume && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <Info size={16} className="text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        No Resume Found
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Upload a resume in the Documents tab to extract
                        technical skills automatically
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {skillsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex justify-between mb-1">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium flex items-center">
                            {skill.color && (
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: skill.color }}
                              ></div>
                            )}
                            {skill.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {skill.expertise}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, skill.level)
                              )}%`,
                              backgroundColor: skill.color || "#6366f1",
                            }}
                          ></div>
                        </div>
                        {skill.category && (
                          <div className="text-xs text-gray-400 mt-1">
                            {skill.category}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <Award size={24} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No skills extracted yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Upload a resume to auto-extract skills
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={refreshSkills}
                  disabled={skillsLoading}
                  className="flex-1 px-4 py-2 text-sm text-indigo-600 hover:text-white border border-indigo-200 hover:bg-indigo-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {skillsLoading ? "Loading..." : "Refresh from Resume"}
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all duration-200"
                >
                  Upload Resume
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full lg:w-2/3">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === "overview"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === "projects"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === "documents"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Documents
                </button>
              </div>

              {/* Content based on active tab */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <Overview employeeData={employeeData} />
                )}

                {activeTab === "projects" && <Projects />}

                {activeTab === "documents" && (
                  <Documents
                    employeeId={employeeId}
                    isAdmin={isAdmin}
                    isOwnProfile={isOwnProfile}
                    onDocumentUpload={() => {
                      // Refresh skills when a new document (especially resume) is uploaded
                      setTimeout(() => {
                        loadSkills();
                      }, 2000);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Performance Statistics */}
            <PerformanceStats employeeId={employeeId} />
          </div>
        </div>
      </div>

      {/* Edit Modal - Only visible for own profile or admins */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <Edit2 size={20} className="text-indigo-600 mr-2" />
            Edit Profile
          </h2>

          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
              <CheckCircle size={16} className="mr-2" />
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Job Title", key: "jobTitle", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone Number", key: "phoneNumber", type: "text" },
              { label: "Salary", key: "salary", type: "number", admin: true },
              {
                label: "Department",
                key: "department",
                type: "text",
                admin: true,
              },
              { label: "Manager", key: "manager", type: "text", admin: true },
              {
                label: "Work Location",
                key: "location",
                type: "text",
                admin: true,
              },
            ]
              .filter((field) => !field.admin || isAdmin) // Only show admin fields to admins
              .map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-gray-600 text-sm mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [key]: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              ))}

            {/* About Me Textarea */}
            <div className="md:col-span-2">
              <label className="block text-gray-600 text-sm mb-1">
                About Me
              </label>
              <textarea
                value={editForm.aboutMe || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, aboutMe: e.target.value })
                }
                rows={3}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Write a short bio..."
              ></textarea>
            </div>

            {/* Address Fields */}
            <div className="md:col-span-2">
              <h3 className="text-md font-medium text-gray-700 mb-2 border-b pb-2">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["street", "city", "state", "zipCode", "country"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block text-gray-600 text-sm mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        value={editForm.address?.[field] || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: {
                              ...(editForm.address || {}),
                              [field]: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Status Dropdown - Admin only */}
            {isAdmin && (
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Status
                </label>
                <select
                  value={editForm.status || "Active"}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Absconded">Absconded</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleEditSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
