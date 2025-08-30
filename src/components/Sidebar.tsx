import React from "react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  return (
    <div
      className={`w-[300px] fixed top-16 left-0 h-[calc(100vh-64px)] bg-[#3F353D] flex flex-col ${className}`}
    >
      {/* Sidebar items */}
      <div className="mt-4 flex flex-col gap-6 px-4">
        <div className="w-full h-12 bg-[#8F8E93] rounded-2xl"></div>
        <div className="w-full h-12 bg-[#8F8E93] rounded-2xl"></div>
        <div className="w-full h-12 bg-[#8F8E93] rounded-2xl"></div>
        <div className="w-full h-12 bg-[#8F8E93] rounded-2xl"></div>
      </div>
    </div>
  );
}
