import { useTheme } from "@emotion/react";
import {
  Button,
  Box,
  Chip,
  IconButton,
  Slider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import YouTubePlayer from "react-player/youtube";
import { useInfiniteQuery } from "react-query";
import { Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchTrailersMovies, genresList, genresListTv } from "../api/tmdbApis";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import { Link } from "react-router-dom";
import { memo } from "react";

import "swiper/css";
import "swiper/css/free-mode";

// ==================== COSTANTI ====================
const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
const FETCH_THRESHOLD = 5;
const LIGHT_MODE_OFFSET = 10;
const DEFAULT_VIDEO_ID = "L3oOldViIgY";

// ==================== COMPONENTE PRINCIPALE ====================
export default function TrailersMoviesPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Refs per gestire i player video
  const playerRefsMap = useRef(new Map());
  const swiperRef = useRef(null);

  const { openDialogMovieDetail } = React.useContext(DialogMovieDetailContext);

  // Stati
  const [currentVideoPos, setCurrentVideoPos] = useState(0);
  const [muted, setMuted] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);
  const [videoInLight, setVideoInLight] = useState(new Set());

  // Query per i trailers
  const { status, error, data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["trailerMovies"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => {
      // Quando cambia pagina, muta automaticamente l'audio
      if (!muted) {
        setMuted(true);
        setOpenMessage(true);
      }
      return fetchTrailersMovies(pageParam);
    },
  });

  // Memoizza i trailers combinati da tutte le pagine
  const trailers = useMemo(() => {
    if (status !== "success" || !data) return [];
    return data.pages?.flatMap((page) => page.results || []) || [];
  }, [data, status]);

  // ==================== GESTIONE VIDEO PLAYERS ====================

  // Funzione per fermare tutti i video tranne quello corrente
  const stopAllVideosExcept = useCallback((currentIndex) => {
    playerRefsMap.current.forEach((player, index) => {
      if (index !== currentIndex && player) {
        try {
          const internalPlayer = player.getInternalPlayer?.();
          if (
            internalPlayer &&
            typeof internalPlayer.pauseVideo === "function"
          ) {
            internalPlayer.pauseVideo();
            // Muta anche il video per sicurezza
            internalPlayer.mute();
            // Resetta il video all'inizio
            player.seekTo(0);
          }
        } catch (err) {
          console.warn(`Errore nel fermare il video ${index}:`, err);
        }
      }
    });
  }, []);

  // Funzione per riprodurre il video corrente
  const playCurrentVideo = useCallback(
    (currentIndex) => {
      const player = playerRefsMap.current.get(currentIndex);
      if (player) {
        try {
          const internalPlayer = player.getInternalPlayer?.();
          if (internalPlayer) {
            // Smuta solo se lo stato globale è unmuted
            if (!muted) {
              internalPlayer.unMute();
            } else {
              internalPlayer.mute();
            }
            // Avvia la riproduzione
            if (typeof internalPlayer.playVideo === "function") {
              internalPlayer.playVideo();
            }
          }
        } catch (err) {
          console.warn(`Errore nel riprodurre il video ${currentIndex}:`, err);
        }
      }
    },
    [muted]
  );

  // ==================== HANDLERS ====================

  const handleSlideChange = useCallback(
    (swiper) => {
      const newPosition = swiper.activeIndex;

      // Ferma tutti i video tranne quello corrente
      stopAllVideosExcept(newPosition);

      // Aggiorna la posizione corrente
      setCurrentVideoPos(newPosition);

      // Riproduce il nuovo video corrente dopo un breve delay
      setTimeout(() => {
        playCurrentVideo(newPosition);
      }, 100);

      // Precarica le prossime pagine se necessario
      if (trailers.length - newPosition <= FETCH_THRESHOLD && hasNextPage) {
        fetchNextPage();
      }
    },
    [
      stopAllVideosExcept,
      playCurrentVideo,
      trailers.length,
      hasNextPage,
      fetchNextPage,
    ]
  );

  const handleCloseMessage = useCallback(() => {
    setOpenMessage(false);
  }, []);

  const onVideoInLight = useCallback((index) => {
    setVideoInLight((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const newMuted = !prev;
      // Applica immediatamente il cambio al video corrente
      const currentPlayer = playerRefsMap.current.get(currentVideoPos);
      if (currentPlayer) {
        try {
          const internalPlayer = currentPlayer.getInternalPlayer?.();
          if (internalPlayer) {
            if (newMuted) {
              internalPlayer.mute();
            } else {
              internalPlayer.unMute();
            }
          }
        } catch (err) {
          console.warn("Errore nel toggle mute:", err);
        }
      }
      return newMuted;
    });
  }, [currentVideoPos]);

  // Registra il player nella mappa
  const registerPlayer = useCallback((index, player) => {
    if (player) {
      playerRefsMap.current.set(index, player);
    } else {
      playerRefsMap.current.delete(index);
    }
  }, []);

  const handleClickItem = (movieID, type) => {
    openDialogMovieDetail(movieID, type);
  };

  // ==================== EFFECTS ====================

  // Cleanup quando il componente viene smontato
  useEffect(() => {
    return () => {
      // Ferma tutti i video quando si esce dalla pagina
      playerRefsMap.current.forEach((player) => {
        try {
          const internalPlayer = player?.getInternalPlayer?.();
          if (
            internalPlayer &&
            typeof internalPlayer.pauseVideo === "function"
          ) {
            internalPlayer.pauseVideo();
          }
        } catch (err) {
          console.warn("Errore nel cleanup:", err);
        }
      });
      playerRefsMap.current.clear();
    };
  }, []);

  // Sincronizza mute con il video corrente quando cambia lo stato muted
  useEffect(() => {
    const currentPlayer = playerRefsMap.current.get(currentVideoPos);
    if (currentPlayer) {
      try {
        const internalPlayer = currentPlayer.getInternalPlayer?.();
        if (internalPlayer) {
          if (muted) {
            internalPlayer.mute();
          } else {
            internalPlayer.unMute();
          }
        }
      } catch (err) {
        console.warn("Errore nella sincronizzazione mute:", err);
      }
    }
  }, [muted, currentVideoPos]);

  // ==================== OPZIONI SWIPER ====================

  const swiperOptions = useMemo(
    () => ({
      direction: "vertical",
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 300,
      resistance: true,
      resistanceRatio: 0,
      threshold: 5,
      touchRatio: 1,
      touchAngle: 45,
      followFinger: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      ...(isDesktop && {
        mousewheel: {
          sensitivity: 1,
          releaseOnEdges: true,
        },
        modules: [Mousewheel],
      }),
    }),
    [isDesktop]
  );

  // ==================== RENDER ====================

  if (status === "error") {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Errore nel caricamento dei video
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {error?.message || JSON.stringify(error)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <Swiper
        ref={swiperRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="trailers-swiper"
        {...swiperOptions}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {trailers.map((video, index) => (
          <SwiperSlide
            key={`${video.ytID}-${index}`}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <VideoWrapper
              ytID={video.ytID}
              movie={video.movie}
              muted={muted}
              index={index}
              onToggleMute={handleToggleMute}
              isDesktop={isDesktop}
              currentVideoPos={currentVideoPos}
              isActive={index === currentVideoPos}
              openMessage={openMessage}
              onCloseMessage={handleCloseMessage}
              onVideoInLight={onVideoInLight}
              videoInLight={videoInLight}
              registerPlayer={registerPlayer}
              handleClickItem={handleClickItem}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

// ==================== VIDEO WRAPPER ====================

const VideoWrapper = memo(function VideoWrapper({
  ytID,
  movie,
  muted,
  index,
  onToggleMute,
  isDesktop,
  currentVideoPos,
  isActive,
  openMessage,
  onCloseMessage,
  onVideoInLight,
  videoInLight,
  registerPlayer,
  handleClickItem,
}) {
  const ytRef = useRef(null);
  const isSeeking = useRef(false);
  const lastProgressUpdate = useRef(0);

  const [stateProgress, setStateProgress] = useState({
    duration: 0,
    playedSeconds: 0,
    loaded: 0,
  });
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Determina se il video deve essere in modalità "light" (thumbnail)
  const isLight = currentVideoPos - index > LIGHT_MODE_OFFSET;

  // ==================== HANDLERS VIDEO ====================

  const handleProgress = useCallback((state) => {
    // Non aggiornare il progresso se l'utente sta usando lo slider
    if (isSeeking.current) return;

    const newPlayedSeconds = state.playedSeconds || 0;

    // Previeni aggiornamenti troppo frequenti (throttle a 100ms)
    const now = Date.now();
    if (now - lastProgressUpdate.current < 100) return;
    lastProgressUpdate.current = now;

    // Previeni salti all'indietro del progresso
    setStateProgress((prev) => {
      const shouldUpdate =
        newPlayedSeconds >= prev.playedSeconds ||
        Math.abs(newPlayedSeconds - prev.playedSeconds) > 1;

      if (!shouldUpdate) return prev;

      return {
        duration: prev.duration || state.duration || 0,
        playedSeconds: newPlayedSeconds,
        loaded: state.loaded || 0,
      };
    });
  }, []);

  const handleDuration = useCallback((duration) => {
    // Imposta la durata solo una volta quando è disponibile
    setStateProgress((prev) => {
      // Non sovrascrivere se già abbiamo una durata valida
      if (prev.duration > 0 && Math.abs(prev.duration - duration) < 1) {
        return prev;
      }
      return { ...prev, duration };
    });
  }, []);

  const handleReady = useCallback(() => {
    setIsReady(true);
    // Reset del progresso quando il video è pronto
    setStateProgress({
      duration: 0,
      playedSeconds: 0,
      loaded: 0,
    });
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    isSeeking.current = false;
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleSeekStart = useCallback(() => {
    isSeeking.current = true;
  }, []);

  const handleSeekChange = useCallback((value) => {
    // Aggiorna immediatamente lo stato visivo dello slider
    setStateProgress((prev) => ({
      ...prev,
      playedSeconds: value,
    }));
  }, []);

  const handleSeekEnd = useCallback(
    (value) => {
      if (ytRef.current && isReady) {
        // Esegui il seek sul video
        ytRef.current.seekTo(value, "seconds");

        // Riabilita gli aggiornamenti del progresso dopo un breve delay
        setTimeout(() => {
          isSeeking.current = false;
        }, 200);
      }
    },
    [isReady]
  );

  // ==================== EFFECTS ====================

  // Registra il player quando è pronto
  useEffect(() => {
    if (ytRef.current) {
      registerPlayer(index, ytRef.current);
    }
    return () => {
      registerPlayer(index, null);
    };
  }, [index, registerPlayer]);

  // Segna il video come "light" quando è troppo lontano
  useEffect(() => {
    if (isLight && !videoInLight.has(index)) {
      onVideoInLight(index);
    }
  }, [isLight, index, onVideoInLight, videoInLight]);

  // Resetta lo stato quando il video diventa inattivo
  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
      isSeeking.current = false;
      // Reset del progresso quando diventa inattivo
      setStateProgress({
        duration: 0,
        playedSeconds: 0,
        loaded: 0,
      });
    }
  }, [isActive]);

  // ==================== STYLES ====================

  const playerContainerStyle = useMemo(
    () => ({
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      "& > div": {
        position: "absolute !important",
        top: "50% !important",
        left: "50% !important",
        width: "100vw !important",
        height: isDesktop ? "100vh !important" : "56.25vw !important",
        minHeight: "100vh !important",
        transform: "translate(-50%, -50%) !important",
      },
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
    }),
    [isDesktop]
  );

  // ==================== RENDER ====================

  return (
    <CustomController
      videoRef={ytRef}
      isActive={isActive}
      stateProgress={stateProgress}
      muted={muted}
      onToggleMute={onToggleMute}
      isDesktop={isDesktop}
      openMessage={openMessage}
      onCloseMessage={onCloseMessage}
      movie={movie}
      isReady={isReady}
      isPlaying={isPlaying}
      handleClickItem={handleClickItem}
    >
      <Box sx={playerContainerStyle}>
        <YouTubePlayer
          ref={ytRef}
          url={`${YOUTUBE_URL}${ytID || DEFAULT_VIDEO_ID}`}
          playing={isActive}
          loop
          muted={muted}
          controls={false}
          light={isLight}
          width="100%"
          height="100%"
          playsinline
          pip={false}
          config={{
            youtube: {
              playerVars: {
                autoplay: isActive ? 1 : 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                cc_load_policy: 0,
              },
            },
          }}
          style={{
            pointerEvents: "none",
          }}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </Box>
    </CustomController>
  );
});

// ==================== CUSTOM CONTROLLER ====================

const CustomController = memo(function CustomController({
  videoRef,
  muted,
  onToggleMute,
  isDesktop,
  stateProgress,
  onSeekStart,
  onSeekChange,
  onSeekEnd,
  isActive,
  openMessage,
  onCloseMessage,
  movie,
  isReady,
  isPlaying,
  children,
  handleClickItem,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const isSeekingRef = useRef(false);

  // ==================== EFFECTS ====================

  // Sincronizza lo slider con il progresso del video
  useEffect(() => {
    if (!isSeekingRef.current) {
      setSliderValue(stateProgress.playedSeconds);
    }
  }, [stateProgress.playedSeconds]);

  // Resetta la pausa quando cambia video
  useEffect(() => {
    if (isActive) {
      setIsPaused(false);
    }
  }, [isActive]);

  // ==================== HANDLERS ====================

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current || !isReady) return;

    const internalPlayer = videoRef.current.getInternalPlayer?.();
    if (!internalPlayer) return;

    try {
      if (isPaused || !isPlaying) {
        internalPlayer.playVideo();
        setIsPaused(false);
      } else {
        internalPlayer.pauseVideo();
        setIsPaused(true);
      }
    } catch (err) {
      console.warn("Errore nel toggle play/pause:", err);
    }
  }, [isPaused, isPlaying, isReady, videoRef]);

  const handleActivateAudio = useCallback(() => {
    onCloseMessage();
    onToggleMute();
  }, [onCloseMessage, onToggleMute]);

  // Handler per inizio drag dello slider
  const handleSliderChangeStart = useCallback(() => {
    isSeekingRef.current = true;
    onSeekStart();
  }, [onSeekStart]);

  // Handler per movimento dello slider
  const handleSliderChange = useCallback(
    (_, value) => {
      setSliderValue(value);
      onSeekChange(value);
    },
    [onSeekChange]
  );

  // Handler per fine drag dello slider
  const handleSliderChangeEnd = useCallback(
    (_, value) => {
      isSeekingRef.current = false;
      onSeekEnd(value);
    },
    [onSeekEnd]
  );

  // ==================== DIMENSIONS ====================

  const dimensions = useMemo(() => {
    const heightHeaderBar = isDesktop ? 60 : 70;
    const heightFooter = isDesktop ? 60 : 140;
    const clickableAreaTop = heightHeaderBar;
    const clickableAreaHeight = `calc(100% - ${
      heightHeaderBar + heightFooter
    }px)`;

    return {
      heightHeaderBar,
      heightFooter,
      clickableAreaTop,
      clickableAreaHeight,
    };
  }, [isDesktop]);

  // ==================== STYLES ====================

  const sliderSx = useMemo(
    () => ({
      color: "#fff",
      height: 3,
      padding: "13px 0 !important",
      "& .MuiSlider-thumb": {
        width: 12,
        height: 12,
        backgroundColor: "#fff",
        transition: "width 0.2s, height 0.2s",
        "&:hover, &.Mui-focusVisible, &.Mui-active": {
          width: 16,
          height: 16,
          boxShadow: "0 0 0 8px rgba(255, 255, 255, 0.16)",
        },
      },
      "& .MuiSlider-rail": {
        opacity: 0.3,
        backgroundColor: "#fff",
      },
      "& .MuiSlider-track": {
        backgroundColor: "#fff",
      },
    }),
    []
  );

  // ==================== RENDER ====================

  return (
    <Box
      sx={{
        position: "relative",
        height: "100svh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000",
        touchAction: "pan-y",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <HeaderController
          isDesktop={isDesktop}
          height={dimensions.heightHeaderBar}
          movie={movie}
          handleClickItem={handleClickItem}
        />
      </Box>

      {/* Area cliccabile centrale per play/pause */}
      <Box
        sx={{
          position: "absolute",
          top: dimensions.clickableAreaTop,
          left: 0,
          right: 0,
          height: dimensions.clickableAreaHeight,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={handlePlayPause}
      >
        {/* Icona Play quando in pausa */}
        {isPaused && (
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              animation: "fadeIn 0.2s ease-in-out",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "scale(0.8)" },
                to: { opacity: 1, transform: "scale(1)" },
              },
            }}
          >
            <PlayArrowIcon
              sx={{
                fontSize: 48,
                color: "#fff",
                ml: 0.5,
              }}
            />
          </Box>
        )}
      </Box>

      {/* Messaggio riattiva audio */}
      {openMessage && isActive && (
        <Chip
          sx={{
            position: "absolute",
            zIndex: 150,
            top: dimensions.heightHeaderBar + 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            "& .MuiChip-deleteIcon": {
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
          label="Tocca per attivare l'audio"
          onClick={handleActivateAudio}
          onDelete={onCloseMessage}
        />
      )}

      {/* Video Player */}
      <Box sx={{ flex: 1, position: "relative" }}>{children}</Box>

      {/* Footer con controlli */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          padding: isDesktop ? "20px 24px" : "20px 16px",
          // paddingBottom: isDesktop
          //   ? "20px"
          //   : "calc(env(safe-area-inset-bottom, 0px) + 100px)",
          pointerEvents: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
            pointerEvents: "auto",
          }}
        >
          {/* Slider progresso */}
          <Slider
            className="slider-custom-player"
            size="small"
            value={sliderValue}
            min={0}
            step={0.01}
            max={stateProgress.duration || 100}
            onChangeCommitted={handleSliderChangeEnd}
            onChange={handleSliderChange}
            onMouseDown={handleSliderChangeStart}
            onTouchStart={handleSliderChangeStart}
            disabled={!isReady || stateProgress.duration === 0}
            sx={sliderSx}
          />

          {/* Pulsante volume */}
          <IconButton
            onClick={onToggleMute}
            disabled={!isReady}
            sx={{
              padding: 1,
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            {muted ? (
              <VolumeOffIcon fontSize={isDesktop ? "medium" : "small"} />
            ) : (
              <VolumeUpIcon fontSize={isDesktop ? "medium" : "small"} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
});

// ==================== HEADER CONTROLLER ====================

const HeaderController = memo(function HeaderController({
  isDesktop,
  height,
  movie,
  handleClickItem,
}) {
  return (
    <Box
      sx={{
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        // justifyContent: "space-between",
        padding: "0 16px",
        gap: 2,
      }}
    >
      {/* Pulsante indietro */}

      <IconButton
        component={Link}
        to="/home"
        sx={{
          color: "#fff",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      {/* Titolo film */}
      <Button onClick={() => handleClickItem(movie.id, "movie")}>
        <Typography
          // variant={isDesktop ? "h6" : "body1"}
          sx={{
            flex: 1,
            fontWeight: 600,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {movie?.title}
        </Typography>
      </Button>
    </Box>
  );
});
