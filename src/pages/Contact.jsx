import { useState } from "react";
import { Mail, Phone, User, MessageSquare } from "lucide-react";
import ContactNavbar from "../components/landing/ContactNavbar";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // 👉 You can add API call / email integration here
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Impressive Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        {/* Animated geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large floating circles */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-white/8 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/3 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-3/4 right-1/3 w-72 h-72 bg-white/4 rounded-full animate-pulse delay-1500"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="contact-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#contact-grid)" />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-3/4 left-3/4 w-3 h-3 bg-white/15 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-white/25 rounded-full animate-bounce delay-1200"></div>
          <div className="absolute top-1/6 right-1/4 w-2 h-2 bg-white/10 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-white/18 rounded-full animate-bounce delay-900"></div>
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 to-transparent"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-20">
        <ContactNavbar />
      </div>

      {/* Content */}
      <section className="relative z-10 w-full py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 md:p-12 border border-white/20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-600 mb-10 drop-shadow-sm">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-blue-500" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white/90 backdrop-blur-sm hover:bg-white/95"
                />
              </div>
            </div>

            {/* Number */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Your Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-blue-500" size={20} />
                <input
                  type="tel"
                  name="number"
                  placeholder="Enter your phone number"
                  value={form.number}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white/90 backdrop-blur-sm hover:bg-white/95"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-blue-500" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white/90 backdrop-blur-sm hover:bg-white/95"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Your Message <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <MessageSquare
                  className="absolute left-3 top-3 text-blue-500"
                  size={20}
                />
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Type your message..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white/90 backdrop-blur-sm hover:bg-white/95 resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}