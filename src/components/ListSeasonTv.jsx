import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { fetchDetailSeasonTvById } from "../api/tmdbApis";
import {
  EPISODE_CARD_HEIGHT,
  EPISODE_CARD_HEIGHT_MOBILE,
  EPISODE_CARD_WIDTH,
  EPISODE_CARD_WIDTH_MOBILE,
} from "../utils/constant";
import { formatMinutes } from "../utils/timeFormat";
import { CircularProgressWithLabel } from "./ChartCompatibility";
import MovieCard from "./MovieCard";
import { useDispatch, useSelector } from "react-redux";
import { upsertSeenTvEpisode } from "../store/profileQuery";

export default function ListSeasonTv({
  tvID,
  seasons,
  isDesktop,
  posterPath,
  title,
  voteAverage,
  activeAction = false,
  numberEpisodes,
  numberSeasons,
  openDialogEpisodeDetail,
}) {
  const dispatch = useDispatch();

  const tvProfile = useSelector((state) => state.profileQuery.tv);

  const [expanded, setExpanded] = React.useState(false);

  const currentTvDetailProfile = React.useMemo(() => {
    return tvProfile?.[tvID] || null;
  }, [tvProfile]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { isLoading, error, data } = useQuery(["seasonDetail", tvID], () =>
    fetchDetailSeasonTvById(tvID, seasons)
  );

  if (error) return null;

  const zeroPad = (num, places = 2) => String(num).padStart(places, "0");

  const handleAddSeason = (seasonID) => {
    const currentSession = data.find((session) => session.id === seasonID);

    if (currentSession) {
      const { id, season_number, episodes } = currentSession;

      if (
        currentTvDetailProfile &&
        currentTvDetailProfile?.seasons_seen?.[seasonID]?.complete
      ) {
        const infoTv = {
          poster_path: posterPath,
          title,
          id: tvID,
          vote_average: voteAverage,
          numberEpisodes,
          numberSeasons,
        };

        const value = {
          id,
          season_number,
          episodes_total: episodes.length,
          episodes_seen: [],
          complete: false,
        };

        dispatch(
          upsertSeenTvEpisode({ itemID: tvID, seasonID, infoTv, value })
        );
      } else {
        const episodes_seen = episodes
          .map((episode) => {
            const differenceRelease = getDifferenceRelease(episode?.air_date);

            if (differenceRelease > 0) {
              return null;
            }

            return episode.id;
          })
          .filter(Boolean);

        const infoTv = {
          poster_path: posterPath,
          title,
          id: tvID,
          vote_average: voteAverage,
          numberEpisodes,
          numberSeasons,
        };

        const value = {
          id,
          season_number,
          episodes_total: episodes.length,
          episodes_seen,
          complete: episodes_seen.length === episodes.length,
        };

        dispatch(
          upsertSeenTvEpisode({ itemID: tvID, seasonID, infoTv, value })
        );
      }
    }
  };

  const handleToggleAddEpisode = (seasonID, episodeID) => {
    const currentSession = data.find((session) => session.id === seasonID);

    if (currentSession) {
      const { id, season_number, episodes } = currentSession;

      if (
        currentTvDetailProfile?.seasons_seen?.[seasonID] &&
        currentTvDetailProfile?.seasons_seen?.[
          seasonID
        ]?.episodes_seen.includes(episodeID)
      ) {
        const value = {
          id,
          season_number,
          episodes_total: episodes.length,
          episodes_seen:
            currentTvDetailProfile?.seasons_seen?.[
              seasonID
            ]?.episodes_seen?.filter((epis) => epis !== episodeID) || [],
          complete:
            currentTvDetailProfile?.seasons_seen?.[
              seasonID
            ]?.episodes_seen?.filter((epis) => epis !== episodeID).length ===
            episodes.length,
        };

        dispatch(upsertSeenTvEpisode({ itemID: tvID, seasonID, value }));
      } else if (currentTvDetailProfile?.seasons_seen?.[seasonID]) {
        const value = {
          id,
          season_number,
          episodes_total: episodes.length,
          episodes_seen: [
            ...(currentTvDetailProfile?.seasons_seen?.[seasonID]
              ?.episodes_seen || []),
            episodeID,
          ],
          complete:
            [
              ...(currentTvDetailProfile?.seasons_seen?.[seasonID]
                ?.episodes_seen || []),
              episodeID,
            ].length === episodes.length,
        };

        dispatch(upsertSeenTvEpisode({ itemID: tvID, seasonID, value }));
      } else {
        const infoTv = {
          poster_path: posterPath,
          title,
          id: tvID,
          vote_average: voteAverage,
          numberEpisodes,
          numberSeasons,
        };

        const value = {
          id,
          season_number,
          episodes_total: episodes.length,
          episodes_seen: [episodeID],
          complete: 1 === episodes.length,
        };

        dispatch(
          upsertSeenTvEpisode({ itemID: tvID, seasonID, infoTv, value })
        );
      }
    }
  };

  return (
    <Box>
      {isLoading && <LinearProgress />}
      {!isLoading &&
        Array.isArray(data) &&
        data.length > 0 &&
        data
          .filter((season) => season?.name !== "Speciali")
          .map((season, i) => {
            const keySeason = season?.name;
            return (
              <Accordion
                key={keySeason + i}
                expanded={expanded === keySeason}
                onChange={handleChange(keySeason)}
                TransitionProps={{ unmountOnExit: true }}
              >
                <AccordionSummary
                  aria-controls={`${keySeason}bh-content`}
                  id={`${keySeason}bh-header`}
                  sx={{ position: "relative" }}
                >
                  <ProgressBarSeason
                    complete={currentTvDetailProfile?.complete}
                    currentSeason={
                      currentTvDetailProfile?.seasons_seen?.[season.id]
                    }
                  />

                  <Stack
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={2}
                    width={"100%"}
                  >
                    <Typography
                      sx={{ fontSize: isDesktop ? "0.9rem" : "0.7rem" }}
                      variant="button"
                    >
                      {keySeason}
                    </Typography>
                    <Typography
                      variant={"button"}
                      sx={{
                        fontSize: isDesktop ? "0.7rem" : "0.6rem",
                        color: "text.secondary",
                      }}
                    >
                      {season?.air_date?.substring(0, 4)}{" "}
                      {season?.air_date && " | "}
                      {season?.episodes?.length} episodi
                    </Typography>
                    {!activeAction && <Box sx={{ flexGrow: 1 }} />}
                    <IconButton
                      sx={{
                        transform:
                          expanded === keySeason
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition:
                          "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                    {activeAction && (
                      <>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                          sx={{ mr: "10px" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleAddSeason(season.id);
                          }}
                        >
                          <CheckCircleIcon
                            sx={{ width: "1.2em", height: "1.2em" }}
                            color={
                              currentTvDetailProfile?.complete ||
                              currentTvDetailProfile?.seasons_seen?.[season.id]
                                ?.complete
                                ? "success"
                                : currentTvDetailProfile?.seasons_seen?.[
                                    season.id
                                  ]?.episodes_seen.length > 0
                                ? "warning"
                                : "inherit"
                            }
                          />
                        </IconButton>
                      </>
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {season?.episodes?.map((episode) => {
                      const percentRating =
                        episode.vote_average &&
                        (episode.vote_average.toFixed(1) * 100) / 10;

                      const differenceRelease = getDifferenceRelease(
                        episode?.air_date
                      );

                      const secondaryAction =
                        differenceRelease > 0 || !activeAction ? null : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              onClick={(event) => {
                                handleToggleAddEpisode(season.id, episode.id);
                              }}
                            >
                              <CheckCircleIcon
                                sx={{ width: "1.2em", height: "1.2em" }}
                                color={
                                  currentTvDetailProfile?.complete ||
                                  currentTvDetailProfile?.seasons_seen?.[
                                    season.id
                                  ]?.episodes_seen.includes(episode.id)
                                    ? "success"
                                    : "inherit"
                                }
                              />
                            </IconButton>
                          </Box>
                        );

                      return (
                        <React.Fragment key={episode.id}>
                          <ListItem
                            disablePadding
                            sx={{
                              position: "relative",
                              "& .MuiListItemSecondaryAction-root": {
                                top: 10,
                                bottom: 15,
                                right: 10,
                                // height: "100%",
                                transform: "none",
                              },
                            }}
                            secondaryAction={secondaryAction}
                          >
                            <ListItemButton
                              disableGutters
                              alignItems="flex-start"
                              sx={{
                                gap: 3,
                                cursor: "inherit",
                                display: "flex",
                                flexDirection: "row",
                              }}
                              key={i + "episode"}
                              onClick={() =>
                                openDialogEpisodeDetail(
                                  tvID,
                                  episode?.season_number,
                                  episode?.episode_number
                                )
                              }
                            >
                              <ListItemAvatar>
                                <MovieCard
                                  title={episode?.name}
                                  bg={episode?.still_path}
                                  w={
                                    isDesktop
                                      ? EPISODE_CARD_WIDTH
                                      : EPISODE_CARD_WIDTH_MOBILE
                                  }
                                  h={
                                    isDesktop
                                      ? EPISODE_CARD_HEIGHT
                                      : EPISODE_CARD_HEIGHT_MOBILE
                                  }
                                  isDesktop={false}
                                  imageStyle={{
                                    objectFit: "cover",
                                  }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                disableTypography
                                primary={
                                  <Stack
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    gap={3}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: isDesktop ? "1rem" : "0.8rem",
                                        letterSpacing: 1.2,
                                      }}
                                      variant={"h6"}
                                    >
                                      {`S${zeroPad(
                                        episode?.season_number
                                      )} | E${zeroPad(
                                        episode?.episode_number
                                      )}`}
                                    </Typography>

                                    {percentRating > 0 && (
                                      <CircularProgressWithLabel
                                        to={percentRating}
                                        size={isDesktop ? 30 : 25}
                                        labelSize={isDesktop ? 9 : 8}
                                        durationAnimate={0}
                                      />
                                    )}
                                  </Stack>
                                }
                                secondary={
                                  <Stack>
                                    <Typography
                                      component="span"
                                      sx={{
                                        fontSize: isDesktop
                                          ? "0.7rem"
                                          : "0.6rem",
                                      }}
                                      variant={"button"}
                                    >
                                      {episode?.air_date}
                                    </Typography>
                                    <Typography
                                      component="span"
                                      variant={"body2"}
                                      sx={{ fontSize: "0.6rem" }}
                                    >
                                      {`${
                                        episode?.runtime
                                          ? formatMinutes(episode?.runtime)
                                          : ""
                                      }`}
                                    </Typography>
                                    <Typography
                                      component="span"
                                      fontWeight={300}
                                      sx={{
                                        mt: 1,
                                        fontSize: isDesktop ? "1rem" : "0.9rem",
                                        fontWeight: 300,
                                      }}
                                      variant={"body2"}
                                    >
                                      {differenceRelease > 0
                                        ? `Tra ${differenceRelease} giorni`
                                        : episode?.name}
                                    </Typography>
                                  </Stack>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
    </Box>
  );
}

function ProgressBarSeason({ complete, currentSeason = {} }) {
  const { episodes_total = 0, episodes_seen = [] } = currentSeason;

  const currentValue = (episodes_seen.length * 100) / episodes_total;

  if (!complete && !currentValue > 0) {
    return null;
  }

  return (
    <LinearProgress
      variant="determinate"
      value={complete ? 100 : currentValue}
      color={complete || currentValue == 100 ? "success" : "warning"}
      sx={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
      }}
    />
  );
}

function getDifferenceRelease(date) {
  const today = moment().format("YYYY-MM-DD");

  const airDate = moment(date, "YYYY-MM-DD");

  return airDate.diff(today, "days");
}
