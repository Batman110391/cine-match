import React from "react";
import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "./MovieCard";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import {
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  MOVIE_CARD_HEIGHT,
  MOVIE_CARD_HEIGTH_MOBILE,
  MOVIE_CARD_WIDTH,
  MOVIE_CARD_WIDTH_MOBILE,
} from "../utils/constant";

export default function CarouselDiscover({
  slides,
  titleDiscover,
  isLoading,
  path,
  onAction,
  handleClickItem,
  isDesktop,
  type,
  invertBg,
  nobg,
  Component,
  customStyle,
  FallbackComponent,
}) {
  if (isLoading) {
    return (
      <LoadingCarousel titleDiscover={titleDiscover} isDesktop={isDesktop} />
    );
  }

  const optionsMobileSwiper = {
    cssMode: true,
    slidesPerView: "auto",
    spaceBetween: 10,
  };

  const optionsDesktopSwiper = {
    grabCursor: true,
    slidesPerView: "auto",
    navigation: true,
    spaceBetween: 10,
    freeMode: {
      enabled: true,
      sticky: true,
    },
    modules: [Navigation, FreeMode],
  };

  const styleSwiperSlide = customStyle
    ? customStyle
    : {
        width: isDesktop
          ? `${MOVIE_CARD_WIDTH}px`
          : `${MOVIE_CARD_WIDTH_MOBILE}px`,
      };

  const action =
    handleClickItem && typeof handleClickItem === "function"
      ? handleClickItem
      : null;

  return (
    <Box
      sx={{
        width: "100%",
        my: 2,
        position: "relative",

        "&:before": {
          content: "''",
          backgroundImage: nobg ? "" : "url(/images/svg/trending-bg.svg)",
          backgroundSize: isDesktop ? "1370px" : "1200px",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: "0px",
          right: "0px",
          bottom: isDesktop ? "-44px" : "-24px",
          left: "0px",
          opacity: 0.35,
          transform: invertBg ? "rotate(180deg) scaleX(-1)" : "rotate(180deg)",
          transition: "background-image 0.8s cubic-bezier(0, 0.71, 0.2, 1.01)",
        },
      }}
    >
      {titleDiscover && (
        <Stack
          mb={1}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="body1">{titleDiscover}</Typography>
          {onAction && (
            <Button LinkComponent={Link} to={path} onClick={onAction}>
              <Typography variant="button">{"Vedi tutti"}</Typography>
            </Button>
          )}
          {path && !onAction && (
            <Button LinkComponent={Link} to={path}>
              <Typography variant="button">{"Vedi tutti"}</Typography>
            </Button>
          )}
        </Stack>
      )}
      {!slides?.length > 0 && FallbackComponent ? (
        <FallbackComponent />
      ) : (
        <Swiper
          style={{
            width: "100%",
          }}
          {...(isDesktop ? optionsDesktopSwiper : optionsMobileSwiper)}
        >
          {slides &&
            slides.length > 0 &&
            slides.map((slideContent, index) => {
              return (
                <SwiperSlide
                  key={slideContent.id}
                  style={styleSwiperSlide}
                  {...(action
                    ? { onClick: () => action(slideContent.id, type) }
                    : null)}
                >
                  {Component ? (
                    <Component
                      slideContent={slideContent}
                      isDesktop={isDesktop}
                    />
                  ) : (
                    <MovieCard
                      bg={slideContent?.poster_path}
                      title={slideContent?.title || slideContent?.name}
                      w={isDesktop ? MOVIE_CARD_WIDTH : MOVIE_CARD_WIDTH_MOBILE}
                      h={
                        isDesktop ? MOVIE_CARD_HEIGHT : MOVIE_CARD_HEIGTH_MOBILE
                      }
                      badgeRating={slideContent?.vote_average}
                      isDesktop={isDesktop}
                    />
                  )}
                </SwiperSlide>
              );
            })}
        </Swiper>
      )}
      <Divider sx={{ my: 2, borderColor: "transparent" }} />
    </Box>
  );
}

const LoadingCarousel = React.memo(function LoadingCarousel({
  titleDiscover,
  isDesktop,
  invertBg,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        my: 2,
      }}
    >
      {titleDiscover && (
        <Stack
          mb={1}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="body1">{titleDiscover}</Typography>
        </Stack>
      )}
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        overflow={"hidden"}
        gap={1}
      >
        {Array.from(new Array(20)).map((ele, i) => (
          <Skeleton
            key={"loading" + i}
            sx={{
              minWidth: isDesktop ? MOVIE_CARD_WIDTH : MOVIE_CARD_WIDTH_MOBILE,
            }}
            variant="rectangular"
            height={isDesktop ? MOVIE_CARD_HEIGHT : MOVIE_CARD_HEIGTH_MOBILE}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 2, borderColor: "transparent" }} />
    </Box>
  );
});
