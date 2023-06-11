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
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { fetchMoviesPage, fetchShowTvPage } from "../api/tmdbApis";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import DialogSettingMovies from "../components/DialogSettingMovies";
import FloatingActionButton from "../components/FloatingActionButton";
import LoadingPage from "../components/LoadingPage";
import RenderRow from "../components/RenderRow";
import { areEqual } from "../utils/areEqual";
import _ from "lodash";
import { useParams, useNavigate } from "react-router-dom";

export default function MoviesAndTvPages({ typeSearch }) {
  const keyQuery = typeSearch === "movie" ? "moviesPage" : "showTvPage";
  const functionCall =
    typeSearch === "movie" ? fetchMoviesPage : fetchShowTvPage;
  const redirectPages = typeSearch === "movie" ? "/movies" : "/showtv";
  const queryTypeDispatch =
    typeSearch === "movie" ? "querySearch" : "querySearchTv";

  const theme = useTheme();
  const navigate = useNavigate();
  const { movieID, type } = useParams();

  const { openDialogMovieDetail } = useContext(DialogMovieDetailContext);
  const scrollContainerRef = useRef(null);

  const [changeFilters, setChangeFilters] = useState(false);
  const [openSettingMovie, setOpenSettingMovie] = useState(false);
  const querySearch = useSelector(
    (state) => state.movieQuery?.[queryTypeDispatch]
  );

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
    queryKey: [keyQuery, changeFilters, querySearch],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => functionCall(pageParam, querySearch),
  });

  const debounceFetchNextPage = _.debounce(() => {
    fetchNextPage();
  }, 200);

  const fetchNextPageCallback = useCallback(debounceFetchNextPage, [
    fetchNextPage,
  ]);

  useEffect(() => {
    if (movieID && type) {
      openDialogMovieDetail(movieID, type);
      navigate(redirectPages, { replace: true });
    }
  }, []);

  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      const { clientHeight, scrollHeight } = scrollContainerRef.current;
      const isScrollable = scrollHeight > clientHeight;

      if (!isScrollable && hasNextPage && !status === "loading") {
        fetchNextPageCallback();
      }
    }
  }, [scrollContainerRef.current, hasNextPage, fetchNextPageCallback]);

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
    openDialogMovieDetail(movieID, typeSearch);
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
          ref={scrollContainerRef}
          style={{ overflow: "hidden" }}
          dataLength={movies?.results?.length || 0}
          next={() => debounceFetchNextPage()}
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
            isDesktop={isDesktop}
            mediaType={typeSearch}
          />
        </InfiniteScroll>
      </Box>
      <DialogSettingMovies
        open={openSettingMovie}
        setOpen={setOpenSettingMovie}
        changeFilters={changeFilters}
        setChangeFilters={setChangeFilters}
        movieQueryType={typeSearch}
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
