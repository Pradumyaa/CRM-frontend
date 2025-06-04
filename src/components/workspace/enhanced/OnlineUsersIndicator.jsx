// components/workspace/enhanced/OnlineUsersIndicator.jsx
import { useState, useEffect } from "react";
import { Users, Circle } from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const OnlineUsersIndicator = ({ spaceId = null }) => {
  const { team, onlineUsers } = useSpacesStore();
  const [spaceMembers, setSpaceMembers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (spaceId) {
      // Filter team members who are part of this space
      // In a real implementation, you'd fetch space members from the API
      setSpaceMembers(team.slice(0, 5)); // Mock data for demo
    } else {
      setSpaceMembers(team);
    }
  }, [spaceId, team]);

  const onlineMembers = spaceMembers.filter((member) =>
    onlineUsers.has(member.id)
  );
  const offlineMembers = spaceMembers.filter(
    (member) => !onlineUsers.has(member.id)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex -space-x-1">
          {spaceMembers.slice(0, 3).map((member, index) => (
            <div
              key={member.id}
              className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden"
              title={member.name}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
              {onlineUsers.has(member.id) && (
                <Circle
                  size={8}
                  className="absolute -bottom-0.5 -right-0.5 text-green-500 fill-current"
                />
              )}
            </div>
          ))}
          {spaceMembers.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              +{spaceMembers.length - 3}
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Circle size={8} className="text-green-500 fill-current mr-1" />
          <span>{onlineMembers.length} online</span>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Users size={16} className="mr-2" />
              Team Members
            </h3>
          </div>

          {onlineMembers.length > 0 && (
            <div>
              <div className="px-4 py-1 text-xs font-medium text-green-600 uppercase">
                Online ({onlineMembers.length})
              </div>
              {onlineMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-50"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <Circle
                      size={10}
                      className="absolute -bottom-0.5 -right-0.5 text-green-500 fill-current border border-white rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.jobTitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {offlineMembers.length > 0 && (
            <div>
              <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase">
                Offline ({offlineMembers.length})
              </div>
              {offlineMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 opacity-60"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.jobTitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineUsersIndicator;
