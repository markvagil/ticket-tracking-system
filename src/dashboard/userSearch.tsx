import React, { useState, ChangeEvent, useEffect } from "react";
import { userSearch } from "../api/api_service";
import "./UserSearch.css";

interface UserSearchProps {
  onSelectUser: (user: { userId: string; userName: string }) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { userId: string; userName: string }[]
  >([]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      // Call the userSearch API with the current search query
      userSearch(searchQuery).then((response) => {
        setSearchResults(response.users);
      });
    } else {
      // Clear search results if the query is empty
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user: { userId: string; userName: string }) => {
    setSearchQuery(""); // Clear the search query
    onSelectUser(user); // Callback to parent component to handle selected user
  };

  return (
    <div>
      <label htmlFor="user">Assign Users:</label>
      <input
        type="text"
        id="user"
        name="user"
        placeholder="Start typing a username..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      {searchResults.length > 0 && (
        <div>
          <ul>
            {searchResults.map((user) => (
              <li key={user.userId}>
                <button
                  className="userButtons"
                  onClick={() => handleUserSelect(user)}
                >
                  {user.userName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
