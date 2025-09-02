import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Mock image data with placeholder images
const images = [
  "1.jpeg",
  "2.jpeg",
  "3.jpeg",
  "4.jpeg",
  "5.jpeg",
  "6.jpeg",
  "7.jpeg",
  "8.jpeg",
];

export default function Carousel() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToSlide = (index) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4">
      {/* Carousel Container */}
      <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay, Pagination]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          className="w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <img
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-[28rem] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Image {index + 1}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows (Overlay) */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Custom Indicators */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <span className="text-sm text-gray-500 mr-2">
          {activeIndex + 1} / {images.length}
        </span>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 hover:scale-125 ${
              activeIndex === index
                ? "bg-blue-500 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-linear"
          style={{
            width: `${((activeIndex + 1) / images.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
