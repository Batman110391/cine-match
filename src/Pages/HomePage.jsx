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
    <Stack
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      sx={{ p: 1.5, height: "100%" }}
    >
      <AnimatedTitle text={"Cine Match"} sx={{ py: 2 }} />
      <TypographyAnimated
        component={"span"}
        sx={{ maxWidth: "500px", textAlign: "center", py: 2 }}
        variant={"h6"}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible,
        }}
        gutterBottom
        text="I film più adatti ai tuoi gusti cinematografici.
        Filtra per attore, regista, genere e altro ancora per trovare il film
        perfetto per la tua giornata."
      />
      <TypographyAnimated
        component={"span"}
        sx={{ pt: 10 }}
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
        sx={{ background: (theme) => theme.palette.gradient.extraLight }}
        LinkComponent={Link}
        to={"/movie-finder-generes"}
        color={"action"}
        variant="contained"
        title="Scoprilo"
      />
    </Stack>
  );
}
