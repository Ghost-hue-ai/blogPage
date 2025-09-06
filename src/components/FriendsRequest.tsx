"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { Check, X, UserPlus } from "lucide-react";
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

export async function declineRequest(id: string) {
  try {
    const res = await axios.patch(`/api/user/request/${id}`, {
      status: "REJECTED",
    });
    if (res) {
      console.log(res);
    }
  } catch (error: any) {
    console.log(error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed rejecting the request ";
    toast("Failed rejecting the request", {
      description: message,
    });
  }
}

export async function acceptRequest(id: string) {
  try {
    const res = await axios.patch(`/api/user/request/${id}`, {
      status: "ACCEPTED",
    });
    if (res) {
      console.log(res);
    }
  } catch (error: any) {
    console.log(error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed rejecting the request ";
    toast("Failed accepting the request", {
      description: message,
    });
  }
}

export default function FriendRequest() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<FriendRequestDocument[]>([]);
  const { isCollapsed } = useSidebar();

  async function fetchFriendRequests(id: string) {
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
    <div className="w-full">
      <div className="max-w-4xl mx-auto">

        {requests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => {
              console.log(request);

              return (
                <Card
                  key={request._id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-gray-200 dark:border-gray-700">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt={request.RequestSender.username}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg">
                          {request.RequestSender.username
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {request.RequestSender.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Wants to be your friend
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex space-x-2">
                      <Button
                        onClick={async () =>
                          await acceptRequest(request.RequestSender._id)
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={async () =>
                          await declineRequest(request.RequestSender._id)
                        }
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <UserPlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Friend Requests
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You don't have any pending friend requests at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
