import React from "react";

import SearchPage from "./Pages/SearchPage";
import MoviesPage from "./Pages/MoviesPage";
import ShowTvPages from "./Pages/ShowTvPage";

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
    route: "/movies",
    component: <MoviesPage />,
  },
  {
    name: "showTv",
    key: "showtv",
    route: "/showtv",
    component: <ShowTvPages />,
  },
];
