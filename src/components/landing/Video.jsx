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
    <section className="bg-gradient-to-b from-white via-blue-50 to-white py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-md border border-blue-100 hover:border-blue-300 transition-colors duration-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl"
          >
            <h2 className="text-4xl font-extrabold text-blue-700 mb-6 leading-snug">
              Why Wezume
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-medium">
              Don&apos;t just apply - impress.
              <br />
              Don&apos;t just type - talk.
            </p>
            <p className="mt-4 text-gray-600 text-base leading-relaxed">
              In a world flooded with resumes, we offer something refreshingly
              human - <span className="font-semibold text-blue-600">your voice</span>.
              Our platform lets you speak your story, showcase your passion, and
              present your personality in a way text never can.
            </p>
          </motion.div>

          {/* Middle Reel/Video */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-xl border border-blue-200 bg-white/40 backdrop-blur-md"
          >
            <video
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>

          {/* Right Features as Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 30px rgba(0,0,0,0.1)" }}
                viewport={{ once: false }}
                className="bg-gradient-to-tr from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-transform duration-300"
              >
                <h3 className="text-2xl font-semibold text-blue-700">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
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
