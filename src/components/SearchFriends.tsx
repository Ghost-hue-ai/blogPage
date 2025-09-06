import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Users, UserPlus, Search } from "lucide-react";

export default function SearchFriends() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  async function handleSearch() {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      console.log(searchQuery);

      const res = await axios.get(`/api/user/${searchQuery}`);
      if (res) {
        console.log(res);
        setSearchResults(res.data.data || []);
      }
    } catch (error) {
      console.log("Search error:", error);
      toast.error("Failed to search users");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
      {!showSearchBar ? (
        <div className="text-center">
          <button
            onClick={() => setShowSearchBar(true)}
            className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200"
          >
            <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </button>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Discover New Friends
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Click the search icon to find and connect with new people.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for users by username... (Press Enter to search)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>
            <button
              onClick={() => {
                setShowSearchBar(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="px-4 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>

          {(searchResults.length > 0 || isSearching) && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Search Results
              </h4>
              {isSearching ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Searching for "{searchQuery}"...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((user: any) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                        Add Friend
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No users found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
