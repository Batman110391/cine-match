import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "./MovieCard";
// Import Swiper styles
import "swiper/css";
//import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
//import "swiper/css/virtual";
import { useMediaQuery, useTheme } from "@mui/material";

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

  /* useEffect(() => {
    swiperRef?.current?.swiper?.slideTo(0);
    setBgWrapperIndex(0);
    setCurrentSlide(0);
  }, [initzializeSwiper]); */

  return (
    <Swiper
      ref={swiperRef}
      style={{
        width: "100%",
        height: "290px",
        paddingTop: "55px",
      }}
      onSlideChange={(e) => setCurrentSlide(e.realIndex)}
      onTransitionEnd={(e) => setBgWrapperIndex(e.realIndex)}
      watchSlidesProgress={true}
      breakpoints={{
        // quando la larghezza della finestra è >= 320px
        320: {
          slidesPerView: 3,
        },
        // quando la larghezza della finestra è >= 480px
        480: {
          slidesPerView: 4,
        },
        // quando la larghezza della finestra è >= 640px
        640: {
          slidesPerView: 5,
        },
        // quando la larghezza della finestra è >= 800px
        800: {
          slidesPerView: 6,
        },
        // quando la larghezza della finestra è >= 960px
        960: {
          slidesPerView: 7,
        },
        // quando la larghezza della finestra è >= 1120px
        1120: {
          slidesPerView: 8,
        },
        // quando la larghezza della finestra è >= 1300px
        1300: {
          slidesPerView: 9,
        },
      }}
      //effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      navigation={useMediaQuery(theme.breakpoints.up("sm")) ? true : false}
      keyboard={{
        enabled: useMediaQuery(theme.breakpoints.up("sm")) ? true : false,
      }}
      /* coverflowEffect={{
        rotate: 10,
        stretch: 0,
        depth: 40,
        modifier: 1,
        slideShadows: false,
      }} */
      pagination={{
        type: "progressbar",
      }}
      //loop={true}
      modules={[Pagination, Navigation, Keyboard]}
      /* virtual={{
        cache: true,
        addSlidesBefore: 4,
        addSlidesAfter: 4,
      }} */
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
                height: "240px",
                width: "150px",
              }}
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
