import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/material";
import { genresList } from "../api/tmdbApis";
import AnimatedTitle from "../components/AnimatedTitle";
import GenreCard from "../components/GenreCard";

export default function SearchGeneres() {
  const data = genresList;
  const [removedItems, setRemovedItems] = useState([]);

  const handleRemoveItem = (id) => {
    setRemovedItems([...removedItems, id]);
  };

  const visibleData = data.filter((item) => !removedItems.includes(item.id));

  return (
    <Box sx={{ py: 5 }}>
      <Box sx={{ textAlign: "center", pb: 5 }}>
        <AnimatedTitle text="Seleziona generi" />
      </Box>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={{ xs: 1 }} columns={{ xs: 1, sm: 8, md: 12 }}>
          <AnimatePresence mode={"popLayout"}>
            {visibleData?.map((genre, i) => {
              return (
                <Grid
                  component={motion.div}
                  key={genre.bg}
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
                  onClick={() => handleRemoveItem(genre.id)}
                >
                  <GenreCard name={genre.name} bg={genre.bg} />
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      </Box>
    </Box>
  );
}
