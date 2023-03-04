import React from "react";

const HomePage = React.lazy(() => import("./Pages/HomePage"));
const MovieFinder = React.lazy(() => import("./Pages/MovieFinder"));
const SearchActors = React.lazy(() => import("./Pages/SearchActors"));
const SearchDirectors = React.lazy(() => import("./Pages/SearchDirectors"));
const SearchGeneres = React.lazy(() => import("./Pages/SearchGeneres"));
const SearchPeriods = React.lazy(() => import("./Pages/SearchPeriods"));

export const routes = [
  {
    name: "HomePage",
    key: "homepage",
    route: "/home",
    component: <HomePage />,
  },
  {
    name: "MovieFinderGeneres",
    key: "moviefindergeneres",
    route: "/movie-finder-generes",
    component: <SearchGeneres />,
  },
  {
    name: "MovieFinderActors",
    key: "moviefinderactors",
    route: "/movie-finder-actors",
    component: <SearchActors />,
  },
  {
    name: "MovieFinderDirectors",
    key: "moviefinderdirectors",
    route: "/movie-finder-directors",
    component: <SearchDirectors />,
  },
  {
    name: "MovieFinderPeriods",
    key: "moviefinderperiods",
    route: "/movie-finder-periods",
    component: <SearchPeriods />,
  },
  {
    name: "MovieFinderPage",
    key: "moviefinderpage",
    route: "/movie-finder",
    component: <MovieFinder />,
  },
];
