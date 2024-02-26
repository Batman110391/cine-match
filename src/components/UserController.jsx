import { Box, CircularProgress, IconButton, Skeleton } from "@mui/material";
import React from "react";
import WatchLaterTwoToneIcon from "@mui/icons-material/WatchLaterTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import NotificationsTwoToneIcon from "@mui/icons-material/NotificationsTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import {
  addItemInProfile,
  fetchProfileDataChecking,
  removeItemInProfile,
} from "../api/tmdbApis";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setActionChange } from "../store/profileQuery";

export default function UserController({ detail, userID, type }) {
  const dispatch = useDispatch();

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

  const { isLoading, error } = useQuery({
    queryKey: ["profile-checking", userID],
    queryFn: () => fetchProfileDataChecking(userID, type),
    keepPreviousData: true,
    onSuccess: (data) => {
      if (data && data[type]) {
        setState({
          watchlist: {
            results: data[type]["watchlist"],
            loading: false,
            active: data[type]["watchlist"].some(
              (res) => res.id === detail?.id
            ),
          },
          seen: {
            results: data[type]["seen"],
            loading: false,
            active: data[type]["seen"].some((res) => res.id === detail?.id),
          },
          favorite: {
            results: data[type]["favorite"],
            loading: false,
            active: data[type]["favorite"].some((res) => res.id === detail?.id),
          },
          notifications: {
            results: data[type]["notifications"],
            loading: false,
            active: data[type]["notifications"].some(
              (res) => res.id === detail?.id
            ),
          },
        });
      }
    },
  });

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

          dispatch(setActionChange());
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
        (error) => {
          if (!error) {
            setState((prev) => ({
              ...prev,
              [field]: {
                results: prev[field].results.concat(detail?.id),
                active: !prev[field].active,
                loading: false,
              },
            }));

            dispatch(setActionChange());
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
      {!error && (
        <>
          {state["watchlist"].loading || isLoading ? (
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
          {state["seen"].loading || isLoading ? (
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
          {state["favorite"].loading || isLoading ? (
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
          {state["notifications"].loading || isLoading ? (
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
