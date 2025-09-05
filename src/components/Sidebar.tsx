"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut } from "next-auth/react";
interface SidebarProps {
  className?: string;
}
import { useSession } from "next-auth/react";

export default function Sidebar({ className = "" }: SidebarProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <aside className="w-[300px] overflow-scroll fixed top-0 h-screen left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hamburger Menu */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/30">
          <button className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors">
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Navigation Menu */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {/* Static navigation items for SSR */}
            <div className="group w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 transition-all duration-300">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="font-semibold">Home</span>
            </div>
            <div className="group w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 transition-all duration-300">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span className="font-semibold">Friends</span>
            </div>
            <div className="group w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 transition-all duration-300">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-semibold">Messages</span>
            </div>
            <div className="group w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 transition-all duration-300">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span className="font-semibold">Notifications</span>
            </div>
            <div className="group w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 transition-all duration-300">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              <span className="font-semibold">Bookmarks</span>
            </div>
          </div>
        </nav>
        {/* Footer */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/30">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur-sm"></div>
              <Avatar className="relative h-10 w-10 border-2 border-white dark:border-gray-800">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                  U
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                Your Profile
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View your profile
              </p>
            </div>
          </div>
        </div>
      </aside>
    );
  }
  return (
    <aside
      className={`${
        isCollapsed ? "w-[80px]" : "w-[300px]"
      } overflow-scroll fixed top-0 h-screen left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30 flex flex-col transition-all duration-300 ease-in-out ${className}`}
    >
      {/* Hamburger Menu */}
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/30">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"
              }
            />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {/* Home */}
          <Link
            href="/dashboard"
            className={`group w-full flex items-center ${isCollapsed ? "justify-center px-2" : "gap-4 px-4"} py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isActive("/dashboard")
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200/50 dark:border-gray-600/30"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            {!isCollapsed && <span className="font-semibold">Home</span>}
          </Link>

          {/* Friends */}
          <Link
            href="/dashboard/friends"
            className={`group w-full flex items-center ${isCollapsed ? "justify-center px-2" : "gap-4 px-4"} py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isActive("/dashboard/friends")
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 border border-gray-200/50 dark:border-gray-600/30"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            {!isCollapsed && <span className="font-semibold">Friends</span>}
          </Link>

          {/* Messages */}
          <Link
            href="/dashboard/messages"
            className={`group w-full flex items-center ${isCollapsed ? "justify-center px-2" : "gap-4 px-4"} py-3 rounded-2xl transition-all duration-300 hover:scale-105 relative ${
              isActive("/dashboard/messages")
                ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200/50 dark:border-gray-600/30"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {!isCollapsed && <span className="font-semibold">Messages</span>}
            <div
              className={`${isCollapsed ? "absolute -top-1 -right-1" : "ml-auto"}`}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </div>
          </Link>

          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className={`group w-full flex items-center ${isCollapsed ? "justify-center px-2" : "gap-4 px-4"} py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isActive("/dashboard/notifications")
                ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 border border-gray-200/50 dark:border-gray-600/30"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-semibold">Notifications</span>
            )}
          </Link>

          {/* Bookmarks */}
          <Link
            href="/dashboard/bookmarks"
            className={`group w-full flex items-center ${isCollapsed ? "justify-center px-2" : "gap-4 px-4"} py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isActive("/dashboard/bookmarks")
                ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200/50 dark:border-gray-600/30"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            {!isCollapsed && <span className="font-semibold">Bookmarks</span>}
          </Link>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200/50 dark:border-gray-700/30"></div>

        {/* Recent Activity */}
        {!isCollapsed && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
              Recent Activity
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/initials/svg?seed=John"
                    alt="John"
                  />
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    J
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    John liked your post
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2m ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/initials/svg?seed=Sarah"
                    alt="Sarah"
                  />
                  <AvatarFallback className="bg-green-500 text-white text-xs">
                    S
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    Sarah commented
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    5m ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/initials/svg?seed=Mike"
                    alt="Mike"
                  />
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    M
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    Mike shared a post
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    1h ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/30">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30`}
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur-sm"></div>
            <Avatar className="relative h-10 w-10 border-2 border-white dark:border-gray-800">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                U
              </AvatarFallback>
            </Avatar>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {session?.user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  View your profile
                </p>
              </div>
              <Popover>
                <PopoverTrigger className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-600/30 transition-colors">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </PopoverTrigger>
                <PopoverContent>
                  <button onClick={() => signOut()}>signOout</button>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
