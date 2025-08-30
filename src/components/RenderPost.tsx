"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

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
  const [isLiked, setIsLiked] = useState(false);

  const fetchAllPost = async () => {
    console.log("inside the fetchAllPost function");
    try {
      const res = await axios.get("/api/user/posts");
      if (res.status >= 200 && res.status < 300) {
        console.log(res);
        setRendered(true);

        setPosts(() =>
          res.data.data.sort((a: CreatedObject, b: CreatedObject) => {
            const aCreatedAt = new Date(a.createdAt).getTime();
            const bCreatedAt = new Date(b.createdAt).getTime();
            return bCreatedAt - aCreatedAt;
          })
        );
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

  useEffect(() => {
    (async () => await fetchAllPost())();
  }, []);
  return (
    <div className="ml-[300px] mt-16 flex flex-col justify-center p-4">
      <div className="flex flex-col gap-6 w-[600px]">
        {" "}
        {/* slightly wider like FB */}
        {rendered ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-md"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="User Icon"
                  className="h-10 w-10 rounded-full border border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {post?.owner.username}
                  </p>
                  <span className="text-xs text-gray-500">
                    {(() => {
                      const diffMs =
                        Date.now() - new Date(post.createdAt).getTime();
                      const diffMin = Math.floor(diffMs / (1000 * 60));
                      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffDays = Math.floor(
                        diffMs / (1000 * 60 * 60 * 24)
                      );

                      if (diffHrs < 1) {
                        return `${diffMin}m`;
                      } else if (diffHrs < 24) {
                        return `${diffHrs}h`;
                      } else {
                        return `${diffDays}d`;
                      }
                    })()}{" "}
                    · 🌍 Public
                  </span>
                </div>
              </div>

              {/* Body */}
              {post.description && (
                <div className="px-4 pb-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
                  <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-1">
                    {post.heading}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {post.description}
                  </p>
                </div>
              )}

              {/* Media/Image Placeholder */}
              <div className="bg-gray-100 dark:bg-gray-800 h-[350px] flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  Image/Video will appear here
                </span>
              </div>

              {/* Stats (likes & comments count) */}
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500">
                <span>👍 ❤️ {post.likesCount}</span>
                <span>32 comments</span>
              </div>

              {/* Actions */}
              <div className="flex justify-around px-2 py-1">
                {/* Like button */}
                <button
                  onClick={async () => {
                    const nextLiked = !isLiked;
                    setIsLiked(nextLiked);
                    if (nextLiked) {
                      await likePost(post._id);
                    } else {
                      await deleteLike(post._id);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                    post.isLikedByCurrentUser
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "currentColor" : "none"}
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
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-md transition">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 19.5 5 21l.7-3.7A8 8 0 0 1 4 13a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8 8 8 0 0 1-8 8h-2c-1.2 0-2.4-.2-3.5-.5Z" />
                    <path d="M8 12h8M8 9.5h5.5" />
                  </svg>
                  <span className="text-sm font-medium">Comment</span>
                </button>

                {/* Share button */}
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-md transition">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v-2a2 2 0 0 1 2-2h4" />
                    <path d="M16 12V9a2 2 0 0 0-2-2h-2" />
                    <path d="M16 12v3a2 2 0 0 1-2 2h-2" />
                    <path d="M4 12v2a2 2 0 0 0 2 2h4" />
                  </svg>
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">...loading</p>
        )}
      </div>
    </div>
  );
}
