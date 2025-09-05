"use client";

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
    <section ref={targetRef} className="relative h-[200vh] bg-gray-100">
      {/* Sticky wrapper to pin during scroll */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
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
