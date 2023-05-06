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

export default function CarouselDiscover({
  slides,
  titleDiscover,
  isLoading,
  path,
  onAction,
  isDesktop,
}) {
  if (isLoading) {
    return <LoadingCarousel titleDiscover={titleDiscover} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        my: 2,
        /*  position: "relative",

        "&:before": {
          content: "''",
          backgroundImage: "url(/images/svg/trending-bg.svg)",
          backgroundPosition: "50% 200px",
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
          opacity: 0.75,
          transition: "background-image 0.8s cubic-bezier(0, 0.71, 0.2, 1.01)",
        }, */
      }}
    >
      <Stack
        mb={1}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="body1">{titleDiscover}</Typography>
        <Button LinkComponent={Link} to={path} onClick={onAction}>
          <Typography variant="button">{"Vedi tutti"}</Typography>
        </Button>
      </Stack>
      <Swiper
        style={{
          width: "100%",
        }}
        grabCursor={true}
        slidesPerView={"auto"}
        navigation={isDesktop}
        spaceBetween={10}
        freeMode={{
          enabled: true,
          momentumVelocityRatio: 0.5,
          sticky: true,
        }}
        modules={[Navigation, FreeMode]}
      >
        {slides &&
          slides.length > 0 &&
          slides.map((slideContent, index) => {
            return (
              <SwiperSlide
                key={slideContent.id}
                style={{
                  width: "150px",
                }}
                onClick={() => console.log("hi")}
              >
                <MovieCard
                  bg={slideContent?.poster_path}
                  title={slideContent?.title || slideContent?.name}
                  w={150}
                  h={230}
                  badgeRating={slideContent?.vote_average}
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

function LoadingCarousel({ titleDiscover }) {
  return (
    <Box
      sx={{
        width: "100%",
        my: 2,
      }}
    >
      <Stack
        mb={1}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="body1">{titleDiscover}</Typography>
      </Stack>
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        overflow={"hidden"}
        gap={1}
      >
        {Array.from(new Array(20)).map((ele, i) => (
          <Skeleton
            key={"loading" + i}
            sx={{ minWidth: 150 }}
            variant="rectangular"
            height={230}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
