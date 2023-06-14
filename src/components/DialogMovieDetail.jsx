import { useTheme } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  LinearProgress,
  Rating,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Grow from "@mui/material/Grow ";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { motion } from "framer-motion";
import React from "react";
import YouTubePlayer from "react-player/youtube";
import { useQuery } from "react-query";
import { fetchDetailMovieById } from "../api/tmdbApis";
import {
  MOVIE_CARD_HEIGTH_MOBILE,
  MOVIE_CARD_WIDTH_MOBILE,
  MOVIE_PAGE_CARD_HEIGTH_MOBILE,
  MOVIE_PAGE_CARD_WIDTH_MOBILE,
} from "../utils/constant";
import { roundToHalf } from "../utils/numberFormatting";
import { formatMinutes } from "../utils/timeFormat";
import useElementSize from "../utils/useElementSize";
import CastListDetail from "./CastListDetail";
import ListImagesMovie from "./ListImagesMovie";
import ListSeasonTv from "./ListSeasonTv";
import ListSimilarMoviesAndTv from "./ListSimilarMoviesAndTv";
import MovieCard from "./MovieCard";
import SpeedDialShare from "./SpeedDialShare";
import SubHeader from "./SubHeader";
import Tmdb from "./icons/Tmdb";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function DialogMovieDetail({
  open,
  handleClose,
  movieID,
  type,
  subItemClick,
  openPersonDialog,
}) {
  const theme = useTheme();

  const [openTrailerDialog, setOpenTrailerDialog] = React.useState(false);

  const [infoMovieRef, { height }] = useElementSize();

  const { isLoading, error, data } = useQuery(
    ["detailMovie", movieID, type],
    () => fetchDetailMovieById(movieID, type)
  );

  const detail = data;

  console.log(detail);

  const bgContainerPoster = detail?.images?.logos?.find(
    (p) => p?.iso_639_1 === "en"
  )?.file_path;

  const director =
    type === "movie"
      ? detail?.credits?.crew?.find((c) => c?.department === "Directing")
      : detail?.created_by;

  const handleClickOpenDialogTrailer = () => {
    setOpenTrailerDialog(true);
  };

  const handleCloseDialogTrailer = () => {
    setOpenTrailerDialog(false);
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div>
      <Dialog
        fullScreen={isDesktop ? false : true}
        fullWidth={true}
        maxWidth={"xl"}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
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

            <SpeedDialShare
              movieID={detail?.id}
              type={type}
              title={detail?.title || detail?.name}
            />
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
                    muted={false}
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
                  px: 0,
                  py: 1,
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
                      <Stack flexDirection={"row"} gap={2}>
                        <Box>
                          <MovieCard
                            bg={detail?.poster_path}
                            title={detail?.title || detail?.name}
                            w={
                              isDesktop
                                ? MOVIE_PAGE_CARD_WIDTH_MOBILE
                                : MOVIE_CARD_WIDTH_MOBILE
                            }
                            h={
                              isDesktop
                                ? MOVIE_PAGE_CARD_HEIGTH_MOBILE
                                : MOVIE_CARD_HEIGTH_MOBILE
                            }
                            isDesktop={isDesktop}
                          />
                        </Box>
                        <Box>
                          <Typography
                            sx={{ fontSize: "1.2rem" }}
                            variant={"h6"}
                          >
                            {detail?.title || detail?.name}
                          </Typography>
                          {detail?.title !== detail?.original_title && (
                            <Typography
                              sx={{ fontSize: "0.6rem" }}
                              variant={"button"}
                              color={"text.secondary"}
                            >
                              {detail?.original_title}
                            </Typography>
                          )}
                          {detail?.name !== detail?.original_name && (
                            <Typography
                              sx={{ fontSize: "0.6rem" }}
                              variant={"button"}
                              color={"text.secondary"}
                            >
                              {detail?.original_name}
                            </Typography>
                          )}
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
                              {detail?.release_date?.substring(0, 4) ||
                                detail?.first_air_date?.substring(0, 4)}
                            </Typography>
                            {director && type === "movie" && (
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
                                        src={`http://image.tmdb.org/t/p/w342${director?.profile_path}`}
                                      />
                                    ) : (
                                      <Avatar>
                                        {director?.name?.charAt(0)}
                                      </Avatar>
                                    )
                                  }
                                  label={director?.name}
                                />
                              </>
                            )}
                            {director &&
                              Array.isArray(director) &&
                              director.length > 0 &&
                              type === "tv" && (
                                <>
                                  <Typography
                                    sx={{ fontSize: "0.6rem" }}
                                    variant={"body2"}
                                  >
                                    - IDEATO DA
                                  </Typography>
                                  <Box>
                                    {director.map((dir) => (
                                      <Chip
                                        key={dir?.id}
                                        variant="outlined"
                                        onClick={() =>
                                          openPersonDialog(dir?.id)
                                        }
                                        avatar={
                                          dir?.profile_path ? (
                                            <Avatar
                                              alt={dir?.name}
                                              src={`http://image.tmdb.org/t/p/w342${dir?.profile_path}`}
                                            />
                                          ) : (
                                            <Avatar>
                                              {dir?.name?.charAt(0)}
                                            </Avatar>
                                          )
                                        }
                                        label={dir?.name}
                                      />
                                    ))}
                                  </Box>
                                </>
                              )}
                          </Stack>

                          <Typography
                            sx={{ fontSize: "0.6rem" }}
                            variant={"button"}
                            color={"text.secondary"}
                          >
                            {detail?.release_date || detail?.first_air_date}
                          </Typography>

                          <Typography
                            variant={"body2"}
                            sx={{ mt: 1, fontSize: "0.7rem" }}
                          >
                            {`${
                              detail?.runtime
                                ? formatMinutes(detail?.runtime) + " - "
                                : ""
                            } ${detail?.genres?.map((g) => g.name).join(", ")}`}
                          </Typography>
                        </Box>
                      </Stack>
                      <Box sx={{ mt: 2 }}>
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
                          variant="text"
                          startIcon={<PlayArrowIcon />}
                          onClick={handleClickOpenDialogTrailer}
                        >
                          Guarda Trailer
                        </Button>
                      )}

                      {detail?.tagline && (
                        <Box sx={{ my: 2 }}>
                          <Typography
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
                          >
                            {detail?.tagline}
                          </Typography>
                        </Box>
                      )}

                      <Typography
                        fontWeight={200}
                        sx={{ mt: 3 }}
                        variant={"body2"}
                      >
                        {detail?.overview}
                      </Typography>

                      {detail?.providers?.flatrate &&
                        detail.providers.flatrate.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <SubHeader title={"Disponibile sulle piattaforme"}>
                              <Stack
                                flexDirection={"row"}
                                flexWrap={"wrap"}
                                gap={2}
                                sx={{ mt: 2 }}
                              >
                                {detail?.providers?.flatrate?.map(
                                  (provider) => (
                                    <Avatar
                                      key={provider?.provider_id}
                                      alt={provider?.provider_name}
                                      src={`http://image.tmdb.org/t/p/w342${provider?.logo_path}`}
                                    />
                                  )
                                )}
                              </Stack>
                            </SubHeader>
                          </Box>
                        )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CastListDetail
                      person={detail?.credits?.cast}
                      height={height}
                      openDialogPersonDetail={openPersonDialog}
                    />
                  </Grid>
                  {type === "tv" &&
                    Array.isArray(detail?.seasons) &&
                    detail?.seasons?.length > 0 && (
                      <Grid item xs={12}>
                        <SubHeader title={"Stagioni"}>
                          <ListSeasonTv
                            tvID={detail?.id}
                            seasons={detail.seasons}
                            isDesktop={isDesktop}
                          />
                        </SubHeader>
                      </Grid>
                    )}
                  <Grid item xs={12}>
                    <SubHeader
                      title={
                        type === "movie" ? "Film simili" : "Serie Tv simili"
                      }
                    >
                      <ListSimilarMoviesAndTv
                        id={detail?.id}
                        type={type}
                        isDesktop={isDesktop}
                        subItemClick={subItemClick}
                      />
                    </SubHeader>
                  </Grid>
                  {detail?.images?.backdrops &&
                    detail?.images?.backdrops?.filter((ele) => !ele?.iso_639_1)
                      .length > 0 && (
                      <Grid item xs={12}>
                        <SubHeader title={"Immagini"}>
                          <ListImagesMovie images={detail?.images?.backdrops} />
                        </SubHeader>
                      </Grid>
                    )}
                  <Box sx={{ height: 40, width: "100%" }} />
                </Grid>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
