"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Heading } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface FormData {
  heading: string;
  description: string;
}
export default function PublishPost() {
  const { register, handleSubmit } = useForm<FormData>();
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [responded, setResponded] = useState(false);
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(false);
  const [postId, setPostId] = useState();

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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session) {
    return <p>You must be logged in to publish a post.</p>;
  }
  return (
    <div className="ml-[300px] mt-16 flex flex-col justify-center p-4">
      {/* Center the post box relative to sidebar */}
      <div className="w-full m-4 max-w-3xl bg-gray-800 rounded-xl shadow-md border border-gray-900 p-4">
        <div className="flex items-center gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="User Icon"
            className="h-12 w-12 rounded-full border-2 border-gray-600"
          />
          {/* <button onClick={() => signOut()}>signOut</button> */}
          <Dialog>
            <DialogTrigger>
              <input
                placeholder="What's on your mind?"
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300 cursor-pointer"
              />
            </DialogTrigger>

            <DialogContent className="bg-gray-900 text-white rounded-xl shadow-lg p-6 max-w-lg w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold mb-4">
                  Create Post
                </DialogTitle>

                {/* Form wrapper */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid w-full gap-4"
                >
                  <div className="flex flex-col">
                    <Label htmlFor="heading" className="text-gray-300">
                      Heading:
                    </Label>
                    <Input
                      {...register("heading")}
                      id="heading"
                      name="heading"
                      type="text"
                      required
                      placeholder="What is the heading of your thought?"
                      className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="description" className="text-gray-300">
                      Description:
                    </Label>
                    <Input
                      {...register("description")}
                      id="description"
                      name="description"
                      type="text"
                      placeholder="Write about your thought."
                      className="bg-gray-700  text-white border-gray-600 placeholder-gray-400 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-2"
                  >
                    Post
                  </button>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="render mt-[40px] mx-[200px]">
        {responded ? (
          <div className="flex flex-col items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md w-[500px]">
            {/* User Row */}
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="User Icon"
                className="h-12 w-12 rounded-full border-2 border-gray-400"
              />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {session?.user?.username}
              </span>
            </div>

            {/* Title */}
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {title}
            </p>

            {/* Description Box */}
            <div className="bg-[#212021] flex w-full h-[300px] rounded-xl shadow-inner">
              <p className="text-white px-3">{des}</p>
            </div>
            <div>
              {/* Like button */}
              <button
                onClick={async () => {
                  setLiked(!liked);
                  if (!postId) {
                    console.log("no post Id");
                    return;
                  } // prevent undefined
                  const nextLiked = !liked;
                  setLiked(nextLiked);
                  if (nextLiked) {
                    await likePost(postId);
                  }
                  if (!nextLiked) {
                    await deleteLike(postId);
                  }
                }}
                className={`inline-flex items-center border-2 gap-2 ${
                  liked ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {liked ? (
                  // Filled like icon
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Like"
                    fill="currentColor"
                  >
                    <path d="M7 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2v11Z" />
                    <path d="M7 10.5l4.7-6.1a1.8 1.8 0 0 1 3.3.9v3.2h3.2a2.3 2.3 0 0 1 2.2 2.9l-1.2 5A3 3 0 0 1 17.3 21H7v-10.5Z" />
                  </svg>
                ) : (
                  // Outline like icon
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Like"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2v11Z" />
                    <path d="M7 10.5l4.7-6.1a1.8 1.8 0 0 1 3.3.9v3.2h3.2a2.3 2.3 0 0 1 2.2 2.9l-1.2 5a3 3 0 0 1-2.9 2.3H7V10.5Z" />
                  </svg>
                )}
                <span className="text-sm font-medium"></span>
              </button>

              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                <span className="text-sm font-medium">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Comment"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 19.5 5 21l.7-3.7A8 8 0 0 1 4 13a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8 8 8 0 0 1-8 8h-2c-1.2 0-2.4-.2-3.5-.5Z" />
                    <path d="M8 12h8M8 9.5h5.5" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
