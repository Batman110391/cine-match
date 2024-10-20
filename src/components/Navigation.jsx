import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import React from "react";
import NavigationDesktop from "./NavigationDesktop";
import NavigationMobile from "./NavigationMobile";

export default function Navigation({ children }) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.up("md"));

  if (isMobile) {
    return <NavigationDesktop>{children}</NavigationDesktop>;
  } else {
    return <NavigationMobile>{children}</NavigationMobile>;
  }
}
