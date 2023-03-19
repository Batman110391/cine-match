import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Virtual } from "swiper";
import MovieCard from "./MovieCard";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function CarouselMovie({
  slides,
  currentSlide,
  setCurrentSlide,
  setBgWrapperIndex,
  hasNextPage,
  fetchNextPage,
}) {
  useEffect(() => {
    console.log("currentSlide", currentSlide);

    if (slides && currentSlide >= slides?.length - 10 && hasNextPage) {
      fetchNextPage();
    }
  }, [currentSlide]);

  return (
    <Swiper
      style={{
        width: "100%",
        height: "100%",
        paddingTop: "55px",
      }}
      onSlideChange={(e) => setCurrentSlide(e.realIndex)}
      onTransitionEnd={(e) => setBgWrapperIndex(e.realIndex)}
      watchSlidesProgress={true}
      slidesPerView={"auto"}
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 10,
        stretch: 0,
        depth: 40,
        modifier: 1,
        slideShadows: false,
      }}
      pagination={{
        type: "progressbar",
      }}
      //loop={true}
      modules={[EffectCoverflow, Pagination, Virtual]}
    >
      {slides &&
        slides.length > 0 &&
        slides.map((slideContent, index) => {
          const selected = index === currentSlide;

          return (
            <SwiperSlide
              key={slideContent.id}
              virtualIndex={index}
              style={{ height: "240px", width: "150px" }}
            >
              <MovieCard
                bg={slideContent.poster_path}
                title={slideContent.title}
                selected={selected}
              />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
}
