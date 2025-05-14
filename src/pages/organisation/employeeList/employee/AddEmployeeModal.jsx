import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  User,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Upload,
  AlertCircle,
  Check,
} from "lucide-react";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  employeeData = {},
  setEmployeeData,
  onSave,
  isEditing,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmployeeData((prevData) => {
        const safeData = prevData || {};
        return {
          ...safeData,
          status: safeData.status || "Active",
          address: safeData.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        };
      });

      setErrors({});
      setResumeFile(null);
      setUploadedFileName(
        employeeData?.resume ? "Resume already uploaded" : ""
      );
    }
  }, [isOpen, setEmployeeData, employeeData?.resume]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...(prevData || {}),
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...(prevData || {}),
      address: {
        ...(prevData?.address || {}),
        [name]: value,
      },
    }));

    // Clear error when field is edited
    if (errors[`address.${name}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`address.${name}`];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setUploadedFileName(file.name);

      // In a real app, you'd upload the file to a server/cloud storage
      // For this example, we'll store in localStorage
      setIsFileUploading(true);

      // Read the file as data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result; // This contains the file's binary data

        // Store the file data temporarily in component state
        setEmployeeData((prevData) => ({
          ...(prevData || {}),
          resumeFile: {
            name: file.name,
            type: file.type,
            data: fileData,
          },
        }));

        setIsFileUploading(false);
      };

      reader.readAsArrayBuffer(file); // Read as binary data
    }
  };

  // Generate a systematic employee ID
  const generateEmployeeId = () => {
    const timestamp = new Date().getTime().toString().slice(-4);
    const department =
      employeeData.jobTitle?.split(" ")[0]?.toUpperCase()?.slice(0, 3) || "EMP";
    return `${department}${timestamp}`;
  };

  // Generate a random password
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@#$%^&*";

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = "";

    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Add 4 more random characters
    for (let i = 0; i < 4; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const validateEmployeeData = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      { key: "name", label: "Full Name" },
      { key: "jobTitle", label: "Job Title" },
      { key: "salary", label: "Salary" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
    ];

    requiredFields.forEach((field) => {
      if (
        !employeeData[field.key] ||
        String(employeeData[field.key]).trim() === ""
      ) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    // Address required fields
    const addressFields = [
      { key: "street", label: "Street" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "zipCode", label: "Zip Code" },
      { key: "country", label: "Country" },
    ];

    addressFields.forEach((field) => {
      if (
        !employeeData.address ||
        !employeeData.address[field.key] ||
        String(employeeData.address[field.key]).trim() === ""
      ) {
        newErrors[`address.${field.key}`] = `${field.label} is required`;
      }
    });

    // Email validation
    if (
      employeeData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation - simple validation for demo
    if (
      employeeData.phoneNumber &&
      !/^\+?[\d\s-]{10,}$/.test(employeeData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Salary validation
    if (
      employeeData.salary &&
      (isNaN(Number(employeeData.salary)) || Number(employeeData.salary) <= 0)
    ) {
      newErrors.salary = "Salary must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatEmployeeData = (data) => {
    // Generate credentials for new employees
    const credentials = !isEditing
      ? {
          employeeId: generateEmployeeId(),
          password: generatePassword(),
        }
      : {};

    return {
      ...data,
      ...credentials,
      salary: Number(data.salary),
      status: data.status || "Active",
      joiningDate: data.joiningDate || new Date().toISOString().split("T")[0],
    };
  };

  const handleSave = async () => {
    if (!validateEmployeeData()) {
      return; // Stop if validation fails
    }

    try {
      setIsSubmitting(true);

      // Format employee data
      const formattedData = formatEmployeeData(employeeData);

      // Determine API endpoint and method
      const apiEndpoint = isEditing
        ? `http://localhost:3000/api/employees/${employeeData.employeeId}`
        : "http://localhost:3000/api/employees";
      const apiMethod = isEditing ? axios.put : axios.post;

      // Make the API request
      const response = await apiMethod(apiEndpoint, formattedData);

      // Handle success
      if ([200, 201].includes(response.status)) {
        // If we have resume file data and an employee ID, store in localStorage
        if (employeeData.resumeFile && formattedData.employeeId) {
          try {
            // Convert the ArrayBuffer to a Blob
            const blob = new Blob([employeeData.resumeFile.data], {
              type: employeeData.resumeFile.type,
            });

            // Store file metadata in localStorage
            localStorage.setItem(
              `resume_${formattedData.employeeId}`,
              JSON.stringify({
                name: employeeData.resumeFile.name,
                type: employeeData.resumeFile.type,
                size: blob.size,
              })
            );

            // Store the actual file in localStorage as blob URL
            const blobUrl = URL.createObjectURL(blob);
            localStorage.setItem(
              `resume_file_${formattedData.employeeId}`,
              blobUrl
            );

            console.log(
              `Resume file stored for employee ${formattedData.employeeId}`
            );
          } catch (err) {
            console.error("Error storing resume in localStorage:", err);
          }
        }

        onSave();
        onClose();
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Error saving employee."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div
        className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-medium">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div
          className="p-6 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "calc(90vh - 130px)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <User className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Basic Information
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={employeeData.name || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="Software Engineer"
                      value={employeeData.jobTitle || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.jobTitle
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.jobTitle && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />{" "}
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="salary"
                        placeholder="50000"
                        value={employeeData.salary || ""}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                          errors.salary
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {errors.salary && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.salary}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        value={employeeData.email || ""}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                          errors.email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="+1 123-456-7890"
                        value={employeeData.phoneNumber || ""}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                          errors.phoneNumber
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />{" "}
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="department"
                        placeholder="Engineering"
                        value={employeeData.department || ""}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Address Information
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      placeholder="123 Main St"
                      value={employeeData.address?.street || ""}
                      onChange={handleAddressChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors["address.street"]
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors["address.street"] && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />{" "}
                        {errors["address.street"]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="New York"
                        value={employeeData.address?.city || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.city"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.city"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.city"]}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="NY"
                        value={employeeData.address?.state || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.state"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.state"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.state"]}
                        </p>
                      )}
                    </div>

                    {/* Zip Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="10001"
                        value={employeeData.address?.zipCode || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.zipCode"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.zipCode"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.zipCode"]}
                        </p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="country"
                        placeholder="USA"
                        value={employeeData.address?.country || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.country"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.country"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.country"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Employment Details */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <Briefcase className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Employment Details
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={employeeData.status || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg appearance-none border ${
                        errors.status
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.status}
                      </p>
                    )}
                  </div>

                  {/* Work Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Location
                    </label>
                    <select
                      name="location"
                      value={employeeData.location || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg appearance-none border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Location</option>
                      <option value="In-Office">In-Office</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  {/* Manager */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager
                    </label>
                    <input
                      type="text"
                      name="manager"
                      placeholder="Jane Smith"
                      value={employeeData.manager || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="joiningDate"
                        value={
                          employeeData.joiningDate
                            ? new Date(employeeData.joiningDate)
                                .toISOString()
                                .split("T")[0]
                            : new Date().toISOString().split("T")[0]
                        }
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <User className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Additional Info
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume URL
                    </label>
                    <div className="flex items-center">
                      <label className="flex-1 cursor-pointer">
                        <div
                          className={`relative flex items-center justify-center border border-dashed ${
                            resumeFile
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300 bg-gray-50"
                          } rounded-lg p-2 hover:bg-gray-100 transition-colors`}
                        >
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                          <div className="text-center py-2">
                            {isFileUploading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-indigo-500"></div>
                                <span className="text-sm text-gray-500">
                                  Uploading...
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <Upload className="h-5 w-5 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">
                                  Click to upload resume
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee ID if editing */}
              {isEditing && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                    <User className="h-4 w-4 text-indigo-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">
                      Employee ID
                    </h3>
                  </div>
                  <div className="p-4">
                    <input
                      type="text"
                      disabled
                      value={employeeData.employeeId || ""}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Employee ID cannot be changed
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
              )}
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Employee"}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default AddEmployeeModal;
