import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import React from "react";
import NavigationDesktop from "./NavigationDesktop";
import NavigationMobile from "./NavigationMobile";
import AuthContext from "../context/authentication";

export default function Navigation({ children }) {
  const theme = useTheme();
  const auth = React.useContext(AuthContext);

  console.log("user", auth?.user);

  const isMobile = useMediaQuery(theme.breakpoints.up("sm"));

  if (isMobile) {
    return <NavigationDesktop auth={auth}>{children}</NavigationDesktop>;
  } else {
    return <NavigationMobile auth={auth}>{children}</NavigationMobile>;
  }
}
