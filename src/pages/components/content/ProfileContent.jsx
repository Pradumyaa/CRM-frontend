import React, { useEffect, useState, useRef } from "react";

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        {children}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImages, setProfileImages] = useState("/api/placeholder/80/80");
  const [uploading, setUploading] = useState(false); // Track upload status
  const fileInputRef = useRef(null);
  const [projects, setProjects] = useState([
    {
      name: "CRM",
      budget: "₹40,000",
      completion: 60,
      members: [1, 2, 3, 4, 5],
    },
    { name: "Project name", budget: "Budget", completion: 10, members: [2, 3] },
    {
      name: "Project name",
      budget: "Budget",
      completion: 100,
      members: [1, 2, 3],
    },
    { name: "Project name", budget: "Budget", completion: 25, members: [1] },
    { name: "Project name", budget: "Budget", completion: 10, members: [1, 2] },
  ]);

  useEffect(() => {
    if (employeeData && employeeData.images && employeeData.images.length > 0) {
      console.log("Setting profile image URL:", employeeData.images[0]); // ✅ Debugging step
      setProfileImages(
        `${employeeData.images[0]}?timestamp=${new Date().getTime()}`
      );
    }
  }, [employeeData]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        if (!employeeId) {
          console.error("Employee ID not found in localStorage");
          return;
        }

        // Fetch employee data from backend
        const response = await fetch(
          `https://crm-backend-6gcl.onrender.com/api/employees/${employeeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const employee = {
          ...data.employee,
          images: data.employee.images || [], // Ensure images is an array
        };

        setEmployeeData(employee);
        setEditForm(employee);

        // ✅ Set Cloudinary Image URL with Cache Buster
        if (employee.images.length > 0) {
          setProfileImages(
            `${employee.images[0]}?timestamp=${new Date().getTime()}`
          );
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, []);

  const handleEditSubmit = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) {
        console.error("Employee ID not found in localStorage");
        return;
      }

      const response = await fetch(
        `https://crm-backend-6gcl.onrender.com/api/employees/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee data");
      }

      const updatedData = await response.json();
      setEmployeeData(updatedData.employee);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("employeeId", localStorage.getItem("employeeId"));

      setUploading(true); // Start uploading

      try {
        const response = await fetch(
          "https://crm-backend-6gcl.onrender.com/api/images/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        const newImageUrl = result.imageUrl; // ✅ Get Cloudinary image URL

        // ✅ Update Profile Image to Latest Upload
        setProfileImages(newImageUrl);

        // ✅ Update Employee Data with New Image URL
        setEmployeeData((prevData) => ({
          ...prevData,
          images: [newImageUrl, ...prevData.images], // Add new image at the start
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false); // Stop uploading
      }
    }
  };

  if (!employeeData) {
    return <div className="p-4">Loading...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Employee Details
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex justify-center items-center">
        <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Panel - Profile */}
            <div className="w-full md:w-1/4 bg-white m-4 rounded-2xl shadow-md p-6">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={profileImages}
                    alt="Profile"
                    className="rounded-full border-2 border-gray-200 w-full h-full object-cover"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:ring-2 ring-transparent hover:ring-[#5932EA] cursor-pointer transition-all duration-300 shadow-neutral-400"
                  >
                    📸
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                  />
                </div>

                {/* Name & Position */}
                <h2 className="mt-4 text-xl font-semibold text-gray-800 text-center">
                  {employeeData.name || "N/A"}
                </h2>
                <p className="text-gray-500 text-sm mb-4 text-center">
                  Joined:{" "}
                  {new Date(employeeData.joiningDate).toLocaleDateString() ||
                    "N/A"}
                </p>
                <span className="mb-2 px-3 py-1 text-blue-700 bg-blue-100 rounded-full text-xs font-medium">
                  {employeeData.jobTitle || "Employee"}
                </span>

                {/* Info Cards */}
                <div className="w-full space-y-3 px-8">
                  <InfoCard
                    label="Employee ID"
                    value={employeeData.id || "N/A"}
                  />
                  <InfoCard
                    label="Position"
                    value={employeeData.position || "N/A"}
                  />
                  <InfoCard
                    label="Manager"
                    value={employeeData.manager || "N/A"}
                  />
                  <InfoCard
                    label="Department"
                    value={employeeData.department || "N/A"}
                  />
                  <InfoCard
                    label="Location"
                    value={employeeData.location || "N/A"}
                  />
                  <InfoCard
                    label="DOJ"
                    value={formatDate(
                      employeeData.dateOfJoining || employeeData.joiningDate
                    )}
                  />
                </div>

                <div className="mt-4 w-full flex justify-center">
                  <button className="w-1/2 px-4 py-2 text-blue-700 font-medium text-sm border-2 border-transparent rounded-md transition-all duration-200 flex justify-center items-center hover:bg-[#bbbbed] hover:text-blue-700 hover:border-blue-700">
                    View Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 p-4">
              {/* Profile Section */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Profile</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#5932EA] text-white rounded-lg shadow-md transition-all duration-200 
                      hover:bg-[#bbbbed] hover:text-[#5932EA] border-2 border-[#5932EA]"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-900">
                  <ProfileField
                    label="About Me"
                    value={employeeData.aboutMe || "Content"}
                  />
                  <ProfileField
                    label="Address"
                    value={
                      employeeData.address
                        ? `${employeeData.address.street || ""}, ${
                            employeeData.address.city || ""
                          }, ${employeeData.address.state || ""} ${
                            employeeData.address.zipCode || ""
                          }, ${employeeData.address.country || ""}`
                        : "N/A"
                    }
                  />
                  <ProfileField
                    label="Email Address"
                    value={employeeData.email || "N/A"}
                  />
                  <ProfileField
                    label="Phone number"
                    value={employeeData.phoneNumber || "N/A"}
                  />
                  <ProfileField
                    label="UAN"
                    value={employeeData.uan || "********"}
                  />
                  <ProfileField
                    label="Aadhaar"
                    value={employeeData.aadhaar || "********"}
                  />
                  <ProfileField
                    label="PAN"
                    value={employeeData.pan || "********"}
                  />
                  <ProfileField label="Status">
                    <div className="bg-green-100 text-green-600 px-4 py-1 rounded-md inline-block">
                      {employeeData.status || "Active"}
                    </div>
                  </ProfileField>
                </div>
              </div>

              {/* Projects Section */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Projects</h2>
                    <div className="flex items-center mt-1">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">
                        30 done this month
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm">
                        <th className="pb-3">PROJECT</th>
                        <th className="pb-3">MEMBERS</th>
                        <th className="pb-3">BUDGET</th>
                        <th className="pb-3">COMPLETION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-3">{project.name}</td>
                          <td className="py-3">
                            <div className="flex">
                              {project.members.map((member, mIndex) => (
                                <div
                                  key={mIndex}
                                  className="w-6 h-6 rounded-full -ml-1 first:ml-0 flex items-center justify-center text-white text-xs"
                                  style={{
                                    backgroundColor: [
                                      "#5932EA",
                                      "#FF4A55",
                                      "#FFAA2C",
                                      "#2ED478",
                                      "#985EFF",
                                    ][mIndex % 5],
                                  }}
                                >
                                  {member}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3">{project.budget}</td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className="w-16 mr-2">
                                {project.completion}%
                              </span>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#5932EA] h-2 rounded-full"
                                  style={{ width: `${project.completion}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Job Title", key: "jobTitle", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone Number", key: "phoneNumber", type: "text" },
                { label: "Salary", key: "salary", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-gray-600">{label}</label>
                  <input
                    type={type}
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [key]: e.target.value })
                    }
                    className="w-full p-2 border-2 border-[#5932EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5932EA]"
                  />
                </div>
              ))}

              {/* Status Dropdown */}
              <div>
                <label className="block text-gray-600">Status</label>
                <select
                  value={editForm.status || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full p-2 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700y"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

// Helper Components
const InfoCard = ({ label, value }) => (
  <div className="bg-gray-100 p-3 rounded-lg">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const ProfileField = ({ label, value, children }) => (
  <div className="bg-gray-100 rounded-lg">
    <p className="font-medium text-gray-800">{label}</p>
    {children || <p className="text-gray-600 p-3">{value}</p>}
  </div>
);

export default ProfilePage;
