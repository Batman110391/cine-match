import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import { setQuery } from "../store/movieQuery";

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
            {routes
              .filter((route) => !route.hidden)
              .map((route) => (
                <BottomNavigationAction
                  key={route.name}
                  LinkComponent={Link}
                  to={route.route}
                  label={route.name}
                  icon={route.icon}
                />
              ))}
          </BottomNavigation>
        </Paper>
      </HideOnScroll>
    </Box>
  );
}
