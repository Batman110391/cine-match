import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  InputBase,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion, useScroll, useSpring } from "framer-motion";
import _ from "lodash";
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
import { useNavigate, useParams } from "react-router-dom";
import { fetchNewsMovie } from "../api/tmdbApis";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import LoadingPage from "../components/LoadingPage";
import RenderRow from "../components/RenderRow";
import { areEqual } from "../utils/areEqual";
import { alpha, styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "../utils/useDebounce";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.07),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },

  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingRight: theme.spacing(1),
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,

    transition: theme.transitions.create("width"),
    width: "100%",
    // [theme.breakpoints.up("md")]: {
    //   width: "20ch",
    // },
  },
}));

export default function NewsMovie() {
  const { openDialogNewsDetail } = useContext(DialogMovieDetailContext);

  const theme = useTheme();
  const navigate = useNavigate();
  const { newsID } = useParams();

  const scrollContainerRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const {
    status,
    error,
    data,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["news", debouncedSearchTerm],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      fetchNewsMovie(pageParam, debouncedSearchTerm),
  });

  const debounceFetchNextPage = _.debounce(() => {
    fetchNextPage();
  }, 200);

  const fetchNextPageCallback = useCallback(debounceFetchNextPage, [
    fetchNextPage,
  ]);

  useEffect(() => {
    if (newsID) {
      setOpenDialogNews(newsID);
      navigate("/newsmovie", { replace: true });
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

  const news = data?.pages
    ?.flatMap((data) => data)
    .reduce((prev, curr) => {
      return {
        ...curr,
        results: prev?.results
          ? prev.results.concat(curr.results)
          : curr.results,
      };
    }, {});

  const handleClickItem = (newsID) => {
    openDialogNewsDetail(newsID);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearchInput = () => {
    setSearchInput("");
  };

  return (
    <>
      <Box sx={{ width: "90%", margin: "auto", py: 3 }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Cerca recensioni, approfondimenti..."
            value={searchInput}
            onChange={handleSearchInputChange}
            endAdornment={
              searchInput && (
                <InputAdornment position="end">
                  <Chip
                    sx={{
                      borderRadius: "0",
                    }}
                    size="small"
                    label={
                      <Typography
                        sx={{
                          padding: 0,
                          margin: 0,
                        }}
                        fontSize={"0.6rem"}
                        variant="button"
                      >
                        {"azzera"}
                      </Typography>
                    }
                    color="secondary"
                    onClick={handleClearSearchInput}
                    variant="outlined"
                    clickable
                  />
                </InputAdornment>
              )
            }
          />
        </Search>
      </Box>
      <Divider />
      {status === "loading" ? (
        <LinearProgress />
      ) : news?.results?.length > 0 ? (
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
          <Box sx={{ overflow: "hidden", pb: 5 }}>
            <InfiniteScroll
              ref={scrollContainerRef}
              style={{ overflow: "hidden" }}
              dataLength={news?.results?.length || 0}
              next={() => debounceFetchNextPage()}
              hasMore={false}
              loader={
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              }
            >
              <ItemRow
                itemData={news?.results}
                typeView={"news"}
                handleClickItem={handleClickItem}
                isDesktop={isDesktop}
              />
            </InfiniteScroll>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            {`Nessun risultato trovato.`}
          </Typography>
        </Box>
      )}
    </>
  );
}

const ItemRow = memo(RenderRow, areEqual);
