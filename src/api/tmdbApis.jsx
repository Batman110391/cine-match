import dayjs from "dayjs";
import _ from "lodash";
import { fetchPromise } from "../utils/fetchPromise";
import { uniqueArray } from "../utils/uniqueArray";
import isBetween from "dayjs/plugin/isBetween";
import axios from "axios";
dayjs.extend(isBetween);

const API_KEY = import.meta.env.VITE_API_KEY;
const CURRENT_LANGUAGE = "language=it-IT";

export const PROVIDERS = "8|119|337|29|39|359|110|222";

export const CURRENT_DATE_FORMATTING = dayjs(new Date()).format("YYYY-MM-DD");
export const DATA_TOMORROW = dayjs(CURRENT_DATE_FORMATTING)
  .add(1, "day")
  .format("YYYY-MM-DD");
export const DATE_SIX_MONTHS_LATER = dayjs(CURRENT_DATE_FORMATTING)
  .add(6, "month")
  .format("YYYY-MM-DD");

const getUrlMoviesWithCustomParams = ({
  order_by = "popularity.desc",
  from = "1970-01-01",
  to = DATE_SIX_MONTHS_LATER,
  with_genres = [],
  with_ott_providers = [],
  exact_search = false,
  with_release_type = null,
}) => {
  const genres =
    with_genres.length > 0 && exact_search
      ? with_genres.map((g) => g.id).join(",")
      : with_genres.length > 0 && !exact_search
      ? with_genres.map((g) => g.id).join("|")
      : null;
  const providers =
    with_ott_providers.length > 0
      ? with_ott_providers.map((g) => g.provider_id).join("|")
      : null;

  return `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${CURRENT_LANGUAGE}
  &air_date.lte=${DATE_SIX_MONTHS_LATER}&certification_country=IT&ott_region=IT&release_date.gte=${from}&release_date.lte=${to}&show_me=0&sort_by=${order_by}&vote_average.gte=0&vote_average.lte=10
  &vote_count.gte=0&with_runtime.gte=0&with_runtime.lte=400&region=IT${
    genres ? "&with_genres=" + genres : ""
  }${providers ? "&with_ott_providers=" + providers : ""}${
    with_release_type ? "&with_release_type=" + with_release_type : ""
  }`;
};

const getUrlSerieTvWithCustomParams = ({
  order_by = "popularity.desc",
  from = "1970-01-01",
  to = DATE_SIX_MONTHS_LATER,
  with_genres = [],
  with_ott_providers = [],
  exact_search = false,
}) => {
  const genres =
    with_genres.length > 0 && exact_search
      ? with_genres.map((g) => g.id).join(",")
      : with_genres.length > 0 && !exact_search
      ? with_genres.map((g) => g.id).join("|")
      : null;
  const providers =
    with_ott_providers.length > 0
      ? with_ott_providers.map((g) => g.provider_id).join("|")
      : PROVIDERS;

  return `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&${CURRENT_LANGUAGE}
  &air_date.lte=${DATE_SIX_MONTHS_LATER}&certification_country=IT&ott_region=IT&release_date.gte=${from}&release_date.lte=${to}&show_me=0&sort_by=${order_by}&vote_average.gte=0&vote_average.lte=10
  &vote_count.gte=0&with_runtime.gte=0&with_runtime.lte=400&region=IT${
    genres ? "&with_genres=" + genres : ""
  }${providers ? "&with_ott_providers=" + providers : ""}`;
};

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
    name: "Dramma",
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

export async function fetchCastsByKey(keyword) {
  let page = 1;
  if (keyword) {
    return fetchPromise(
      `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&query=${encodeURI(
        keyword
      )}&include_adult=true`
    ).then((data) => {
      return data?.results;
    });
  }
}

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
  return new Promise((resolve) => resolve(genresList));
}

export async function fetchProviders() {
  return fetchPromise(
    `https://api.themoviedb.org/3/watch/providers/movie?api_key=${API_KEY}&${CURRENT_LANGUAGE}&watch_region=IT`
  ).then((data) => {
    return data.results;
  });
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

export async function fetchSimilarMoviesById(id) {
  return fetchPromise(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&page=${1}&${CURRENT_LANGUAGE}`
  ).then(async (data) => {
    const promises = await data?.results?.map(async (op) => {
      const credits = await fetchPromise(
        `https://api.themoviedb.org/3/movie/${op.id}/credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
      );
      return { ...op, credits };
    });

    const filteredResults = await Promise.all(promises);

    return filteredResults;
  });
}

