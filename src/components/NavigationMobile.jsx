import ArchiveIcon from "@mui/icons-material/Archive";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RestoreIcon from "@mui/icons-material/Restore";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";
import { ICON_ROUTE } from "./Navigation";
import { Link } from "react-router-dom";

const BottomNavigationHeight = 70;

function HideOnScroll({ children }) {
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    // target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function NavigationMobile({ children }) {
  const dispatch = useDispatch();

  const currentRoute = useSelector((state) => state.movieQuery.currentRoute);

  const handleClick = (i) => {
    dispatch(setQuery({ currentRoute: i }));
  };

  return (
    <Box>
      <CssBaseline />
      {children}
      <HideOnScroll>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.default",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            zIndex: 1,
          }}
          elevation={3}
        >
          <BottomNavigation
            sx={{
              bgcolor: "background.default",
              height: `${BottomNavigationHeight}px`,
            }}
            showLabels
            value={currentRoute}
            onChange={(event, newValue) => {
              handleClick(newValue);
            }}
          >
            {ICON_ROUTE.map((iconRoute) => (
              <BottomNavigationAction
                key={iconRoute.name}
                LinkComponent={Link}
                to={iconRoute.path}
                label={iconRoute.name}
                icon={iconRoute.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </HideOnScroll>
    </Box>
  );
}
