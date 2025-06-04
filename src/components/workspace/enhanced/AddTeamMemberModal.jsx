// components/workspace/enhanced/AddTeamMemberModal.jsx
import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Mail,
  Briefcase,
  Building,
  Shield,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Send,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const AddTeamMemberModal = ({ isOpen, onClose, spaceId = null }) => {
  const { addTeamMember, addSpaceMember, team } = useSpacesStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
    title: "",
    department: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: confirmation
  const [generatedPassword, setGeneratedPassword] = useState("");

  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        role: "member",
        title: "",
        department: "",
        password: "",
      });
      setStep(1);
      setError("");
      setGeneratedPassword("");
      setIsSubmitting(false);

      // Generate a random password
      const password = generatePassword();
      setGeneratedPassword(password);
      setFormData((prev) => ({ ...prev, password }));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@#$%^&*";
    const allChars = lowercase + uppercase + numbers + symbols;

    let password = "";
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 0; i < 4; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Check if email already exists
    if (
      team.find(
        (member) => member.email.toLowerCase() === formData.email.toLowerCase()
      )
    ) {
      setError("A team member with this email already exists");
      return false;
    }

    if (!formData.title.trim()) {
      setError("Job title is required");
      return false;
    }

    if (!formData.department.trim()) {
      setError("Department is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Add to team
      const newMember = await addTeamMember({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        title: formData.title.trim(),
        department: formData.department.trim(),
      });

      // If this is for a specific space, add to space as well
      if (spaceId) {
        await addSpaceMember(spaceId, formData.email);
      }

      setStep(2);
    } catch (err) {
      console.error("Error adding team member:", err);
      setError(err.message || "Failed to add team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <UserPlus size={20} className="mr-2 text-indigo-600" />
            {step === 1 ? "Add Team Member" : "Member Added Successfully"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4">
          {step === 1 && (
            <>
              {error && (
                <div className="mb-4 flex items-center p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  <AlertCircle size={16} className="flex-shrink-0 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={16}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g. Software Engineer"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <div className="relative">
                    <Building
                      size={16}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      placeholder="e.g. Engineering"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <Shield
                      size={16}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isSubmitting}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Generated Password:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPassword = generatePassword();
                        setGeneratedPassword(newPassword);
                        setFormData((prev) => ({
                          ...prev,
                          password: newPassword,
                        }));
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                      disabled={isSubmitting}
                    >
                      Regenerate
                    </button>
                  </div>
                  <div className="mt-1 font-mono text-sm bg-white border rounded px-2 py-1">
                    {generatedPassword}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This password will be sent to the user via email
                  </p>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Team Member Added Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                {formData.name} has been added to the team and will receive a
                welcome email with their login credentials.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <div className="flex items-center text-sm text-blue-700">
                  <Send size={16} className="mr-2" />
                  <span>Welcome email sent to {formData.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
          {step === 1 && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none transition-colors relative"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Add Member</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  </>
                ) : (
                  "Add Member"
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;
