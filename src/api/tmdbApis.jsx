import { fetchPromise } from "../utils/fetchPromise";

const API_KEY = import.meta.env.VITE_API_KEY;

export function getMovieGenres() {
  return fetchPromise(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=it-IT`
  );
}
