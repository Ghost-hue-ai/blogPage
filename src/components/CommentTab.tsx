"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
type commentSectionProp = {
  postId: string;
};
interface Comment {
  _id: string;
  content: string;
}
interface FormData {
  content: string;
}
export default function CommentTab({ postId }: commentSectionProp) {
  const [rendered, setRendered] = useState(false);
  const [id, setId] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const { register, handleSubmit } = useForm<FormData>();

  async function createComment(data: FormData) {
    try {
      const content = data.content;
      const res = await axios.post(`/api/user/posts/${postId}/comment/`, {
        content: content,
      });
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
        setCommentCount(res.data.data.commentCount);
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
    <div className="overflow-y-auto fixed top-[75px] right-0 w-[450px] h-[700px] border-2 flex flex-col justify-start bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
      {/* Form is always visible */}
      <form onSubmit={handleSubmit(createComment)} className="flex gap-2 mb-4">
        <input
          {...register("content", { required: true })}
          type="text"
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Post
        </button>
      </form>

      {/* Comments or Skeleton */}
      {rendered ? (
        <div className="flex flex-col gap-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-center space-x-4 p-2 border-b border-gray-200 dark:border-gray-700"
              >
                <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                <div className="space-y-1">
                  <p className="text-gray-800 dark:text-gray-200">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {id.map((element) => (
            <div key={element} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-700" />
                <Skeleton className="h-4 w-[200px] bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
