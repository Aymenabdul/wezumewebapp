import Hero from "../components/landing/Hero";
import Video from "../components/landing/Video";
import Features from "../components/landing/Features";
import Carousel from "../components/landing/Carousel";
import FAQ from "../components/landing/FAQ";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import ContactSection from "../components/landing/ContactSection";

export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <Video />
      <Carousel />
      <FAQ />
      <Testimonials />
      <ContactSection />
      <Footer />
    </>
  );
}
