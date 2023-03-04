import React from "react";
import { Link } from "react-router-dom";
import { Typography, Fab, Badge } from "@mui/material";

//size :
// -small
// -medium
// -large

//position: (bottom in element with position relative)
// -center
// -left
// -right

//href:
//- '/{pages}'
// or
//onClick:
//- function()

/*
Example usage:
<FloatingActionButton
  text={'Continua'}
  path={'/movie-finder-actors'}
  position={'right'}
  size={'small'}
>
  {icon}
</FloatingActionButton>
*/

export default function FloatingActionButton({
  children,
  badgeContent,
  size,
  position,
  onClick,
  path,
  bottom,
}) {
  const Component = path ? Link : "button";

  const fabProps = {
    to: path || undefined,
    onClick: onClick || undefined,
  };

  return (
    <Fab
      component={Component}
      sx={{
        background: (theme) => theme.palette.gradient.extraLight,
        position: "fixed",
        bottom: bottom || 16,
        right: position === "right" ? 20 : "unset",
        left:
          position === "left" ? 20 : position === "center" ? "50%" : "unset",
        transform: position === "center" ? "translateX(-50%)" : "unset",
      }}
      variant="extended"
      size={size || "medium"}
      color={"primary"}
      {...fabProps}
    >
      <Badge
        badgeContent={badgeContent}
        color="secondary"
        overlap="circular"
        sx={{ position: "absolute", top: 4, left: 4 }}
      />
      {children}
    </Fab>
  );
}
