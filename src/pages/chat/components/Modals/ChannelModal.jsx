// src/pages/chat/components/Modals/ChannelModal.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Hash,
  Lock,
  Globe,
  Users,
  Settings,
  UserPlus,
  UserMinus,
  Crown,
  Shield,
  MoreHorizontal,
  Search,
  X,
  Save,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Star,
  Bell,
  BellOff,
} from "lucide-react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import Tooltip from "../UI/Tooltip";
import LoadingSpinner from "../UI/LoadingSpinner";
import useChatStore from "../../store/chatStore";
import useChat from "../../hooks/useChat";
import {
  copyToClipboard,
  formatUserName,
  filterBySearch,
} from "../../utils/helper";
import {
  CHANNEL_TYPES,
  CHANNEL_PERMISSIONS,
  CHANNEL_LIMITS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../utils/constants";

const ChannelModal = ({
  isOpen,
  onClose,
  mode = "info", // 'create' | 'edit' | 'info' | 'members'
  channelId = null,
}) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: CHANNEL_TYPES.PUBLIC,
    members: [],
  });
  const [errors, setErrors] = useState({});
  const [selectedMembers, setSelectedMembers] = useState(new Set());

  const {
    channels,
    users,
    currentUser,
    addChannel,
    updateChannel,
    removeChannel,
  } = useChatStore();

  const { selectChat } = useChat();

  // Get channel data
  const channel = channelId ? channels.find((c) => c._id === channelId) : null;
  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit";
  const canEdit =
    channel &&
    (channel.createdBy === currentUser?._id ||
      channel.admins?.includes(currentUser?._id));

  // ======================
  // FORM MANAGEMENT
  // ======================

  useEffect(() => {
    if (channel && !isCreateMode) {
      setFormData({
        name: channel.name || "",
        description: channel.description || "",
        type: channel.type || CHANNEL_TYPES.PUBLIC,
        members: channel.members || [],
      });
    } else if (isCreateMode) {
      setFormData({
        name: "",
        description: "",
        type: CHANNEL_TYPES.PUBLIC,
        members: [currentUser?._id].filter(Boolean),
      });
    }
  }, [channel, isCreateMode, currentUser]);

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
      newErrors.name = "Channel name is required";
    } else if (formData.name.length > CHANNEL_LIMITS.MAX_NAME_LENGTH) {
      newErrors.name = `Channel name must be less than ${CHANNEL_LIMITS.MAX_NAME_LENGTH} characters`;
    } else if (!/^[a-z0-9-_]+$/.test(formData.name)) {
      newErrors.name =
        "Channel name can only contain lowercase letters, numbers, hyphens, and underscores";
    }

    if (
      formData.description &&
      formData.description.length > CHANNEL_LIMITS.MAX_DESCRIPTION_LENGTH
    ) {
      newErrors.description = `Description must be less than ${CHANNEL_LIMITS.MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (formData.members.length === 0) {
      newErrors.members = "At least one member is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isCreateMode) {
        const newChannel = {
          _id: `channel-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          type: formData.type,
          members: formData.members,
          memberCount: formData.members.length,
          createdBy: currentUser?._id,
          createdAt: new Date().toISOString(),
          admins: [currentUser?._id],
        };

        addChannel(newChannel);
        selectChat(newChannel._id, "channel");
        onClose();
      } else {
        updateChannel(channelId, {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          members: formData.members,
          memberCount: formData.members.length,
        });
        setActiveTab("info");
      }
    } catch (error) {
      console.error("Failed to save channel:", error);
      setErrors({ general: ERROR_MESSAGES.SOMETHING_WENT_WRONG });
    } finally {
      setIsLoading(false);
    }
  }, [
    formData,
    validateForm,
    isCreateMode,
    channelId,
    addChannel,
    updateChannel,
    selectChat,
    onClose,
    currentUser,
  ]);

  const handleDelete = useCallback(async () => {
    if (
      !channel ||
      !window.confirm(
        "Are you sure you want to delete this channel? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      removeChannel(channelId);
      onClose();
    } catch (error) {
      console.error("Failed to delete channel:", error);
      setErrors({ general: ERROR_MESSAGES.SOMETHING_WENT_WRONG });
    } finally {
      setIsLoading(false);
    }
  }, [channel, channelId, removeChannel, onClose]);

  // ======================
  // MEMBER MANAGEMENT
  // ======================

  const handleAddMember = useCallback(
    (userId) => {
      if (!formData.members.includes(userId)) {
        handleInputChange("members", [...formData.members, userId]);
      }
    },
    [formData.members, handleInputChange]
  );

  const handleRemoveMember = useCallback(
    (userId) => {
      if (userId !== currentUser?._id) {
        // Can't remove yourself
        handleInputChange(
          "members",
          formData.members.filter((id) => id !== userId)
        );
      }
    },
    [formData.members, handleInputChange, currentUser]
  );

  const handleCopyInviteLink = useCallback(async () => {
    const inviteLink = `${window.location.origin}/invite/${channelId}`;
    try {
      await copyToClipboard(inviteLink);
      // Show success message
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  }, [channelId]);

  // ======================
  // COMPUTED VALUES
  // ======================

  const availableUsers = useMemo(() => {
    return users.filter(
      (user) =>
        !formData.members.includes(user._id) && user._id !== currentUser?._id
    );
  }, [users, formData.members, currentUser]);

  const filteredAvailableUsers = useMemo(() => {
    return filterBySearch(availableUsers, searchQuery, ["name", "email"]);
  }, [availableUsers, searchQuery]);

  const channelMembers = useMemo(() => {
    return formData.members
      .map((memberId) => users.find((user) => user._id === memberId))
      .filter(Boolean);
  }, [formData.members, users]);

  const filteredChannelMembers = useMemo(() => {
    return filterBySearch(channelMembers, searchQuery, ["name", "email"]);
  }, [channelMembers, searchQuery]);

  // ======================
  // RENDER HELPERS
  // ======================

  const renderChannelInfo = () => (
    <div className="space-y-6">
      {/* Channel Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          {channel?.type === CHANNEL_TYPES.PRIVATE ? (
            <Lock className="w-8 h-8 text-white" />
          ) : (
            <Hash className="w-8 h-8 text-white" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            #{channel?.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {channel?.type === CHANNEL_TYPES.PRIVATE ? "Private" : "Public"}{" "}
            channel
          </p>
          <p className="text-sm text-gray-500">
            {channel?.memberCount} members
          </p>
        </div>

        {canEdit && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Settings}
              onClick={() => setActiveTab("edit")}
            >
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Users}
              onClick={() => setActiveTab("members")}
            >
              View Members
            </Button>
          </div>
        )}

        <Button variant="outline" size="sm" icon={Star}>
          Favorite
        </Button>

        <Button variant="outline" size="sm" icon={Bell}>
          Notifications
        </Button>
      </div>

      {/* Channel Description */}
      {channel?.description && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {channel.description}
          </p>
        </div>
      )}

      {/* Channel Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {channel?.memberCount}
          </div>
          <div className="text-sm text-gray-500">Members</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Date(channel?.createdAt).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">Created</div>
        </div>
      </div>

      {/* Danger Zone */}
      {canEdit && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-medium text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h4>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={Copy}
              onClick={handleCopyInviteLink}
            >
              Copy Invite Link
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleDelete}
              loading={isLoading}
            >
              Delete Channel
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderChannelForm = () => (
    <div className="space-y-6">
      {/* Channel Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Hash className="w-4 h-4" />
          Channel Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            handleInputChange(
              "name",
              e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "")
            )
          }
          placeholder="general"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={CHANNEL_LIMITS.MAX_NAME_LENGTH}
        />
        <p className="text-xs text-gray-500">
          Only lowercase letters, numbers, hyphens, and underscores allowed
        </p>
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      {/* Channel Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Channel Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange("type", CHANNEL_TYPES.PUBLIC)}
            className={`p-4 rounded-lg border transition-colors ${
              formData.type === CHANNEL_TYPES.PUBLIC
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Public</div>
                <div className="text-sm text-gray-500">Anyone can join</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange("type", CHANNEL_TYPES.PRIVATE)}
            className={`p-4 rounded-lg border transition-colors ${
              formData.type === CHANNEL_TYPES.PRIVATE
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <div className="font-medium">Private</div>
                <div className="text-sm text-gray-500">Invite only</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="What's this channel about?"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          maxLength={CHANNEL_LIMITS.MAX_DESCRIPTION_LENGTH}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Describe the purpose of this channel</span>
          <span>
            {formData.description?.length || 0}/
            {CHANNEL_LIMITS.MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </p>
        )}
      </div>

      {/* Add Members */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Add Members
        </label>

        {/* Search Users */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Available Users */}
        <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          {filteredAvailableUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size="sm"
                  status={user.status}
                />
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>

              <Button
                size="xs"
                variant="outline"
                icon={UserPlus}
                onClick={() => handleAddMember(user._id)}
              >
                Add
              </Button>
            </div>
          ))}

          {filteredAvailableUsers.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "No users found" : "All users are already members"}
            </div>
          )}
        </div>

        {/* Selected Members */}
        {formData.members.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selected Members ({formData.members.length})
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {channelMembers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="xs"
                      status={user.status}
                    />
                    <span className="text-sm font-medium">{user.name}</span>
                    {user._id === currentUser?._id && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        (You)
                      </span>
                    )}
                  </div>

                  {user._id !== currentUser?._id && (
                    <Button
                      size="xs"
                      variant="ghost"
                      icon={X}
                      onClick={() => handleRemoveMember(user._id)}
                      className="text-red-600 dark:text-red-400"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.members && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.members}
          </p>
        )}
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      {/* Search Members */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Members List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredChannelMembers.map((user) => {
          const isAdmin = channel?.admins?.includes(user._id);
          const isCreator = channel?.createdBy === user._id;

          return (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size="sm"
                  status={user.status}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.name}</span>
                    {isCreator && (
                      <Tooltip content="Channel Creator">
                        <Crown className="w-4 h-4 text-yellow-500" />
                      </Tooltip>
                    )}
                    {isAdmin && !isCreator && (
                      <Tooltip content="Admin">
                        <Shield className="w-4 h-4 text-blue-500" />
                      </Tooltip>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>

              {canEdit && user._id !== currentUser?._id && (
                <div className="flex items-center gap-2">
                  <Tooltip content="More options">
                    <Button size="xs" variant="ghost" icon={MoreHorizontal} />
                  </Tooltip>

                  <Tooltip content="Remove member">
                    <Button
                      size="xs"
                      variant="ghost"
                      icon={UserMinus}
                      onClick={() => handleRemoveMember(user._id)}
                      className="text-red-600 dark:text-red-400"
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Members Button */}
      {canEdit && (
        <Button
          variant="outline"
          icon={UserPlus}
          onClick={() => setActiveTab("edit")}
          fullWidth
        >
          Add More Members
        </Button>
      )}
    </div>
  );

  // ======================
  // TAB CONFIGURATION
  // ======================

  const tabs = useMemo(() => {
    if (isCreateMode) {
      return [{ id: "create", label: "Create Channel", icon: Hash }];
    }

    const baseTabs = [
      { id: "info", label: "Channel Info", icon: Hash },
      { id: "members", label: "Members", icon: Users },
    ];

    if (canEdit) {
      baseTabs.splice(1, 0, {
        id: "edit",
        label: "Edit Channel",
        icon: Settings,
      });
    }

    return baseTabs;
  }, [isCreateMode, canEdit]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
      case "edit":
        return renderChannelForm();
      case "members":
        return renderMembersTab();
      case "info":
      default:
        return renderChannelInfo();
    }
  };

  // ======================
  // RENDER
  // ======================

  const modalTitle = isCreateMode
    ? "Create Channel"
    : channel
    ? `#${channel.name}`
    : "Channel";

  const footerContent =
    isCreateMode || isEditMode ? (
      <div className="flex gap-3">
        <Button
          variant="primary"
          icon={Save}
          onClick={handleSave}
          loading={isLoading}
          disabled={isLoading}
        >
          {isCreateMode ? "Create Channel" : "Save Changes"}
        </Button>
        <Button
          variant="ghost"
          onClick={isCreateMode ? onClose : () => setActiveTab("info")}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="lg"
      footer={footerContent}
    >
      {!isCreateMode && tabs.length > 1 && (
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.general}
          </p>
        </div>
      )}

      {renderTabContent()}
    </Modal>
  );
};

export default ChannelModal;
