import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";
import { IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { routes } from "../routes";

const drawerWidth = 70;

export default function NavigationDesktop({ auth, children }) {
  const { user, login, logout, authReady } = auth;

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

          <Box flexGrow={1} />
          {authReady && (
            <ListItem
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              disablePadding
            >
              <Tooltip title={user ? "Esci" : "Accedi"}>
                <ListItemButton
                  onClick={user ? logout : login}
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
                    {user ? <LogoutIcon /> : <LoginIcon />}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )}
        </List>
      </Drawer>
      <Box sx={{ width: `calc(100% - ${drawerWidth}px)` }}>{children}</Box>
    </Box>
  );
}
