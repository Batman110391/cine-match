import { fetchPromise } from "../utils/fetchPromise";

const API_KEY = import.meta.env.VITE_API_KEY;
const CURRENT_LANGUAGE = "language=it-IT";

const genresList = [
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

export async function fetchCasts(page, keyword) {
  if (keyword) {
    return fetchPromise(
      `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&query=${encodeURI(
        keyword
      )}&include_adult=true`
    ).then((data) => {
      const hasNext = page <= data.total_pages;

      const currCasts = {
        results: data?.results,
        nextPage: hasNext ? page + 1 : undefined,
        previousPage: page > 1 ? page - 1 : undefined,
      };

      return currCasts;
    });
  }

  return fetchPromise(
    `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}`
  ).then((data) => {
    const hasNext = page <= data.total_pages;

    const currCasts = {
      results: data?.results,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };

    return currCasts;
  });
}

export function fetchGenres() {
  return new Promise((resolve, _) => resolve(genresList));
}

export async function fetchSimilarMoviesByGenres(page, keyword, genres) {
  const genresQuery = genres?.map((g) => g.id).join(",") || null;

  if (keyword) {
    return fetchPromise(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&query=${encodeURI(
        keyword
      )}&include_adult=true`
    ).then((data) => {
      const hasNext = page <= data.total_pages;

      const currCasts = {
        results: data?.results,
        nextPage: hasNext ? page + 1 : undefined,
        previousPage: page > 1 ? page - 1 : undefined,
      };

      return currCasts;
    });
  }

  return fetchPromise(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}${
      genresQuery && "&with_genres=" + genresQuery
    }`
  ).then((data) => {
    const hasNext = page <= data.total_pages;

    const currMovieByGenres = {
      results: data?.results,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };

    return currMovieByGenres;
  });
}

export async function fetchSimilarMoviesById(page, id) {
  return fetchPromise(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}`
  ).then((data) => {
    return data?.results;
  });
}

export async function fetchMovies(page, genres, casts, similarMovies) {
  const genresQuery = genres?.map((g) => g.id).join("|") || null;
  const castsQuery = casts?.map((c) => c.id).join("|") || null;

  //01/01/2000
  //14/03/2023

  //YYYY-MM-DD // &release_date.gte=PRIMA &release_date.lte=DOPO

  let totalPage = 0;

  const currMoviesByGeneres =
    genresQuery || (!genresQuery && !castsQuery)
      ? await fetchPromise(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}${
            genresQuery && "&with_genres=" + genresQuery
          }`
        ).then((data) => {
          if (data?.total_pages > totalPage) {
            totalPage = data.total_pages;
          }
          return data?.results;
        })
      : [];

  const currMoviesByPeople =
    castsQuery || (!castsQuery && !genresQuery)
      ? await fetchPromise(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}${
            castsQuery && "&with_people=" + castsQuery
          }`
        ).then((data) => {
          if (data?.total_pages > totalPage) {
            totalPage = data.total_pages;
          }
          return data?.results;
        })
      : [];

  const hasNext = page <= totalPage;

  const uniqueIds = [];

  const filterUniqueResult = [
    ...currMoviesByGeneres,
    ...currMoviesByPeople,
  ].filter((element) => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate) {
      uniqueIds.push(element.id);

      return true;
    }

    return false;
  });

  return {
    results: filterUniqueResult,
    nextPage: hasNext ? page + 1 : undefined,
    previousPage: page > 1 ? page - 1 : undefined,
  };
}

export async function fetchDetailMovieById(id) {
  return fetchPromise(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then(async (data) => {
    const currCreditsMovie = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
    );

    const currImagesMovie = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
    );

    const currWatchProviders = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
    );

    const currVideosIT = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
    );

    if (currVideosIT?.results?.length > 0) {
      return {
        ...data,
        videos: currVideosIT,
        credits: currCreditsMovie,
        images: currImagesMovie,
        providers: currWatchProviders?.results?.["IT"],
      };
    } else {
      const currVideosEN = await fetchPromise(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
      );

      return {
        ...data,
        videos: currVideosEN,
        credits: currCreditsMovie,
        images: currImagesMovie,
        providers: currWatchProviders?.results?.["IT"],
      };
    }
  });
}
