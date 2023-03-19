import {
  Box,
  Button,
  Card,
  IconButton,
  alpha,
  CardContent,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../api/tmdbApis";
import LoadingPage from "../components/LoadingPage";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import MovieCard from "../components/MovieCard";
import CarouselMovie from "../components/CarouselMovie";
import { motion } from "framer-motion";
import DetailMovie from "../components/DetailMovie";

function Navigation({ pagination, movielength, handlePagination }) {
  console.log("pag", pagination, "lenght", movielength);

  return (
    <>
      <IconButton
        disabled={pagination <= 0}
        onClick={() => handlePagination("P")}
        sx={{
          position: "absolute",
          left: "-10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      >
        <ArrowCircleLeftIcon fontSize="large" />
      </IconButton>
      <IconButton
        disabled={pagination >= movielength}
        onClick={() => handlePagination("N")}
        sx={{
          position: "absolute",
          right: "-10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
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
  const [bgWrapperIndex, setBgWrapperIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  /*   const handlePagination = (type) => {
    if (type === "N") {
      setPagination(pagination + 1);
    } else {
      setPagination(pagination - 1);
    }
  }; */

  const visibleData = movies?.results?.filter(
    (item) =>
      !excludeMovie?.find((sItem) => sItem.id === item.id) &&
      Boolean(item?.overview)
  );

  console.log("visible", visibleData);

  const currentMovie = visibleData[bgWrapperIndex];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        "&:after": {
          content: "''",
          backgroundImage: (theme) => theme.palette.gradient.opacityBgBottom,
          backgroundRepeat: "no-repeat",
          display: "block",
          height: "100%",
          left: "50%",
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          transform: "translateX(-50%)",
          width: "100%",
          zIndex: 0,
        },
        "&:before": {
          content: "''",
          backgroundImage: `url(http://image.tmdb.org/t/p/original${currentMovie?.backdrop_path})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          position: "absolute",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
          opacity: 0.35,
          transition: "background-image 0.8s cubic-bezier(0, 0.71, 0.2, 1.01)",
        },
      }}
    >
      <Box sx={{ width: "100%" }}>
        <CarouselMovie
          slides={visibleData}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          setBgWrapperIndex={setBgWrapperIndex}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginX: "auto",
          width: { xs: "100%", sm: "90%" },
          //height: "100%",
          overflowX: "hidden",
          zIndex: 1,
        }}
      >
        <Card
          elevation={12}
          sx={{
            position: "relative",
            background: (theme) => alpha(theme.palette.background.paper, 0.8),
            width: "100%",
            height: "100%",
            minHeight: "80vh",
            borderRadius: "2%",
            mb: 3,
          }}
        >
          <DetailMovie id={currentMovie?.id} />
        </Card>
        {/*  <Navigation
          pagination={pagination}
          movielength={visibleData?.length - 1}
          handlePagination={handlePagination}
        /> */}
      </Box>
    </Box>
  );
}
