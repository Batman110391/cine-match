import { useTheme } from "@emotion/react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Slider,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrailersMovies } from "../api/tmdbApis";
import CloseIcon from "@mui/icons-material/Close";
import { useInView } from "react-intersection-observer";

import { memo } from "react";
import { setQuery } from "../store/movieQuery";
import "./TrailersMoviesPage.css";

function buildThresholdList(trailers) {
  let thresholds = [];
  let numSteps = trailers?.results?.length;

  for (let i = 3.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

export default function TrailersMoviesPage() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [trailers, setTrailers] = useState(null);
  const [muted, setMuted] = useState(true);
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
      dispatch(setQuery({ showTrailerCurrentPage: pageParam }));
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

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  console.log("trailers", trailers?.results?.length);

  const isReady = true;
  // currentVideoPos + 1 < trailers?.results?.length
  //   ? stateVideoPlayer?.[`videoPlayer${currentVideoPos + 1}`] &&
  //     status !== "loading"
  //   : true;

  return (
    <Box
      className="container"
      sx={{
        overflow: isReady ? "scroll" : "hidden",
        height: "100%",
        width: "100%",
        position: "relative",
        paddingBottom: isDesktop ? "25px" : 0,
        paddingTop: isDesktop ? "5px" : 0,
      }}
    >
      {trailers?.results?.map((video, index) => (
        <VideoCard
          key={index}
          ytID={video.ytID}
          movie={video.movie}
          index={index}
          muted={muted}
          setMuted={setMuted}
          isDesktop={isDesktop}
          isReady={isReady}
          openMessage={openMessage}
          onCloseMessage={handleCloseMessage}
          trailers={trailers?.results}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      ))}
    </Box>
  );
}

const VideoCard = memo((props) => {
  const {
    ytID,
    index,
    muted,
    isReady,
    setMuted,
    isDesktop,
    openMessage,
    onCloseMessage,
    trailers,
    fetchNextPage,
    hasNextPage,
    movie,
  } = props;
  const { ref, inView, entry } = useInView({
    rootMargin: "0px",
    threshold: buildThresholdList(trailers),
  });

  const videoRef = useRef(null);
  const [stateProgress, setStateProgress] = useState({
    duration: 0,
    playedSeconds: 0,
  });

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
    videoRef.current.seekTo(value, "second");
  };

  const handlePlay = () => {
    // if (!muted && inView) {
    //   console.log("test");
    //   videoRef?.current?.getInternalPlayer()?.unMute();
    // }
  };

  useEffect(() => {
    if (inView) {
      if (trailers?.length - index < 5 && hasNextPage) {
        fetchNextPage();
      }
    }
  }, [inView]);

  const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

  //console.log("movie", movie);

  return (
    <Box
      ref={ref}
      sx={{
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
      className="player"
      data-index={index}
    >
      <Box sx={{ position: "absolute", zIndex: 2000 }}>{index}</Box>
      <ReactPlayer
        ref={videoRef}
        playsinline
        url={`${YOUTUBE_URL}${ytID || "L3oOldViIgY"}`}
        // style={{
        //   pointerEvents: "none",
        // }}
        width="100%"
        height="100%"
        controls={false}
        playing={inView}
        muted={muted}
        loop
        onProgress={handleProgress}
        onDuration={handleDuration}
        //onReady={onReadyPlayer(index)}
        onError={(err) => console.log("err", err)}
        config={{
          yourube: {
            onUnstarted: () => console.log("what"),
          },
        }}
        //onPause={onReadyPlayer(index)}
        onPlay={handlePlay}
      />
      <Controller
        videoRef={videoRef}
        muted={muted}
        setMuted={setMuted}
        isDesktop={isDesktop}
        stateProgress={stateProgress}
        seekHandler={seekHandler}
        isReady={isReady}
        activePlayer={inView}
        openMessage={openMessage}
        onCloseMessage={onCloseMessage}
      />
    </Box>
  );
});

const Controller = memo((props) => {
  const {
    videoRef,
    muted,
    setMuted,
    isDesktop,
    stateProgress,
    seekHandler,
    isReady,
    activePlayer,
    openMessage,
    onCloseMessage,
  } = props;

  const [isPause, setIsPaused] = useState(false);

  useEffect(() => {
    setIsPaused(false);
  }, [activePlayer]);

  const handleClick = (e) => {
    e.preventDefault();
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

  const handleMuted = (bool) => {
    const currentPlayer = videoRef.current?.getInternalPlayer();
    if (bool) {
      setMuted(true);
      currentPlayer?.mute();
    } else {
      setMuted(false);
      currentPlayer?.unMute();
    }
  };

  return (
    <Box
      sx={{
        zIndex: 1000,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100%",
        background: "transparent",
      }}
    >
      <Box
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100%",
          background: isPause ? "#00000070" : "transparent",
          transition: "background 0.3s cubic-bezier(0, 0.71, 0.2, 1.01)",
        }}
        onClick={handleClick}
      />
      <Box
        sx={{
          zIndex: 1001,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: isDesktop ? "60px" : "90px",
          background: isDesktop ? "transparent" : "black",
        }}
      />
      <Box
        sx={{
          zIndex: 1001,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: isDesktop ? "40px" : "240px",
          background: isDesktop ? "transparent" : "black",
          display: "flex",
          gap: "10px",
          padding: isDesktop ? "0 15px" : "20px 15px",
        }}
      >
        <Slider
          className="slider-custom-player"
          disabled={!isReady}
          size="small"
          value={stateProgress.playedSeconds}
          min={0.5}
          step={0.00000001}
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
            onClick={() => handleMuted(false)}
          >
            <VolumeOffIcon sx={{ filter: "brightness(0.7)" }} />
          </IconButton>
        ) : (
          <IconButton
            disabled={!isReady}
            sx={{ padding: 0, alignItems: "end" }}
            onClick={() => handleMuted(true)}
          >
            <VolumeUpIcon sx={{ filter: "brightness(0.7)" }} />
          </IconButton>
        )}
      </Box>
      {openMessage && (
        <Chip
          sx={{
            position: "absolute",
            zIndex: 1001,
            top: "65px",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          label="Riattiva audio"
          onClick={handleActiveMessage}
          onDelete={onCloseMessage}
        />
      )}
      {isPause && (
        <Box
          sx={{
            zIndex: 1005,
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
    </Box>
  );
});
