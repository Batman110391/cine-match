import { Card, Typography } from "@mui/material";
import React from "react";

export default function MovieCard({ title, bg, selected }) {
  return (
    <Card
      elevation={3}
      sx={{
        backgroundImage: `url(http://image.tmdb.org/t/p/w500${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "200px",
        width: "133px",
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
    </Card>
  );
}
