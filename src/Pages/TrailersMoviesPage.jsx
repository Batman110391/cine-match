import { useTheme } from "@emotion/react";
import React, { useRef, useState } from "react";
import YouTubePlayer from "react-player/youtube";
import { useInfiniteQuery, useQuery } from "react-query";
import { Mousewheel, Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchTrailersMovies } from "../api/tmdbApis";
import { Box, IconButton, Slider, useMediaQuery } from "@mui/material";
import LoadingPage from "../components/LoadingPage";

// Import Swiper styles
import "swiper/css";
import "swiper/css/virtual";
//import "swiper/css/mousewheel";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useEffect } from "react";

export default function TrailersMoviesPage() {
  const videoRefs = useRef([]);
  const theme = useTheme();

  const [currentVideoPos, setCurrentVideoPos] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPause, setIsPause] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

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
    queryFn: ({ pageParam = 1 }) => fetchTrailersMovies(pageParam),
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

  const optionsMobileSwiper = {
    // resistance: false,
    // resistanceRatio: 6,
    modules: [Virtual],
  };

  const optionsDesktopSwiper = {
    cssMode: true,
    mousewheel: true,
    modules: [Mousewheel, Virtual],
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleVideoRef = (index) => (ref) => {
    // if (videoRefs.current.length === trailers?.results?.length) {
    //   setFirstRender(false);
    // }

    if (index !== currentVideoPos) {
      ref.seekTo(0.5, "second");
    }
    videoRefs.current[index] = ref;
  };

  const handleSlideChange = (info) => {
    // const prevVideo = info.previousIndex;
    // videoRefs.current[prevVideo].seekTo(0.5, "second");
    const currentVideoPos = info.activeIndex;

    if (trailers?.results?.length - currentVideoPos <= 5 && hasNextPage) {
      fetchNextPage();
    }

    setCurrentVideoPos(currentVideoPos);
    setIsPause(false);
  };

  if (status === "loading") return <LoadingPage />;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        paddingBottom: isDesktop ? "40px" : 0,
      }}
    >
      <Swiper
        style={{
          width: "100%",
          height: "100%",
        }}
        direction={"vertical"}
        spaceBetween={3}
        {...(isDesktop ? optionsDesktopSwiper : optionsMobileSwiper)}
        onSlideChange={handleSlideChange}
        noSwipingClass=".slider-custom-player"
        virtual={{
          //enabled: true,
          addSlidesBefore: 5,
          addSlidesAfter: 5,
        }}
      >
        {trailers &&
          trailers?.results?.length > 0 &&
          trailers?.results?.map((video, index) => {
            return (
              <SwiperSlide
                key={video.ytID + index}
                virtualIndex={index}
                style={{ width: "100%", height: "100%" }}
              >
                <VideoWrapper
                  key={index}
                  ytID={video.ytID}
                  autoPlay={false}
                  muted={muted}
                  index={index}
                  isCurrentVideo={index === currentVideoPos}
                  setMuted={setMuted}
                  setVideoRef={handleVideoRef(index)}
                  isDesktop={isDesktop}
                  isPause={isPause}
                  setIsPause={setIsPause}
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </Box>
  );
}

function VideoWrapper({
  ytID,
  autoPlay,
  muted,
  index,
  isCurrentVideo,
  setMuted,
  setVideoRef,
  isDesktop,
  setIsPause,
  isPause,
}) {
  const ytRef = useRef(null);
  const [stateProgress, setStateProgress] = useState({
    duration: 0,
    playedSeconds: 0,
  });

  const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

  const handleProgress = ({ playedSeconds }) => {
    setStateProgress({ ...stateProgress, playedSeconds });
  };
  const handleDuration = (duration) => {
    setStateProgress({ ...stateProgress, duration });
  };

  const seekHandler = (value) => {
    console.log("valuew", value);
    setStateProgress({
      ...stateProgress,
      playedSeconds: value,
    });
    ytRef.current.seekTo(value, "second");
  };

  return (
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
          transform: "translate(-50%, -50%)",
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
        loop
        muted={muted}
        playing={isCurrentVideo ? true : autoPlay}
        width="100%"
        height="100%"
        playsinline
        url={`${YOUTUBE_URL}${ytID || "L3oOldViIgY"}`}
        config={{
          youtube: {
            playerVars: { modestbranding: 1 },
          },
        }}
        style={{
          pointerEvents: "none",
        }}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />

      <Controller
        videoRef={ytRef}
        muted={muted}
        setMuted={setMuted}
        setIsPause={setIsPause}
        isPause={isPause}
        isDesktop={isDesktop}
        stateProgress={stateProgress}
        seekHandler={seekHandler}
      />
    </Box>
  );
}

function Controller({
  videoRef,
  muted,
  setMuted,
  isPause,
  setIsPause,
  isDesktop,
  stateProgress,
  seekHandler,
}) {
  const handleClick = () => {
    if (videoRef.current) {
      const currentPlayer = videoRef.current?.getInternalPlayer();

      if (!isPause) {
        currentPlayer.pauseVideo();
        currentPlayer.hideVideoInfo();
        setIsPause(true);
      } else {
        currentPlayer.playVideo();
        setIsPause(false);
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
          size="small"
          value={stateProgress.playedSeconds}
          min={0}
          // step={1}
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
