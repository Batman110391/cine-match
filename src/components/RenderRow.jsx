import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import MovieCard from "../components/MovieCard";
import MovieCardDetail from "../components/MovieCardDetail";
import {
  MOVIE_PAGE_CARD_HEIGHT,
  MOVIE_PAGE_CARD_HEIGTH_MOBILE,
  MOVIE_PAGE_CARD_WIDTH,
  MOVIE_PAGE_CARD_WIDTH_MOBILE,
} from "../utils/constant";
import NewsCard from "./NewsCard";

const transition = {
  type: "spring",
  damping: 15,
  mass: 0.75,
  stiffness: 100,
};

export default function RenderRow({
  itemData,
  typeView,
  handleClickItem,
  isDesktop,
  mediaType,
}) {
  if (typeView === "news") {
    return (
      <Grid container sx={{ overflow: "hidden" }} gap={2}>
        <AnimatePresence>
          {itemData.map((news, i) => (
            <Grid
              component={motion.div}
              key={news.id}
              xs={12}
              layout={"preserve-aspect"}
              animate={{ scale: 1, opacity: 1 }}
              initial={{
                scale: 0.9,
                opacity: 0,
                duration: 0.1,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={transition}
              sx={{
                paddingY: isDesktop ? 1.5 : 1,
                paddingX: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NewsCard
                news={news}
                w={isDesktop ? 250 : 125}
                h={isDesktop ? 180 : 155}
                onClick={() => handleClickItem(news.id)}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    );
  } else if (typeView === "detail") {
    return (
      <Grid container sx={{ overflow: "hidden" }} gap={2}>
        <AnimatePresence>
          {itemData.map((movie, i) => (
            <Grid
              component={motion.div}
              key={movie.id}
              xs={12}
              layout={"preserve-aspect"}
              animate={{ scale: 1, opacity: 1 }}
              initial={{
                scale: 0.9,
                opacity: 0,
                duration: 0.1,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={transition}
              sx={{
                paddingY: isDesktop ? 1.5 : 1,
                paddingX: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MovieCardDetail
                movie={movie}
                w={
                  isDesktop
                    ? MOVIE_PAGE_CARD_WIDTH
                    : MOVIE_PAGE_CARD_WIDTH_MOBILE
                }
                h={
                  isDesktop
                    ? MOVIE_PAGE_CARD_HEIGHT
                    : MOVIE_PAGE_CARD_HEIGTH_MOBILE
                }
                mediaType={mediaType}
                onClick={() => handleClickItem(movie.id)}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        sx={{
          overflow: "hidden",
          paddingY: isDesktop ? 1.5 : 1,
          paddingX: isDesktop ? 1 : 0.5,
        }}
      >
        <AnimatePresence>
          {itemData.map((movie, i) => (
            <Grid
              component={motion.div}
              key={movie.id}
              xs={isDesktop ? 6 : 4}
              sm={isDesktop ? 4 : 3}
              md={2}
              lg={2}
              layout={"preserve-aspect"}
              animate={{ scale: 1, opacity: 1 }}
              initial={{
                scale: 0.9,
                opacity: 0,
                duration: 0,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={transition}
              sx={{
                paddingY: isDesktop ? 1.5 : 1,
                paddingX: isDesktop ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MovieCard
                bg={movie?.poster_path}
                title={movie?.title}
                w={
                  isDesktop
                    ? MOVIE_PAGE_CARD_WIDTH
                    : MOVIE_PAGE_CARD_WIDTH_MOBILE
                }
                h={
                  isDesktop
                    ? MOVIE_PAGE_CARD_HEIGHT
                    : MOVIE_PAGE_CARD_HEIGTH_MOBILE
                }
                badgeRating={movie?.vote_average}
                onClick={() => handleClickItem(movie.id)}
                isDesktop={isDesktop}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    );
  }
}
