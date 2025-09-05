// Hero.jsx
import Navbar from "./Navbar";
import HeroBackground from "./HeroBackground";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-600">
      {/* Background */}
      <HeroBackground />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Hero Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 lg:px-20 text-center lg:text-left py-40">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Speak <span className="text-blue-600">Up.</span>{" "}
              <br className="hidden sm:block" /> Stand{" "}
              <span className="text-blue-600">Out.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed">
              The new-age interactive job search platform that <br />
              highlights your <span className="text-white font-bold">skills</span> — not just plain words.
            </p>

            {/* CTA */}
            <p className="mt-6 text-base sm:text-lg text-white/80">
              Download the Wezume app today and shine.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {/* Google Play */}
              <a href="#">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-14 w-auto object-contain"
                />
              </a>

              {/* App Store */}
              <a href="#">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-14 w-auto object-contain"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
