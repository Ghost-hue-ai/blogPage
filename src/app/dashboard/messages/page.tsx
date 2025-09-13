"use client";
import React from "react";
import Message from "@/components/Message";
import { useSidebar } from "@/contexts/SidebarContext";

const MessagePage = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-20' : 'ml-64'
      } p-6`}
    >
      <Message />
    </div>
  );
};

export default MessagePage;
