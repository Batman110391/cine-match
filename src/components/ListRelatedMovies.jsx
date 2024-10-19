import { LinearProgress, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { fetchRelatedMovies } from "../api/tmdbApis";
import CarouselDiscover from "./CarouselDiscover";

export default function ListRelatedMovies({
  id,
  idCollection,
  type,
  isDesktop,
  subItemClick,
}) {
  const { isLoading, error, data } = useQuery(
    ["relatedMovie", idCollection],
    () => fetchRelatedMovies(idCollection)
  );

  const excludeOriginalMovie = React.useMemo(() => {
    return data && data.length > 0 ? data.filter((m) => m.id !== id) : [];
  }, [data]);

  const handleClickItem = (id, type) => {
    subItemClick(id, type);
  };

  return (
    <>
      {isLoading && <LinearProgress />}
      {!isLoading &&
        excludeOriginalMovie &&
        excludeOriginalMovie.length > 0 && (
          <CarouselDiscover
            slides={excludeOriginalMovie}
            isLoading={isLoading}
            handleClickItem={handleClickItem}
            isDesktop={isDesktop}
            type={type}
            nobg={true}
          />
        )}
      {!isLoading &&
        (error ||
          !excludeOriginalMovie ||
          !excludeOriginalMovie.length > 0) && (
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
