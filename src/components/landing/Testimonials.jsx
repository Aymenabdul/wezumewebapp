import { useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ms Nagarani",
    role: "Placement Director",
    rating: 5,
    text:
      "Wezume has added real value to our placement efforts. The platform not only trained students on crafting impactful video resumes but also served as a litmus test for soft skills. Platform also helped students get job leads and offers beyond our existing network. Recruiters appreciated the visibility into key soft skills like clarity, confidence, and authenticity.",
    avatar: "avatar.jpg",
  },
  {
    name: "Keerthana",
    role: "Fresher",
    rating: 5,
    text:
      "Wezume takes job searching to a whole new level. Uploading a video resume let me express my passion and personality way beyond what a normal CV can do. It's smooth, modern, and got me real attention from employers. If you're serious about your career, this app is a must-have!",
    avatar: "avatar.jpg",
  },
  {
    name: "Gowshik",
    role: "Freelancer",
    rating: 5,
    text:
      "I love how Wezume lets me *speak* my resume. Literally! Recording a 60-second video helped me highlight my skills and energy in a way paper never could. The design is intuitive, and I started getting interview calls much quicker. A real confidence booster!",
    avatar: "avatar.jpg",
  },
  {
    name: "Jenifer",
    role: "Employee",
    rating: 4,
    text:
      "Traditional resumes feel outdated — Wezume gets it! Being able to upload a video introduction gave me a massive edge. Recruiters appreciated seeing the real me, not just a list of skills. It's ideal for job seekers who want to make an impression fast.",
    avatar: "avatar.jpg",
  },
  {
    name: "Lavanya",
    role: "Fresher",
    rating: 5,
    text:
      "As a fresher, I always struggled to stand out — until I found Wezume. The video resume feature let me share my story in my own voice, and that made all the difference. It's simple, smart, and gives you the spotlight you deserve.",
    avatar: "avatar.jpg",
  },
];

// duplicate for smooth infinite scroll
const duplicatedTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={`${
          i < rating ? "fill-blue-500 text-blue-500" : "text-gray-300"
        } transition-colors duration-200`}
      />
    ));

  return (
    <div className="relative py-16 bg-white overflow-hidden">
      <div className="relative z-0 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            What Users Say About Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full" />
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real users who transformed their career journey
            with Wezume
          </p>
        </div>

        {/* Carousel (outer wrapper) */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoverIndex(null);
          }}
        >
          {/* Marquee container: overflow-visible so hovered cards can scale outwards */}
          <div
            className="flex gap-6 w-max marquee overflow-visible"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => {
              const isHovered = hoverIndex === index;
              return (
                <div
                  key={index}
                  className={`group relative w-80 md:w-96 bg-white rounded-2xl p-6 shadow-md transition-all duration-300 transform-gpu
                    ${isHovered ? "scale-105 z-50 shadow-2xl" : "z-10"}
                  `}
                  onMouseEnter={() => {
                    setIsPaused(true);
                    setHoverIndex(index);
                  }}
                  onMouseLeave={() => {
                    setIsPaused(false);
                    setHoverIndex(null);
                  }}
                  style={{ willChange: "transform" }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Quote
                      className="text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                      size={32}
                    />
                    <div className="flex gap-1">{renderStars(testimonial.rating)}</div>
                  </div>

                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 line-clamp-6">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className={`w-12 h-12 rounded-full object-cover border-2 transition-colors duration-300 ${
                          isHovered ? "border-blue-300" : "border-blue-100"
                        }`}
                      />
                    </div>
                    <div>
                      <h4
                        className={`font-semibold text-gray-900 transition-colors duration-300 ${
                          isHovered ? "text-blue-600" : ""
                        }`}
                      >
                        {testimonial.name}
                      </h4>
                      <p
                        className={`text-sm text-gray-500 transition-colors duration-300 ${
                          isHovered ? "text-gray-600" : ""
                        }`}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS keyframes & small helpers */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee {
          animation: scroll 40s linear infinite;
        }

        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
