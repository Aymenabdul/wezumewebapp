import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollCarousel() {
  const targetRef = useRef(null);
  // Track scroll progress inside this section
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  // Map scroll progress (0 → 1) to x movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const images = Array.from({ length: 8 }, (_, i) => `${i + 1}.jpeg`);

  return (
    <section
      ref={targetRef}
      className="relative h-[200vh] bg-gray-100"
    >
      {/* Responsive Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="carouselbg.jpeg"
          alt="Carousel Background"
          className="w-full h-full object-cover"
        />
        {/* Black Tint Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.5)_0%,rgba(0,0,0,1)_100%)]" />
      </div>

      {/* Title - positioned to avoid navbar overlap */}
      {/* This div remains static or sticky at a higher point */}
      <div className="relative z-0 flex justify-center pt-8">
        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4 drop-shadow-lg">
          What is Wezume?
        </h2>
      </div>

      {/* Sticky wrapper to pin during scroll, below title */}
      {/* This container's height will determine when the carousel starts moving */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center z-0">
        <motion.div
          style={{ x }}
          className="flex gap-6 will-change-transform px-6"
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="min-w-[80vw] sm:min-w-[60vw] lg:min-w-[25vw] h-[70vh]
                                   rounded-2xl overflow-hidden shadow-xl bg-white flex items-center justify-center"
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}