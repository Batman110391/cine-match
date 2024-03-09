import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import WatchLaterTwoToneIcon from "@mui/icons-material/WatchLaterTwoTone";
import { Box, IconButton } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateItem } from "../store/profileQuery";

export default function UserController({ detail, userID, type }) {
  const dispatch = useDispatch();

  const profileState = useSelector((state) => state.profileQuery) || {};

  const currentSession = React.useMemo(() => {
    return profileState[type]?.[detail?.id] || null;
  }, [profileState]);

  const existAtLeastOneAttribute = React.useCallback(
    (newCurrentSession) => {
      return Boolean(
        newCurrentSession?.complete ||
          newCurrentSession?.favorite ||
          newCurrentSession?.notification ||
          (newCurrentSession?.seasons_seen &&
            Object.values(newCurrentSession.seasons_seen).some(
              (seas) => seas.episodes_seen.length > 0
            ))
      );
    },
    [profileState]
  );

  const handleToggleItemProfile = (field) => {
    switch (field) {
      case "watchlist": {
        if (!currentSession) {
          const newValue = {
            poster_path: detail?.poster_path,
            title: detail?.title || detail?.name,
            id: detail.id,
            vote_average: detail?.vote_average,
            watchlist: true,
            favorite: false,
            notification: false,
            complete: false,
          };

          return dispatch(
            addItem({ type, itemID: detail.id, value: newValue })
          );
        } else {
          if (
            existAtLeastOneAttribute({
              ...currentSession,
              watchlist: !currentSession.watchlist,
            })
          ) {
            return dispatch(
              updateItem({
                itemID: detail.id,
                type,
                value: { watchlist: !currentSession.watchlist },
              })
            );
          } else {
            return dispatch(removeItem({ itemID: detail.id, type }));
          }
        }
      }

      case "seen": {
        if (!currentSession) {
          const newValue = {
            poster_path: detail?.poster_path,
            title: detail?.title || detail?.name,
            id: detail.id,
            vote_average: detail?.vote_average,
            watchlist: false,
            favorite: false,
            notification: false,
            complete: true,
          };

          return dispatch(
            addItem({ type, itemID: detail.id, value: newValue })
          );
        } else {
          if (
            existAtLeastOneAttribute({
              ...currentSession,
              complete: !currentSession.complete,
            })
          ) {
            return dispatch(
              updateItem({
                itemID: detail.id,
                type,
                value: { complete: !currentSession.complete },
              })
            );
          } else {
            return dispatch(removeItem({ itemID: detail.id, type }));
          }
        }
      }

      case "notification": {
        if (!currentSession) {
          const newValue = {
            poster_path: detail?.poster_path,
            title: detail?.title || detail?.name,
            id: detail.id,
            vote_average: detail?.vote_average,
            watchlist: false,
            favorite: false,
            notification: true,
            complete: false,
          };

          return dispatch(
            addItem({ type, itemID: detail.id, value: newValue })
          );
        } else {
          if (
            existAtLeastOneAttribute({
              ...currentSession,
              notification: !currentSession.notification,
            })
          ) {
            return dispatch(
              updateItem({
                itemID: detail.id,
                type,
                value: { notification: !currentSession.notification },
              })
            );
          } else {
            return dispatch(removeItem({ itemID: detail.id, type }));
          }
        }
      }

      case "favorite": {
        if (!currentSession) {
          const newValue = {
            poster_path: detail?.poster_path,
            title: detail?.title || detail?.name,
            id: detail.id,
            vote_average: detail?.vote_average,
            watchlist: false,
            favorite: true,
            notification: false,
            complete: false,
          };

          return dispatch(
            addItem({ type, itemID: detail.id, value: newValue })
          );
        } else {
          if (
            existAtLeastOneAttribute({
              ...currentSession,
              favorite: !currentSession.favorite,
            })
          ) {
            return dispatch(
              updateItem({
                itemID: detail.id,
                type,
                value: { favorite: !currentSession.favorite },
              })
            );
          } else {
            return dispatch(removeItem({ itemID: detail.id, type }));
          }
        }
      }

      default: {
        return null;
      }
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
      <IconButton onClick={() => handleToggleItemProfile("seen")}>
        <VisibilityTwoToneIcon
          color={currentSession?.complete ? "success" : "inherit"}
        />
      </IconButton>

      <IconButton onClick={() => handleToggleItemProfile("watchlist")}>
        <WatchLaterTwoToneIcon
          color={currentSession?.watchlist ? "success" : "inherit"}
        />
      </IconButton>

      <IconButton onClick={() => handleToggleItemProfile("favorite")}>
        <FavoriteTwoToneIcon
          color={currentSession?.favorite ? "success" : "inherit"}
        />
      </IconButton>
      {/* <IconButton onClick={() => handleToggleItemProfile("notification")}>
        <NotificationsTwoToneIcon
          color={
            currentSession && currentSession?.notification
              ? "success"
              : "inherit"
          }
        />
      </IconButton> */}
    </Box>
  );
}
