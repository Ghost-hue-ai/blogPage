"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import CommentTab from "./CommentTab";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/contexts/SidebarContext";
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

export async function likePost(id: string) {
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

export async function deleteLike(id: string) {
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
export default function RenderPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rendered, setRendered] = useState(false);
  const [commentTabVisible, setCommentTabVisible] = useState(false);
  const [commentProp, setCommentProp] = useState("");
  const { isCollapsed } = useSidebar();

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

  //TODO : To use skeleton instead of ...loading you already downloaded skeleton form scad cn just use it and if possible optimize the ui change

  useEffect(() => {
    (async () => await fetchAllPost())();
  }, []);
  return (
    <div className={`${isCollapsed ? 'ml-[80px]' : 'ml-[300px]'} relative mt-16 flex flex-col justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-all duration-300 ease-in-out`}>
      {commentTabVisible ? <CommentTab postId={commentProp} /> : ""}
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {rendered ? (
          posts.map((post) => (
            <article
              key={post._id}
              className="group relative flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden"
            >
              {/* Media/Image */}
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
                {/* User info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                    <Avatar className="relative h-12 w-12 border-2 border-white dark:border-gray-800">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        CN
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                        {post.owner.username}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        ✓ Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {(() => {
                          const diffMs =
                            Date.now() - new Date(post.createdAt).getTime();
                          const diffMin = Math.floor(diffMs / (1000 * 60));
                          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                          const diffDays = Math.floor(
                            diffMs / (1000 * 60 * 60 * 24)
                          );
                          if (diffHrs < 1) return `${diffMin}m ago`;
                          if (diffHrs < 24) return `${diffHrs}h ago`;
                          return `${diffDays}d ago`;
                        })()}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        •
                      </span>
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

                {/* Post text */}
                {post.description && (
                  <div className="mb-6">
                    <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-3 leading-tight">
                      {post.heading}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex justify-between items-center mb-4 py-3 px-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">👍</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {post.likesCount}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    View insights
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-around gap-2 pt-4">
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
                    className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                      post.isLikedByCurrentUser
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200/50 dark:border-gray-600/30"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={post.isLikedByCurrentUser ? "currentColor" : "none"}
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
                      {post.isLikedByCurrentUser ? "Liked" : "Like"}
                    </span>
                  </button>
                  {/* Comment button */}
                  <button
                    className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 border border-gray-200/50 dark:border-gray-600/30 font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                    onClick={() => {
                      if (post._id === commentProp) {
                        // same post → toggle visibility
                        setCommentTabVisible((prev) => !prev);
                      } else {
                        // different post → show tab and load new comments
                        setCommentProp(post._id);
                        setCommentTabVisible(true);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transition-transform group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                  {/* Share button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200/50 dark:border-gray-600/30 font-medium transition-all duration-300 hover:scale-105 active:scale-95">
                        <svg
                          className="w-5 h-5 transition-transform group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        <span className="text-sm font-semibold">Share</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                          Anyone who has this link will be able to view this.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Link
                          </Label>
                          <Input
                            id="link"
                            defaultValue={`http://localhost:3000/home/${post._id}`}
                            readOnly
                          />
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </article>
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
