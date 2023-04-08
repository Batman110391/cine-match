import React from "react";
import { useQuery } from "react-query";
import { fetchGenres } from "../api/tmdbApis";
import LoadingPage from "./LoadingPage";
import ScrollContainer from "react-indiana-drag-scroll";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function ListGenresSetting({
  selectedItemsGenres,
  setSelectedItemsGenres,
}) {
  const { isLoading, error, data } = useQuery(["genres"], () => fetchGenres());

  if (isLoading) return <LoadingPage />;

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const handleSelectedGenres = (id) => {
    const currSelection = data.filter((item) => item.id === id);
    setSelectedItemsGenres([...selectedItemsGenres, ...currSelection]);
  };

  const handleDeleteGenres = (id) => {
    const newSelectedItems = selectedItemsGenres.filter(
      (sItem) => sItem.id !== id
    );

    setSelectedItemsGenres(newSelectedItems);
  };

  const handleToggleSelectedGeneres = (id) => {
    const exist = selectedItemsGenres.find((s) => s.id === id);

    if (exist) {
      handleDeleteGenres(id);
    } else {
      handleSelectedGenres(id);
    }
  };

  const visibleData = data;

  return (
    <Grid
      container
      spacing={0.5}
      sx={{ height: { xs: "265px", lg: "100%" }, overflow: "auto" }}
    >
      {visibleData.map((genre) => {
        const selected = selectedItemsGenres.find((s) => s.id === genre.id);

        return (
          <Grid
            xs={4}
            sm={3}
            md={2}
            lg={2}
            key={genre.id}
            //onClick={() => handleSelectedItem(genre.id)}
          >
            <Button
              onClick={() => handleToggleSelectedGeneres(genre.id)}
              color="inherit"
              sx={{
                position: "relative",
                backgroundImage: selected
                  ? `linear-gradient(-180deg, rgba(206, 147, 216, 0.8), rgba(206, 147, 216, 0.8)), url(${genre.bg})`
                  : `linear-gradient(-180deg, rgba(34,34,34,0.8), rgba(32,32,32,0.8)), url(${genre.bg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                objectFit: "cover",
                width: "100%",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  userSelect: "none",
                  letterSpacing: ".1em",
                  textShadow: `-1px -1px 1px #1111116b,
          2px 2px 1px #36363691`,
                }}
                variant="button"
                fontWeight="bold"
                fontSize="0.7rem"
              >
                {genre.name}
              </Typography>
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}
