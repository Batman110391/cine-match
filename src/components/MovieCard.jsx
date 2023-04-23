import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { CircularProgressWithLabel } from "./ChartCompatibility";

export default function MovieCard({ title, bg, selected, w, h, badgeRating }) {
  const percentRating = badgeRating && (badgeRating.toFixed(1) * 100) / 10;

  return (
    <Card
      elevation={3}
      sx={{
        position: "relative",
        backgroundImage: `url(http://image.tmdb.org/t/p/w500${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: h ? `${h}px` : "200px",
        width: w ? `${w}px` : "133px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ffffff70",
        transform: selected ? "scale(1.3)" : "scale(1)",
        transition: "all 0.3s ease-out",
      }}
    >
      {!bg && (
        <Typography
          sx={{
            mb: 1,
            textAlign: "center",
            userSelect: "none",
            textShadow: `-1px -1px 1px #1111116b,
          2px 2px 1px #36363691`,
          }}
          variant="button"
          fontWeight="bold"
          fontSize="0.7rem"
        >
          {title}
        </Typography>
      )}
      {percentRating && (
        <Box sx={{ position: "absolute", top: 2, left: 0 }}>
          <CircularProgressWithLabel
            to={percentRating}
            size={35}
            labelSize={11}
            durationAnimate={0}
          />
        </Box>
      )}
    </Card>
  );
}
