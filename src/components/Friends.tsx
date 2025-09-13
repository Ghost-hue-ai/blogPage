"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Users, MessageCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FriendUser {
  _id: string;
  username: string;
}

interface Friend {
  _id: string;
  RequestSender: FriendUser;
  RequestReceiver: FriendUser;
  status: string;
}

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { data: session, status } = useSession();

  async function fetchFriends() {
    if (friends.length > 0) return;
    try {
      const res = await axios.get(`/api/user/request`);
      if (res) {
        console.log(res);
        setFriends(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    (async () => await fetchFriends())();
  }, []);
  return (
    <div className="w-full">
      {friends.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => {
            // Determine which user is the friend (not the current user)
            const friendUser = friend.RequestSender;

            return (
              <Card
                key={friend._id}
                className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-700">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold">
                          {friendUser.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {friend.RequestReceiver.username ==
                          session?.user.username
                            ? `${friend.RequestSender.username}`
                            : `${friend.RequestReceiver.username}`}
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Friends
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          Unfriend
                        </DropdownMenuItem>
                        <DropdownMenuItem>Block</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Friends Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start connecting with people to build your network.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Find Friends
          </Button>
        </div>
      )}
    </div>
  );
}
