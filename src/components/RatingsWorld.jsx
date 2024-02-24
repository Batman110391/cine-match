import { Box, Chip, Rating, Skeleton, Typography } from "@mui/material";
import React from "react";
import { fetchRatingMovieById } from "../api/tmdbApis";
import { useQuery } from "react-query";
import Letterboxd from "./icons/Letterboxd";
import Imdb from "../components/icons/Imdb";
import { roundToHalf } from "../utils/numberFormatting";

export default function RatingsWorld({ id, originalTitle }) {
  const { isLoading, error, data } = useQuery(
    ["ratingsMovie", id, originalTitle],
    () => fetchRatingMovieById(id, originalTitle)
  );

  if (error) {
    return <></>;
  }

  return (
    <>
      {isLoading ? (
        <LoadingRating />
      ) : (
        data?.ratings?.map(({ source, value, count }) => {
          if (!value) {
            return null;
          }

          return (
            <Box
              key={source}
              sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Chip
                sx={{ borderColor: "transparent" }}
                variant="outlined"
                icon={source === "Imdb" ? <Imdb /> : <Letterboxd />}
                label={
                  <Rating value={roundToHalf(value)} precision={0.5} readOnly />
                }
              />
              <Typography fontWeight={"bold"} variant={"caption"}>
                {value}
              </Typography>
            </Box>
          );
        })
      )}
    </>
  );
}

function LoadingRating() {
  return (
    <>
      <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: "210px" }} />
      <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: "210px" }} />
    </>
  );
}
