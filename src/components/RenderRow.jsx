import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import MovieCard from "../components/MovieCard";
import MovieCardDetail from "../components/MovieCardDetail";

export default function RenderRow({ itemData, typeView, handleClickItem }) {
  if (typeView === "detail") {
    return (
      <Grid container sx={{ overflow: "hidden" }} gap={2}>
        <AnimatePresence
          mode={"popLayout"}
          prop={{
            popDuration: 0.2,
            popSpringMass: 0.1,
            popSpringStiffness: 20,
            popSpringDamping: 20,
          }}
        >
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
              transition={{ type: "spring" }}
              sx={{
                padding: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleClickItem(movie.id)}
            >
              <MovieCardDetail movie={movie} />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    );
  } else {
    return (
      <Grid container sx={{ overflow: "hidden" }}>
        <AnimatePresence mode={"popLayout"}>
          {itemData.map((movie, i) => (
            <Grid
              component={motion.div}
              key={movie.id}
              xs={6}
              sm={4}
              md={3}
              lg={2}
              layout={"preserve-aspect"}
              animate={{ scale: 1, opacity: 1 }}
              initial={{
                scale: 0.9,
                opacity: 0,
                duration: 0,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring" }}
              sx={{
                padding: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MovieCard
                bg={movie?.poster_path}
                title={movie?.title}
                w={175}
                h={265}
                badgeRating={movie?.vote_average}
                onClick={() => handleClickItem(movie.id)}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    );
  }
}
