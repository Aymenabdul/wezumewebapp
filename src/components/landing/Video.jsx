import { motion } from "framer-motion";

export default function Video() {
  const features = [
    {
      title: "Skill-Pull",
      description:
        "Bring your resume to life with the power of voice. Create your voice profile today and make a lasting first impression.",
    },
    {
      title: "Social-Professional",
      description:
        "Experience a platform that goes beyond networking and job search. Discover a unified space.",
    },
    {
      title: "Reimagined",
      description:
        "No more static PDFs. Create a dynamic, voice-driven pitch that you can share anywhere - via link, QR code, or embedded in your portfolio.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-blue-50 to-white py-20 mb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Top Section - Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold text-blue-700 mb-6 leading-snug">
            Why Wezume ?
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed text-xl font-medium mb-4">
              Don&apos;t just apply –{" "}
              <span className="text-blue-600">impress.</span>
              <br />
              Don&apos;t just type – <span className="text-blue-600">talk.</span>
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              In a world flooded with resumes, we offer something refreshingly
              human –{" "}
              <span className="font-semibold text-blue-600">your voice</span>.
              Our platform lets you speak your story, showcase your passion, and
              present your personality in a way text never can.
            </p>
          </div>
        </motion.div>

        {/* Bottom Section - Video + Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left Section - Video */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center h-full"
          >
            <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-xl border border-blue-200 bg-white/40 backdrop-blur-md">
              <video
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* Right Section - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                }}
                viewport={{ once: false }}
                className="bg-gradient-to-tr from-blue-50 to-white border border-blue-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
