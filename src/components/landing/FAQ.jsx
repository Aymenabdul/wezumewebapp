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
    <div className="w-full max-w-5xl mx-auto py-16 px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 mb-14 tracking-tight">
        What We Offer
      </h2>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white border border-blue-100 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            {/* Header */}
            <button
              onClick={() => toggleSection(index)}
              className="flex items-center justify-between w-full px-8 py-6 text-left text-2xl font-bold text-blue-700 focus:outline-none"
            >
              {section.title}
              {openIndex === index ? (
                <ChevronUp className="w-7 h-7 text-blue-600" />
              ) : (
                <ChevronDown className="w-7 h-7 text-blue-600" />
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
                      className="border-l-4 border-blue-600 pl-5 bg-blue-50 rounded-lg py-4 hover:bg-blue-100 transition"
                    >
                      <p className="text-xl font-semibold text-blue-800 mb-1">
                        {item.heading}
                      </p>
                      <p className="text-lg text-gray-600">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
