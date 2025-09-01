"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
interface CreatedObject {
  createdAt: string;
}

interface Owner {
  username: string;
}
interface Post {
  _id: string;
  owner: Owner;
  heading: string;
  description: string;
  createdAt: string;
  likes: object;
  isLikedByCurrentUser: boolean;
  likesCount: number;
}

export default function RenderPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rendered, setRendered] = useState(false);

  const fetchAllPost = async () => {
    console.log("inside the fetchAllPost function");
    try {
      const res = await axios.get("/api/user/posts");
      if (res.status >= 200 && res.status < 300) {
        console.log(res);

        setPosts(() =>
          res.data.data.sort((a: CreatedObject, b: CreatedObject) => {
            const aCreatedAt = new Date(a.createdAt).getTime();
            const bCreatedAt = new Date(b.createdAt).getTime();
            return bCreatedAt - aCreatedAt;
          })
        );
        setRendered(true);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.error || // if server sends an error object
        error.response?.data?.message || // or a message string
        error.message || // fallback
        "Something went wrong";

      toast("Failed to load document.please check you connection", {
        description: message,
      });
    }
  };

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

  //TODO : To use skeleton instead of ...loading you already downloaded skeleton form scad cn just use it and if possible optimize the ui change

  useEffect(() => {
    (async () => await fetchAllPost())();
  }, []);
  return (
    <div className="ml-[300px]  mt-16 flex flex-col justify-center p-4 bg-gray-50 dark:bg-[#1b1b21] min-h-screen">
      <div className="flex flex-col gap-8 w-[600px]">
        {rendered ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Media/Image */}
              <div className="bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 h-[350px] flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-300 text-sm">
                  Image/Video placeholder
                </span>
              </div>

              {/* Post Content */}
              <div className="px-5 py-4">
                {/* User info */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="User Icon"
                    className="h-11 w-11 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {post.owner.username}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(() => {
                        const diffMs =
                          Date.now() - new Date(post.createdAt).getTime();
                        const diffMin = Math.floor(diffMs / (1000 * 60));
                        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffDays = Math.floor(
                          diffMs / (1000 * 60 * 60 * 24)
                        );
                        if (diffHrs < 1) return `${diffMin}m`;
                        if (diffHrs < 24) return `${diffHrs}h`;
                        return `${diffDays}d`;
                      })()}{" "}
                      · 🌍 Public
                    </span>
                  </div>
                </div>

                {/* Post text */}
                {post.description && (
                  <div className="mb-4">
                    <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-1">
                      {post.heading}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex justify-between items-center mb-3 text-gray-600 dark:text-gray-300 text-sm font-medium">
                  <span>👍 ❤️ {post.likesCount}</span>
                  <span>32 comments</span>
                </div>

                {/* Actions */}
                <div className="flex justify-around border-t border-gray-200 dark:border-gray-700 pt-2">
                  {/* Like button */}
                  <button
                    onClick={async () => {
                      if (post.isLikedByCurrentUser) {
                        setPosts((prev) =>
                          prev.map((p) =>
                            p._id === post._id
                              ? {
                                  ...p,
                                  isLikedByCurrentUser: false,
                                  likesCount: p.likesCount - 1,
                                }
                              : p
                          )
                        );
                        await deleteLike(post._id);
                      } else {
                        setPosts((prev) =>
                          prev.map((p) =>
                            p._id === post._id
                              ? {
                                  ...p,
                                  isLikedByCurrentUser: true,
                                  likesCount: p.likesCount + 1,
                                }
                              : p
                          )
                        );
                        await likePost(post._id);
                      }
                    }}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-colors duration-200 ${
                      post.isLikedByCurrentUser
                        ? "text-white bg-blue-500 hover:bg-blue-600"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={post.isLikedByCurrentUser ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2v11Z" />
                      <path d="M7 10.5l4.7-6.1a1.8 1.8 0 0 1 3.3.9v3.2h3.2a2.3 2.3 0 0 1 2.2 2.9l-1.2 5a3 3 0 0 1-2.9 2.3H7V10.5Z" />
                    </svg>
                    <span className="text-sm font-medium">Like</span>
                  </button>

                  {/* Comment button */}
                  <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    Comment
                  </button>

                  {/* Share button */}
                  <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex  items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-600" />
                  <Skeleton className="h-4 w-[200px] bg-gray-600" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]  bg-gray-600" />
                  <Skeleton className="h-4 w-[200px]  bg-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex  items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-600" />
                  <Skeleton className="h-4 w-[200px] bg-gray-600" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]  bg-gray-600" />
                  <Skeleton className="h-4 w-[200px]  bg-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex  items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-600" />
                  <Skeleton className="h-4 w-[200px] bg-gray-600" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]  bg-gray-600" />
                  <Skeleton className="h-4 w-[200px]  bg-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex  items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-600" />
                  <Skeleton className="h-4 w-[200px] bg-gray-600" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]  bg-gray-600" />
                  <Skeleton className="h-4 w-[200px]  bg-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex  items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-600" />
                  <Skeleton className="h-4 w-[200px] bg-gray-600" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl  bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]  bg-gray-600" />
                  <Skeleton className="h-4 w-[200px]  bg-gray-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
