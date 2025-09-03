"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { likePost, deleteLike } from "@/components/RenderPost";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommentTab from "@/components/CommentTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
interface Owner {
  username: string;
}

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const params = useParams();
  const postId = params.postId;
  const [commentTabVisible, setCommentTabVisible] = useState(false);
  const [commentProp, setCommentProp] = useState("");
  const [loading, setLoading] = useState(true);
  async function fetchPost() {
    try {
      setLoading(true);
      const res = await axios.get(`/api/user/posts/${postId}/getPost`);
      if (res.status >= 200 && res.status < 300) {
        // API returns array with single post, get first element
        const postData = Array.isArray(res.data.data)
          ? res.data.data[0]
          : res.data.data;
        setPost(postData);
        toast("Post fetched successfully", {
          description: "Post fetched successfully",
        });
        console.log(res);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast("Failed to fetch post", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchPost();
    })();
  }, [postId]);

  if (loading) {
    return (
      <div className="ml-[300px] relative mt-16 flex flex-col justify-center p-4 bg-gray-50 dark:bg-[#1b1b21] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="ml-[300px] relative mt-16 flex flex-col justify-center p-4 bg-gray-50 dark:bg-[#1b1b21] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ml-[300px] relative mt-16 flex flex-col justify-center p-4 bg-gray-50 dark:bg-[#1b1b21] min-h-screen">
        {commentTabVisible ? <CommentTab postId={commentProp} /> : ""}
        <div className="flex flex-col gap-8 w-[600px]">
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
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

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
                <span></span>
              </div>

              {/* Actions */}
              <div className="flex justify-around border-t border-gray-200 dark:border-gray-700 pt-2">
                {/* Like button */}
                <button
                  onClick={async () => {
                    if (post.isLikedByCurrentUser) {
                      setPost({
                        ...post,
                        isLikedByCurrentUser: false,
                        likesCount: post.likesCount - 1,
                      });
                      await deleteLike(post._id);
                    } else {
                      setPost({
                        ...post,
                        isLikedByCurrentUser: true,
                        likesCount: post.likesCount + 1,
                      });
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
                <button
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
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
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-5-5H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7a2 2 0 01-2 2h-3l-5 5z"
                    />
                  </svg>
                  Comment
                </button>
                {/* Share button */}{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      Share
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
          </div>
        </div>
      </div>
    </div>
  );
}
