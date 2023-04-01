import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Virtual,
  Keyboard,
} from "swiper";
import MovieCard from "./MovieCard";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import LoadingPage from "./LoadingPage";

export default function CarouselMovie({
  slides,
  setBgWrapperIndex,
  hasNextPage,
  fetchNextPage,
  initzializeSwiper,
  isLoading,
}) {
  const swiperRef = useRef(null);
  const theme = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides && currentSlide >= slides?.length - 5 && hasNextPage) {
      fetchNextPage();
    }
  }, [currentSlide]);

  useEffect(() => {
    swiperRef?.current?.swiper?.slideTo(0);
    setBgWrapperIndex(0);
    setCurrentSlide(0);
  }, [initzializeSwiper]);

  return (
    <Swiper
      ref={swiperRef}
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
      navigation={useMediaQuery(theme.breakpoints.up("sm")) ? true : false}
      keyboard={{
        enabled: useMediaQuery(theme.breakpoints.up("sm")) ? true : false,
      }}
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
      modules={[EffectCoverflow, Pagination, Virtual, Navigation, Keyboard]}
    >
      {slides && isLoading ? (
        <LoadingPage />
      ) : (
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
        })
      )}
    </Swiper>
  );
}
