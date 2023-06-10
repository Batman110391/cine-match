import {
  alpha,
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
  Popover,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery } from "react-query";
import { fetchDetailSeasonTvById } from "../api/tmdbApis";
import MovieCard from "./MovieCard";
import {
  EPISODE_CARD_HEIGHT,
  EPISODE_CARD_WIDTH,
  MOVIE_CARD_HEIGTH_MOBILE,
  MOVIE_CARD_WIDTH_MOBILE,
} from "../utils/constant";
import { CircularProgressWithLabel } from "./ChartCompatibility";
import { formatMinutes } from "../utils/timeFormat";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function ListSeasonTv({ tvID, seasons, isDesktop }) {
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [overviewPop, setOverviewPop] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { isLoading, error, data } = useQuery(["seasonDetail", tvID], () =>
    fetchDetailSeasonTvById(tvID, seasons)
  );

  if (error) return null;

  const handleClickPop = (event, overview) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOverviewPop(overview);
  };

  const handleClosePop = () => {
    setAnchorEl(null);
    setOverviewPop(null);
  };

  const openPop = Boolean(anchorEl) && overviewPop;
  const idPop = openPop ? "info-overview" : undefined;

  return (
    <Box>
      {isLoading && <LinearProgress />}
      {!isLoading &&
        Array.isArray(data) &&
        data.length > 0 &&
        data.map((season, i) => {
          const keySeason = season?.name;
          return (
            <Accordion
              key={keySeason + i}
              expanded={expanded === keySeason}
              onChange={handleChange(keySeason)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${keySeason}bh-content`}
                id={`${keySeason}bh-header`}
              >
                <Stack gap={1}>
                  <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
                    <Typography variant="button">{keySeason}</Typography>
                    <Typography
                      variant={"button"}
                      sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                    >
                      {season?.air_date?.substring(0, 4)}{" "}
                      {season?.air_date && " | "}
                      {season?.episodes?.length} episodi
                    </Typography>
                  </Stack>
                  <Stack flexDirection={"row"} gap={2}>
                    <Box sx={{ flex: 1 }}>
                      <MovieCard
                        title={i}
                        bg={season?.poster_path}
                        w={MOVIE_CARD_WIDTH_MOBILE}
                        h={MOVIE_CARD_HEIGTH_MOBILE}
                        isDesktop={false}
                      />
                    </Box>
                    <Stack flexDirection={"row"} gap={1}>
                      <Typography
                        fontWeight={200}
                        variant={"body2"}
                        sx={{ px: 2, fontSize: "0.8rem" }}
                      >
                        {season?.overview &&
                        season.overview.length >= 185 &&
                        !isDesktop
                          ? season.overview.substring(0, 185) + "..."
                          : season.overview}
                      </Typography>
                      {!isDesktop &&
                        season?.overview &&
                        season.overview.length >= 185 && (
                          <IconButton
                            sx={{ height: "fit-content" }}
                            onClick={(e) => handleClickPop(e, season.overview)}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        )}
                      <Popover
                        id={idPop}
                        open={openPop}
                        anchorEl={anchorEl}
                        onClose={handleClosePop}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "center",
                          horizontal: "right",
                        }}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            backgroundColor: (theme) =>
                              alpha(theme.palette.background.paperDark, 0.9),
                          },
                        }}
                      >
                        <Typography
                          fontWeight={200}
                          variant={"body2"}
                          sx={{ p: 2, fontSize: "0.8rem" }}
                        >
                          {overviewPop}
                        </Typography>
                      </Popover>
                    </Stack>
                  </Stack>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <List disablePadding>
                  {season?.episodes?.map((episode) => {
                    const percentRating =
                      episode.vote_average &&
                      (episode.vote_average.toFixed(1) * 100) / 10;

                    const secondaryAction = percentRating ? (
                      <Box>
                        <CircularProgressWithLabel
                          to={percentRating}
                          size={isDesktop ? 35 : 30}
                          labelSize={isDesktop ? 11 : 10}
                          durationAnimate={0}
                        />
                      </Box>
                    ) : null;

                    return (
                      <React.Fragment key={episode.id}>
                        <ListItem
                          disablePadding
                          sx={{
                            position: "relative",
                            "& .MuiListItemSecondaryAction-root": {
                              top: 30,
                              right: 10,
                            },
                          }}
                          secondaryAction={secondaryAction}
                        >
                          <ListItemButton
                            alignItems="flex-start"
                            sx={{
                              gap: 2,
                              cursor: "inherit",
                              display: "flex",
                              flexDirection: isDesktop ? "row" : "column",
                            }}
                            key={i + "episode"}
                          >
                            <ListItemAvatar>
                              <MovieCard
                                title={episode?.name}
                                bg={episode?.still_path}
                                w={EPISODE_CARD_WIDTH}
                                h={EPISODE_CARD_HEIGHT}
                                isDesktop={false}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{ fontSize: "1rem" }}
                                  variant={"h6"}
                                >
                                  {episode?.name}
                                </Typography>
                              }
                              secondary={
                                <Stack>
                                  <Typography
                                    component="span"
                                    sx={{ fontSize: "0.7rem" }}
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
                                      fontSize: "0.8rem",
                                    }}
                                    variant={"body2"}
                                  >
                                    {episode?.overview}
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
