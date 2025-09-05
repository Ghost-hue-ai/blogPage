"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/contexts/SidebarContext";
type commentSectionProp = {
  postId: string;
};
interface commentOwner {
  _id: string;
  username: string;
}
interface Comment {
  _id: string;
  content: string;
  owner: commentOwner;
}
interface FormData {
  content: string;
}
export default function CommentTab({ postId }: commentSectionProp) {
  const { data: session, status } = useSession();
  const [rendered, setRendered] = useState(false);
  const [id, setId] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const { register, handleSubmit } = useForm<FormData>();
  const { isCollapsed } = useSidebar();

  async function createComment(data: FormData) {
    try {
      const content = data.content;
      const res = await axios.post(`/api/user/posts/${postId}/comment/`, {
        content: content,
      });
      if (res.status >= 200 && res.status < 300) {
        console.log(res);
        const newComment: Comment = {
          _id: res.data.data._id as string,
          content: res.data.data.content as string,
          owner: {
            _id: session?.user._id ?? "Unknown",
            username: session?.user.username as string,
          },
        };
        setComments((prev = []) => [...prev, newComment]);
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
  }
  async function fetchComments() {
    try {
      const res = await axios.get(`/api/user/posts/${postId}/comment`);
      if (res) {
        console.log(res);
        setComments(res.data.data);
        setCommentCount(res.data.commentCount);
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
  }
  useEffect(() => {
    (async () => await fetchComments())();
  }, [postId]);
  return (
    <div className={`overflow-y-auto z-10 fixed top-20 ${isCollapsed ? 'right-6' : 'right-6'} w-96 h-[calc(100vh-6rem)] backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-6 pb-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/30 rounded-t-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Comments
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </span>
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit(createComment)} className="space-y-3">
          <div className="relative">
            <input
              {...register("content", { required: true })}
              type="text"
              placeholder="Write a comment..."
              className="w-full px-4 py-3 pr-20 bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Comments Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {rendered ? (
          <div className="space-y-4">
            {Array.isArray(comments) && comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No comments yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              comments?.map((comment, index) => (
                <div
                  key={comment._id}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/20 hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-60 group-hover:opacity-80 transition duration-200 blur-sm"></div>
                    <Avatar className="relative h-10 w-10 border-2 border-white dark:border-gray-800">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.owner.username}`}
                        alt={comment.owner.username}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                        {comment.owner.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {comment.owner.username}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        ✓
                      </span>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200/50 dark:border-gray-600/30">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Like
                      </button>
                      <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Reply
                      </button>
                      <span>Just now</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {id.map((element) => (
              <div
                key={element}
                className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30"
              >
                <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-600 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
