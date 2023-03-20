import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputBase,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { memo, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCasts } from "../api/tmdbApis";
import CastsCard from "../components/CastsCard";
import AnimatedTitle from "../components/AnimatedTitle";
import FloatingActionButton from "../components/FloatingActionButton";
import LoadingPage from "../components/LoadingPage";
import { setQuery } from "../store/movieQuery";
import { areEqual } from "../utils/areEqual";

export default function SearchCast() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const prevSelectedItems = useSelector((state) => state.movieQuery.cast);
  const [selectedItems, setSelectedItems] = useState(prevSelectedItems);
  const [keywordSearchInput, setKeywordSearchInput] = useState("");
  const [queryKeyword, setQueryKeyword] = useState("");

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
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["cast", queryKeyword],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => fetchCasts(pageParam, queryKeyword),
  });

  if (status === "loading") return <LoadingPage />;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  const cast = data?.pages
    ?.flatMap((data) => data)
    .reduce((prev, curr) => {
      return {
        ...curr,
        results: prev?.results
          ? prev.results.concat(curr.results)
          : curr.results,
      };
    }, {});

  const handleNavigateNextStep = () => {
    dispatch(setQuery({ cast: selectedItems }));

    navigate("/movie-finder");
  };

  const handleSelectedItem = (id) => {
    const currSelection = cast?.results?.filter((item) => item.id === id);
    setSelectedItems([...selectedItems, ...currSelection]);
  };

  const handleDelete = (chipToDelete) => () => {
    const newSelectedItems = selectedItems.filter(
      (sItem) => sItem.id !== chipToDelete.id
    );

    setSelectedItems(newSelectedItems);
  };

  const handleChangeInput = (e) => {
    const keyword = e.target.value;

    setKeywordSearchInput(keyword);
  };

  const handleSearchByKeyword = () => {
    if (keywordSearchInput) {
      setQueryKeyword(keywordSearchInput);
    }
  };

  const handleRemoveQueryKeyword = () => {
    setKeywordSearchInput("");
    setQueryKeyword(null);
  };

  const visibleData = cast?.results?.filter(
    (item) => !selectedItems?.find((sItem) => sItem.id === item.id)
  );

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
      {Boolean(selectedItems.length) && (
        <Box
          component={motion.div}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          sx={{
            position: "fixed",
            zIndex: 1,
            height: "50px",
            width: "95%",
            background: (theme) => theme.palette.gradient.main,
            px: 2,
            borderRadius: 2,
            mt: 0.5,
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
          }}
        >
          <ScrollContainer
            horizontal={true}
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
              height: "100%",
            }}
          >
            <AnimatePresence mode={"popLayout"}>
              {selectedItems.map((sItem) => {
                const existPath = sItem?.profile_path ? (
                  <Avatar
                    alt={sItem.name}
                    src={`http://image.tmdb.org/t/p/w500${sItem.profile_path}`}
                  />
                ) : (
                  <Avatar>{sItem.name.charAt(0)}</Avatar>
                );

                return (
                  <Chip
                    key={sItem.id}
                    component={motion.div}
                    layout
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{
                      scale: 0.8,
                      opacity: 0,
                      duration: 0.5,
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring" }}
                    label={sItem.name}
                    avatar={existPath}
                    onDelete={handleDelete(sItem)}
                  />
                );
              })}
            </AnimatePresence>
          </ScrollContainer>
        </Box>
      )}
      <Box sx={{ textAlign: "center", pt: 9, pb: 3 }}>
        <AnimatedTitle text="Seleziona cast" />
      </Box>

      <Box
        component={"form"}
        onSubmit={handleSearchByKeyword}
        sx={{
          position: "relative",
          borderRadius: (theme) => theme.shape.borderRadius,
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
          },
          margin: "0  auto 15px auto",
          width: "85%",
        }}
      >
        <InputBase
          sx={{
            color: "inherit",
            width: "100%",
            "& .MuiInputBase-input": {
              padding: (theme) => theme.spacing(1, 1, 1, 0),
              // vertical padding + font size from searchIcon
              paddingLeft: (theme) => `calc(1em + ${theme.spacing(1)})`,
              transition: (theme) => theme.transitions.create("width"),
              width: "100%",
            },
          }}
          onChange={handleChangeInput}
          value={keywordSearchInput || ""}
          placeholder="Cerca per nome…"
          inputProps={{ "aria-label": "search" }}
          endAdornment={
            <Button
              sx={{ margin: "5px 10px", p: 0 }}
              variant="outlined"
              size="small"
              onClick={handleSearchByKeyword}
            >
              cerca
            </Button>
          }
        />
      </Box>
      {queryKeyword && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Chip
            label={queryKeyword}
            size="small"
            color="secondary"
            onDelete={handleRemoveQueryKeyword}
          />
        </Box>
      )}
      <Box sx={{ overflow: "hidden", pb: 5 }}>
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={visibleData.length || 0}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          }
        >
          <ItemRow
            itemData={visibleData}
            handleSelectedItem={handleSelectedItem}
          />
        </InfiniteScroll>
      </Box>
      <FloatingActionButton
        onClick={() => handleNavigateNextStep()}
        position={"right"}
        size={"large"}
        badgeContent={selectedItems.length}
      >
        <ArrowCircleRightOutlinedIcon fontSize="large" color="action" />
      </FloatingActionButton>
    </Box>
  );
}

const ItemRow = memo(RenderRow, areEqual);

function RenderRow({ itemData, handleSelectedItem }) {
  return (
    <Grid
      container
      spacing={{ xs: 1 }}
      columns={{ xs: 1, sm: 8, md: 12 }}
      sx={{ overflow: "hidden" }}
    >
      <AnimatePresence mode={"popLayout"}>
        {itemData.map((cast, i) => (
          <Grid
            component={motion.div}
            key={cast.id}
            xs={2}
            sm={4}
            md={4}
            lg={3}
            layout
            animate={{ scale: 1, opacity: 1 }}
            initial={{
              scale: 0.8,
              opacity: 0,
              duration: 0.1 * i,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring" }}
            sx={{
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleSelectedItem(cast.id)}
          >
            <CastsCard
              known_for_department={cast.known_for_department}
              name={cast.name}
              bg={`http://image.tmdb.org/t/p/w500${cast.profile_path}`}
            />
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  );
}
