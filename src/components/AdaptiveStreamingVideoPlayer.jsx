import { useTheme } from "@emotion/react";
import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

export default function AdaptiveStreamingVideoPlayer() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const src = queryParams.get("src");
  const bg = queryParams.get("bg");

  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const options = bg
    ? {
        poster: "http://image.tmdb.org/t/p/original" + bg,
      }
    : {};

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <video
        style={{
          width: "100%",
          height: "100%",
        }}
        preload={"auto"}
        src={src}
        controls
        {...options}
      />
    </Box>
  );
}
