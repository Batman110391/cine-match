import { Box } from "@mui/material";
import React from "react";

export default function GridListImageVisualizations({ w, children }) {
  return (
    <Box
      sx={{
        marginTop: 2,
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${w}px, ${w + 5}px))`,
        gridRowGap: 10,
        gridColumnGap: 5,
      }}
    >
      {children}
    </Box>
  );
}
