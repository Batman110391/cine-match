import React from "react";

import SearchPage from "./Pages/SearchPage";
import MoviesAndTvPages from "./Pages/MoviesAndTvPages";
import LetterboxdRaccomendations from "./Pages/LetterboxdRaccomendations";
import NewsMovie from "./Pages/NewsMovie";
import TrailersMoviesPage from "./Pages/TrailersMoviesPage";

export const routes = [
  {
    name: "HomePage",
    key: "homepage",
    route: "/home",
    component: <SearchPage />,
  },
  {
    name: "movies",
    key: "movies",
    route: "/movies/:movieID?/:type?",
    exact: false,
    component: <MoviesAndTvPages typeSearch={"movie"} />,
  },
  {
    name: "showTv",
    key: "showtv",
    route: "/showtv/:movieID?/:type?",
    exact: false,
    component: <MoviesAndTvPages typeSearch={"tv"} />,
  },
  {
    name: "trailerMovies",
    key: "trailermovies",
    route: "/trailerMovies",
    component: <TrailersMoviesPage />,
  },
  {
    name: "LetterboxdRaccomendations",
    key: "letterboxdraccomendations",
    route: "/letterboxdraccomendations",
    component: <LetterboxdRaccomendations />,
  },
  // {
  //   name: "NewsMovie",
  //   key: "newsmovie",
  //   route: "/newsmovie/:newsID?/:type?",
  //   component: <NewsMovie />,
  // },
];
