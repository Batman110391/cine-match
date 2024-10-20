import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Rating,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "react-query";
import { fetchEpisodeDetailByID } from "../api/tmdbApis";
import {
  EPISODE_CARD_DETAIL_HEIGHT,
  EPISODE_CARD_DETAIL_WIDTH,
  EPISODE_CARD_HEIGHT,
  EPISODE_CARD_WIDTH,
} from "../utils/constant";
import { roundToHalf } from "../utils/numberFormatting";
import { formatMinutes } from "../utils/timeFormat";
import CastListDetail from "./CastListDetail";
import { RelaseDataFormatting } from "./DialogMovieDetail";
import DialogWrapperResponsivness from "./DialogWrapperResponsivness";
import MovieCard from "./MovieCard";
import Tmdb from "./icons/Tmdb";

export default function DialogEpisodeDetail({
  open,
  handleClose,
  seriesID,
  seasonNumber,
  episodeNumber,
  openPersonDialog,
}) {
  const theme = useTheme();

  const { isLoading, error, data } = useQuery(
    ["episodeDetail", seriesID, seasonNumber, episodeNumber],
    () => fetchEpisodeDetailByID(seriesID, seasonNumber, episodeNumber)
  );

  const detail = data;

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const director = detail?.crew?.find((c) => c?.department === "Directing");

  console.log("data", data);

  return (
    <DialogWrapperResponsivness
      open={open}
      onClose={handleClose}
      isDesktop={isDesktop}
      maxWidth={"xl"}
      PaperProps={{
        sx: {
          height: "100%",
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar sx={{ position: "relative" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {isLoading && !error ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : error ? (
        <h1>{JSON.stringify(error)}</h1>
      ) : (
        <DialogContent
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{ paddingX: 1.5 }}
        >
          <Box
            sx={{
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              position: "relative",
              mb: 3,
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Stack flexDirection={"row"} gap={2}>
                  <Box>
                    <MovieCard
                      bg={detail?.still_path}
                      title={detail?.title || detail?.name}
                      w={
                        isDesktop
                          ? EPISODE_CARD_DETAIL_WIDTH
                          : EPISODE_CARD_WIDTH
                      }
                      h={
                        isDesktop
                          ? EPISODE_CARD_DETAIL_HEIGHT
                          : EPISODE_CARD_HEIGHT
                      }
                      isDesktop={isDesktop}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "1.2rem" }} variant={"h6"}>
                      {detail?.title || detail?.name}
                    </Typography>

                    <Stack
                      flexDirection={"row"}
                      flexWrap={"wrap"}
                      alignItems={"center"}
                      gap={1}
                    >
                      <Typography
                        sx={{ fontSize: "0.7rem" }}
                        variant={"button"}
                      >
                        <RelaseDataFormatting
                          originalReleaseDate={detail?.air_date}
                          onlyYear
                        />
                      </Typography>
                      {director && (
                        <>
                          <Typography
                            sx={{ fontSize: "0.6rem" }}
                            variant={"body2"}
                          >
                            - DIRETTO DA
                          </Typography>
                          <Chip
                            onClick={() => openPersonDialog(director?.id)}
                            key={director?.id}
                            variant="outlined"
                            avatar={
                              director?.profile_path ? (
                                <Avatar
                                  alt={director?.name}
                                  src={`http://image.tmdb.org/t/p/w500${director?.profile_path}`}
                                />
                              ) : (
                                <Avatar>{director?.name?.charAt(0)}</Avatar>
                              )
                            }
                            label={director?.name}
                          />
                        </>
                      )}
                    </Stack>

                    <Typography
                      sx={{ fontSize: "0.6rem" }}
                      variant={"button"}
                      color={"text.secondary"}
                    >
                      <RelaseDataFormatting
                        production={[{ iso_3166_1: "IT" }]}
                        originalReleaseDate={detail?.air_date}
                      />
                    </Typography>

                    <Typography
                      variant={"body2"}
                      sx={{ mt: 1, fontSize: "0.7rem" }}
                    >
                      {`${
                        detail?.runtime ? formatMinutes(detail?.runtime) : ""
                      }`}
                    </Typography>
                  </Box>
                </Stack>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Chip
                    sx={{ borderColor: "transparent" }}
                    variant="outlined"
                    icon={<Tmdb />}
                    label={
                      <Rating
                        value={roundToHalf(detail?.vote_average)}
                        precision={0.5}
                        readOnly
                      />
                    }
                  />
                  <Typography fontWeight={"bold"} variant={"caption"}>
                    {detail?.vote_average?.toFixed(1)}
                  </Typography>
                </Box>
                <Typography fontWeight={200} sx={{ mt: 3 }} variant={"body2"}>
                  {detail?.overview}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <CastListDetail
                  person={detail?.guest_stars}
                  sx={{
                    maxHeight: "inherit",
                    overflowY: "inherit",
                  }}
                  openDialogPersonDetail={openPersonDialog}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      )}
    </DialogWrapperResponsivness>
  );
}
