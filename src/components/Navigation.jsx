import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import React from "react";
import NavigationDesktop from "./NavigationDesktop";
import NavigationMobile from "./NavigationMobile";

import LiveTvIcon from "@mui/icons-material/LiveTv";
import MovieIcon from "@mui/icons-material/Movie";
import SearchIcon from "@mui/icons-material/Search";
import Letterboxd from "./icons/Letterboxd";
import NewspaperIcon from "@mui/icons-material/Newspaper";

export const ICON_ROUTE = [
  {
    name: "Scopri",
    icon: <SearchIcon />,
    path: "/home",
  },
  {
    name: "Film",
    icon: <MovieIcon />,
    path: "/movies",
  },
  {
    name: "Serie TV",
    icon: <LiveTvIcon />,
    path: "/showtv",
  },
  // {
  //   name: "News",
  //   icon: <NewspaperIcon />,
  //   path: "/newsmovie",
  // },
  // {
  //   name: "Consigliati",
  //   icon: <Letterboxd noMargin />,
  //   path: "/letterboxdraccomendations",
  // },
];

export default function Navigation({ children }) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.up("sm"));

  if (isMobile) {
    return <NavigationDesktop>{children}</NavigationDesktop>;
  } else {
    return <NavigationMobile>{children}</NavigationMobile>;
  }
}
