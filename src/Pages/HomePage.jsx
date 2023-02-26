import { Box, Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import AnimatedTitle from "../components/AnimatedTitle";
import ButtonAnimated from "../components/ButtonAnimated";
import TypographyAnimated from "../components/TypographyAnimated";

export default function HomePage() {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };

  return (
    <Stack flexDirection={"column"}>
      <AnimatedTitle text={"Animated text"} />
      <TypographyAnimated
        component={"span"}
        variant={"h5"}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible,
        }}
        gutterBottom
        text="CineMatch ti suggerisce i film più adatti ai tuoi gusti cinematografici.
        Filtra per attore, regista, genere e altro ancora per trovare il film
        perfetto per la tua giornata."
      />
      <TypographyAnimated
        component={"span"}
        variant={"subtitle1"}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible,
        }}
        gutterBottom
        text="Che film guarderai oggi ?"
      />
      <ButtonAnimated
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible,
        }}
        LinkComponent={Link}
        to={"/movie-finder-generes"}
        variant="contained"
        title="Scoprilo"
      />
    </Stack>
  );
}
