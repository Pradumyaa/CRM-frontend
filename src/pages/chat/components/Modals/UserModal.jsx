// src/pages/chat/components/Modals/UserModal.jsx
import React, { useState, useCallback, useEffect } from "react";
import {
  User,
  Settings,
  Edit,
  Save,
  X,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Bell,
  Lock,
  Palette,
  Volume2,
  Shield,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import Tooltip from "../UI/Tooltip";
import LoadingSpinner from "../UI/LoadingSpinner";
import { ThemeToggle } from "../UI/ThemeProvider";
import useChatStore from "../../store/chatStore";
import { isValidEmail, formatUserName } from "../../utils/helper";
import {
  USER_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../utils/constants";

const UserModal = ({
  isOpen,
  onClose,
  mode = "profile", // 'profile' | 'settings'
  userId = null, // If viewing another user's profile
}) => {
  const [activeTab, setActiveTab] = useState(
    mode === "settings" ? "general" : "profile"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { currentUser, users, settings, updateCurrentUser, updateSettings } =
    useChatStore();

  // Determine which user we're viewing
  const targetUser = userId ? users.find((u) => u._id === userId) : currentUser;
  const isOwnProfile = !userId || userId === currentUser?._id;

  // ======================
  // FORM MANAGEMENT
  // ======================

  useEffect(() => {
    if (targetUser) {
      setFormData({
        name: targetUser.name || "",
        email: targetUser.email || "",
        phone: targetUser.phone || "",
        location: targetUser.location || "",
        bio: targetUser.bio || "",
        role: targetUser.role || "",
        department: targetUser.department || "",
        website: targetUser.website || "",
        status: targetUser.status || "online",
      });
    }
  }, [targetUser]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isOwnProfile) {
        await updateCurrentUser(formData);
      }

      setIsEditing(false);
      // Show success message (you might want to add a toast system)
      console.log(SUCCESS_MESSAGES.SETTINGS_SAVED);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setErrors({ general: ERROR_MESSAGES.SOMETHING_WENT_WRONG });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, isOwnProfile, updateCurrentUser]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFormData({
      name: targetUser.name || "",
      email: targetUser.email || "",
      phone: targetUser.phone || "",
      location: targetUser.location || "",
      bio: targetUser.bio || "",
      role: targetUser.role || "",
      department: targetUser.department || "",
      website: targetUser.website || "",
      status: targetUser.status || "online",
    });
    setErrors({});
  }, [targetUser]);

  // ======================
  // SETTINGS HANDLERS
  // ======================

  const handleSettingChange = useCallback(
    (section, key, value) => {
      updateSettings(section, { [key]: value });
    },
    [updateSettings]
  );

  // ======================
  // RENDER HELPERS
  // ======================

  const renderFormField = (
    field,
    label,
    type = "text",
    icon = null,
    placeholder = "",
    multiline = false
  ) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {icon && React.createElement(icon, { className: "w-4 h-4" })}
        {label}
      </label>
      {multiline ? (
        <textarea
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          disabled={!isEditing || !isOwnProfile}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          disabled={!isEditing || !isOwnProfile}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      {errors[field] && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {errors[field]}
        </p>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar
            src={targetUser?.avatar}
            alt={targetUser?.name}
            size="2xl"
            status={targetUser?.status}
            showStatus={true}
          />
          {isEditing && isOwnProfile && (
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatUserName(targetUser)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{targetUser?.role}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {targetUser?.department}
          </p>

          {isOwnProfile && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              icon={Edit}
              onClick={() => setIsEditing(true)}
              className="mt-3"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Status Selection */}
      {isEditing && isOwnProfile && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(USER_STATUS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleInputChange("status", value)}
                className={`p-3 rounded-lg border transition-colors ${
                  formData.status === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      value === "online"
                        ? "bg-green-500"
                        : value === "away"
                        ? "bg-yellow-500"
                        : value === "busy"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="capitalize">{value}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFormField(
          "name",
          "Full Name",
          "text",
          User,
          "Enter your full name"
        )}
        {renderFormField("email", "Email", "email", Mail, "Enter your email")}
        {renderFormField(
          "phone",
          "Phone",
          "tel",
          Phone,
          "Enter your phone number"
        )}
        {renderFormField(
          "location",
          "Location",
          "text",
          MapPin,
          "Enter your location"
        )}
        {renderFormField("role", "Role", "text", Briefcase, "Enter your role")}
        {renderFormField(
          "department",
          "Department",
          "text",
          Briefcase,
          "Enter your department"
        )}
        {renderFormField(
          "website",
          "Website",
          "url",
          Globe,
          "Enter your website"
        )}
      </div>

      {renderFormField(
        "bio",
        "Bio",
        "text",
        User,
        "Tell us about yourself...",
        true
      )}

      {/* Action Buttons */}
      {isEditing && isOwnProfile && (
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSave}
            loading={isLoading}
            disabled={isLoading}
          >
            Save Changes
          </Button>
          <Button
            variant="ghost"
            icon={X}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h4>

        <div className="space-y-3 pl-7">
          {[
            { key: "desktop", label: "Desktop notifications" },
            { key: "sound", label: "Sound notifications" },
            { key: "mentions", label: "Mention notifications" },
            { key: "directMessages", label: "Direct message notifications" },
            { key: "channels", label: "Channel notifications" },
            { key: "calls", label: "Call notifications" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {label}
              </span>
              <input
                type="checkbox"
                checked={settings.notifications?.[key] || false}
                onChange={(e) =>
                  handleSettingChange("notifications", key, e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Appearance
        </h4>

        <div className="space-y-3 pl-7">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Theme
            </span>
            <ThemeToggle showLabel={true} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Font size
            </span>
            <select
              value={settings.appearance?.fontSize || "medium"}
              onChange={(e) =>
                handleSettingChange("appearance", "fontSize", e.target.value)
              }
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Compact mode
            </span>
            <input
              type="checkbox"
              checked={settings.appearance?.compact || false}
              onChange={(e) =>
                handleSettingChange("appearance", "compact", e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy
        </h4>

        <div className="space-y-3 pl-7">
          {[
            { key: "readReceipts", label: "Read receipts" },
            { key: "lastSeen", label: "Last seen" },
            {
              key: "messagePreview",
              label: "Message preview in notifications",
            },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {label}
              </span>
              <input
                type="checkbox"
                checked={settings.privacy?.[key] || false}
                onChange={(e) =>
                  handleSettingChange("privacy", key, e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Profile visibility
            </span>
            <select
              value={settings.privacy?.profileVisibility || "everyone"}
              onChange={(e) =>
                handleSettingChange(
                  "privacy",
                  "profileVisibility",
                  e.target.value
                )
              }
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">Contacts only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // ======================
  // TAB MANAGEMENT
  // ======================

  const tabs = isOwnProfile
    ? [
        { id: "profile", label: "Profile", icon: User },
        { id: "general", label: "General", icon: Settings },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy", icon: Lock },
      ]
    : [{ id: "profile", label: "Profile", icon: User }];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "general":
      case "notifications":
      case "privacy":
        return renderSettingsTab();
      default:
        return renderProfileTab();
    }
  };

  // ======================
  // RENDER
  // ======================

  if (!targetUser) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner
            type="spinner"
            size="lg"
            text="Loading user profile..."
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isOwnProfile ? "Profile & Settings" : `${targetUser.name}'s Profile`
      }
      size="lg"
      className="max-w-4xl"
    >
      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-48 border-r border-gray-200 dark:border-gray-700 pr-6">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          {renderTabContent()}
        </div>
      </div>
    </Modal>
  );
};

export default UserModal;
