import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Avatar, Box, Chip } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGenres } from "../api/tmdbApis";
import AnimatedTitle from "../components/AnimatedTitle";
import FloatingActionButton from "../components/FloatingActionButton";
import GenreCard from "../components/GenreCard";
import LoadingPage from "../components/LoadingPage";
import { setQuery } from "../store/movieQuery";

export default function SearchGeneres() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const prevSelectedItems = useSelector((state) => state.movieQuery.genres);

  const [selectedItems, setSelectedItems] = useState(prevSelectedItems);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { isLoading, error, data } = useQuery(["genres"], () => fetchGenres());

  if (isLoading) return <LoadingPage />;

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const handleNavigateNextStep = () => {
    dispatch(setQuery({ genres: selectedItems }));

    navigate("/movie-finder-cast");
  };

  const handleSelectedItem = (id) => {
    const currSelection = data.filter((item) => item.id === id);
    setSelectedItems([...selectedItems, ...currSelection]);
  };

  const handleDelete = (chipToDelete) => () => {
    const newSelectedItems = selectedItems.filter(
      (sItem) => sItem.id !== chipToDelete.id
    );

    setSelectedItems(newSelectedItems);
  };

  const visibleData = data.filter(
    (item) => !selectedItems.find((sItem) => sItem.id === item.id)
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
              {selectedItems.map((sItem) => (
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
                  avatar={<Avatar>{sItem.name.charAt(0)}</Avatar>}
                  onDelete={handleDelete(sItem)}
                />
              ))}
            </AnimatePresence>
          </ScrollContainer>
        </Box>
      )}
      <Box sx={{ textAlign: "center", pt: 9, pb: 3 }}>
        <AnimatedTitle text="Seleziona generi" />
      </Box>
      <Box sx={{ overflow: "hidden", pb: 5 }}>
        <Grid container spacing={{ xs: 1 }} columns={{ xs: 1, sm: 8, md: 12 }}>
          <AnimatePresence mode={"popLayout"}>
            {visibleData?.map((genre, i) => {
              return (
                <Grid
                  component={motion.div}
                  key={genre.id}
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
                  onClick={() => handleSelectedItem(genre.id)}
                >
                  <GenreCard name={genre.name} bg={genre.bg} />
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
