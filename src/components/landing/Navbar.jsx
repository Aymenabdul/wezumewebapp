import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 transition-all duration-300 ${
          scrolled 
            ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-lg" 
            : "bg-transparent"
        }`}
      >
        {/* Background decorative elements when scrolled */}
        {scrolled && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating circles */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -left-16 w-40 h-40 bg-white/8 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/3 rounded-full animate-pulse delay-2000"></div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="navbar-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#navbar-grid)" />
              </svg>
            </div>

            {/* Floating particles */}
            <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-white/15 rounded-full animate-bounce delay-700"></div>
            <div className="absolute top-1/4 right-1/5 w-0.5 h-0.5 bg-white/25 rounded-full animate-bounce delay-1200"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/10 rounded-full animate-bounce delay-500"></div>

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-800/30 to-transparent"></div>
          </div>
        )}

        {/* Logo */}
        <a href="#home" className="flex items-center relative z-10">
          <img
            src="whitelogo.png"
            alt="Wezume Logo"
            className={`${scrolled ? "h-10" : "h-15"} w-auto hover:opacity-80 transition-all duration-300`}
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-white items-center font-medium relative z-10">
          <a href="#contact" className="hover:text-blue-200 transition-colors">
            Get a Mandate
          </a>
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
        className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: scrolled 
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(29, 78, 216, 0.95), rgba(30, 64, 175, 0.95))"
            : "rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Background decorative elements for mobile menu */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating circles */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-white/8 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/3 rounded-full animate-pulse delay-2000"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="mobile-menu-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#mobile-menu-grid)" />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-white/15 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/4 right-1/5 w-1 h-1 bg-white/25 rounded-full animate-bounce delay-1200"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/10 rounded-full animate-bounce delay-500"></div>

          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 to-transparent"></div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6 h-full text-white font-medium relative z-10">
          <a
            onClick={toggleMenu}
            href="#contact"
            className="hover:text-blue-200 transition-colors text-xl"
          >
            Get a Mandate
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
