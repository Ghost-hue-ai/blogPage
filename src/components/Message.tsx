"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  MessageCircle,
  UserPlus,
  Video,
  Phone,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import LiveMessagingComponent from "./LiveMessagingComponent";

interface FriendUser {
  _id: string;
  username: string;
  profilePic: string;
}

interface Friend {
  _id: string;
  RequestSender: FriendUser;
  RequestReceiver: FriendUser;
  status: string;
}

const Message = () => {
  useEffect(() => {
    fetchFriends();
  }, []);

  const { data: session } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isMessaging, setIsMessaging] = useState(false);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [room, setRoom] = useState("");

  async function fetchFriends() {
    if (friends.length > 0) return;
    try {
      const res = await axios.get(`/api/user/request`);
      if (res) {
        setFriends(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className="relative h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-lg bg-gray-950">
      {/* Header */}
      {isMessaging ? (
        <LiveMessagingComponent
          sender={sender}
          receiver={receiver}
          room={room}
        />
      ) : (
        ""
      )}
      <CardHeader className="border-b py-4 bg-gray-900">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold tracking-tight text-white">
            Chats
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-blue-400 hover:bg-gray-800"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-green-400 hover:bg-gray-800"
            >
              <UserPlus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search messages or people"
            className="pl-10 rounded-full bg-gray-800 text-gray-200 border border-gray-700 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </CardHeader>

      {/* Friend List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-800">
          {friends.map((friend) => {
            const friendData =
              friend.RequestSender._id === session?.user?._id
                ? friend.RequestReceiver
                : friend.RequestSender;

            return (
              <div
                onClick={() => {
                  setIsMessaging((prev) => !prev);
                  const msgReceiver =
                    friend.RequestSender._id === session?.user?._id
                      ? friend.RequestReceiver.username
                      : friend.RequestSender.username;
                  setReceiver(msgReceiver);
                  const msgSender =
                    friend.RequestSender._id === session?.user._id
                      ? friend.RequestSender.username
                      : friend.RequestReceiver.username;
                  console.log(msgReceiver, msgSender);

                  setSender(msgSender);
                  setRoom(friend._id);
                }}
                key={friend._id}
                className="p-3 hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-3 rounded-lg"
              >
                {/* Avatar + status */}
                <div className="relative">
                  <Avatar className="h-12 w-12 border border-gray-700 shadow-sm">
                    <AvatarImage
                      src={
                        friend.RequestReceiver.username ===
                        session?.user?.username
                          ? `${friend.RequestSender.profilePic}`
                          : `${friend.RequestReceiver.profilePic}`
                      }
                    />
                    <AvatarFallback className="text-gray-200">
                      {friendData.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-950 shadow-sm"></div>
                </div>

                {/* Username + last message */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate text-sm sm:text-base text-white">
                      {friendData.username}
                    </h3>
                    <span className="text-xs text-gray-400">12:30 PM</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    Last message preview...
                  </p>
                </div>

                {/* Actions menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-800"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-900 border-gray-800"
                  >
                    <DropdownMenuItem className="flex items-center gap-2 text-blue-400 hover:bg-gray-800">
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-green-400 hover:bg-gray-800">
                      <Video className="h-4 w-4" />
                      <span>Video Call</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-purple-400 hover:bg-gray-800">
                      <Phone className="h-4 w-4" />
                      <span>Voice Call</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default Message;
