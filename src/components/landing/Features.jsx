import { motion, useAnimation } from "framer-motion";
import { Briefcase, Users, Rocket, Handshake } from "lucide-react";
import { useEffect, useState } from "react";

// Animated Counter Component - Fixed version
function AnimatedCounter({ from = 0, to = 50, duration = 2 }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      const currentCount = Math.floor(
        from + (to - from) * easeOutQuart(progress)
      );
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration]);

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  return <span>{count}</span>;
}

// Floating particles background
function FloatingParticles() {
  const particles = Array.from({ length: 25 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-30"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * 400,
          }}
          animate={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * 400,
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function Features() {
  const [recruitersCount, setRecruitersCount] = useState(0);
  const controls = useAnimation();

  // Your original animation setup (preserved)
  useEffect(() => {
    controls.start({
      count: 50,
      transition: { duration: 2, ease: "easeOut" },
    });
  }, [controls]);

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: (
        <>
          <AnimatedCounter from={0} to={50} duration={2} />+ Verified Recruiters
        </>
      ),
      description:
        "Trusted recruiters from top companies are ready to connect with talent.",
    },
    {
      icon: <Handshake className="w-8 h-8 text-blue-600" />,
      title: "Investors",
      description:
        "Investors easily find and connect with businesses for funding opportunities.",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      title: "Jobseekers",
      description:
        "Pitch your 60 sec videos and discover the right opportunities.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-600" />,
      title: "Freelancers / Entrepreneurs",
      description:
        "Showcase your skills and pitch ideas to attract potential clients or investors.",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 overflow-hidden">
      {/* Background Animations */}
      <FloatingParticles />

      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-indigo-100/25 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Divider Line Top - Enhanced */}
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ transformOrigin: "left" }}
        />

        {/* Your original grid layout preserved */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: false }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="text-center p-6 relative group bg-white rounded-lg"
            >
              {/* Card Background with Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg opacity-0 group-hover:opacity-100 -m-4"
                transition={{ duration: 0.3 }}
              />

              {/* Icon with enhanced styling */}
              <motion.div
                className="flex justify-center mb-4 relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-3 bg-white rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {feature.icon}
                </div>
              </motion.div>

              <h3 className="text-xl font-bold text-blue-600 relative z-10">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 relative z-10">
                {feature.description}
              </p>

              {/* Subtle shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 pointer-events-none"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Divider Line Bottom - Enhanced */}
        {/* Divider Line Top - Enhanced */}
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </section>
  );
}
