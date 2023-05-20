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
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { fetchShowTvPage } from "../api/tmdbApis";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import DialogSettingTv from "../components/DialogSettingTv";
import FloatingActionButton from "../components/FloatingActionButton";
import LoadingPage from "../components/LoadingPage";
import RenderRow from "../components/RenderRow";
import { areEqual } from "../utils/areEqual";
import _ from "lodash";

export default function ShowTvPage() {
  const theme = useTheme();

  const { openDialogMovieDetail } = useContext(DialogMovieDetailContext);
  const scrollContainerRef = useRef(null);

  const [changeFilters, setChangeFilters] = useState(false);
  const [openSettingTv, setOpenSettingTv] = useState(false);
  const querySearchTv = useSelector((state) => state.movieQuery.querySearchTv);

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
    queryKey: ["showTvPage", changeFilters],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => fetchShowTvPage(pageParam, querySearchTv),
  });

  const debounceFetchNextPage = _.debounce(() => {
    fetchNextPage();
  }, 200);

  const fetchNextPageCallback = useCallback(debounceFetchNextPage, [
    fetchNextPage,
  ]);

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

  const tvShows = data?.pages
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
    openDialogMovieDetail(movieID, "tv");
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
          dataLength={tvShows?.results?.length || 0}
          next={() => debounceFetchNextPage()}
          hasMore={hasNextPage}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          }
        >
          <ItemRow
            itemData={tvShows?.results}
            typeView={viewGrid}
            handleClickItem={handleClickItem}
          />
        </InfiniteScroll>
      </Box>
      <DialogSettingTv
        open={openSettingTv}
        setOpen={setOpenSettingTv}
        changeFilters={changeFilters}
        setChangeFilters={setChangeFilters}
        //refetchPagination={refetch}
      />
      <FloatingActionButton
        onClick={() => setOpenSettingTv(true)}
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
