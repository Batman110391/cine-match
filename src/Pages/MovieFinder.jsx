import { Box, Button, Card, IconButton, alpha } from "@mui/material";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../api/tmdbApis";
import LoadingPage from "../components/LoadingPage";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

function Navigation({ pagination, movielength, handlePagination }) {
  console.log("pag", pagination, "lenght", movielength);

  return (
    <>
      <IconButton
        disabled={pagination <= 0}
        onClick={() => handlePagination("P")}
        sx={{
          position: "absolute",
          left: "2%",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ArrowCircleLeftIcon fontSize="large" />
      </IconButton>
      <IconButton
        disabled={pagination >= movielength}
        onClick={() => handlePagination("N")}
        sx={{
          position: "absolute",
          right: "2%",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ArrowCircleRightIcon fontSize="large" />
      </IconButton>
    </>
  );
}

export default function MovieFinder() {
  const dispatch = useDispatch();

  const genres = useSelector((state) => state.movieQuery.genres);
  const casts = useSelector((state) => state.movieQuery.cast);
  const similarMovies = useSelector((state) => state.movieQuery.similarMovies);

  const prevExcludeItems = useSelector(
    (state) => state.movieQuery.prevExcludeItems
  );
  const [pagination, setPagination] = useState(0);
  const [excludeMovie, setExcludeMovie] = useState(prevExcludeItems);

  const {
    status,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["movies", genres, casts, similarMovies],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      fetchMovies(pageParam, genres, casts, similarMovies),
  });

  if (status === "loading") return <LoadingPage />;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  const movies = data?.pages
    ?.flatMap((data) => data)
    .reduce((prev, curr) => {
      return {
        ...curr,
        results: prev?.results
          ? prev.results.concat(curr.results)
          : curr.results,
      };
    }, {});

  const handlePagination = (type) => {
    if (type === "N") {
      setPagination(pagination + 1);
    } else {
      setPagination(pagination - 1);
    }
  };

  const visibleData = movies?.results?.filter(
    (item) => !excludeMovie?.find((sItem) => sItem.id === item.id)
  );

  console.log("visible movie", visibleData[pagination]);

  const currentMovie = visibleData[pagination];

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `linear-gradient(-180deg, rgba(24,24,24,0.8), rgba(32,32,32,0.9)), url(http://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        objectFit: "cover",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          position: "relative",
          background: (theme) => alpha(theme.palette.background.default, 0.8),
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          objectFit: "cover",
          width: "92%",
          height: "90%",
          borderRadius: "2%",
        }}
      ></Card>
      <Navigation
        pagination={pagination}
        movielength={visibleData?.length - 1}
        handlePagination={handlePagination}
      />
    </Box>
  );
}
