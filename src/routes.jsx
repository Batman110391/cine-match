import React from "react";

import SearchPage from "./Pages/SearchPage";
import MoviesAndTvPages from "./Pages/MoviesAndTvPages";
import LetterboxdRaccomendations from "./Pages/LetterboxdRaccomendations";
import NewsMovie from "./Pages/NewsMovie";
import TrailersMoviesPage from "./Pages/TrailersMoviesPage";

import LiveTvIcon from "@mui/icons-material/LiveTv";
import MovieIcon from "@mui/icons-material/Movie";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Letterboxd from "./components/icons/Letterboxd";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import TheatersIcon from "@mui/icons-material/Theaters";
import AdaptiveStreamingVideoPlayer from "./components/AdaptiveStreamingVideoPlayer";
import ProfilePage from "./Pages/ProfilePage";

export const routes = [
  {
    name: "Scopri",
    icon: <SearchIcon />,
    key: "homepage",
    route: "/home",
    component: <SearchPage />,
    navbar: true,
  },
  {
    name: "Film",
    icon: <MovieIcon />,
    key: "movies",
    route: "/movies/:movieID?/:type?",
    exact: false,
    component: <MoviesAndTvPages typeSearch={"movie"} />,
    navbar: true,
  },
  {
    name: "Serie TV",
    icon: <LiveTvIcon />,
    key: "showtv",
    route: "/showtv/:movieID?/:type?",
    exact: false,
    component: <MoviesAndTvPages typeSearch={"tv"} />,
    navbar: true,
  },
  {
    name: "Trailers",
    icon: <TheatersIcon />,
    key: "trailermovies",
    route: "/trailerMovies",
    component: <TrailersMoviesPage />,
    navbar: false,
  },
  {
    name: "Profilo",
    icon: <PersonOutlineIcon />,
    key: "profile",
    route: "/profile",
    component: <ProfilePage />,
    navbar: true,
  },
  // {
  //   name: "player",
  //   hidden: true,
  //   key: "player",
  //   route: "/player/:src?",
  //   exact: false,
  //   component: <AdaptiveStreamingVideoPlayer />,
  //    navbar: false
  // },
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
