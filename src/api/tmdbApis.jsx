import dayjs from "dayjs";
import { fetchPromise } from "../utils/fetchPromise";
import { uniqueArray } from "../utils/uniqueArray";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

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

export async function fetchMovies(
  page,
  genres,
  casts,
  sort,
  periods,
  exactQuery
) {
  const genresQuery =
    genres?.map((g) => g.id).join(exactQuery ? "," : "|") || null;
  const castsQuery =
    casts
      ?.filter((c) => c.known_for_department !== "Directing")
      ?.map((c) => c.id)
      ?.join(exactQuery ? "," : "|") || null;
  const crewQuery =
    casts
      ?.filter((c) => c.known_for_department === "Directing")
      ?.map((c) => c.id)
      ?.join(exactQuery ? "," : "|") || null;

  const currentSort =
    sort === "vote_average.desc" ? "vote_average" : "popularity";

  //01/01/2000
  //14/03/2023 dayjs(data.to).format("DD/MM/YYYY")

  //YYYY-MM-DD // &release_date.gte=PRIMA &release_date.lte=DOPO

  /*
filtri sort
 popularity.desc, POPOLARITA
 release_date.desc, RECENTI
 vote_average.desc, MIGLIOR VOTI
  */

  let totalPage = 0;

  const { from, to } = JSON.parse(periods);

  const formattingPeriod = {
    from: dayjs(new Date(from)).format("YYYY-MM-DD"),
    to: dayjs(new Date(to)).format("YYYY-MM-DD"),
  };

  const periodsQueryString = `&primary_release_date.gte=${formattingPeriod.from}&primary_release_date.lte=${formattingPeriod.to}`;

  const minVoteCount =
    sort === "vote_average.desc" ? "&vote_count.gte=100" : "";

  /*   if (exactQuery) {
    const currMoviesByGenresAndCast =
      (await fetchPromise(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sort}&${CURRENT_LANGUAGE}${
          genresQuery && "&with_genres=" + genresQuery
        }${castsQuery && "&with_cast=" + castsQuery}${
          crewQuery && "&with_crew=" + crewQuery
        }${periodsQueryString}${minVoteCount}`
      ).then((data) => {
        if (data?.total_pages > totalPage) {
          totalPage = data.total_pages;
        }
        return data?.results;
      })) || [];

    const hasNext = page <= totalPage;

    return {
      results: currMoviesByGenresAndCast,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };
  } */

  const currMoviesByGeneres =
    (!castsQuery && !crewQuery) || (!exactQuery && genresQuery)
      ? await fetchPromise(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}${
            genresQuery && "&with_genres=" + genresQuery
          }${periodsQueryString}${minVoteCount}`
        ).then((data) => {
          if (data?.total_pages > totalPage) {
            totalPage = data.total_pages;
          }
          return data?.results;
        })
      : [];

  const currMoviesByCast = castsQuery
    ? await fetchPromiseAllQueries(
        casts,
        genres,
        null,
        "cast",
        formattingPeriod,
        exactQuery
      )
    : [];

  const currMoviesByCrew = crewQuery
    ? await fetchPromiseAllQueries(
        casts,
        genres,
        "Directing",
        "crew",
        formattingPeriod,
        exactQuery
      )
    : [];

  const hasNext = page <= totalPage || !genresQuery;

  const aggregationPeople = uniqueArray(currMoviesByCast, currMoviesByCrew);

  const filterUniqueResult = uniqueArray(
    currMoviesByGeneres,
    aggregationPeople
  ).sort((a, b) => b?.[currentSort] - a?.[currentSort]);

  console.log("filterUniqueResult", filterUniqueResult);

  return {
    results: filterUniqueResult,
    nextPage: hasNext ? page + 1 : undefined,
    previousPage: page > 1 ? page - 1 : undefined,
  };
}

export async function fetchDetailMovieById(id) {
  const externalRating = await getRatingMovieById(id);

  return fetchPromise(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then(async (data) => {
    const currCreditsMovie = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
    );

    const currImagesMovie = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`
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
        ...(externalRating && { ratings: externalRating.ratings }),
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
        ...(externalRating && { ratings: externalRating.ratings }),
      };
    }
  });
}

export async function fetchMoviesByCasts(cast, genres, periods, exactQuery) {
  if (!cast) {
    return null;
  }

  const { from, to } = JSON.parse(periods);

  const formattingPeriod = {
    from: dayjs(new Date(from)).format("YYYY-MM-DD"),
    to: dayjs(new Date(to)).format("YYYY-MM-DD"),
  };

  const currCast = [{ id: cast?.id }];

  const currMoviesByCast = await fetchPromiseAllQueries(
    currCast,
    genres,
    null,
    "cast",
    formattingPeriod,
    exactQuery
  );

  const currMoviesByPeopleWithIdCast = currMoviesByCast.map((c) => {
    return {
      ...c,
      castId: cast?.id,
    };
  });

  return {
    results: currMoviesByPeopleWithIdCast,
  };
}

async function getRatingMovieById(id) {
  try {
    const { imdb_id } = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${API_KEY}`
    );

    const response = await fetchPromise(
      `http://www.omdbapi.com/?i=${imdb_id}&apikey=15eb44fd`
    );

    const rottenTomatoesValue = response?.Ratings.find(
      (ele) => ele.Source === "Rotten Tomatoes"
    )?.Value;

    const splitPercent = rottenTomatoesValue?.split("%")[0];

    const convertPercent = (parseFloat(splitPercent) * 10) / 100;

    return {
      ratings: [
        { source: "Imdb", value: parseFloat(response?.imdbRating) || null },
        { source: "rottenTomatoes", value: convertPercent || null },
      ],
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function fetchPromiseAllQueries(
  persons,
  genres,
  currDepartment,
  type,
  periods,
  exactQuery
) {
  const currGenres = genres?.map((g) => g.id);

  const { from, to } = periods;

  const currPerson = currDepartment
    ? persons?.filter((c) => c.known_for_department === currDepartment)
    : persons;

  return await Promise.all(
    currPerson?.map(({ id }) => {
      return fetchPromise(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
      );
    })
  )
    .then((data) => {
      const filtertingForDepartment = data?.reduce((prev, curr) => {
        const onlyDepartment = currDepartment
          ? curr?.[type].filter((m) => m?.department === currDepartment)
          : curr?.[type];

        const onlyGenere =
          Boolean(currGenres.length) && !exactQuery
            ? onlyDepartment?.filter((od) =>
                od.genre_ids.some((g) => currGenres.includes(g))
              )
            : onlyDepartment;

        const onlyPeriods = onlyGenere?.filter((og) => {
          const dateToCheck = dayjs(og?.release_date);

          return dateToCheck.isBetween(from, to);
        });

        return [...prev, ...onlyPeriods];
      }, []);

      return filtertingForDepartment;
    })
    .catch((err) => {
      console.error(err);

      return [];
    });
}
