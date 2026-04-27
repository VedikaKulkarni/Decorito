import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://housing.com/news/wp-content/uploads/2024/06/Popular-wooden-home-decor-items-in-2024-12.jpg",
  "https://media.designcafe.com/wp-content/uploads/2020/09/21140705/origami-ganpati-decoration-at-home.jpg",
  "/images/ca.png",
  "https://img.staticmb.com/mbcontent/images/crop/uploads/2024/3/birthday-party-decoration-items%20(1)_0_1200.jpg.webp",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () =>
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  const nextSlide = () =>
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  const goToSlide = (index) => setCurrent(index);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4000);
    return () => clearInterval(slideInterval);
  }, [current]);

  return (
    <div className="flex w-full h-[500px] bg-[#2a0e00]">
      {/* Left Carousel */}
      <div className="relative w-2/3 h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="relative w-full h-full flex-shrink-0">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better readability */}
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-[#411900]/70 text-white p-2 rounded-full hover:bg-[#6b2b00]/90 transition"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-[#411900]/70 text-white p-2 rounded-full hover:bg-[#6b2b00]/90 transition"
        >
          <ChevronRight size={28} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-colors ${
                current === index ? "bg-[#c49a6c]" : "bg-white/50"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Right Text Content */}
      <div className="w-1/3 h-full flex flex-col justify-center items-start 
                      bg-gradient-to-br from-[#411900] via-[#6b2b00] to-[#c49a6c]/70
                      p-10 text-white shadow-inner">
        <h1 className="text-4xl font-serif font-bold mb-4 tracking-wide">
          Transform Your Home
        </h1>
        <p className="text-lg leading-relaxed mb-6 opacity-90">
          Discover exquisite wooden & handcrafted décor items.  
          Lights, curtains, and accents that redefine warmth & style.
        </p>
        <button className="px-6 py-3 bg-[#c49a6c] text-[#2a0e00] font-bold rounded-lg shadow-lg hover:bg-[#e6b980] transition">
          Shop Now
        </button>
      </div>
    </div>
  );
}
