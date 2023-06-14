import { LinearProgress, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { fetchSimilarMoviesOrTvById } from "../api/tmdbApis";
import CarouselDiscover from "./CarouselDiscover";

export default function ListSimilarMoviesAndTv({
  id,
  type,
  isDesktop,
  subItemClick,
}) {
  const { isLoading, error, data } = useQuery(["similarMovieOrTv", id], () =>
    fetchSimilarMoviesOrTvById(id, type)
  );

  const handleClickItem = (id, type) => {
    subItemClick(id, type);
  };

  return (
    <>
      {isLoading && <LinearProgress />}
      {!isLoading && data && data.length > 0 && (
        <CarouselDiscover
          slides={data}
          isLoading={isLoading}
          handleClickItem={handleClickItem}
          isDesktop={isDesktop}
          type={type}
          nobg={true}
        />
      )}
      {!isLoading && (error || !data || !data.length > 0) && (
        <Typography
          fontWeight={300}
          sx={{
            mt: 1,
            fontSize: "0.8rem",
          }}
          variant={"body2"}
        >
          {"Nessun titolo presente"}
        </Typography>
      )}
    </>
  );
}
