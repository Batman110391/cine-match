import React from "react";

import SearchPage from "./Pages/SearchPage";
import MoviesAndTvPages from "./Pages/MoviesAndTvPages";
import LetterboxdRaccomendations from "./Pages/LetterboxdRaccomendations";

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
    name: "LetterboxdRaccomendations",
    key: "letterboxdraccomendations",
    route: "/letterboxdraccomendations",
    component: <LetterboxdRaccomendations />,
  },
];
