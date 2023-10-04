import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { fetchTrailersMovies } from "../api/tmdbApis";
import { Box } from "@mui/material";
import LoadingPage from "../components/LoadingPage";
import YouTubePlayer from "react-player/youtube";
import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

export default function TrailersMoviesPage() {
  const videoRefs = useRef([]);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [muted, setMuted] = useState(true);

  const { isLoading, error, data } = useQuery(["trailerMovies"], () =>
    fetchTrailersMovies()
  );

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const videoWrapper = entry.target;

        if (entry.isIntersecting) {
          setCurrentVideo(videoWrapper.index);
        } else {
          videoRefs.current[videoWrapper.index].otherRef.current.seekTo(
            0,
            "second"
          );
        }
      });
    };

    if (data) {
      const observer = new IntersectionObserver(
        handleIntersection,
        observerOptions
      );
      videoRefs.current.forEach((videoRef) => {
        observer.observe(videoRef);
      });
      return () => {
        observer.disconnect();
      };
    }
  }, [data]);

  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <h1>{JSON.stringify(error)}</h1>;

  return (
    <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
      <Box
        sx={{
          position: "relative",
          height: "90vh",
          width: "375px",
          borderRadius: "25px",
          overflow: "scroll",
          scrollSnapType: "y mandatory",
          "& ::--webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          ":-ms-overflow-style": "none",
        }}
      >
        {data.map((video, index) => (
          <VideoWrapper
            key={index}
            ytID={video.ytID}
            setVideoRef={handleVideoRef(index)}
            autoPlay={false}
            muted={muted}
            index={index}
            isCurrentVideo={index === currentVideo}
            setMuted={setMuted}
          />
        ))}
      </Box>
    </Box>
  );
}

function VideoWrapper({
  ytID,
  setVideoRef,
  autoPlay,
  muted,
  index,
  isCurrentVideo,
  setMuted,
}) {
  const ytRef = useRef(null);

  const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

  const handleConfigsChange = () => {
    const isMuted = ytRef?.current?.getInternalPlayer()?.isMuted();
    if (isMuted) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  };

  return (
    <Box
      ref={(ref) => {
        if (ref) {
          ref.index = index;

          if (ytRef && ytRef.current) {
            ref.otherRef = ytRef;
          }
          setVideoRef(ref);
        }
      }}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        textShadow: "0 0 4px rgba(0, 0, 0, 0.5)",
        scrollSnapAlign: "start",
        "&:before": {
          contain: "''",
          display: "block",
          boxShadow: "0 -33px 48px rgba(0, 0, 0, 0.5) inset",
          width: "100%",
          pointerEvents: "none",
          zIndex: 999999,
          height: "100%",
          top: 0,
          left: 0,
          position: "absolute",
          background: "red",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <YouTubePlayer
          ref={ytRef}
          controls={true}
          loop
          muted={muted}
          playing={isCurrentVideo ? true : autoPlay}
          width="100%"
          height="100%"
          //playsinline
          url={`${YOUTUBE_URL}${ytID || "L3oOldViIgY"}`}
          style={{ position: "absolute", top: 0 }}
          onProgress={handleConfigsChange}
          onVol
        />
      </Box>
    </Box>
  );
}
