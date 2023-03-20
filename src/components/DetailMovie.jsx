import {
  alpha,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import YouTubePlayer from "react-player/youtube";
import TypographyAnimated from "./TypographyAnimated";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { fetchDetailMovieById } from "../api/tmdbApis";
import { useQuery } from "react-query";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { motion } from "framer-motion";
import { useTheme } from "@emotion/react";
import ChartCompatibility from "./ChartCompatibility";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

export default function DetailMovie({ id }) {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
  const theme = useTheme();

  const [mute, setMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [openTrailerDialog, setOpenTrailerDialog] = React.useState(false);

  const genres = useSelector((state) => state.movieQuery.genres);

  const { isLoading, error, data } = useQuery(["detailMovie", id], () =>
    fetchDetailMovieById(id)
  );

  if (isLoading || !data)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const detail = data;

  console.log("data", data);
  // const currProgress = Math.round((progress / duration) * 100);

  const handleClickOpenDialogTrailer = () => {
    setOpenTrailerDialog(true);
  };

  const handleCloseDialogTrailer = () => {
    setOpenTrailerDialog(false);
  };

  return (
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
      <Dialog
        //fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={"lg"}
        open={openTrailerDialog}
        onClose={handleCloseDialogTrailer}
      >
        <Box
          sx={{
            width: "100%",
            position: "relative",
            paddingTop: "calc(9 / 16 * 100%)",
            overflow: "hidden",
          }}
        >
          <YouTubePlayer
            controls={true}
            loop
            muted={mute}
            playing={true}
            width="100%"
            height="100%"
            url={`${YOUTUBE_URL}${
              detail?.videos.results[0]?.key || "L3oOldViIgY"
            }`}
            style={{ position: "absolute", top: 0 }}
            //onProgress={({ playedSeconds }) => setProgress(playedSeconds)}
            //onDuration={(duration) => setDuration(duration)}
          />
        </Box>
      </Dialog>
      <Container
        sx={{
          height: "100%",
          py: 2,
          //px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} sm={9}>
            <TypographyAnimated
              component={"div"}
              sx={{ mb: 1, fontSize: "1.2rem" }}
              variant={"h6"}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible,
              }}
              text={
                detail?.title +
                " (" +
                detail?.release_date.substring(0, 4) +
                ")"
              }
            />
            <TypographyAnimated
              component={"div"}
              variant={"body2"}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible,
              }}
              text={
                <Highlighter
                  searchWords={genres?.map((g) => g.name)}
                  autoEscape={true}
                  highlightStyle={{
                    backgroundColor: "#ffee58b3",
                  }}
                  textToHighlight={`Genere : ${detail?.genres
                    .map((g) => g.name)
                    .join(", ")}`}
                />
              }
            />
            {detail?.videos.results[0]?.key && (
              <Button
                sx={{ pl: 0, mt: 1 }}
                component={motion.div}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible,
                }}
                variant="text"
                startIcon={<PlayArrowIcon />}
                onClick={handleClickOpenDialogTrailer}
              >
                Guarda Trailer
              </Button>
            )}

            {detail?.tagline && (
              <TypographyAnimated
                component={"p"}
                sx={{
                  display: "inline",
                  m: 0,
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.light, 0.3),
                  borderLeft: "10px solid #ccc",
                  padding: "0.5em 10px",
                  "&:before": {
                    color: "#ccc",
                    content: "open-quote",
                    fontSize: "4em",
                    lineHeight: "0.1em",
                    marginRight: "0.25em",
                    verticalAlign: "-0.4em",
                  },
                }}
                variant={"body2"}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible,
                }}
                text={detail?.tagline}
              />
            )}

            <TypographyAnimated
              fontWeight={200}
              component={"div"}
              sx={{ mt: 3 }}
              variant={"body2"}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible,
              }}
              text={detail?.overview}
            />
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ mt: 2 }}
              component={motion.div}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible,
              }}
            >
              <ChartCompatibility movie={detail} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            {detail?.providers?.flatrate && (
              <TypographyAnimated
                component={"div"}
                variant={"body2"}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible,
                }}
                text={"Disponibile su :"}
              />
            )}
            <Stack flexDirection={"row"} gap={2} sx={{ mt: 2 }}>
              {detail?.providers?.flatrate?.map((provider) => (
                <Avatar
                  key={progress?.provider_id}
                  alt={provider?.provider_name}
                  src={`http://image.tmdb.org/t/p/w500${provider?.logo_path}`}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
