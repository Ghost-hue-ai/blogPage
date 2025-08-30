import React from "react";
import PublishPost from "@/components/PublishPost";
import RenderPost from "@/components/RenderPost";
import { signOut } from "next-auth/react";

export default function Page() {
  return (
    <div>
      <PublishPost />
      <RenderPost />
    </div>
  );
}
