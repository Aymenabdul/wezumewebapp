import { useState } from "react";

export default function ContactNavbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-transparent">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="whitelogo.png"
            alt="Wezume Logo"
            className="h-15 w-auto hover:opacity-80 transition-opacity"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-white items-center font-medium">
          <a
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Login
          </a>
        </div>

        {/* Mobile Login Button */}
        <div className="md:hidden">
          <a
            href="/login"
            className="bg-white text-blue-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
          >
            Login
          </a>
        </div>
      </nav>
    </>
  );
}
