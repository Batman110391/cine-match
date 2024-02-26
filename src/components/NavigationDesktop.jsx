import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import { setQuery } from "../store/movieQuery";

const drawerWidth = 70;

export default function NavigationDesktop({ children }) {
  const dispatch = useDispatch();

  const currentRoute = useSelector((state) => state.movieQuery.currentRoute);

  const handleClick = (i) => {
    dispatch(setQuery({ currentRoute: i }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            bgcolor: "background.default",
            overflow: "hidden",
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {routes
            .filter((route) => !route.hidden)
            .map((route, index) => (
              <ListItem
                key={route.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disablePadding
              >
                <Tooltip title={route.name}>
                  <Box component={Link} to={route.route}>
                    <ListItemButton
                      selected={index === currentRoute}
                      onClick={() => handleClick(index)}
                      sx={{
                        py: 3,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {route.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </Box>
                </Tooltip>
              </ListItem>
            ))}
        </List>
      </Drawer>
      <Box sx={{ width: `calc(100% - ${drawerWidth}px)` }}>{children}</Box>
    </Box>
  );
}
