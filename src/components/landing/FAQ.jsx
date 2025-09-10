import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    title: "Campus Placement Assist",
    subtitle: "Empowering Colleges & Corporates",
    items: [
      {
        heading: "For Colleges",
        desc: "Empower your students with voice-first resumes that boost placement success.",
      },
      {
        heading: "For Corporates",
        desc: "Hire smarter with voice-powered student profiles.",
      },
      {
        heading: "Hire Smarter, Faster",
        desc: "One platform. Real talent. Smarter campus hiring.",
      },
    ],
  },
  {
    title: "Corporates Hire Assist",
    subtitle: "Smarter Hiring with AI",
    items: [
      {
        heading: "Automate Initial Screening",
        desc: "Smart filtering for faster, easier hiring decisions.",
      },
      {
        heading: "Data-Driven Decisions",
        desc: "Use video, skills, and pitch data to hire with confidence.",
      },
      {
        heading: "AI-Driven Insights",
        desc: "Evaluate candidates beyond skills using AI-enabled personality analysis.",
      },
    ],
  },
  {
    title: "Platform User Analytics",
    subtitle: "Actionable Talent Insights",
    items: [
      {
        heading: "Track Engagement in Real Time",
        desc: "Gain insight into user skills—from voice pitches to profile shares.",
      },
      {
        heading: "Identify Top Talent & Trends",
        desc: "Spot top talent and trends with real-time user insights.",
      },
      {
        heading: "Make Smarter Decisions",
        desc: "Optimize your platform with data-driven AI insights.",  
      },
    ],
  },
];

// Animated Doodle Component
const AnimatedDoodles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating circles */}
    <div className="absolute top-10 left-10 w-4 h-4 bg-white/10 rounded-full animate-bounce" 
         style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
    <div className="absolute top-20 right-20 w-6 h-6 bg-blue-300/20 rounded-full animate-pulse" 
         style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
    <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/15 rounded-full animate-ping" 
         style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
    <div className="absolute bottom-32 right-16 w-5 h-5 bg-blue-200/25 rounded-full animate-bounce" 
         style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>

    {/* Floating lines */}
    <svg className="absolute top-16 left-1/4 w-24 h-24 text-white/10 animate-spin" 
         style={{ animationDuration: '20s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 12l16 0M12 4l0 16" />
    </svg>
    
    <svg className="absolute bottom-24 right-1/4 w-16 h-16 text-blue-300/15 animate-pulse" 
         style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
            d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>

    {/* Doodle shapes */}
    <div className="absolute top-1/3 left-12 w-8 h-8 border-2 border-white/10 rounded-full animate-spin" 
         style={{ animationDuration: '15s' }}></div>
    <div className="absolute bottom-1/3 right-12 w-6 h-6 border-2 border-blue-200/20 rotate-45 animate-pulse" 
         style={{ animationDuration: '7s' }}></div>
    
    {/* More decorative elements */}
    <div className="absolute top-40 right-40 w-2 h-12 bg-white/5 rounded-full transform rotate-45 animate-pulse" 
         style={{ animationDelay: '1.5s', animationDuration: '8s' }}></div>
    <div className="absolute bottom-40 left-40 w-12 h-2 bg-blue-300/10 rounded-full animate-ping" 
         style={{ animationDelay: '3s', animationDuration: '6s' }}></div>
  </div>
);

export default function HorizontalFAQ() {
  const [openStates, setOpenStates] = useState(
    Array(sections.length).fill(false)
  );

  const toggleSection = (index) => {
    setOpenStates((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <div className="relative w-full mt-20 overflow-visible"> {/* Changed to overflow-visible */}
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
        {/* Animated doodles */}
        <AnimatedDoodles />
      </div>

      {/* Content */}
      <div className="relative z-0 max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            What We Offer
          </h2>
        </div>

        {/* Grid Container for 3 boxes in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex flex-col relative ${
                openStates[index] ? 'z-50' : 'z-10'
              }`} // Dynamic z-index for expanded sections
            >
              {/* Header Box */}
              <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Subtle inner doodles */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-100/50 rounded-full animate-pulse"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-200/30 rounded-full animate-ping" 
                     style={{ animationDelay: '2s' }}></div>
                
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex flex-col items-center text-center px-6 py-6 focus:outline-none relative z-10"
                >
                  <span className="text-xl font-bold text-blue-600">
                    {section.title}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {section.subtitle}
                  </span>
                  <div className="mt-3">
                    {openStates[index] ? (
                      <ChevronUp className="w-6 h-6 text-blue-600 transform transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-blue-600 transform transition-transform duration-300" />
                    )}
                  </div>
                </button>
              </div>

              {/* Expandable Content Below - Fixed with grid-based animation */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  openStates[index] 
                    ? "grid-rows-[1fr] opacity-100 mt-4" 
                    : "grid-rows-[0fr] opacity-0"
                } grid`} // Grid-based animation prevents cutting
              >
                <div className="overflow-hidden"> {/* This wrapper prevents content cutting */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative">
                    {/* Content card doodles */}
                    <div className="absolute top-1 right-4 w-2 h-2 bg-blue-100 rounded-full animate-bounce" 
                         style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                    
                    <div className="space-y-4 relative z-10">
                      {section.items.map((item, i) => (
                        <div
                          key={i}
                          className="border-l-4 border-blue-600 pl-4 bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg p-4 hover:from-blue-100 hover:to-blue-50 transition-all duration-300 relative overflow-hidden group"
                        >
                          {/* Item doodles */}
                          <div className="absolute top-1 right-2 w-1 h-1 bg-blue-300 rounded-full animate-pulse" 
                               style={{ animationDelay: `${i * 0.5}s` }}></div>
                          
                          {/* Subtle hover effect background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="relative z-10">
                            <p className="text-lg font-semibold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors">
                              {item.heading}
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
