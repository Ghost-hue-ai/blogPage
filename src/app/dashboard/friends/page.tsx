"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/contexts/SidebarContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsRequest from "@/components/FriendsRequest";
import { Users, UserPlus, Search } from "lucide-react";
import Friends from "@/components/Friends";
import SearchFriends from "@/components/SearchFriends";

interface RequestSenderDocument {
  username: string;
  _id: string;
}

interface FriendRequestDocument {
  _id: string;
  RequestSender: RequestSenderDocument;
  RequestReceiver: string;
  status: string;
  accepted: string;
}

export default function FriendRequest() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<FriendRequestDocument[]>([]);
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState("requests");

  async function fetchFriendRequests(id: string) {
    if (requests.length > 0) return;
    try {
      const res = await axios.get(`/api/user/request/${id}`);
      setRequests(res.data.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!session?.user._id) return;
    const fetchData = async () => {
      await fetchFriendRequests(session?.user._id ?? "");
    };

    fetchData();
  }, [session?.user._id]);
  return (
    <div
      className="min-h-screen transition-all duration-300 ease-in-out"
      style={{
        marginLeft: isCollapsed ? "80px" : "300px",
        paddingTop: "2rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Friends
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your friends and connections
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger
              value="requests"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === "requests"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === "friends"
                  ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
              Friends
            </TabsTrigger>
            <TabsTrigger
              value="discover"
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === "discover"
                  ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Search className="w-4 h-4" />
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-0">
            <FriendsRequest />
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <Friends />
          </TabsContent>

          <TabsContent value="discover" className="mt-0">
            <SearchFriends />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
