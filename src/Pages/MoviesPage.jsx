import { useTheme } from "@emotion/react";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TuneIcon from "@mui/icons-material/Tune";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import {
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { memo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { fetchMoviesPage } from "../api/tmdbApis";
import DialogSettingMovies from "../components/DialogSettingMovies";
import FloatingActionButton from "../components/FloatingActionButton";
import LoadingPage from "../components/LoadingPage";
import MovieCard from "../components/MovieCard";
import MovieCardDetail from "../components/MovieCardDetail";
import { areEqual } from "../utils/areEqual";

export default function MoviesPage() {
  const theme = useTheme();

  const [changeFilters, setChangeFilters] = useState(false);
  const [openSettingMovie, setOpenSettingMovie] = useState(false);
  const querySearch = useSelector((state) => state.movieQuery.querySearch);

  const [viewGrid, setViewGrid] = useState("compact");

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

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
    queryFn: ({ pageParam = 1 }) => fetchMoviesPage(pageParam, querySearch),
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
        bottom={isDesktop ? 16 : 95}
        sx={{ padding: 0 }}
      >
        <TuneIcon fontSize="large" color="action" />
      </FloatingActionButton>
    </Box>
  );
}

const ItemRow = memo(RenderRow, areEqual);

function RenderRow({ itemData, typeView, handleClickItem }) {
  if (typeView === "detail") {
    return (
      <Grid container sx={{ overflow: "hidden" }} gap={2}>
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
