import { Box } from "@mui/material";
import React from "react";

export default function SimpleGridFlexBox({
  spacingH = 0,
  spacingW = 1,
  w = 100,
  sx,
  children,
}) {
  const currentSpacingH = spacingH * 8;
  const currentSpacingW = spacingW * 8;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${
          w + currentSpacingW
        }px, 1fr))`,
        rowGap: currentSpacingH,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
