import React from "react";

import SearchPage from "./Pages/SearchPage";
import MoviesAndTvPages from "./Pages/MoviesAndTvPages";

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
];
