import {
  Box,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { memo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMoviesPage } from "../api/tmdbApis";
import AnimatedTitle from "../components/AnimatedTitle";
import DialogSettingMovies from "../components/DialogSettingMovies";
import FloatingActionButton from "../components/FloatingActionButton";
import LoadingPage from "../components/LoadingPage";
import MovieCard from "../components/MovieCard";
import { areEqual } from "../utils/areEqual";
import TuneIcon from "@mui/icons-material/Tune";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import TableRowsIcon from "@mui/icons-material/TableRows";
import { useTheme } from "@emotion/react";
import MovieCardDetail from "../components/MovieCardDetail";

export default function MoviesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const genres = useSelector((state) => state.movieQuery.genres);
  const casts = useSelector((state) => state.movieQuery.cast);
  const sort = useSelector((state) => state.movieQuery.sort);
  const periods = useSelector((state) => state.movieQuery.rangeDate);
  const exactQuery = useSelector((state) => state.movieQuery.exactQuery);

  const [changeFilters, setChangeFilters] = useState(false);
  const [openSettingMovie, setOpenSettingMovie] = useState(false);

  const [viewGrid, setViewGrid] = useState("detail");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const {
    status,
    error,
    data,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["moviesPage", changeFilters],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      fetchMoviesPage(pageParam, genres, casts, sort, periods, exactQuery),
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

  const handleClickItem = () => {
    console.log("to do");
  };

  const handleViewGrid = (event, newValue) => {
    if (newValue !== null) {
      setViewGrid(newValue);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        component={motion.div}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: (theme) => theme.palette.gradient.extraLight,
          transformOrigin: "0%",
          zIndex: 2,
        }}
        style={{ scaleX }}
      />
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ToggleButtonGroup value={viewGrid} exclusive onChange={handleViewGrid}>
          <ToggleButton value="detail">
            <TableRowsIcon />
          </ToggleButton>
          <ToggleButton value="compact">
            <ViewCompactIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ overflow: "hidden", pb: 5 }}>
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={movies?.results?.length || 0}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          }
        >
          <ItemRow
            itemData={movies?.results}
            typeView={viewGrid}
            handleClickItem={handleClickItem}
          />
        </InfiniteScroll>
      </Box>
      <DialogSettingMovies
        open={openSettingMovie}
        setOpen={setOpenSettingMovie}
        changeFilters={changeFilters}
        setChangeFilters={setChangeFilters}
        //refetchPagination={refetch}
      />
      <FloatingActionButton
        onClick={() => setOpenSettingMovie(true)}
        position={"right"}
        size={"large"}
        sx={{ padding: 0 }}
      >
        <TuneIcon fontSize="large" color="action" />
      </FloatingActionButton>
    </Box>
  );
}

const ItemRow = memo(RenderRow, areEqual);

function RenderRow({ itemData, typeView, handleClickItem }) {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  if (typeView === "detail") {
    return (
      <Grid container sx={{ overflow: "hidden" }}>
        <AnimatePresence
          mode={"popLayout"}
          prop={{
            popDuration: 0.2,
            popSpringMass: 1.8,
            popSpringStiffness: 100,
            popSpringDamping: 100,
          }}
        >
          {itemData.map((movie, i) => (
            <Grid
              component={motion.div}
              key={movie.id}
              xs={12}
              layout
              animate={{ scale: 1, opacity: 1 }}
              initial={{
                scale: 0.9,
                opacity: 0,
                duration: 0.1,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring" }}
              sx={{
                padding: 1.5,
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
              layout
              animate={{ scale: 1, opacity: 1 }}
              initial={{
                scale: 0.8,
                opacity: 0,
                duration: 0.1,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring" }}
              sx={{
                padding: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleClickItem(movie.id)}
            >
              <MovieCard
                bg={movie?.poster_path}
                title={movie?.title}
                w={175}
                h={265}
                badgeRating={movie?.vote_average}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    );
  }
}
