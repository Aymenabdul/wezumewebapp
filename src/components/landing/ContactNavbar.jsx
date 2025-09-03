import { useState } from "react";

export default function ContactNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white relative z-50 focus:outline-none"
        >
          {isMenuOpen ? (
            // Close Icon
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              className="w-7 h-7"
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
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-blue-600 bg-opacity-95 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-6 h-full text-white font-medium">
          <a
            onClick={toggleMenu}
            href="#home"
            className="hover:text-blue-200 transition-colors text-xl"
          >
            Home
          </a>
          <a
            onClick={toggleMenu}
            href="#about"
            className="hover:text-blue-200 transition-colors text-xl"
          >
            About Us
          </a>
          <a
            onClick={toggleMenu}
            href="#contact"
            className="hover:text-blue-200 transition-colors text-xl"
          >
            Contact
          </a>
          <a
            onClick={toggleMenu}
            href="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-xl mt-4"
          >
            Login
          </a>
        </div>
      </div>
    </>
  );
}
