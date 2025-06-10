// src/pages/chat/components/Modals/SearchModal.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Filter,
  Calendar,
  User,
  Hash,
  File,
  Image,
  Video,
  Music,
  FileText,
  Clock,
  ArrowRight,
  Download,
  ExternalLink,
} from "lucide-react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import LoadingSpinner from "../UI/LoadingSpinner";
import useChatStore from "../../store/chatStore";
import useChat from "../../hooks/useChat";
import {
  highlightSearchTerms,
  formatRelativeTime,
  formatFileSize,
  getFileIcon,
  isImageFile,
  downloadFile,
} from "../../utils/helper";
import {
  SEARCH_TYPES,
  SEARCH_FILTERS,
  MESSAGE_TYPES,
} from "../../utils/constants";

const SearchModal = ({
  isOpen,
  onClose,
  initialQuery = "",
  initialFilter = "all",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedSender, setSelectedSender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    searchResults,
    searchQuery,
    users,
    channels,
    directMessages,
    setSearchQuery,
    performSearch,
  } = useChatStore();

  const { selectChat } = useChat();

  // ======================
  // SEARCH LOGIC
  // ======================

  const executeSearch = useCallback(
    async (searchTerm, filters = {}) => {
      if (!searchTerm.trim()) {
        setSearchQuery("");
        return;
      }

      setIsLoading(true);

      try {
        // Set the search query in store (this will trigger performSearch)
        setSearchQuery(searchTerm);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchQuery]
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      setQuery(searchTerm);
      executeSearch(searchTerm, {
        type: activeFilter,
        dateRange,
        sender: selectedSender,
      });
    },
    [activeFilter, dateRange, selectedSender, executeSearch]
  );

  // Auto-search when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== searchQuery) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch, searchQuery]);

  // ======================
  // RESULT FILTERING
  // ======================

  const filteredResults = useMemo(() => {
    if (!searchResults) return [];

    let results = [...searchResults];

    // Filter by type
    if (activeFilter !== "all") {
      results = results.filter((result) => {
        switch (activeFilter) {
          case "messages":
            return result.type === "message";
          case "channels":
            return result.type === "channel";
          case "users":
            return result.type === "user";
          case "files":
            return (
              result.type === "message" && result.data.attachments?.length > 0
            );
          case "images":
            return (
              result.type === "message" &&
              result.data.attachments?.some((att) =>
                isImageFile(att.name, att.type)
              )
            );
          default:
            return true;
        }
      });
    }

    // Filter by date range
    if (dateRange.start || dateRange.end) {
      results = results.filter((result) => {
        if (result.type !== "message") return true;

        const messageDate = new Date(result.data.timestamp);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        if (startDate && messageDate < startDate) return false;
        if (endDate && messageDate > endDate) return false;

        return true;
      });
    }

    // Filter by sender
    if (selectedSender) {
      results = results.filter((result) => {
        return (
          result.type !== "message" || result.data.senderId === selectedSender
        );
      });
    }

    return results;
  }, [searchResults, activeFilter, dateRange, selectedSender]);

  // ======================
  // RESULT GROUPING
  // ======================

  const groupedResults = useMemo(() => {
    const groups = {
      messages: [],
      channels: [],
      users: [],
      files: [],
    };

    filteredResults.forEach((result) => {
      switch (result.type) {
        case "message":
          if (result.data.attachments?.length > 0) {
            groups.files.push(result);
          } else {
            groups.messages.push(result);
          }
          break;
        case "channel":
          groups.channels.push(result);
          break;
        case "user":
          groups.users.push(result);
          break;
      }
    });

    return groups;
  }, [filteredResults]);

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleResultClick = useCallback(
    (result) => {
      switch (result.type) {
        case "message":
          // Navigate to the chat and highlight the message
          selectChat(result.data.chatId, result.data.chatType || "channel");
          onClose();
          break;
        case "channel":
          selectChat(result.data._id, "channel");
          onClose();
          break;
        case "user":
          // Find or create direct message with user
          const existingDM = directMessages.find((dm) =>
            dm.participants.includes(result.data._id)
          );
          if (existingDM) {
            selectChat(existingDM._id, "direct");
          }
          onClose();
          break;
      }
    },
    [selectChat, directMessages, onClose]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setSearchQuery("");
    setActiveFilter("all");
    setDateRange({ start: "", end: "" });
    setSelectedSender("");
  }, [setSearchQuery]);

  // ======================
  // RENDER HELPERS
  // ======================

  const renderSearchFilters = () => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      {/* Filter Types */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: "all", label: "All", icon: Search },
          { id: "messages", label: "Messages", icon: Hash },
          { id: "channels", label: "Channels", icon: Hash },
          { id: "users", label: "Users", icon: User },
          { id: "files", label: "Files", icon: File },
          { id: "images", label: "Images", icon: Image },
        ].map((filter) => {
          const IconComponent = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Sender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From User
            </label>
            <select
              value={selectedSender}
              onChange={(e) => setSelectedSender(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              <option value="">All users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSearch}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessageResult = (result) => {
    const message = result.data;
    const sender = users.find((u) => u._id === message.senderId);
    const chatName =
      channels.find((c) => c._id === message.chatId)?.name ||
      directMessages.find((dm) => dm._id === message.chatId)?.name ||
      "Unknown";

    return (
      <div
        key={`message-${message._id}`}
        onClick={() => handleResultClick(result)}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
      >
        <div className="flex items-start gap-3">
          <Avatar src={sender?.avatar} alt={sender?.name} size="sm" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{sender?.name}</span>
              <span className="text-xs text-gray-500">in #{chatName}</span>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(message.timestamp)}
              </span>
            </div>

            <div
              className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: highlightSearchTerms(message.content, query),
              }}
            />

            {message.attachments?.length > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <File className="w-3 h-3" />
                {message.attachments.length} file
                {message.attachments.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  };

  const renderChannelResult = (result) => {
    const channel = result.data;

    return (
      <div
        key={`channel-${channel._id}`}
        onClick={() => handleResultClick(result)}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Hash className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">#{channel.name}</span>
              <span className="text-xs text-gray-500">
                {channel.memberCount} members
              </span>
            </div>

            {channel.description && (
              <div
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1"
                dangerouslySetInnerHTML={{
                  __html: highlightSearchTerms(channel.description, query),
                }}
              />
            )}
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  };

  const renderUserResult = (result) => {
    const user = result.data;

    return (
      <div
        key={`user-${user._id}`}
        onClick={() => handleResultClick(result)}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
      >
        <div className="flex items-center gap-3">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="md"
            status={user.status}
            showStatus={true}
          />

          <div className="flex-1 min-w-0">
            <div
              className="font-medium text-sm mb-1"
              dangerouslySetInnerHTML={{
                __html: highlightSearchTerms(user.name, query),
              }}
            />
            <div className="text-xs text-gray-500">{user.email}</div>
            {user.role && (
              <div className="text-xs text-gray-500">{user.role}</div>
            )}
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  };

  const renderFileResult = (result) => {
    const message = result.data;
    const file = message.attachments[0]; // Show first file
    const sender = users.find((u) => u._id === message.senderId);
    const IconComponent = getFileIcon(file.name, file.type);

    return (
      <div
        key={`file-${message._id}`}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <File className="w-5 h-5 text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="font-medium text-sm mb-1 line-clamp-1"
              dangerouslySetInnerHTML={{
                __html: highlightSearchTerms(file.name, query),
              }}
            />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>Shared by {sender?.name}</span>
              <span>•</span>
              <span>{formatRelativeTime(message.timestamp)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="ghost"
              icon={Download}
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(file.url, file.name);
              }}
            />
            <Button
              size="xs"
              variant="ghost"
              icon={ArrowRight}
              onClick={() => handleResultClick(result)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderResultSection = (title, results, renderFn) => {
    if (results.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 px-4">
          {title} ({results.length})
        </h3>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {results.slice(0, 5).map(renderFn)}
          {results.length > 5 && (
            <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-700">
              +{results.length - 5} more results
            </div>
          )}
        </div>
      </div>
    );
  };

  // ======================
  // RENDER
  // ======================

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search"
      size="lg"
      className="max-h-[80vh]"
    >
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages, channels, users, and files..."
          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
            className={
              showFilters ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : ""
            }
          />

          {query && (
            <Button size="xs" variant="ghost" icon={X} onClick={clearSearch} />
          )}
        </div>
      </div>

      {/* Filters */}
      {renderSearchFilters()}

      {/* Results */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner type="dots" size="lg" text="Searching..." />
          </div>
        ) : query && filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : query ? (
          <div>
            {renderResultSection(
              "Messages",
              groupedResults.messages,
              renderMessageResult
            )}
            {renderResultSection(
              "Channels",
              groupedResults.channels,
              renderChannelResult
            )}
            {renderResultSection(
              "Users",
              groupedResults.users,
              renderUserResult
            )}
            {renderResultSection(
              "Files",
              groupedResults.files,
              renderFileResult
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start searching
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find messages, channels, users, and files across your workspace
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
