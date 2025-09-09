import { motion, useInView } from "framer-motion";
import { Briefcase, Users, Rocket, Handshake } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Animated Counter Component
function AnimatedCounter({ from = 0, to = 50, duration = 2, trigger }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!trigger) return; // Only run when in view
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
  }, [trigger, from, to, duration]);

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  return <span>{count}</span>;
}

export default function Features() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: (trigger) => (
        <>
          <AnimatedCounter from={0} to={50} duration={2} trigger={trigger} />+ Verified Recruiters
        </>
      ),
      description:
        "Trusted recruiters from top companies are ready to connect with talent.",
    },
    {
      icon: <Handshake className="w-8 h-8 text-blue-600" />,
      title: () => "Investors",
      description:
        "Investors easily find and connect with businesses for funding opportunities.",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      title: () => "Jobseekers",
      description:
        "Pitch your 60 sec videos and discover the right opportunities.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-600" />,
      title: () => "Freelancers / Entrepreneurs",
      description:
        "Showcase your skills and pitch ideas to attract potential clients or investors.",
    },
  ];

  return (
    <section className="relative bg-transparent z-0">
      {/* Wrapper that overlaps Hero */}
      <div className="container mx-auto px-6 lg:px-12 -mt-28 relative">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {features.map((feature, index) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: false, margin: "-50px" });

            return (
              <motion.div
                ref={ref}
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                className="text-center p-6 bg-white rounded-xl shadow-lg relative z-30 group"
              >
                {/* Icon */}
                <motion.div
                  className="flex justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-3 bg-white rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    {feature.icon}
                  </div>
                </motion.div>

                {/* Title with Counter (if applicable) */}
                <h3 className="text-xl font-bold text-blue-600">
                  {feature.title(inView)}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
