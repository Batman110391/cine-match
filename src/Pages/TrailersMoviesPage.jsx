import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import YouTubePlayer from "react-player/youtube";
import { useInfiniteQuery } from "react-query";
import { Mousewheel, Virtual } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { fetchTrailersMovies } from "../api/tmdbApis";
import LoadingPage from "../components/LoadingPage";
import { useInView } from "react-intersection-observer";

import "swiper/css";
import "swiper/css/virtual";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";

export default function TrailersMoviesPage() {
  const videoRefs = useRef([]);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [currentVideoPos, setCurrentVideoPos] = useState(0);
  const [muted, setMuted] = useState(true);
  const [trailers, setTrailers] = useState(null);
  const [stateVideoPlayer, setStateVideoPlayer] = useState([true]);

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
  const optionsMobileSwiper = {
    modules: [Virtual],
  };

  const optionsDesktopSwiper = {
    mousewheel: true,
    modules: [Mousewheel, Virtual],
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleVideoRef = (index) => (ref) => {
    // if (!videoRefs?.current?.[index]) {
    //   ref.seekTo(0.9, "second");
    //   videoRefs.current[index] = ref;
    // }
    if (index !== currentVideoPos) {
      ref.seekTo(0.9, "second");
    }
    videoRefs.current[index] = ref;
  };

  const handleSlideChange = (info) => {
    const prevVideo = info.previousIndex;
    videoRefs.current[prevVideo].seekTo(0.9, "second");
    videoRefs.current[prevVideo].getInternalPlayer().pauseVideo();
    const currentVideoPos = info.activeIndex;

    setCurrentVideoPos(currentVideoPos);

    if (trailers?.results?.length - currentVideoPos <= 5 && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleReadyPlayer = () => {
    setStateVideoPlayer([...stateVideoPlayer, true]);
  };

  if (status === "loading") return <LoadingPage />;
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

  // console.log("trailers", trailers?.results);
  console.log("redy", stateVideoPlayer);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        paddingBottom: isDesktop ? "25px" : 0,
        paddingTop: isDesktop ? "5px" : 0,
      }}
    >
      <Swiper
        style={{
          width: "100%",
          height: "100%",
        }}
        direction={"vertical"}
        spaceBetween={5}
        {...(isDesktop ? optionsDesktopSwiper : optionsMobileSwiper)}
        onSlideChange={handleSlideChange}
        noSwipingClass={isDesktop ? "slider-custom-player" : null}
        // resistance={false}
        // resistanceRatio={2}
        threshold={0.5}
        allowSlideNext={stateVideoPlayer?.[currentVideoPos + 1] || false}
        virtual={{
          enabled: true,
          slides: [trailers?.results || []],
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
                  movie={video.movie}
                  muted={muted}
                  index={index}
                  setMuted={setMuted}
                  setVideoRef={handleVideoRef(index)}
                  isDesktop={isDesktop}
                  currentVideoPos={currentVideoPos}
                  autoplay={index === currentVideoPos}
                  isReady={stateVideoPlayer?.[index] || false}
                  onReadyPlayer={handleReadyPlayer}
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
  movie,
  muted,
  index,
  setMuted,
  setVideoRef,
  isDesktop,
  currentVideoPos,
  autoplay,
  isReady,
  onReadyPlayer,
}) {
  // const { ref, inView, entry } = useInView({
  //   /* Optional options */
  //   threshold: 0.85,
  // });

  const ytRef = useRef(null);
  const [stateProgress, setStateProgress] = useState({
    duration: 0,
    playedSeconds: 0,
  });
  // const [isReady, setIsReady] = useState(false);

  const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

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

  // console.log("element", index, " -> in view :  ", inView);

  return (
    <Box
      //ref={ref}
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
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          zIndex: 1001,
          top: 0,
          left: 5,
          p: 0,
          m: 0,
        }}
      >
        {movie?.title}
      </Typography>
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
        playing={autoplay}
        width="100%"
        height="100%"
        playsinline
        url={`${YOUTUBE_URL}${ytID || "L3oOldViIgY"}`}
        style={{
          pointerEvents: "none",
        }}
        onReady={onReadyPlayer}
        onProgress={handleProgress}
        onDuration={handleDuration}
        // onPause={() => setIsPause(true)}
        // onPlay={() => setIsPause(false)}
      />

      <Controller
        videoRef={ytRef}
        muted={muted}
        setMuted={setMuted}
        // setIsPause={setIsPause}
        // isPause={isPause}
        // playerInPause={playerInPause}
        isDesktop={isDesktop}
        stateProgress={stateProgress}
        seekHandler={seekHandler}
        isReady={isReady}
        activePlayer={index === currentVideoPos}
      />
    </Box>
  );
}

function Controller({
  videoRef,
  muted,
  setMuted,
  // setIsPause,,
  isDesktop,
  stateProgress,
  seekHandler,
  isReady,
  activePlayer,
}) {
  const [isPause, setIsPaused] = useState(false);

  useEffect(() => {
    setIsPaused(false);
  }, [activePlayer]);

  const handleClick = () => {
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
          height: isDesktop ? "40px" : "40px",
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
