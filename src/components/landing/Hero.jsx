import Navbar from "./Navbar";
import HeroBackground from "./HeroBackground";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <Navbar />
      <div className="flex flex-col lg:flex-row justify-center min-h-screen p-6 lg:p-12 font-sans">
        {/* Phone Mockup - only visible on lg+ */}
        <motion.div
          initial={{ x: -200, opacity: 0 }} // start off-screen right
          animate={{ x: 0, opacity: 1 }} // slide into place
          transition={{ duration: 2, ease: "easeOut" }}
          className="
            flex-shrink-0
            w-full max-w-sm h-auto
            lg:w-1/4 lg:max-w-md lg:mr-24
            mb-12 lg:mb-0
            items-center justify-center
            cursor-pointer
          "
        >
          <div
            className="
            relative
            w-full h-[550px]
            bg-gray-900 rounded-[40px] shadow-2xl
            border-[10px] border-black
            flex flex-col
          "
          >
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-lg"></div>

            {/* Phone Screen */}
            <div
              className="
              flex-grow
              mt-5 mb-3 mx-2
              bg-blue-500 rounded-[28px] overflow-hidden
              flex flex-col
            "
            >
              {/* Fake App UI */}
              <img src="landing.jpeg" />
            </div>
          </div>
        </motion.div>

        {/* Content Container */}
        <motion.div
          initial={{ x: 200, opacity: 0 }} // start off-screen right
          animate={{ x: 0, opacity: 1 }} // slide into place
          transition={{ duration: 2, ease: "easeOut" }}
          className="
        w-full lg:w-1/2 z-10
        flex flex-col items-center lg:items-start
        text-center lg:text-left
        text-white
      "
        >
          <h1
            className="
          text-3xl sm:text-4xl md:text-5xl lg:text-5xl
          font-extrabold mb-4 lg:mb-6"
          >
            Speak Up . Stand Out .
          </h1>
          <p
            className="
          text-lg md:text-xl lg:text-2xl
          font-medium
          leading-relaxed
          mb-8 lg:mb-12
        "
          >
            New age interactive job search that voice out skills rather than
            boring plain words
          </p>
          <p
            className="
          text-base md:text-lg lg:text-xl
          font-normal
          mb-8 lg:mb-12
        "
          >
            Download the wezume app now and shine.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-row justify-center space-x-4">
            {/* Google Play */}
            <a href="#">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-14 w-44 object-contain"
              />
            </a>

            {/* App Store */}
            <a href="#">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-14 w-44 object-contain"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
