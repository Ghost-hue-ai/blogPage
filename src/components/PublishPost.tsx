"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import CommentTab from "./CommentTab";
import { useSidebar } from "@/contexts/SidebarContext";

interface FormData {
  heading: string;
  description: string;
}
interface UserDocument {
  username: string;
  profilePic: string;
}
export default function PublishPost() {
  const { register, handleSubmit } = useForm<FormData>();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserDocument>();
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [responded, setResponded] = useState(false);

  const [liked, setLiked] = useState(false);
  const [postId, setPostId] = useState();
  const { isCollapsed } = useSidebar();

  async function onSubmit(value: any) {
    const heading = value.heading;
    const description = value.description;
    const date = new Date();

    const formatted = date.toLocaleString("en-US", {
      weekday: "long", // full day name
      year: "numeric",
      month: "long", // full month name
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // 12-hour format with AM/PM
    });
    console.log(heading, description);
    try {
      const res = await axios.post("/api/user/posts", {
        heading,
        description,
      });
      if (res.status >= 200 && res.status <= 300) {
        console.log(res);
        setTitle(heading);
        setDes(description);
        setResponded(true);
        setPostId(res.data.data._id || "yo");

        toast("Post has been created", {
          description: formatted,
        });
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.error || // if server sends an error object
        error.response?.data?.message || // or a message string
        error.message || // fallback
        "Something went wrong";

      toast("Failed to create a post", {
        description: message,
      });
    }
  }

  async function likePost(id: string) {
    try {
      const res = await axios.post(`/api/user/posts/${id}/likes`);
      if (res) {
        console.log(res);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.error || // if server sends an error object
        error.response?.data?.message || // or a message string
        error.message || // fallback
        "Something went wrong";

      toast("Failed to like the post", {
        description: message,
      });
    }
  }

  async function deleteLike(id: string) {
    try {
      const res = await axios.delete(`/api/user/posts/${id}/likes`);
      if (res) {
        console.log(res);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.error || // if server sends an error object
        error.response?.data?.message || // or a message string
        error.message || // fallback
        "Something went wrong";

      toast("Failed to delete like on the post", {
        description: message,
      });
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/user/user-data/${session?.user._id}`);
        if (res.status >= 200 && res.status < 300) {
          console.log(session);
          console.log(res);

          setUser(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [session]);
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session) {
    return <p>You must be logged in to publish a post.</p>;
  }
  return (
    <div
      className={`${isCollapsed ? "ml-[80px]" : "ml-[300px]"} flex flex-col justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-all duration-300 ease-in-out`}
    >
      {/* Modern Post Creation Card */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur-sm"></div>
              {user?.profilePic ? (
                <Avatar className="relative h-12 w-12 border-2 border-white dark:border-gray-800">
                  <AvatarImage
                    src={user?.profilePic}
                    alt="@user"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {session?.user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="relative h-12 w-12 border-2 border-white dark:border-gray-800">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@user"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {session?.user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex-1 text-left px-6 py-4 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/30 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-all duration-200 hover:scale-[1.02]">
                  What's on your mind, {session?.user?.username}?
                </button>
              </DialogTrigger>

              <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl max-w-2xl w-full">
                <DialogHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur-sm"></div>
                      <Avatar className="relative h-12 w-12 border-2 border-white dark:border-gray-800">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@user"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                          {session?.user?.username?.charAt(0).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Create Post
                      </DialogTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Share your thoughts with the community
                      </p>
                    </div>
                  </div>

                  {/* Form wrapper */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mt-6"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="heading"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Title
                      </Label>
                      <Input
                        {...register("heading")}
                        id="heading"
                        name="heading"
                        type="text"
                        required
                        placeholder="What's the title of your post?"
                        className="bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-600/30 rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Content
                      </Label>
                      <textarea
                        {...register("description")}
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Share your thoughts..."
                        className="w-full bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-600/30 rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </DialogTrigger>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                      >
                        Publish Post
                      </button>
                    </div>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Preview Post */}
        {responded && (
          <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
            {/* Media Placeholder */}
            <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 h-80 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 dark:border-gray-600/30">
                  <svg
                    className="w-8 h-8 text-gray-400 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Media content
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 py-5">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur-sm"></div>
                  <Avatar className="relative h-12 w-12 border-2 border-white dark:border-gray-800">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@user"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                      {session?.user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                      {session?.user?.username}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Just now
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Public
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Text */}
              <div className="mb-6">
                <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-3 leading-tight">
                  {title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {des}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-around gap-2 pt-4">
                <button
                  onClick={async () => {
                    if (!postId) return;
                    const nextLiked = !liked;
                    setLiked(nextLiked);
                    if (nextLiked) {
                      await likePost(postId);
                    } else {
                      await deleteLike(postId);
                    }
                  }}
                  className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                    liked
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200/50 dark:border-gray-600/30"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:scale-110"
                  >
                    <path d="M7 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2v11Z" />
                    <path d="M7 10.5l4.7-6.1a1.8 1.8 0 0 1 3.3.9v3.2h3.2a2.3 2.3 0 0 1 2.2 2.9l-1.2 5a3 3 0 0 1-2.9 2.3H7V10.5Z" />
                  </svg>
                  <span className="text-sm font-semibold">
                    {liked ? "Liked" : "Like"}
                  </span>
                </button>

                <button className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 border border-gray-200/50 dark:border-gray-600/30 font-medium transition-all duration-300 hover:scale-105 active:scale-95">
                  <svg
                    className="h-5 w-5 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 8h10M7 12h4m1 8l-5-5H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7a2 2 0 01-2 2h-3l-5 5z"
                    />
                  </svg>
                  <span className="text-sm font-semibold">Comment</span>
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
