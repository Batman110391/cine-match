import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import NotificationsTwoToneIcon from "@mui/icons-material/NotificationsTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import WatchLaterTwoToneIcon from "@mui/icons-material/WatchLaterTwoTone";
import { Box, CircularProgress, IconButton } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemInProfile, removeItemInProfile } from "../api/tmdbApis";
import { addItem, removeItem } from "../store/profileQuery";

export default function UserController({ detail, userID, type }) {
  const dispatch = useDispatch();

  const profileState = useSelector((state) => state.profileQuery) || {};

  const [state, setState] = React.useState({
    watchlist: {
      results: [],
      loading: true,
      active: false,
    },
    seen: {
      results: [],
      loading: true,
      active: false,
    },
    favorite: {
      results: [],
      loading: true,
      active: false,
    },
    notifications: {
      results: [],
      loading: true,
      active: false,
    },
  });

  React.useEffect(() => {
    if (profileState && profileState[type]) {
      setState({
        watchlist: {
          results: profileState[type]["watchlist"],
          loading: false,
          active: profileState[type]["watchlist"].some(
            (res) => res.id === detail?.id
          ),
        },
        seen: {
          results: profileState[type]["seen"],
          loading: false,
          active: profileState[type]["seen"].some(
            (res) => res.id === detail?.id
          ),
        },
        favorite: {
          results: profileState[type]["favorite"],
          loading: false,
          active: profileState[type]["favorite"].some(
            (res) => res.id === detail?.id
          ),
        },
        notifications: {
          results: profileState[type]["notifications"],
          loading: false,
          active: profileState[type]["notifications"].some(
            (res) => res.id === detail?.id
          ),
        },
      });
    }
  }, [userID]);

  const handleToggleItemProfile = async (field) => {
    if (state[field].active) {
      setState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: true,
        },
      }));

      await removeItemInProfile(type, field, userID, detail?.id, (error) => {
        if (!error) {
          setState((prev) => ({
            ...prev,
            [field]: {
              results: prev[field].results.filter((res) => res !== detail?.id),
              active: !prev[field].active,
              loading: false,
            },
          }));

          dispatch(removeItem({ itemID: detail?.id, field, type }));
        }

        setState((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            loading: false,
          },
        }));
      });
    } else {
      setState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: true,
        },
      }));

      await addItemInProfile(
        type,
        field,
        userID,
        {
          poster_path: detail?.poster_path,
          id: detail?.id,
          title: detail?.title || detail?.name,
          vote_average: detail?.vote_average,
        },
        async (error) => {
          if (!error) {
            if (field === "watchlist" && state.seen.active) {
              await removeItemInProfile(
                type,
                "seen",
                userID,
                detail?.id,
                (error) => {
                  if (!error) {
                    setState((prev) => ({
                      ...prev,
                      seen: {
                        results: prev.seen.results.filter(
                          (res) => res !== detail?.id
                        ),
                        active: !prev.seen.active,
                        loading: false,
                      },
                      [field]: {
                        results: prev[field].results.concat(detail?.id),
                        active: !prev[field].active,
                        loading: false,
                      },
                    }));

                    dispatch(
                      removeItem({ itemID: detail?.id, field: "seen", type })
                    );
                  }
                }
              );
            } else if (field === "seen" && state.watchlist.active) {
              await removeItemInProfile(
                type,
                "watchlist",
                userID,
                detail?.id,
                (error) => {
                  if (!error) {
                    setState((prev) => ({
                      ...prev,
                      watchlist: {
                        results: prev.watchlist.results.filter(
                          (res) => res !== detail?.id
                        ),
                        active: !prev.watchlist.active,
                        loading: false,
                      },
                      [field]: {
                        results: prev[field].results.concat(detail?.id),
                        active: !prev[field].active,
                        loading: false,
                      },
                    }));

                    dispatch(
                      removeItem({
                        itemID: detail?.id,
                        field: "watchlist",
                        type,
                      })
                    );
                  }
                }
              );
            } else {
              setState((prev) => ({
                ...prev,
                [field]: {
                  results: prev[field].results.concat(detail?.id),
                  active: !prev[field].active,
                  loading: false,
                },
              }));
            }

            dispatch(
              addItem({
                field,
                value: {
                  poster_path: detail?.poster_path,
                  id: detail?.id,
                  title: detail?.title || detail?.name,
                  vote_average: detail?.vote_average,
                },
                type,
              })
            );
          }

          setState((prev) => ({
            ...prev,
            [field]: {
              ...prev[field],
              loading: false,
            },
          }));
        }
      );
      setState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: false,
        },
      }));
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {profileState && (
        <>
          {state["watchlist"].loading ? (
            <IconButton>
              <CircularProgress size={24} />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleToggleItemProfile("watchlist")}>
              <WatchLaterTwoToneIcon
                color={state["watchlist"].active ? "success" : "inherit"}
              />
            </IconButton>
          )}
          {state["seen"].loading ? (
            <IconButton>
              <CircularProgress size={24} />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleToggleItemProfile("seen")}>
              <VisibilityTwoToneIcon
                color={state["seen"].active ? "success" : "inherit"}
              />
            </IconButton>
          )}
          {state["favorite"].loading ? (
            <IconButton>
              <CircularProgress size={24} />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleToggleItemProfile("favorite")}>
              <FavoriteTwoToneIcon
                color={state["favorite"].active ? "success" : "inherit"}
              />
            </IconButton>
          )}
          {state["notifications"].loading ? (
            <IconButton>
              <CircularProgress size={24} />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleToggleItemProfile("notifications")}
            >
              <NotificationsTwoToneIcon
                color={state["notifications"].active ? "success" : "inherit"}
              />
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
}
