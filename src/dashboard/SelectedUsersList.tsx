import React from "react";
import "./SelectedUsersList.css";

interface SelectedUsersListProps {
  selectedUsers: { userId: string; userName: string }[];
  onRemoveUser: (userId: string) => void;
}

const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
  selectedUsers,
  onRemoveUser,
}) => {
  return (
    <div>
      <p>Selected Users:</p>
      <ul>
        {selectedUsers.map((user) => (
          <li key={user.userId}>
            {user.userName}
            <button
              className="removeButtons"
              onClick={() => onRemoveUser(user.userId)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedUsersList;
