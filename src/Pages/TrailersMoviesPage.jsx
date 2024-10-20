import { useTheme } from "@emotion/react";
import {
  Box,
  Chip,
  IconButton,
  Slider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import YouTubePlayer from "react-player/youtube";
import { useInfiniteQuery } from "react-query";
import { Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchTrailersMovies, genresList, genresListTv } from "../api/tmdbApis";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/free-mode";
import { Link } from "react-router-dom";
import { memo } from "react";
// import "swiper/css/mousewheel";

export default function TrailersMoviesPage() {
  const videoRefs = useRef([]);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [currentVideoPos, setCurrentVideoPos] = useState(0);
  const [muted, setMuted] = useState(true);
  const [trailers, setTrailers] = useState(null);
  const [stateVideoPlayer, setStateVideoPlayer] = useState([true]);
  const [videoInLight, setVideoInLight] = useState([]);
  const [openMessage, setOpenMessage] = useState(false);

  const currentPage = useSelector(
    (state) => state.movieQuery.showTrailerCurrentPage
  );

  const {
    status,
    error,
    data,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["trailerMovies"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => {
      if (!muted) {
        setMuted(true);

        setOpenMessage(true);

        // setTimeout(() => {
        //   setOpenMessage(false);
        // }, 5000);
      }
      //dispatch(setQuery({ showTrailerCurrentPage: pageParam }));
      return fetchTrailersMovies(pageParam);
    },
  });

  // Quando i dati vengono caricati o aggiornati, li memorizziamo nello stato locale
  if (status === "success" && data) {
    const newTrailers = data.pages
      ?.flatMap((data) => data)
      .reduce((prev, curr) => {
        return {
          ...curr,
          results: prev?.results
            ? prev.results.concat(curr.results)
            : curr.results,
        };
      }, {});

    // Verifica se i nuovi dati sono diversi dai dati memorizzati nello stato
    if (JSON.stringify(newTrailers) !== JSON.stringify(trailers)) {
      setTrailers(newTrailers);
    }
  }

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleVideoRef = (index) => (ref) => {
    // if (index !== currentVideoPos) {
    //   ref.seekTo(0.9, "second");
    // }
    // videoRefs.current[index] = ref;
  };

  const handleSlideChange = (info) => {
    // const prevVideo = info.previousIndex;
    // videoRefs.current[prevVideo].seekTo(0.9, "second");
    // videoRefs.current[prevVideo].getInternalPlayer().pauseVideo();
    const currentVideoPos = info.activeIndex;

    setCurrentVideoPos(currentVideoPos);

    if (trailers?.results?.length - currentVideoPos <= 5 && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleResumePlayer = (index) => () => {
    setTimeout(() => {
      setStateVideoPlayer([...stateVideoPlayer, true]);
    }, 800);
  };

  const handleReadyPlayer = (index) => () => {
    //videoRefs.current[index].getInternalPlayer().pauseVideo();
  };

  const handleBeforeSlideChangeStart = (info) => {
    // const currentVideoPos = info.activeIndex;
    // setCurrentVideoPos((state) => currentVideoPos);
    // if (trailers?.results?.length - currentVideoPos <= 5 && hasNextPage) {
    //   fetchNextPage();
    // }
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const onVideoInLight = (index) => {
    const exist = videoInLight.indexOf(index) !== -1;

    if (!exist) {
      setVideoInLight((state) => [...state, index]);
    }
  };

  // if (status === "loading") return <LoadingPage />;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  const optionDesktop = {
    mousewheel: true,
    modules: [Mousewheel],
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <Swiper
        style={{
          width: "100%",
          height: "100%",
        }}
        className="slideme"
        direction={"vertical"}
        slidesPerView={1}
        spaceBetween={400}
        {...(isDesktop ? optionDesktop : {})}
        noSwipingClass={isDesktop ? "slider-custom-player" : null}
        resistance={true}
        resistanceRatio={10}
        threshold={8}
        allowSlidePrev={!(videoInLight.indexOf(currentVideoPos - 1) !== -1)}
        speed={310}
        // observeSlideChildren
        //preventInteractionOnTransition
        onSlideChange={handleSlideChange}
        //onBeforeSlideChangeStart={handleBeforeSlideChangeStart}
        //onBeforeTransitionStart={handleBeforeSlideChangeStart}
      >
        {trailers &&
          trailers?.results?.length > 0 &&
          trailers?.results?.map((video, index) => {
            return (
              <SwiperSlide
                style={{ width: "100%" }}
                key={video.ytID + index}
                className="player"
              >
                <VideoWrapper
                  key={index}
                  ytID={video.ytID}
                  movie={video.movie}
                  muted={muted}
                  index={index}
                  setMuted={setMuted}
                  setVideoRef={handleVideoRef(index)}
                  isDesktop={isDesktop}
                  currentVideoPos={currentVideoPos}
                  autoplay={index === currentVideoPos}
                  isReady={true}
                  onResumePlayer={handleResumePlayer}
                  onReadyPlayer={handleReadyPlayer}
                  openMessage={openMessage}
                  onCloseMessage={handleCloseMessage}
                  onVideoInLight={onVideoInLight}
                  videoInLight={videoInLight}
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </Box>
  );
}

const VideoWrapper = memo(function VideoWrapper(props) {
  const {
    ytID,
    movie,
    muted,
    index,
    setMuted,
    setVideoRef,
    isDesktop,
    currentVideoPos,
    autoplay,
    isReady,
    openMessage,
    onCloseMessage,
    onVideoInLight,
  } = props;

  const ytRef = useRef(null);
  const [stateProgress, setStateProgress] = useState({
    duration: 0,
    playedSeconds: 0,
  });

  const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

  const isLight = currentVideoPos - index > 10;

  const handleProgress = ({ playedSeconds }) => {
    setStateProgress({ ...stateProgress, playedSeconds });
  };
  const handleDuration = (duration) => {
    setStateProgress({ ...stateProgress, duration });
  };

  const seekHandler = (value) => {
    setStateProgress({
      ...stateProgress,
      playedSeconds: value,
    });
    ytRef.current.seekTo(value, "second");
  };

  useEffect(() => {
    if (isLight) {
      onVideoInLight(index);
    }
  }, [currentVideoPos, isLight]);

  return (
    <CustomController
      videoRef={ytRef}
      activePlayer={index === currentVideoPos}
      stateProgress={stateProgress}
      seekHandler={seekHandler}
      {...props}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          "& iframe": {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "300%",
            transform: isDesktop
              ? "translate(-50%, -50%) rotateX(40deg)"
              : "translate(-50%, -50%) scale3d(1.5, 1.5, 1.5)",
          },
        }}
      >
        <YouTubePlayer
          ref={(ref) => {
            ytRef.current = ref;
            if (ref) {
              setVideoRef(ref);
            }
          }}
          controls={false}
          light={isLight}
          loop
          muted={muted}
          playing={autoplay}
          width="100%"
          height="100%"
          playsinline
          url={`${YOUTUBE_URL}${ytID || "L3oOldViIgY"}`}
          style={{
            pointerEvents: "none",
          }}
          onProgress={handleProgress}
          onDuration={handleDuration}
          // onPlay={onResumePlayer(index)}
          // onReady={onReadyPlayer(index)}
          // onPause={() => setIsPause(true)}
          // onPlay={() => setIsPause(false)}
        />
      </Box>
    </CustomController>
  );
});

const CustomController = memo(function CustomController(props) {
  const {
    videoRef,
    muted,
    setMuted,
    // setIsPause,,
    isDesktop,
    stateProgress,
    seekHandler,
    isReady,
    activePlayer,
    openMessage,
    onCloseMessage,
    movie,
    index,
    children,
  } = props;

  const [isPause, setIsPaused] = useState(false);
  const [openControl, setOpenControl] = useState(false);

  useEffect(() => {
    setIsPaused(false);
  }, [activePlayer]);

  const handleClick = () => {
    if (!openControl) {
      setOpenControl(true);
    } else {
    }

    if (videoRef.current) {
      const currentPlayer = videoRef.current?.getInternalPlayer();

      if (!isPause) {
        currentPlayer.pauseVideo();
        setIsPaused(true);
      } else {
        currentPlayer.playVideo();
        setIsPaused(false);
      }
    }
  };

  const handleActiveMessage = () => {
    const currentPlayer = videoRef.current?.getInternalPlayer();

    onCloseMessage();
    currentPlayer?.unMute();
    setMuted(false);
  };

  const heightHeaderBar = isDesktop ? 45 : 80;
  const heightFooter = 20;
  const marginExtra = 30;
  const aggregateHeight = heightHeaderBar + heightFooter + marginExtra;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: `${heightHeaderBar}px`,
          left: 0,
          width: "100vw",
          height: `calc(100% - ${aggregateHeight}px)`,
          background: isPause ? "#00000070" : "transparent",
          transition: "background 0.3s cubic-bezier(0, 0.71, 0.2, 1.01)",
          userSelect: "none",
        }}
        onClick={handleClick}
      />
      {isPause && (
        <Box
          sx={{
            zIndex: 1001,
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "90px",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleClick}
        >
          <IconButton>
            <PlayArrowIcon
              sx={{ width: "80px", height: "80px", filter: "brightness(0.7)" }}
            />
          </IconButton>
        </Box>
      )}
      {openMessage && (
        <Chip
          sx={{
            position: "absolute",
            zIndex: 1001,
            top: isDesktop ? "85px" : "155px",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          label="Riattiva audio"
          onClick={handleActiveMessage}
          onDelete={onCloseMessage}
        />
      )}
      <HeaderControll
        isDesktop={isDesktop}
        height={heightHeaderBar}
        movie={movie}
      />
      <Box sx={{ height: "100%" }}>{children}</Box>
      <Box
        sx={{
          background: isDesktop ? "transparent" : "black",
          display: "flex",
          gap: "10px",
          height: `${heightFooter}px`,
          padding: isDesktop ? "15px" : "20px 15px",
          userSelect: "none",
        }}
      >
        <Slider
          className="slider-custom-player"
          disabled={!isReady}
          size="small"
          value={stateProgress.playedSeconds}
          min={0.9}
          step={0.1}
          max={stateProgress.duration || 100}
          onChange={(_, value) => seekHandler(value)}
          sx={{
            color: "#fff",
            filter: "brightness(0.7)",
            height: 4,
            alignSelf: "end",
            padding: "6px 0!important",
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
              },
              "&.Mui-active": {
                width: 20,
                height: 20,
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.28,
            },
          }}
        />
        {muted ? (
          <IconButton
            disabled={!isReady}
            sx={{ padding: 0, alignItems: "end" }}
            onClick={() => setMuted(false)}
          >
            <VolumeOffIcon
              // fontSize={isDesktop ? "large" : "medium"}
              sx={{ filter: "brightness(0.7)" }}
            />
          </IconButton>
        ) : (
          <IconButton
            disabled={!isReady}
            sx={{ padding: 0, alignItems: "end" }}
            onClick={() => setMuted(true)}
          >
            <VolumeUpIcon
              // fontSize={isDesktop ? "large" : "medium"}
              sx={{ filter: "brightness(0.7)" }}
            />
          </IconButton>
        )}
      </Box>
    </Box>
  );
});

const HeaderControll = memo(function HeaderControll(props) {
  const { isDesktop, height, movie } = props;

  return (
    <Box
      sx={{
        px: 1,
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: isDesktop ? "nowrap" : "wrap",
        gap: 1.5,
      }}
    >
      <IconButton LinkComponent={Link} to="/home">
        <ArrowBackIosNewIcon />
      </IconButton>
      <Typography
        sx={{
          flex: 1,
          textAlign: "center",
          textWrap: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: isDesktop ? "10%" : "60%",
          mr: !isDesktop ? "40px" : 0,
        }}
        variant="h6"
      >
        {movie?.title}
      </Typography>
      <InfoGenresList isDesktop={isDesktop} movie={movie} />
    </Box>
  );
});

const InfoGenresList = memo(function InfoGenresList({
  mediaType = "movie",
  movie,
  isDesktop,
}) {
  const currentGenresList = mediaType === "movie" ? genresList : genresListTv;

  const currGenres = currentGenresList
    .map(({ id, name }) => {
      if (movie?.genre_ids.includes(id)) {
        return name;
      } else {
        return null;
      }
    })
    .filter(Boolean);

  const otherStyle = !isDesktop
    ? {
        flex: 1,
        justifyContent: "center",
      }
    : {};

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        userSelect: "none",
        ...otherStyle,
      }}
    >
      {currGenres?.map((name) => {
        return <Chip key={name} size="small" color="secondary" label={name} />;
      })}
    </Box>
  );
});
