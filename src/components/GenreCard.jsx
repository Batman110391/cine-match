import React from "react";
import { Card, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function GenreCard({ name, bg }) {
  return (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        position: "relative",
        backgroundImage: `linear-gradient(-180deg, rgba(54,54,54,0.2), rgba(32,32,32,0.6)), url(${bg})`,
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
        fontSize="1.5rem"
      >
        {name}
      </Typography>
    </Card>
  );
}
