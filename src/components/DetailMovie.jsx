import {
  Box,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import YouTubePlayer from "react-player/youtube";
import TypographyAnimated from "./TypographyAnimated";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { fetchDetailMovieById } from "../api/tmdbApis";
import { useQuery } from "react-query";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

export default function DetailMovie({ id }) {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };

  const [mute, setMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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
  const currProgress = Math.round((progress / duration) * 100);

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
      <Box
        sx={{
          width: "100%",
          position: "relative",
          paddingTop: "calc(9 / 16 * 100%)",
        }}
      >
        <YouTubePlayer
          loop
          muted={mute}
          playing={true}
          width="100%"
          height="100%"
          url={`${YOUTUBE_URL}${
            detail?.videos.results[0]?.key || "L3oOldViIgY"
          }`}
          style={{ position: "absolute", top: 0 }}
          onProgress={({ playedSeconds }) => setProgress(playedSeconds)}
          onDuration={(duration) => setDuration(duration)}
        />
        <Box
          sx={{
            background: `linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)`,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            opacity: 1,
            position: "absolute",
            transition: "opacity .5s",
          }}
        />
        <Box
          sx={{
            backgroundColor: "transparent",
            backgroundImage:
              "linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "0px top",
            backgroundSize: "100% 100%",
            bottom: 0,
            position: "absolute",
            height: "14.7vw",
            opacity: 1,
            top: "auto",
            width: "100%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 10,
            px: { xs: 2, sm: 3, md: 5 },
          }}
        >
          <TypographyAnimated
            component={"div"}
            sx={{ maxWidth: "55%", mb: 1, fontSize: "1rem" }}
            variant={"h6"}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible,
            }}
            text={detail?.title}
          />
          <Stack direction="row" spacing={2}>
            <Box flexGrow={1} />
            <IconButton
              size="large"
              onClick={() => {
                setMute((v) => !v);
              }}
              sx={{ zIndex: 2 }}
            >
              {!mute ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Stack>
          <Box sx={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={currProgress} />
          </Box>
        </Box>
      </Box>
      <Container
        sx={{
          height: "100%",
          py: 2,
          px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={8}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TypographyAnimated
                component={"div"}
                variant={"body2"}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible,
                }}
                text={detail?.release_date.substring(0, 4)}
              />
            </Stack>

            <TypographyAnimated
              component={"div"}
              sx={{ mt: 2 }}
              variant={"body1"}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible,
              }}
              text={detail?.overview}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ mt: 3 }}>
            <TypographyAnimated
              component={"div"}
              sx={{ my: 1 }}
              variant={"body2"}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible,
              }}
              text={`Genere : ${detail?.genres.map((g) => g.name).join(", ")}`}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
