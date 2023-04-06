import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";
import React from "react";
import ChartCompatibilityMobile from "./ChartCompatibilityMobile";
import TypographyAnimated from "./TypographyAnimated";

export default function MovieCardMobile({ title, bg, currentMovie }) {
  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
        background: "transparent",
        border: "1px solid #ffffff70",
      }}
    >
      <CardMedia
        sx={{
          height: "68%",
          width: "100%",
          borderBottom: "1px solid #ffffff70",
        }}
        image={`http://image.tmdb.org/t/p/w500${bg}`}
        title={title}
      />
      <CardContent
        sx={{
          height: "32%",
          width: "100%",
          background: "transparent",
        }}
      >
        <TypographyAnimated
          component={"div"}
          sx={{ mb: 1, fontSize: "1.2rem" }}
          variant={"h6"}
          animate={"visible"}
          text={
            title + " (" + currentMovie?.release_date?.substring(0, 4) + ")"
          }
        />
        <ChartCompatibilityMobile movie={currentMovie} />
      </CardContent>
    </Card>
  );
}
