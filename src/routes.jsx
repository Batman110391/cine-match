import React from "react";

import SearchPage from "./Pages/SearchPage";
import MoviesAndTvPages from "./Pages/MoviesAndTvPages";
import LetterboxdRaccomendations from "./Pages/LetterboxdRaccomendations";
import NewsMovie from "./Pages/NewsMovie";
import TrailersMoviesPage from "./Pages/TrailersMoviesPage";

import LiveTvIcon from "@mui/icons-material/LiveTv";
import MovieIcon from "@mui/icons-material/Movie";
import SearchIcon from "@mui/icons-material/Search";
import Letterboxd from "./components/icons/Letterboxd";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import TheatersIcon from "@mui/icons-material/Theaters";
import AdaptiveStreamingVideoPlayer from "./components/AdaptiveStreamingVideoPlayer";

export const routes = [
  {
    name: "Scopri",
    icon: <SearchIcon />,
    key: "homepage",
    route: "/home",
    component: <SearchPage />,
  },
  {
    name: "Film",
    icon: <MovieIcon />,
    key: "movies",
    route: "/movies/:movieID?/:type?",
    exact: false,
    component: <MoviesAndTvPages typeSearch={"movie"} />,
  },
  {
    name: "Serie TV",
    icon: <LiveTvIcon />,
    key: "showtv",
    route: "/showtv/:movieID?/:type?",
    exact: false,
    component: <MoviesAndTvPages typeSearch={"tv"} />,
  },
  {
    name: "Trailers",
    icon: <TheatersIcon />,
    key: "trailermovies",
    route: "/trailerMovies",
    component: <TrailersMoviesPage />,
  },
  {
    name: "player",
    hidden: true,
    key: "player",
    route: "/player/:src?",
    exact: false,
    component: <AdaptiveStreamingVideoPlayer />,
  },
  // {
  //   name: "Consigliati",
  //   icon: <Letterboxd noMargin />,
  //   key: "letterboxdraccomendations",
  //   route: "/letterboxdraccomendations",
  //   component: <LetterboxdRaccomendations />,
  // },
  // {
  //   name: "News",
  //   icon: <NewspaperIcon />,
  //   key: "newsmovie",
  //   route: "/newsmovie/:newsID?/:type?",
  //   component: <NewsMovie />,
  // },
];
