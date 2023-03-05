import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Avatar, Box, Chip } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchActors } from "../api/tmdbApis";
import ActorsCard from "../components/ActorsCard";
import AnimatedTitle from "../components/AnimatedTitle";
import FloatingActionButton from "../components/FloatingActionButton";

const MIN_RESULT = 10;

export default function SearchActors() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const prevSelectedItems = useSelector((state) => state.movieQuery.actors);
  const [selectedItems, setSelectedItems] = useState(prevSelectedItems);

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
    queryKey: ["actors", "infinite"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => fetchActors(pageParam),
  });

  if (status === "loading") return <h1>Loading...</h1>;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  const actors = data?.pages
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
    dispatch(setQuery({ genres: selectedItems }));

    navigate("/movie-finder-actors");
  };

  const handleSelectedItem = (id) => {
    const currSelection = actors?.results?.filter((item) => item.id === id);
    setSelectedItems([...selectedItems, ...currSelection]);
  };

  const handleDelete = (chipToDelete) => () => {
    const newSelectedItems = selectedItems.filter(
      (sItem) => sItem.id !== chipToDelete.id
    );

    setSelectedItems(newSelectedItems);
  };

  const visibleData = actors?.results?.filter(
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
        <AnimatedTitle text="Seleziona attori" />
      </Box>
      <Box sx={{ overflow: "hidden", pb: 5 }}>
        <Grid container spacing={{ xs: 1 }} columns={{ xs: 1, sm: 8, md: 12 }}>
          <AnimatePresence mode={"popLayout"}>
            {visibleData?.map((actor, i) => {
              return (
                <Grid
                  component={motion.div}
                  key={actor.id}
                  xs={2}
                  sm={4}
                  md={4}
                  lg={3}
                  layout
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
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
                  onClick={() => handleSelectedItem(actor.id)}
                >
                  <ActorsCard
                    name={actor.name}
                    bg={`http://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  />
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
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
