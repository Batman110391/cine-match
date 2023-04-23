import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
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
import { setQuery } from "../store/movieQuery";
import { ICON_ROUTE } from "./Navigation";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

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
        <List>
          {ICON_ROUTE.map((routeIcon, index) => (
            <ListItem
              key={routeIcon.name}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              disablePadding
            >
              <Tooltip title={routeIcon.name}>
                <Box component={Link} to={routeIcon.path}>
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
                      {routeIcon.icon}
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
