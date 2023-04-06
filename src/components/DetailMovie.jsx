import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  Grid,
  LinearProgress,
  Rating,
  Stack,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Highlighter from "react-highlight-words";
import YouTubePlayer from "react-player/youtube";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { fetchDetailMovieById } from "../api/tmdbApis";
import Imdb from "../components/icons/Imdb";
import RottenTomatoes from "../components/icons/RottenTomatoes";
import { roundToHalf } from "../utils/numberFormatting";
import { formatMinutes } from "../utils/timeFormat";
import useElementSize from "../utils/useElementSize";
import CastListDetail from "./CastListDetail";
import ChartCompatibility from "./ChartCompatibility";
import TypographyAnimated from "./TypographyAnimated";
import Tmdb from "./icons/Tmdb";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

export default function DetailMovie({
  currentMovie,
  handleAddMoviesByInsertPeople,
  handleRemoveMoviesByInsertPeople,
}) {
  const [mute, setMute] = useState(true);
  const [openTrailerDialog, setOpenTrailerDialog] = React.useState(false);

  const genres = useSelector((state) => state.movieQuery.genres);

  const [infoMovieRef, { height }] = useElementSize();

  const { isLoading, error, data } = useQuery(
    ["detailMovie", currentMovie],
    () => fetchDetailMovieById(currentMovie?.id)
  );

  if (isLoading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const detail = data;

  const bgContainerPoster = detail?.images?.logos?.find(
    (p) => p?.iso_639_1 === "en"
  )?.file_path;

  const director = currentMovie?.credits?.crew?.find(
    (c) => c.department === "Directing"
  );

  console.log("direct", director);

  //console.log("data", data);
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
              detail?.videos?.results[0]?.key || "L3oOldViIgY"
            }`}
            style={{ position: "absolute", top: 0 }}
            //onProgress={({ playedSeconds }) => setProgress(playedSeconds)}
            //onDuration={(duration) => setDuration(duration)}
          />
        </Box>
      </Dialog>
      <Box
        sx={{
          height: "100%",
          px: 3,
          py: 2,
          //px: { xs: 2, sm: 3, md: 5 },
          "&:before": {
            content: "''",
            backgroundImage: `url(http://image.tmdb.org/t/p/original${bgContainerPoster})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            position: "absolute",
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px",
            opacity: 0.04,
            transition:
              "background-image 0.8s cubic-bezier(0, 0.71, 0.2, 1.01)",
          },
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} sm={8}>
            <Box ref={infoMovieRef}>
              <TypographyAnimated
                component={"div"}
                sx={{ fontSize: "1.2rem", mb: 2 }}
                variant={"h6"}
                text={detail?.title}
              />
              <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
                <TypographyAnimated
                  component={"div"}
                  sx={{ fontSize: "0.7rem" }}
                  variant={"button"}
                  text={`${detail?.release_date?.substring(
                    0,
                    4
                  )} - diretto da `}
                />
                <Chip
                  key={director.id}
                  variant="outlined"
                  avatar={
                    director?.profile_path ? (
                      <Avatar
                        alt={director.name}
                        src={`http://image.tmdb.org/t/p/w500${director.profile_path}`}
                      />
                    ) : (
                      <Avatar>{director.name.charAt(0)}</Avatar>
                    )
                  }
                  label={director.name}
                  deleteIcon={<AddIcon />}
                  onDelete={() => console.log("hi")}
                />
              </Stack>
              <TypographyAnimated
                component={"div"}
                variant={"body2"}
                sx={{ mt: 2 }}
                text={
                  <Highlighter
                    searchWords={genres?.map((g) => g.name)}
                    autoEscape={true}
                    highlightStyle={{
                      backgroundColor: "#ffee58b3",
                      padding: "0 4px",
                    }}
                    textToHighlight={`${formatMinutes(
                      detail?.runtime
                    )} - ${detail?.genres?.map((g) => g.name).join(", ")}`}
                  />
                }
              />
              <Box
                sx={{ mt: 2 }}
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {detail?.ratings?.find((r) => r.source === "rottenTomatoes")
                  ?.value && (
                  <Chip
                    sx={{ borderColor: "transparent" }}
                    variant="outlined"
                    icon={<RottenTomatoes />}
                    label={
                      <Rating
                        value={roundToHalf(
                          detail?.ratings?.find(
                            (r) => r.source === "rottenTomatoes"
                          )?.value
                        )}
                        precision={0.5}
                        readOnly
                      />
                    }
                  />
                )}
                {detail?.ratings?.find((r) => r.source === "Imdb")?.value && (
                  <Chip
                    sx={{ borderColor: "transparent" }}
                    variant="outlined"
                    icon={<Imdb />}
                    label={
                      <Rating
                        value={roundToHalf(
                          detail?.ratings?.find((r) => r.source === "Imdb")
                            ?.value
                        )}
                        precision={0.5}
                        readOnly
                      />
                    }
                  />
                )}
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
              </Box>
              {detail?.videos?.results[0]?.key && (
                <Button
                  sx={{ pl: 0, mt: 1 }}
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  variant="text"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleClickOpenDialogTrailer}
                >
                  Guarda Trailer
                </Button>
              )}

              {detail?.tagline && (
                <Box sx={{ my: 2 }}>
                  <TypographyAnimated
                    component={"div"}
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
                        lineHeight: "0.4em",
                        marginRight: "0.15em",
                        verticalAlign: "-0.4em",
                      },
                    }}
                    variant={"body2"}
                    text={detail?.tagline}
                  />
                </Box>
              )}

              <TypographyAnimated
                fontWeight={200}
                component={"div"}
                sx={{ mt: 3 }}
                variant={"body2"}
                text={detail?.overview}
              />
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ mt: 2 }}
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChartCompatibility movie={currentMovie} />
              </Box>
              {detail?.providers?.flatrate && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <TypographyAnimated
                    component={"div"}
                    variant={"body2"}
                    text={"Disponibile sulle piattaforme"}
                  />

                  <Stack flexDirection={"row"} gap={2} sx={{ mt: 2 }}>
                    {detail?.providers?.flatrate?.map((provider) => (
                      <Avatar
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={provider?.provider_id}
                        alt={provider?.provider_name}
                        src={`http://image.tmdb.org/t/p/w500${provider?.logo_path}`}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CastListDetail
              movieId={currentMovie?.id}
              person={currentMovie?.credits?.cast}
              height={height}
              handleAddMoviesByInsertPeople={handleAddMoviesByInsertPeople}
              handleRemoveMoviesByInsertPeople={
                handleRemoveMoviesByInsertPeople
              }
            />
          </Grid>
          {/*  <Grid item xs={12}>
            <ListImagesMovie images={detail?.images?.posters} />
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
}
