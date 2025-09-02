"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();
  const postId = params.postId; // This comes from /home/[postId]

  return (
    <div>
      Post ID: {postId}
      <br />
      page
    </div>
  );
}
