import { fetchPromise } from "../utils/fetchPromise";

const API_KEY = import.meta.env.VITE_API_KEY;
const CURRENT_LANGUAGE = "language=it-IT";

export function fetchActors() {
  return fetchPromise(
    `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  );
}

export const genresList = [
  {
    pos: 0,
    id: 28,
    name: "Azione",
    bg: "/images/genres/action.jpg",
  },
  {
    pos: 1,
    id: 12,
    name: "Avventura",
    bg: "/images/genres/adventure.jpg",
  },
  {
    pos: 2,
    id: 16,
    name: "Animazione",
    bg: "/images/genres/animation.jpg",
  },
  {
    pos: 3,
    id: 35,
    name: "Commedia",
    bg: "/images/genres/comedy.jpg",
  },
  {
    pos: 4,
    id: 80,
    name: "Crimine",
    bg: "/images/genres/crime.jpg",
  },
  {
    pos: 5,
    id: 99,
    name: "Documentario",
    bg: "/images/genres/documentary.jpg",
  },
  {
    pos: 6,
    id: 18,
    name: "Drammatico",
    bg: "/images/genres/dramatic.jpg",
  },
  {
    pos: 7,
    id: 14,
    name: "Fantasy",
    bg: "/images/genres/fantasy.jpg",
  },
  {
    pos: 8,
    id: 36,
    name: "Storia",
    bg: "/images/genres/history.jpg",
  },
  {
    pos: 9,
    id: 27,
    name: "Horror",
    bg: "/images/genres/horror.jpg",
  },
  {
    pos: 10,
    id: 10402,
    name: "Musica",
    bg: "/images/genres/music.jpg",
  },
  {
    pos: 11,
    id: 10749,
    name: "Romantico",
    bg: "/images/genres/romance.jpg",
  },
  {
    pos: 12,
    id: 878,
    name: "Fantascienza",
    bg: "/images/genres/fantascienza.jpg",
  },
  {
    pos: 13,
    id: 53,
    name: "Thriller",
    bg: "/images/genres/thriller.jpg",
  },
  {
    pos: 14,
    id: 10752,
    name: "Guerra",
    bg: "/images/genres/war.jpg",
  },
  {
    pos: 15,
    id: 37,
    name: "Western",
    bg: "/images/genres/western.jpg",
  },
];
