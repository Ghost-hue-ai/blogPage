"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const navigate = useRouter();
  return (
    <header className="sticky  top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src="/xing.png"
                alt="logo"
                loading="lazy"
                className="h-10 w-auto transition-transform hover:scale-105"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-2 rounded-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 px-2 py-2 shadow-lg">
              <li>
                <button
                  onClick={() => navigate.push("/dashboard")}
                  className="group relative p-3 rounded-full transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
                    alt="home"
                    className="h-6 w-6 transition-all duration-200 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Home
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate.push("/dashboard/friends")}
                  className="group relative p-3 rounded-full transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/880/880594.png"
                    alt="friends"
                    className="h-6 w-6 transition-all duration-200 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Friends
                  </div>
                </button>
              </li>
              <li>
                <button className="group relative p-3 rounded-full transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/711/711245.png"
                    alt="video"
                    className="h-6 w-6 transition-all duration-200 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Video
                  </div>
                </button>
              </li>
              <li>
                <button className="group relative p-3 rounded-full transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                    alt="market"
                    className="h-6 w-6 transition-all duration-200 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Market
                  </div>
                </button>
              </li>
              <li>
                <button className="group relative p-3 rounded-full transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
                    alt="groups"
                    className="h-6 w-6 transition-all duration-200 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Groups
                  </div>
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors">
            <svg
              className="h-6 w-6"
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

          {/* Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
                <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    CN
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
