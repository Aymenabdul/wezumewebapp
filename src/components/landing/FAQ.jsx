import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    title: "Campus Placement Assist",
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

export default function FAQSections() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Impressive Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        {/* Animated geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large floating circles */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-white/8 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/3 rounded-full animate-pulse delay-2000"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-3/4 left-3/4 w-3 h-3 bg-white/15 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-white/25 rounded-full animate-bounce delay-1200"></div>
          <div className="absolute top-1/6 right-1/4 w-2 h-2 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-14 tracking-tight drop-shadow-lg">
          What We Offer
        </h2>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:scale-[1.02]"
            >
              {/* Header */}
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between w-full px-8 py-6 text-left text-2xl font-bold text-blue-600 focus:outline-none hover:text-blue-700 transition-colors"
              >
                {section.title}
                {openIndex === index ? (
                  <ChevronUp className="w-7 h-7 text-blue-600 transform transition-transform duration-300" />
                ) : (
                  <ChevronDown className="w-7 h-7 text-blue-600 transform transition-transform duration-300" />
                )}
              </button>

              {/* Expandable Content */}
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="px-8 pb-6 space-y-4">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="relative border-l-4 border-blue-600 pl-5 bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg py-4 hover:from-blue-100 hover:to-blue-50 transition-all duration-300 group overflow-hidden"
                      >
                        {/* Subtle hover effect background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10">
                          <p className="text-xl font-semibold text-blue-600 mb-1 group-hover:text-blue-700 transition-colors">
                            {item.heading}
                          </p>
                          <p className="text-lg text-gray-700 leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}