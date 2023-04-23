import React from "react";

const HomePage = React.lazy(() => import("./Pages/HomePage"));
const MovieFinder = React.lazy(() => import("./Pages/MovieFinder"));
const SearchCast = React.lazy(() => import("./Pages/SearchCast"));
const SearchGeneres = React.lazy(() => import("./Pages/SearchGeneres"));
const SearchPage = React.lazy(() => import("./Pages/SearchPage"));
const MoviesPage = React.lazy(() => import("./Pages/MoviesPage"));
const ShowTvPages = React.lazy(() => import("./Pages/ShowTvPage"));

export const routes = [
  /* {
    name: "HomePage",
    key: "homepage",
    route: "/home",
    component: <HomePage />,
  }, */
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
  {
    name: "MovieFinderGeneres",
    key: "moviefindergeneres",
    route: "/movie-finder-generes",
    component: <SearchGeneres />,
  },
  {
    name: "MovieFinderCast",
    key: "moviefindercast",
    route: "/movie-finder-cast",
    component: <SearchCast />,
  },
  {
    name: "MovieFinderPage",
    key: "moviefinderpage",
    route: "/movie-finder",
    component: <MovieFinder />,
  },
];
