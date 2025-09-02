import { useState } from "react";
import { Mail, Phone, User, MessageSquare } from "lucide-react";

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
    <section className="w-full py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12 border border-blue-100">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 mb-10">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
