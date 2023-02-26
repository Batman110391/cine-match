import React from "react";
import { motion } from "framer-motion";
import randomColor from "randomcolor";
import { Box, Typography } from "@mui/material";

export default function GenreCard({ name, index }) {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.1 * index } };
  const color = randomColor();

  return (
    <Box
      component={motion.div}
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        background: (theme) => theme.palette.gradient.main,
        borderRadius: "5px",
        width: "275px",
        height: "70px",
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <Typography sx={{ userSelect: "none" }} variant="body1">
        {name}
      </Typography>
    </Box>
  );
}
