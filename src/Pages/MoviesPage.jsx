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
import { motion, useScroll, useSpring } from "framer-motion";
import { memo, useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { fetchMoviesPage } from "../api/tmdbApis";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import DialogSettingMovies from "../components/DialogSettingMovies";
import FloatingActionButton from "../components/FloatingActionButton";
import LoadingPage from "../components/LoadingPage";
import RenderRow from "../components/RenderRow";
import { areEqual } from "../utils/areEqual";

export default function MoviesPage() {
  const theme = useTheme();

  const { openDialogMovieDetail } = useContext(DialogMovieDetailContext);

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

  const handleClickItem = (movieID) => {
    openDialogMovieDetail(movieID, "movie");
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
