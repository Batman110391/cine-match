import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import _ from "lodash";
import { fetchPromise } from "../utils/fetchPromise";
import { uniqueArray } from "../utils/uniqueArray";
import { KEYWORDS_SEARCH_MOVIE } from "../utils/constant";
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
  with_original_language = null,
  with_keywords = [],
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
  const ordering =
    order_by === "vote_average.desc" ? "&vote_count.gte=300" : "";

  const keywords = with_keywords?.map((k) => k.id)?.join("|") || [];

  return `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${CURRENT_LANGUAGE}
  &certification_country=IT&ott_region=IT&release_date.gte=${from}&release_date.lte=${to}&show_me=0&sort_by=${order_by}&vote_average.gte=0&vote_average.lte=10
  &vote_count.gte=0&with_runtime.gte=0&with_runtime.lte=400${
    genres ? "&with_genres=" + genres : ""
  }${providers ? "&with_ott_providers=" + providers : ""}${
    with_release_type ? "&with_release_type=" + with_release_type : ""
  }${
    with_original_language
      ? "&with_original_language=" + with_original_language
      : ""
  }${keywords.length > 0 ? "&with_keywords=" + keywords : ""}${ordering}`;
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
  const ordering =
    order_by === "vote_average.desc" ? "&vote_count.gte=300" : "";

  return `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&${CURRENT_LANGUAGE}
  &air_date.lte=${DATE_SIX_MONTHS_LATER}&certification_country=IT&ott_region=IT&release_date.gte=${from}&release_date.lte=${to}&show_me=0&sort_by=${order_by}&vote_average.gte=0&vote_average.lte=10
  &vote_count.gte=0&with_runtime.gte=0&with_runtime.lte=400&region=IT${
    genres ? "&with_genres=" + genres : ""
  }${providers ? "&with_ott_providers=" + providers : ""}${ordering}`;
};

export const genresListTv = [
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
    pos: 13,
    id: 9648,
    name: "Mistero",
    bg: "/images/genres/thriller.jpg",
  },
  {
    pos: 7,
    id: 14,
    name: "Fantasy",
    bg: "/images/genres/fantasy.jpg",
  },
  {
    pos: 14,
    id: 10768,
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

export function fetchGenres(type) {
  if (type === "tv") {
    return new Promise((resolve) => resolve(genresListTv));
  } else {
    return new Promise((resolve) => resolve(genresList));
  }
}

export async function fetchProviders() {
  const availableProviders = PROVIDERS.split("|").map((p) => parseInt(p));

  return fetchPromise(
    `https://api.themoviedb.org/3/watch/providers/movie?api_key=${API_KEY}&${CURRENT_LANGUAGE}&watch_region=IT`
  ).then((data) => {
    const filterProviders = data?.results.filter((provider) =>
      availableProviders.includes(provider.provider_id)
    );

    return filterProviders;
  });
}

export async function fetchSimilarMoviesOrTvById(id, type) {
  return fetchPromise(
    `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}&page=${1}&${CURRENT_LANGUAGE}`
  ).then((data) => {
    if (data && data?.results?.length > 0) {
      return data?.results;
    } else {
      return [];
    }
  });
}

export async function fetchMoviesDiscover(page = 1) {
  const keywordsMovies = KEYWORDS_SEARCH_MOVIE.map((ksm) => {
    return {
      name: ksm.name,
      api: fetchPromise(
        `${getUrlMoviesWithCustomParams({
          with_keywords: ksm.queries,
        })}&page=${page}`
      ),
    };
  });

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
    {
      name: "italian_movie",
      api: fetchPromise(
        `${getUrlMoviesWithCustomParams({
          with_original_language: "it",
        })}&page=${page}`
      ),
    },
    ...keywordsMovies,
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

export async function fetchDetailSeasonTvById(tvID, seasons) {
  if (!tvID || (!Array.isArray(seasons) && seasons.length === 0)) {
    return null;
  }

  const resourcesAll = seasons.map((season) => {
    const url = `https://api.themoviedb.org/3/tv/${tvID}/season/${season.season_number}?api_key=${API_KEY}&${CURRENT_LANGUAGE}`;
    return {
      api: fetchPromise(url),
    };
  });

  const aggregationResources = await Promise.all(
    resourcesAll.map((r) => r.api)
  );

  return aggregationResources;
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

export async function fetchDetailMovieById(id, type) {
  return fetchPromise(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then(async (data) => {
    const resourcesAll = [
      {
        name: "credits",
        api: fetchPromise(
          `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
        ),
      },
      {
        name: "images",
        api: fetchPromise(
          `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${API_KEY}`
        ),
      },
      {
        name: "providers",
        api: fetchPromise(
          `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
        ),
      },
      {
        name: "videos",
        api: fetchPromise(
          `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
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
        credits: resources.credits,
        videos: resources.videos,
        images: resources.images,
        providers: resources.providers?.results?.["IT"],
      };
    } else {
      const currVideosEN = await fetchPromise(
        `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`
      );

      return {
        ...data,
        credits: resources.credits,
        videos: currVideosEN,
        images: resources.images,
        providers: resources.providers?.results?.["IT"],
      };
    }
  });
}

export async function fetchPersonDetailById(personID) {
  return fetchPromise(
    `https://api.themoviedb.org/3/person/${personID}?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then(async (data) => {
    if (data) {
      const combinedCredits = await fetchCombinedCreditsPersonById(personID);

      return { ...data, ...combinedCredits };
    } else {
      return {};
    }
  });
}

export async function fetchCombinedCreditsPersonById(personID) {
  return fetchPromise(
    `https://api.themoviedb.org/3/person/${personID}/combined_credits?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then((data) => {
    if (data) {
      return data;
    } else {
      return {};
    }
  });
}

export async function fetchCounties() {
  return fetchPromise(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then((data) => {
    if (data) {
      return data;
    } else {
      return [];
    }
  });
}

export async function fetchKeywords(page, querySearch) {
  return fetchPromise(
    `https://api.themoviedb.org/3/search/keyword?query=${querySearch}&api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  ).then((data) => {
    const hasNext = page <= data.total_pages;

    const keywords = {
      results: data?.results,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };

    return keywords;
  });
}
