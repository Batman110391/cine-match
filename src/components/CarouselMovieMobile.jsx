import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Navigation, Pagination, Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "./MovieCard";
// Import Swiper styles
import "swiper/css";
//import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
//import "swiper/css/virtual";
import { useMediaQuery, useTheme } from "@mui/material";
import MovieCardMobile from "./MovieCardMobile";

export default function CarouselMovieMobile({
  slides,
  setBgWrapperIndex,
  hasNextPage,
  fetchNextPage,
  initzializeSwiper = 0,
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
        paddingTop: "45px",
        paddingBottom: "45px",
        paddingRight: "25px",
        paddingLeft: "25px",
      }}
      onSlideChange={(e) => setCurrentSlide(e.realIndex)}
      onTransitionEnd={(e) => setBgWrapperIndex(e.realIndex)}
      //centeredSlides={true}
      //slidesPerView={1}
      watchSlidesProgress={true}
      spaceBetween={20}
      grabCursor={true}
      navigation={useMediaQuery(theme.breakpoints.up("sm")) ? true : false}
      keyboard={{
        enabled: useMediaQuery(theme.breakpoints.up("sm")) ? true : false,
      }}
      pagination={{
        type: "progressbar",
      }}
      virtual={true}
      modules={[Pagination, Navigation, Keyboard, Virtual]}
    >
      {slides &&
        slides.length > 0 &&
        slides.map((slideContent, index) => {
          const selected = index === currentSlide;

          return (
            <SwiperSlide
              key={slideContent.id}
              virtualIndex={index}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <MovieCardMobile
                bg={slideContent.poster_path}
                title={slideContent.title}
                currentMovie={slideContent}
              />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
}
