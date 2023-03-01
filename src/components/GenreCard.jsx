import React from "react";
import { Card, Typography, darken, lighten } from "@mui/material";

export default function GenreCard({ name, bg }) {
  return (
    <Card
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
        sx={{ userSelect: "none" }}
        variant="button"
        fontWeight="bold"
        fontSize="1.5rem"
      >
        {name}
      </Typography>
    </Card>
  );
}
