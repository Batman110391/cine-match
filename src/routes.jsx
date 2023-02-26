import HomePage from "./Pages/HomePage";
import MovieFinder from "./Pages/MovieFinder";
import SearchActors from "./Pages/SearchActors";
import SearchDirectors from "./Pages/SearchDirectors";
import SearchGeneres from "./Pages/SearchGeneres";
import SearchPeriods from "./Pages/SearchPeriods";

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
