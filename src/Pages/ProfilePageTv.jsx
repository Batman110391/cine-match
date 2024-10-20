import React from "react";
import { HEIGHT_NAVIGATION_MOBILE } from "../utils/constant";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";
import { VirtuosoGrid } from "react-virtuoso";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import { SectionMovie } from "./ProfilePageMovie";

export default function ProfilePageTv() {
  const theme = useTheme();
  const { openDialogMovieDetail } = React.useContext(DialogMovieDetailContext);

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const data = useSelector((state) => state.profileQuery) || {};

  const { tv, loading: isLoading } = data;

  const handleClickItem = (movieID) => {
    openDialogMovieDetail(movieID, "tv");
  };

  const allLists = React.useMemo(() => {
    if (tv) {
      return Object.values(tv);
    }

    return [];
  }, [tv]);

  const watchlist = React.useMemo(() => {
    return allLists?.filter(
      (tv) =>
        tv?.watchlist &&
        !(tv?.seasons_seen && Object.values(tv?.seasons_seen).length > 0)
    );
  }, [allLists]);

  const seen = React.useMemo(() => {
    return allLists?.filter((tv) => tv?.complete);
  }, [allLists]);

  const incomplete = React.useMemo(() => {
    return allLists?.filter(
      (tv) =>
        !tv?.complete &&
        tv?.seasons_seen &&
        Object.values(tv?.seasons_seen).length > 0
    );
  }, [allLists]);

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: isDesktop
          ? "100vh"
          : `calc(100vh - ${HEIGHT_NAVIGATION_MOBILE}px)`,
      }}
    >
      <SectionMovie
        sections={incomplete}
        label={"Continua a guardare"}
        isDesktop={isDesktop}
        onClick={handleClickItem}
        progressBar
      />
      <SectionMovie
        sections={watchlist}
        label={"Serie Tv da vedere"}
        isDesktop={isDesktop}
        onClick={handleClickItem}
        progressBar
      />
      <SectionMovie
        sections={seen}
        label={"Serie Tv viste"}
        isDesktop={isDesktop}
        onClick={handleClickItem}
        progressBar
      />
    </Box>
  );
}
