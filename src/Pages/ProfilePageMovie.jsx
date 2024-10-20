import { useTheme } from "@emotion/react";
import { Box, Chip, LinearProgress, useMediaQuery } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import MovieCard from "../components/MovieCard";
import {
  HEIGHT_NAVIGATION_MOBILE,
  MOVIE_CARD_HEIGHT,
  MOVIE_CARD_HEIGTH_MOBILE,
  MOVIE_CARD_WIDTH,
  MOVIE_CARD_WIDTH_MOBILE,
} from "../utils/constant";
import SimpleGridFlexBox from "../components/SimpleGridFlexBox";

export default function ProfilePageMovie() {
  const theme = useTheme();
  const { openDialogMovieDetail } = React.useContext(DialogMovieDetailContext);

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const data = useSelector((state) => state.profileQuery) || {};

  const { movie, loading: isLoading } = data;

  const handleClickItem = (movieID) => {
    openDialogMovieDetail(movieID, "movie");
  };

  const allLists = React.useMemo(() => {
    if (movie) {
      return Object.values(movie);
    }

    return [];
  }, [movie]);

  const watchlist = React.useMemo(() => {
    return allLists?.filter((movie) => movie?.watchlist);
  }, [allLists]);

  const seen = React.useMemo(() => {
    return allLists?.filter((movie) => movie?.complete);
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
        sections={watchlist}
        label={"Film da vedere"}
        isDesktop={isDesktop}
        onClick={handleClickItem}
      />
      <SectionMovie
        sections={seen}
        label={"Film visti"}
        isDesktop={isDesktop}
        onClick={handleClickItem}
      />
    </Box>
  );
}

export function SectionMovie({
  sections,
  label,
  isDesktop,
  onClick,
  progressBar = false,
}) {
  if (!sections.length > 0) {
    return null;
  }

  return (
    <Box
      sx={{
        height: "auto",
        p: isDesktop ? 2 : 1,
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: "sticky",
          top: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
          zIndex: 2,
        }}
      >
        <Chip sx={{ backgroundColor: "#778899bf" }} label={label} />
      </Box>

      <SimpleGridFlexBox
        w={isDesktop ? MOVIE_CARD_WIDTH : MOVIE_CARD_WIDTH_MOBILE}
        spacingW={2}
        spacingH={isDesktop ? 0.5 : 0.2}
      >
        {sections.map((section) => {
          const progressValue = progressBar ? calcProgressTv(section) : null;

          return (
            <Box
              key={section.id}
              sx={{
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                flex: "none",
                alignContent: "stretch",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <MovieCard
                bg={section?.poster_path}
                title={section?.title || section?.name}
                w={isDesktop ? MOVIE_CARD_WIDTH : MOVIE_CARD_WIDTH_MOBILE}
                h={isDesktop ? MOVIE_CARD_HEIGHT : MOVIE_CARD_HEIGTH_MOBILE}
                badgeRating={section?.vote_average}
                isDesktop={isDesktop}
                onClick={() => onClick(section.id)}
              />
              {progressBar && (
                <LinearProgress
                  variant="determinate"
                  value={progressValue || 0}
                  color={progressValue == 100 ? "success" : "warning"}
                  sx={{
                    borderBottomLeftRadius: "4px",
                    borderBottomRightRadius: "4px",
                    borderLeft: "1px solid #ffffff70",
                    borderBottom: "1px solid #ffffff70",
                    borderRight: "1px solid #ffffff70",
                    position: "absolute",
                    left: "0.5rem",
                    right: "0.5rem",
                    bottom: 8,
                    height: 5,
                  }}
                />
              )}
            </Box>
          );
        })}
      </SimpleGridFlexBox>
    </Box>
  );
}

function calcProgressTv(tv) {
  const { numberEpisodes, complete, watchlist } = tv;

  if (complete) {
    return 100;
  }

  if (watchlist) {
    return 0;
  }

  const totalEpisodesSeen = Object.values(tv?.seasons_seen).reduce(
    (prevSeason, currentSeason) => {
      const { episodes_seen = [] } = currentSeason;

      return prevSeason + episodes_seen.length;
    },
    0
  );

  const currentValue = (totalEpisodesSeen * 100) / numberEpisodes;

  return currentValue;
}
