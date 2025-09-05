"use client";

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
    <div className="relative w-full overflow-x-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-0 max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            What We Offer
          </h2>
        </div>

        {/* Horizontal FAQ Container */}
        <div className="flex flex-row gap-6 overflow-x-auto pb-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="relative min-w-[280px] sm:min-w-[320px] bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Header */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex flex-col items-center text-center px-6 py-6 focus:outline-none"
              >
                <span className="text-xl font-bold text-blue-600">
                  {section.title}
                </span>
                <span className="text-sm text-gray-500">
                  {section.subtitle}
                </span>
                <div className="mt-3">
                  {openStates[index] ? (
                    <ChevronUp className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </button>

              {/* Expandable Content (slide out to right of card) */}
              <div
                className={`absolute top-0 left-full h-full w-[280px] sm:w-[320px] 
                  bg-white shadow-2xl rounded-r-2xl border-l border-blue-200 
                  transform transition-transform duration-500 ease-in-out
                  ${openStates[index] ? "translate-x-0" : "translate-x-full"}
                `}
              >
                <div className="px-6 py-6 space-y-4 overflow-y-auto h-full">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-blue-600 pl-4 bg-gradient-to-b from-blue-50 to-blue-25 rounded-lg p-4 hover:from-blue-100 hover:to-blue-50 transition-all duration-300"
                    >
                      <p className="text-lg font-semibold text-blue-600 mb-2">
                        {item.heading}
                      </p>
                      <p className="text-gray-700">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
