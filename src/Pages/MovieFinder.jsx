import { alpha, Box, Card } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, fetchMoviesByCasts } from "../api/tmdbApis";
import CarouselMovie from "../components/CarouselMovie";
import DetailMovie from "../components/DetailMovie";
import FloatingActionButton from "../components/FloatingActionButton";
import LoadingPage from "../components/LoadingPage";
import SettingsIcon from "@mui/icons-material/Settings";
import DialogSettingMovies from "../components/DialogSettingMovies";
import { uniqueArray } from "../utils/uniqueArray";

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
  const [openSettingMovie, setOpenSettingMovie] = useState(false);
  const [currSelectedCast, setCurrSelectedCast] = useState([]);

  const {
    status,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["movies"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      fetchMovies(pageParam, genres, casts, similarMovies),
  });

  if (status === "loading") return <LoadingPage />;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  const handleAddMoviesByInsertPeople = (castMovie) => {
    console.log("castMovie", castMovie);
    setCurrSelectedCast([...currSelectedCast, ...castMovie]);
  };
  const handleRemoveMoviesByInsertPeople = (id) => {
    const newCurrSelectedCast = currSelectedCast.filter((c) => c.castId !== id);
    setCurrSelectedCast(newCurrSelectedCast);
  };

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

  const visibleData = uniqueArray(
    currSelectedCast,
    movies?.results?.filter(
      (item) =>
        !excludeMovie?.find((sItem) => sItem.id === item.id) &&
        Boolean(item?.overview)
    )
  );

  console.log("visible", visibleData);

  console.log("currSelectedCast", currSelectedCast);

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
            minHeight: "50vh",
            borderRadius: "2%",
            my: 3,
            marginBottom: { xs: 0, sm: 3 },
          }}
        >
          <DetailMovie
            id={currentMovie?.id}
            handleAddMoviesByInsertPeople={handleAddMoviesByInsertPeople}
            handleRemoveMoviesByInsertPeople={handleRemoveMoviesByInsertPeople}
          />
        </Card>
      </Box>
      <DialogSettingMovies
        open={openSettingMovie}
        setOpen={setOpenSettingMovie}
      />
      <FloatingActionButton
        onClick={() => setOpenSettingMovie(true)}
        position={"right"}
        size={"large"}
        sx={{ padding: 0 }}
      >
        <SettingsIcon fontSize="large" color="action" />
      </FloatingActionButton>
    </Box>
  );
}
