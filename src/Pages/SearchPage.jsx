import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import SearchPageDialog from "../components/SearchPageDialog";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "react-query";
import { fetchMoviesDiscover } from "../api/tmdbApis";
import CarouselDiscover from "../components/CarouselDiscover";

export default function SearchPage() {
  const [openSearchMovie, setOpenSearchMovie] = useState(false);

  const { isLoading, error, data } = useQuery(["discoverPage"], () =>
    fetchMoviesDiscover()
  );

  const popularMovies = data?.trending_movie?.results || [];

  const popularTv = data?.trending_tv?.results || [];

  const incomingMovie = data?.incoming_movie?.results || [];

  return (
    <Box sx={{ p: 2 }}>
      <Box>
        <Button
          sx={{
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            width: "100%",
            maxWidth: "500px",
            mx: "auto",
            mt: { xs: 0, sm: 1 },
            bgcolor: "background.paper",
            borderRadius: { xs: 0, sm: 2 },
          }}
          onClick={() => setOpenSearchMovie(true)}
        >
          <Stack flexDirection={"row"} gap={2}>
            <SearchIcon />
            <Typography variant="button">Cerca</Typography>
          </Stack>
        </Button>
        <SearchPageDialog open={openSearchMovie} setOpen={setOpenSearchMovie} />
      </Box>
      <Box sx={{ width: "100%" }}>
        <CarouselDiscover
          slides={popularMovies}
          titleDiscover={"Film di tendenza"}
        />
        <CarouselDiscover
          slides={popularTv}
          titleDiscover={"Serie TV di tendenza"}
        />
        <CarouselDiscover
          slides={incomingMovie}
          titleDiscover={"Film in arrivo"}
        />
      </Box>
    </Box>
  );
}
