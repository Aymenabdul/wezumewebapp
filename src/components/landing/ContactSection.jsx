export default function ContactSection() {
  return (
    <div id="contact" className="relative w-full p-20 overflow-hidden flex items-center justify-center">
      {/* Impressive Background - Same as FAQ */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        {/* Animated geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large floating circles */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-white/8 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/3 rounded-full animate-pulse delay-2000"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="contact-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#contact-grid)" />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-white/15 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/4 right-1/5 w-1 h-1 bg-white/25 rounded-full animate-bounce delay-1200"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          Ready to Get Started?
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Transform your hiring process with our innovative voice-first platform. 
          Let's connect and explore the possibilities together.
        </p>

        {/* Jelly Animation Button */}
        <a 
          href="/contact"
          className="group relative inline-block"
        >
          <button className="
            relative px-12 py-6 
            bg-white text-blue-600 
            text-xl font-bold 
            rounded-2xl 
            shadow-2xl 
            transform transition-all duration-300 ease-out
            hover:scale-110 
            active:scale-95
            focus:outline-none focus:ring-4 focus:ring-white/30
            overflow-hidden
            jelly-button
          ">
            {/* Button background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50 rounded-2xl"></div>
            
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 group-active:animate-ping bg-white/30"></div>
            
            {/* Button text */}
            <span className="relative z-10 group-hover:text-blue-700 transition-colors duration-300">
              Contact Us
            </span>
            
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000"></div>
          </button>
        </a>

        {/* Additional decorative elements */}
        <div className="mt-16 flex justify-center space-x-8">
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Custom CSS for jelly animation */}
      <style jsx>{`
        .jelly-button {
          animation: jelly 2s infinite;
        }
        
        .jelly-button:hover {
          animation: jelly-hover 0.6s ease-out;
        }
        
        @keyframes jelly {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.02, 0.98); }
          50% { transform: scale(0.98, 1.02); }
          75% { transform: scale(1.01, 0.99); }
        }
        
        @keyframes jelly-hover {
          0% { transform: scale(1); }
          30% { transform: scale(1.15, 0.85); }
          40% { transform: scale(0.95, 1.05); }
          50% { transform: scale(1.05, 0.95); }
          65% { transform: scale(0.98, 1.02); }
          75% { transform: scale(1.02, 0.98); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}