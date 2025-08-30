import React from "react";

export default function Navbar() {
  return (
    <div className="nav bg-[#3F353D] w-screen sticky top-0 flex items-center justify-between py-[6px]">
      {/* Logo */}
      <img src="/xing.png" alt="logo" loading="lazy" className="h-13" />

      {/* Navigation */}
      <nav className="w-fit">
        <ul className="flex justify-between items-center gap-16 px-8 py-3.5 bg-[#888788] rounded-4xl mr-2">
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
              alt="home"
              className="h-9 w-9 cursor-pointer"
              loading="lazy"
            />
          </li>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/880/880594.png"
              alt="friends"
              className="h-9 w-9 cursor-pointer"
              loading="lazy"
            />
          </li>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/711/711245.png"
              alt="video"
              className="h-9 w-9 cursor-pointer"
              loading="lazy"
            />
          </li>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
              alt="market"
              className="h-9 w-9 cursor-pointer"
              loading="lazy"
            />
          </li>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
              alt="groups"
              className="h-9 w-9 cursor-pointer"
              loading="lazy"
            />
          </li>
        </ul>
      </nav>
      {/* Profile */}
      <div className="profile">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="User Icon"
          className="h-15 w-15 mx-10"
        />
      </div>
    </div>
  );
}