export async function fetchMoviesDiscover(page = 1) {
  const resourcesAll = [
    {
      name: "trending_movie",
      api: fetchPromise(`${getUrlMoviesWithCustomParams({})}&page=${page}`),
    },
    {
      name: "trending_tv",
      api: fetchPromise(`${getUrlSerieTvWithCustomParams({})}&page=${page}`),
    },
    {
      name: "incoming_movie",
      api: fetchPromise(
        `${getUrlMoviesWithCustomParams({
          from: DATA_TOMORROW,
          with_release_type: "3|4",
        })}&page=${page}`
      ),
    },
  ];

  const aggregationResources = await Promise.all(
    resourcesAll.map((r) => r.api)
  );

  const resources = Object.fromEntries(
    aggregationResources.map((resource, index) => [
      resourcesAll[index].name,
      resource,
    ])
  );

  return resources;
}

export async function fetchMoviesByKeywords(keyword, typeQuery, page = 1) {
  const keyWordNotNull = keyword && keyword !== "";

  if (keyWordNotNull && typeQuery === "movie") {
    return await fetchPromise(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&query=${encodeURI(
        keyword
      )}&region=IT`
    ).then((data) => {
      if (data && data?.results?.length > 0) {
        return data?.results;
      } else {
        return [];
      }
    });
  }

  if (keyWordNotNull && typeQuery === "tv") {
    return await fetchPromise(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&query=${encodeURI(
        keyword
      )}`
    ).then((data) => {
      if (data && data?.results?.length > 0) {
        return data?.results;
      } else {
        return [];
      }
    });
  }

  if (keyWordNotNull && typeQuery === "person") {
    return await fetchPromise(
      `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&query=${encodeURI(
        keyword
      )}&include_adult=true&region=IT`
    ).then((data) => data?.results);
  }

  if (typeQuery === "movie") {
    return await fetchPromise(
      `${getUrlMoviesWithCustomParams({})}&page=${page}`
    ).then((data) => {
      if (data && data?.results?.length > 0) {
        return data?.results;
      } else {
        return [];
      }
    });
  }

  if (typeQuery === "tv") {
    return await fetchPromise(
      `${getUrlSerieTvWithCustomParams({})}&page=${page}`
    ).then((data) => {
      if (data && data?.results?.length > 0) {
        return data?.results;
      } else {
        return [];
      }
    });
  }

  if (typeQuery === "person") {
    return await fetchPromise(
      `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&region=IT`
    ).then((data) => data?.results);
  }
}

export async function fetchMoviesPage(page, querySearch) {
  return fetchPromise(
    `${getUrlMoviesWithCustomParams(querySearch)}&page=${page}`
  ).then((data) => {
    const hasNext = page <= data.total_pages;

    const currMovies = {
      results: data?.results,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };

    return currMovies;
  });
}
export async function fetchShowTvPage(page, querySearch) {
  return fetchPromise(
    `${getUrlSerieTvWithCustomParams(querySearch)}&page=${page}`
  ).then((data) => {
    const hasNext = page <= data.total_pages;

    const currMovies = {
      results: data?.results,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };

    return currMovies;
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
      ?.map((c) => c.id) || null;
  const crewQuery =
    casts
      ?.filter((c) => c.known_for_department === "Directing")
      ?.map((c) => c.id) || null;

  const currentSort =
    sort === "vote_average.desc"
      ? "vote_average"
      : sort === "compatibility"
      ? "progress"
      : "popularity";

  //01/01/2000
  //14/03/2023 dayjs(data.to).format("DD/MM/YYYY")

  //YYYY-MM-DD // &release_date.gte=PRIMA &release_date.lte=DOPO

  /*
filtri sort
 popularity.desc, POPOLARITA
 release_date.desc, RECENTI
 vote_average.desc, MIGLIOR VOTI
  */

  const isCrew = crewQuery.length > 0;
  const isCast = castsQuery.length > 0;

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
    (!isCast && !isCrew) || (!exactQuery && genresQuery)
      ? await fetchPromise(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}${
            genresQuery && "&with_genres=" + genresQuery
          }${periodsQueryString}${minVoteCount}&sort_by=${
            sort === "compatibility" ? "popularity.desc" : sort
          }`
        ).then(async (data) => {
          const promises = await data?.results?.map(async (op) => {
            const credits = await fetchPromise(
              `https://api.themoviedb.org/3/movie/${op.id}/credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
            );
            return { ...op, credits };
          });

          const filteredResults = await Promise.all(promises);
          if (data?.total_pages > totalPage) {
            totalPage = data.total_pages;
          }
          return filteredResults;
        })
      : [];

  const currMoviesByCast =
    isCast && page == 1
      ? await fetchPromiseAllQueries(
          casts,
          genres,
          null,
          "cast",
          formattingPeriod,
          exactQuery
        )
      : [];

  const currMoviesByCrew =
    isCrew && page == 1
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

  const aggregationPeople =
    exactQuery && isCrew && isCast
      ? _.intersectionWith(currMoviesByCast, currMoviesByCrew, _.isEqual)
      : exactQuery && isCast
      ? currMoviesByCast
      : exactQuery && isCrew
      ? currMoviesByCrew
      : uniqueArray(currMoviesByCast, currMoviesByCrew);

  const filterUniqueResult = uniqueArray(
    currMoviesByGeneres,
    aggregationPeople
  );

  const aggregateComaptibility = filterUniqueResult
    ?.reduce((prev, curr) => {
      const progress = findCompatibility(curr, genres, casts);
      return [...prev, { ...curr, progress }];
    }, [])
    .sort((a, b) => b?.[currentSort] - a?.[currentSort]);

  return {
    results: aggregateComaptibility,
    nextPage: hasNext ? page + 1 : undefined,
    previousPage: page > 1 ? page - 1 : undefined,
  };
}

