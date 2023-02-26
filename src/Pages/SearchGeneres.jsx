import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import { use } from "react";
import { getMovieGenres } from "../api/tmdbApis";
import AnimatedTitle from "../components/AnimatedTitle";
import GenreCard from "../components/GenreCard";

export default function SearchGeneres() {
  const data = use(getMovieGenres());

  return (
    <>
      <Box sx={{ textAlign: "center", py: 5 }}>
        <AnimatedTitle text="Seleziona fino a 5 generi" />
      </Box>
      <Stack
        justifyContent={"center"}
        gap={3}
        alignItems={"center"}
        flexDirection={"row"}
        flexWrap={"wrap"}
      >
        {data?.genres?.map(({ id, name }, i) => (
          <GenreCard key={id} name={name} index={i} />
        ))}
      </Stack>
      <pre>{JSON.stringify(data, null, 2)}</pre>;
    </>
  );
}
