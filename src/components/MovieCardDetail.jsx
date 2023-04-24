import { Box, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { CircularProgressWithLabel } from "./ChartCompatibility";
import Highlighter from "react-highlight-words";
import MovieCard from "./MovieCard";
import { genresList } from "../api/tmdbApis";
import { useSelector } from "react-redux";
import PeopleIcon from "@mui/icons-material/People";
import { useTheme } from "@emotion/react";

export default function MovieCardDetail({ movie, w = 175, h = 275 }) {
  const theme = useTheme();

  const genres = useSelector((state) => state.movieQuery.genres);

  const percentRating =
    movie?.vote_average && (movie?.vote_average.toFixed(1) * 100) / 10;

  const currGenres = genresList
    .map(({ id, name }) => {
      if (movie?.genre_ids.includes(id)) {
        return name;
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return (
    <Grid
      container
      maxWidth={"md"}
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <Grid item xs={10}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={4} md={4}>
            <Stack flexDirection={"row"}>
              <Box sx={{ flex: 2 }}>
                <MovieCard
                  bg={movie?.poster_path}
                  title={movie?.title || movie?.name}
                  w={w}
                  h={h}
                />
              </Box>
              {!useMediaQuery(theme.breakpoints.up("sm")) && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant={"body2"}>
                    <Highlighter
                      searchWords={genres?.map((g) => g.name)}
                      autoEscape={true}
                      highlightStyle={{
                        backgroundColor: "#ffee58b3",
                        padding: "0 4px",
                      }}
                      textToHighlight={`${currGenres.join(" ")}`}
                    />
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8} md={8}>
            <Stack>
              <Typography sx={{ fontSize: "1rem" }} variant={"h6"}>
                {movie?.title || movie?.name}
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: "0.7rem" }}
                variant={"button"}
              >
                {movie?.release_date || movie?.first_air_date}
              </Typography>
              {useMediaQuery(theme.breakpoints.up("sm")) && (
                <Typography variant={"body2"} sx={{ mt: 1 }}>
                  <Highlighter
                    searchWords={genres?.map((g) => g.name)}
                    autoEscape={true}
                    highlightStyle={{
                      backgroundColor: "#ffee58b3",
                      padding: "0 4px",
                    }}
                    textToHighlight={`${currGenres.join(", ")}`}
                  />
                </Typography>
              )}
              <Typography
                component="span"
                fontWeight={300}
                sx={{
                  mt: 1,
                  fontSize: "0.8rem",
                }}
                variant={"body2"}
              >
                {movie?.overview}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Stack flexDirection={"column"} gap={3} alignItems={"center"}>
          <CircularProgressWithLabel
            to={percentRating}
            size={55}
            labelSize={11}
            durationAnimate={0}
          />
          <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
            <PeopleIcon fontSize="small" />
            <Typography variant="caption">{movie?.vote_count}</Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
