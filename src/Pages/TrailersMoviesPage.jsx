import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@emotion/react";
import ReactPlayer from "react-player/youtube";
import { useInfiniteQuery } from "react-query";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { fetchTrailersMovies } from "../api/tmdbApis";
import LoadingPage from "../components/LoadingPage";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";

import "./TrailersMoviesPage.css";

export default function TrailersMoviesPage() {
  const videoRefs = useRef([]);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [muted, setMuted] = useState(true);

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
    queryFn: ({ pageParam = currentPage + 1 }) => {
      dispatch(setQuery({ showTrailerCurrentPage: pageParam }));
      return fetchTrailersMovies(pageParam);
    },
  });

  const trailers = data?.pages
    ?.flatMap((data) => data)
    .reduce((prev, curr) => {
      return {
        ...curr,
        results: prev?.results
          ? prev.results.concat(curr.results)
          : curr.results,
      };
    }, {});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8, // Adjust this value to change the scroll trigger point
    };

    // This function handles the intersection of videos
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoElement = entry.target;
          const dataIndex = videoElement.getAttribute("data-index");

          const currentPlayer =
            videoRefs.current[dataIndex]?.getInternalPlayer();
          7;

          if (currentPlayer) {
            currentPlayer.playVideo();
          }
        } else {
          const videoElement = entry.target;
          const dataIndex = videoElement.getAttribute("data-index");

          const currentPlayer =
            videoRefs.current[dataIndex]?.getInternalPlayer();
          if (currentPlayer) {
            currentPlayer.pauseVideo();
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    const videos = document.querySelectorAll(".player");

    // We observe each video reference to trigger play/pause
    videoRefs.current.forEach((_, index) => {
      observer.observe(videos[index]);
    });

    // We disconnect the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [trailers]);

  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  console.log("tr", trailers);

  return (
    <Box
      className="container"
      sx={{
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
          setVideoRef={handleVideoRef(index)}
          autoplay={index === 0}
          index={index}
          muted={muted}
          setMuted={setMuted}
          isDesktop={isDesktop}
        />
      ))}
    </Box>
  );
}

const VideoCard = (props) => {
  const { ytID, setVideoRef, autoplay, index, muted, setMuted, isDesktop } =
    props;
  const videoRef = useRef(null);
  const [stateProgress, setStateProgress] = useState({
    duration: 0,
    playedSeconds: 0,
  });
  const [isReady, setIsReady] = useState(false);
  const [isPause, setIsPause] = useState(false);

  const onVideoPress = () => {
    if (videoRef.current) {
      const internalPlayer = videoRef.current.getInternalPlayer();
      if (!isPause) {
        internalPlayer.pauseVideo();
      } else {
        internalPlayer.playVideo();
      }
    }
  };

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
  const handleReadyPlayer = () => {
    setIsReady(true);
  };

  const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

  return (
    <div className="player" data-index={index} onClick={onVideoPress}>
      <ReactPlayer
        ref={(ref) => {
          videoRef.current = ref;
          if (ref) {
            setVideoRef(ref);
          }
        }}
        playsinline
        url={`${YOUTUBE_URL}${ytID || "L3oOldViIgY"}`}
        style={{
          pointerEvents: "none",
        }}
        width="100%"
        height="100%"
        controls={false}
        playing={autoplay}
        muted={muted}
        loop
        onProgress={handleProgress}
        onDuration={handleDuration}
        onReady={handleReadyPlayer}
        onPause={() => setIsPause(true)}
        onPlay={() => setIsPause(false)}
      />
      {/* <Controller
          videoRef={videoRef}
          muted={muted}
          setMuted={setMuted}
          isDesktop={isDesktop}
          stateProgress={stateProgress}
          seekHandler={seekHandler}
          isReady={isReady}
          isPause={isPause}
        /> */}
    </div>
  );
};

function Controller({
  videoRef,
  muted,
  setMuted,
  isDesktop,
  stateProgress,
  seekHandler,
  isReady,
  isPause,
}) {
  const handleClick = () => {
    if (videoRef.current) {
      const currentPlayer = videoRef.current?.getInternalPlayer();

      if (!isPause) {
        currentPlayer.pauseVideo();
      } else {
        currentPlayer.playVideo();
      }
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
    </Box>
  );
}