export async function fetchDetailMovieById(id, originalTitle) {
  const externalRating = await getRatingMovieById(id, originalTitle);

  return fetchPromise(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then(async (data) => {
    const resourcesAll = [
      {
        name: "images",
        api: fetchPromise(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`
        ),
      },
      {
        name: "providers",
        api: fetchPromise(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
        ),
      },
      {
        name: "videos",
        api: fetchPromise(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
        ),
      },
      {
        name: "releaseIT",
        api: fetchPromise(
          `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${API_KEY}`
        ),
      },
    ];

    const aggregationResources = await Promise.all(
      resourcesAll.map((r) => r.api)
    );

    const resources = Object.fromEntries(
      aggregationResources.map((resource, index) => [
        resourcesAll[index].name,
        resource,
      ])
    );

    if (resources.videos?.results?.length > 0) {
      return {
        ...data,
        videos: resources.videos,
        images: resources.images,
        providers: resources.providers?.results?.["IT"],
        releaseIT: resources.releaseIT?.results?.find(
          (release) => release.iso_3166_1 === "IT"
        )?.release_dates?.[0],
        ...(externalRating && { ratings: externalRating.ratings }),
      };
    } else {
      const currVideosEN = await fetchPromise(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
      );

      return {
        ...data,
        videos: currVideosEN,
        images: resources.images,
        providers: resources.providers?.results?.["IT"],
        releaseIT: resources.releaseIT?.results?.find(
          (release) => release.iso_3166_1 === "IT"
        )?.release_dates?.[0],
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

async function getRatingMovieById(id, originalTitle, type) {
  const url = `https://flickmetrix.com/api2/values/getFilms?amazonRegion=us&cast=&comboScoreMax=100&comboScoreMin=0&countryCode=it&criticRatingMax=100&criticRatingMin=0&criticReviewsMax=1000&criticReviewsMin=0&currentPage=0&deviceID=1&director=&format=movies&genreAND=false&imdbRatingMax=10&imdbRatingMin=0&imdbVotesMax=2800000&imdbVotesMin=0&inCinemas=true&includeDismissed=true&includeSeen=true&includeWantToWatch=true&isCastSearch=false&isDirectorSearch=false&isPersonSearch=false&language=all&letterboxdScoreMax=100&letterboxdScoreMin=0&letterboxdVotesMax=1200000&letterboxdVotesMin=0&metacriticRatingMax=100&metacriticRatingMin=0&metacriticReviewsMax=100&metacriticReviewsMin=0&onAmazonPrime=false&onAmazonVideo=false&onDVD=false&onNetflix=false&pageSize=20&path=/&person=&plot=&queryType=GetFilmsToSieve&searchTerm=${encodeURI(
    originalTitle
  )}&sharedUser=&sortOrder=comboScoreDesc&title=&token=&watchedRating=0&writer=&yearMax=2023&yearMin=1900`;

  const encodeURL1 = `https://api.allorigins.win/get?url=${encodeURIComponent(
    url
  )}`;
  const encodeURL2 = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(
    url
  )}`;
  let responseJson = await fetchPromise(encodeURL2)
    .then((data) => JSON.parse(data))
    .catch((e) => {
      console.log("Error second response Rating");
      return null;
    });

  if (!responseJson) {
    responseJson = await fetchPromise(encodeURL1)
      .then((data) => JSON.parse(JSON.parse(data.contents)))
      .catch((e) => {
        console.log("Errore first response Rating, retry on new proxy");

        return null;
      });
  }

  if (!responseJson) {
    return null;
  }

  const { imdb_id } = await fetchPromise(
    `https://api.themoviedb.org/3/${type}/${id}/external_ids?api_key=${API_KEY}`
  );

  const currentMovieRating = responseJson?.find(
    (obj) => obj.imdbID === imdb_id
  );

  return {
    providers: currentMovieRating?.Providers,
    awards: currentMovieRating?.Awards,
    cast: currentMovieRating?.Cast,
    director: currentMovieRating?.Director,
    ratings: [
      {
        source: "Imdb",
        value: currentMovieRating?.imdbRating,
        count: currentMovieRating?.imdbVotes || 0,
      },
      {
        source: "Letterboxd",
        value: currentMovieRating?.LetterboxdScore,
        count: currentMovieRating?.letterboxdVotes || 0,
      },
      {
        source: "ComboScore",
        value: currentMovieRating?.ComboScore,
      },
    ],
  };
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
    .then(async (data) => {
      const filtertingForDepartment = data?.reduce(
        async (prevPromise, curr) => {
          const prev = await prevPromise;
          const onlyDepartment = currDepartment
            ? curr?.[type].filter((m) => m?.department === currDepartment)
            : curr?.[type];

          const onlyGenere =
            Boolean(currGenres.length) && exactQuery
              ? onlyDepartment?.filter((od) =>
                  od.genre_ids.some((g) => currGenres.includes(g))
                )
              : onlyDepartment;

          const onlyPeriods = onlyGenere?.filter((og) => {
            const dateToCheck = dayjs(og?.release_date);

            return dateToCheck.isBetween(from, to);
          });

          const promises = onlyPeriods?.map(async (op) => {
            const credits = await fetchPromise(
              `https://api.themoviedb.org/3/movie/${op.id}/credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
            );
            return { ...op, credits };
          });

          const filteredResults = await Promise.all(promises);

          return [...prev, ...(filteredResults ?? [])];
        },
        Promise.resolve([])
      );

      return filtertingForDepartment;
    })
    .catch((err) => {
      console.error(err);

      return [];
    });
}

function findCompatibility(movie, genres, cast) {
  let progress = 0;
  const prevIdGenred = [];
  const prevIdCast = [];

  const onlyIdGenres = genres.map((g) => g.id);
  const onlyIdCast = cast.map((c) => c.id);

  const currentGeneresMovie = movie.genre_ids;
  const currentCast = movie?.credits?.cast;
  const currentCrew = movie?.credits?.crew;

  const divideProgress = 100 / (genres.length + cast.length);

  currentGeneresMovie.forEach((item) => {
    if (onlyIdGenres.includes(item) && !prevIdGenred.includes(item)) {
      progress += divideProgress;
      prevIdGenred.push(item);
    }
  });
  currentCast.forEach((item) => {
    if (onlyIdCast.includes(item.id) && !prevIdCast.includes(item.id)) {
      progress += divideProgress;
      prevIdCast.push(item.id);
    }
  });
  currentCrew.forEach((item) => {
    if (
      onlyIdCast.includes(item.id) &&
      !prevIdCast.includes(item.id) &&
      item.department === "Directing"
    ) {
      progress += divideProgress;
      prevIdCast.push(item.id);
    }
  });

  return Math.round(progress);
}

const memoizedGetRatingMovieById = (() => {
  const cache = new Map();

  return async (id, originalTitle, type) => {
    const cacheKey = `${id}-${originalTitle}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const details = await getRatingMovieById(id, originalTitle, type);
    cache.set(cacheKey, details);
    return details;
  };
})();

async function concatDetailMovies(array, type) {
  return await processArrayInBatches(array, 5, type);
}

async function processArrayInBatches(arr, batchSize, type) {
  let dividedResults = [];

  for (let i = 0; batchSize * i < arr.length; i++) {
    const batch = arr.slice(batchSize * i, batchSize * (i + 1));

    const promises = batch.map(async (arr) => {
      const searchTerm = arr?.original_name || arr?.original_title;

      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 0 : 500)); // Wait 1 second for second batch

      const details = await memoizedGetRatingMovieById(
        arr.id,
        searchTerm,
        type
      );
      return { ...arr, details };
    });

    const filteredResults = await Promise.all(promises);

    dividedResults = dividedResults.concat(filteredResults);
  }

  return dividedResults;
}
