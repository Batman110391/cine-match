import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import _ from "lodash";
import { fetchPromise } from "../utils/fetchPromise";
import { KEYWORDS_SEARCH_MOVIE } from "../utils/constant";
import { uniqueArray } from "../utils/uniqueArray";
import { supabase } from "../supabaseClient";
import * as cheerio from "cheerio";
dayjs.extend(isBetween);

const API_KEY = import.meta.env.VITE_API_KEY;
const LANGUAGE = "it-IT";
const CURRENT_LANGUAGE = `language=${LANGUAGE}`;

export const PROVIDERS =
  "8|119|337|350|29|39|359|40|109|110|222|1726|531|582|1796";

export const CURRENT_DATE_FORMATTING = dayjs(new Date()).format("YYYY-MM-DD");
export const DATA_TOMORROW = dayjs(CURRENT_DATE_FORMATTING)
  .add(1, "day")
  .format("YYYY-MM-DD");
export const DATE_SIX_MONTHS_LATER = dayjs(CURRENT_DATE_FORMATTING)
  .add(2, "month")
  .format("YYYY-MM-DD");

async function convertJson(obj) {
  let json = null;

  let nonJson = true;

  while (nonJson) {
    try {
      json = JSON.parse(obj);
      if (typeof json === "object" || typeof json === "array") {
        nonJson = false;
      } else {
        obj = json;
      }
    } catch (e) {
      json = obj;
      nonJson = false;
    }
  }

  return json;
}

async function useProxy(url, customProxy) {
  let responseJson = null;

  const urlNetlifyProxy1 =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8888/.netlify/functions/cors/"
      : "https://cinematicmatch.netlify.app/.netlify/functions/cors/";

  const urlNetlifyProxy2 =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8888/.netlify/functions/cors-binary/"
      : "https://cinematicmatch.netlify.app/.netlify/functions/cors-binary/";

  const proxyUrls = [
    "https://api.allorigins.win/get?url=",
    "https://thingproxy.freeboard.io/fetch/",
    urlNetlifyProxy1,
    urlNetlifyProxy2,
    "https://cors-proxy-share-chi.vercel.app/api?url=",
    "https://cors-proxy-share-2.vercel.app/api?url=",
    "https://cors-proxy-share-3.vercel.app/api?url=",
  ];

  const myServerProxy = [
    "https://cors-proxy-share-chi.vercel.app/api?url=",
    "https://cors-proxy-share-2.vercel.app/api?url=",
    "https://cors-proxy-share-3.vercel.app/api?url=",
    urlNetlifyProxy1,
    urlNetlifyProxy2,
  ];

  const proxies = customProxy ? myServerProxy : proxyUrls;

  for (const proxyUrl of proxies) {
    try {
      const resp = await fetchPromise(proxyUrl + encodeURIComponent(url));

      if (resp) {
        const json = resp?.contents
          ? await convertJson(resp.contents)
          : await convertJson(resp);
        responseJson = json;

        break;
      }
    } catch (e) {
      // Log the error and try the next proxy
      console.error(e);
    }
  }
  return responseJson;
}

export async function fetchRatingMovieById(id, originalTitle) {
  if (!originalTitle || !id) {
    return null;
  }

  try {
    const { imdb_id } = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${API_KEY}`
    );

    const { data, error } = await supabase
      .from("flickmetrix-movies")
      .select("detail")
      .eq("imdbID", imdb_id);

    if (error) {
      return null;
    }

    const convertPercent = (number) => (parseFloat(number) * 10) / 100;

    return {
      awards: data?.[0]?.detail?.Awards,
      ratings: [
        {
          source: "Imdb",
          value: data?.[0]?.detail?.imdbRating || null,
          count: data?.[0]?.detail?.imdbVotes || 0,
        },
        {
          source: "Letterboxd",
          value: convertPercent(data?.[0]?.detail?.LetterboxdScore) || null,
          count: data?.[0]?.detail?.letterboxdVotes || 0,
        },
      ],
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

const getUrlMoviesWithCustomParams = ({
  order_by = "popularity.desc",
  from = "1970-01-01",
  to = CURRENT_DATE_FORMATTING,
  with_genres = [],
  with_ott_providers = [],
  exact_search = false,
  with_release_type = null,
  with_original_language = null,
  with_keywords = [],
  region = "IT",
  watch_region = null,
  vote_count = null,
}) => {
  const genres =
    with_genres.length > 0
      ? with_genres.map((g) => g.id).join(exact_search ? "," : "|")
      : null;

  const providers =
    with_ott_providers.length > 0
      ? with_ott_providers.map((p) => p.provider_id).join("|")
      : null;

  const keywords = with_keywords.map((k) => k.id).join("|");

  const url = new URL("https://api.themoviedb.org/3/discover/movie");
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("include_adult", false);
  url.searchParams.set("include_video", false);
  url.searchParams.set("language", LANGUAGE);
  url.searchParams.set("certification_country", "IT");
  //url.searchParams.set("ott_region", "IT");
  url.searchParams.set("primary_release_date.gte", from);
  url.searchParams.set("primary_release_date.lte", to);
  url.searchParams.set("sort_by", order_by);
  url.searchParams.set(
    "vote_count.gte",
    vote_count ? vote_count : order_by === "vote_average.desc" ? "300" : "0"
  );

  if (genres) {
    url.searchParams.set("with_genres", genres);
  }

  if (providers) {
    url.searchParams.set("with_watch_providers", providers);
    url.searchParams.set("watch_region", "IT");
  }

  if (with_release_type) {
    url.searchParams.set("with_release_type", with_release_type);
  }

  if (with_original_language) {
    url.searchParams.set("with_original_language", with_original_language);
  }

  if (keywords.length > 0) {
    url.searchParams.set("with_keywords", keywords);
  }

  if (region) {
    url.searchParams.set("region", region);
  }

  if (watch_region) {
    url.searchParams.set("watch_region", watch_region);
  }

  return url.toString();
};

const getUrlSerieTvWithCustomParams = ({
  order_by = "popularity.desc",
  from = "1970-01-01",
  to = CURRENT_DATE_FORMATTING,
  with_genres = [],
  with_ott_providers = [],
  exact_search = false,
  with_original_language = null,
  with_keywords = [],
}) => {
  const genres =
    with_genres.length > 0
      ? with_genres.map((g) => g.id).join(exact_search ? "," : "|")
      : null;

  const providers =
    with_ott_providers.length > 0
      ? with_ott_providers.map((p) => p.provider_id).join("|")
      : PROVIDERS;

  const keywords = with_keywords.map((k) => k.id).join("|");

  const url = new URL("https://api.themoviedb.org/3/discover/tv");
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", LANGUAGE);
  url.searchParams.set("include_adult", false);
  url.searchParams.set("air_date.gte", from);
  url.searchParams.set("air_date.lte", to);
  url.searchParams.set("certification_country", "IT");
  url.searchParams.set("watch_region", "IT");
  url.searchParams.set("sort_by", order_by);
  url.searchParams.set(
    "vote_count.gte",
    order_by === "vote_average.desc" ? "300" : "0"
  );
  url.searchParams.set(
    "with_watch_monetization_types",
    "flatrate|free|ads|rent|buy"
  );

  if (genres) {
    url.searchParams.set("with_genres", genres);
  }

  if (providers) {
    url.searchParams.set("with_watch_providers", providers);
  }

  if (with_original_language) {
    url.searchParams.set("with_original_language", with_original_language);
  }

  if (keywords.length > 0) {
    url.searchParams.set("with_keywords", keywords);
  }

  return url.toString();
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

export async function fetchNewsByTitleMovie(title) {
  const formattingSearchInput = title
    ?.split(" ")
    ?.map((ele) => `%${ele}%`)
    ?.join(" ");

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .ilike("titleMovie", formattingSearchInput);

  if (error) {
    return null;
  }

  return data;
}

async function getTotalNews() {
  try {
    const { count } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    return count;
  } catch (err) {
    return null;
  }
}

export async function fetchNewsMovie(page, searchInput) {
  const totalNews = await getTotalNews();

  const rangeStarted = { start: (page - 1) * 200, end: page * 200 - 1 };

  const range = {
    start: totalNews - rangeStarted.end - 1,
    end: totalNews - rangeStarted.start - (page - 1 !== 0 ? 1 : 0),
  };

  if (searchInput) {
    const formattingSearchInput = searchInput
      ?.split(" ")
      ?.map((ele) => `%${ele}%`)
      ?.join(" ");

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .ilike("articleTitle", formattingSearchInput)
      .range(range.start, range.end);

    if (error) {
      return null;
    }

    const hasNext = data.length >= 50;

    const news = {
      results: data,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };

    return news || [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .range(range.start, range.end)
    .order("articleDataFromatting", { ascending: false });

  if (error) {
    return null;
  }

  const hasNext = data.length >= 50;

  const news = {
    results: data,
    nextPage: hasNext ? page + 1 : undefined,
    previousPage: page > 1 ? page - 1 : undefined,
  };

  return news || [];
}

export async function fetchDetailNewsById(newsID) {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", newsID);

  if (error) {
    return null;
  }

  return data?.[0];
}

export async function createFromattingMoviesData(data) {
  const batchSize = 50; // Numero di chiamate da eseguire contemporaneamente in ogni batch
  const timeout = 1000; // Timeout in millisecondi tra i batch

  const results = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const batchPromises = batch.map((d) => {
      const exist = d?.movie_data?.movie_title && d?.movie_data?.year_released;

      if (exist) {
        return fetchPromise(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&${CURRENT_LANGUAGE}&query=${encodeURI(
            d?.movie_data?.movie_title
          )}&primary_release_year=${
            d?.movie_data?.year_released
          }&include_adult=true&page=1`
        ).catch((error) => {
          console.error(`Errore nella chiamata API: ${error}`);
          return null; // Escludi la chiamata in caso di errore
        });
      } else {
        return null;
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);

    const orderedResults = batchResults
      .map((result, index) => {
        const movieData = batch[index]?.movie_data;
        const predicted_rating = batch[index]?.predicted_rating;
        if (
          result.status === "fulfilled" &&
          result.value &&
          result.value.results &&
          result.value.results[0]
        ) {
          return {
            ...result?.value?.results?.[0],
            movie_data: movieData,
            predicted_rating,
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    results.push(...orderedResults);

    await new Promise((resolve) => setTimeout(resolve, timeout));
  }

  const filteredResults = results.flatMap((r) => r).filter(Boolean);

  const unique = uniqueArray(filteredResults);

  return unique;
}
export const poll = async ({ username, interval, maxAttempts }) => {
  let attempts = 0;

  const uriResult = await fetchLetterboxdRaccomendations(username);

  const executePoll = async (resolve, reject) => {
    const result = await useProxy(uriResult, true);
    attempts++;

    const data = await convertJson(result);

    const notExistUserData =
      data?.execution_data?.user_status === "user_not_found";

    if (notExistUserData) {
      return resolve(false);
    }

    const finished =
      data?.statuses?.redis_build_model_job_status === "finished" &&
      data?.statuses?.redis_get_user_data_job_status === "finished";

    if (finished) {
      return resolve(data?.result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error("Exceeded max attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};

export async function fetchLetterboxdRaccomendations(username) {
  const uri = `https://letterboxd-recommendations.herokuapp.com/get_recs?username=${username}&popularity_filter=-1&training_data_size=40000&data_opt_in=false`;

  const responseJson = await useProxy(uri, true);

  if (!responseJson) {
    return null;
  }

  const { redis_build_model_job_id, redis_get_user_data_job_id } = responseJson;

  const uriResult = `https://letterboxd-recommendations.herokuapp.com/results?redis_get_user_data_job_id=${redis_get_user_data_job_id}&redis_build_model_job_id=${redis_build_model_job_id}`;

  return uriResult;
}

export async function fetchTrending(type) {
  return fetchPromise(
    `https://api.themoviedb.org/3/trending/${type}/day?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
  );
}

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
    `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${API_KEY}&page=${1}&${CURRENT_LANGUAGE}`
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
          order_by: "primary_release_date.desc",
          with_keywords: ksm.queries,
          watch_region: "IT",
          vote_count: "100",
        })}&page=${page}`
      ),
    };
  });

  const resourcesAll = [
    {
      name: "trending_movie",
      api: fetchTrending("movie"),
    },
    {
      name: "trending_tv",
      api: fetchTrending("tv"),
    },
    {
      name: "incoming_movie",
      api: fetchPromise(
        `${getUrlMoviesWithCustomParams({
          from: DATA_TOMORROW,
          to: DATE_SIX_MONTHS_LATER,
          with_release_type: "3",
        })}&page=${page}`
      ),
    },
    {
      name: "italian_movie",
      api: fetchPromise(
        `${getUrlMoviesWithCustomParams({
          order_by: "primary_release_date.desc",
          with_original_language: "it",
          region: "IT",
          watch_region: "IT",
          with_release_type: "4|5|6",
          vote_count: "30",
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

  if (keyWordNotNull && typeQuery === "multi") {
    return await fetchPromise(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}&query=${encodeURI(
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

  if (typeQuery === "multi") {
    const resourcesAll = [
      {
        name: "movie",
        api: await fetchPromise(`${getUrlMoviesWithCustomParams({})}&page=1`),
      },
      {
        name: "tv",
        api: await fetchPromise(`${getUrlSerieTvWithCustomParams({})}&page=1`),
      },
    ];

    const aggregationResources = await Promise.all(
      resourcesAll.map((r) => r.api)
    );

    const resources = Object.fromEntries(
      aggregationResources.map((resource, index) => [
        resourcesAll[index].name,
        resource?.results || [],
      ])
    );

    const result = [...resources?.movie, ...resources?.tv].sort(
      (a, b) => b.popularity - a.popularity
    );

    return result;
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

async function getPlayerLink(id) {
  // if (true) {
  //   const link =
  //     "https://hfs265.serversicuro.cc/dnzpe6wh2tgqsj6yvcwh5mlwylw6iddvbwyrjr3swf7ohignx7bvvfq6zqba/la-societa-della-neve-2024[supervideo.tv].mp4";
  //   return link;
  // }

  try {
    const { imdb_id } = await fetchPromise(
      `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${API_KEY}`
    );

    const link = `https://guardahd.stream/movie/${imdb_id}`;

    const response = await useProxy(link);

    const $ = cheerio.load(response);

    const firstDiv = $("ul._player-mirrors li").first();

    const idLink = firstDiv.attr("data-link");

    const id_movie_stream = idLink.split("/").pop();

    if (id_movie_stream) {
      const downloadLink = `https://supervideo.tv/dl?op=download_orig&id=${id_movie_stream}&mode=n`;

      const respDownloadHtml = await fetch(downloadLink);
      const body = await respDownloadHtml.text();

      const $2 = cheerio.load(body);

      const linkDownloadElem = $2("a.btn_direct-download");

      const valueLink = linkDownloadElem.attr("href");

      return valueLink;
    } else {
      return null;
    }
  } catch (err) {
    console.log("err");
  }
}

export async function fetchDetailMovieById(id, type, originalTitle) {
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
      ...(type === "movie"
        ? [
            {
              name: "release",
              api: fetchPromise(
                `https://api.themoviedb.org/3/${type}/${id}/release_dates?api_key=${API_KEY}&${CURRENT_LANGUAGE}`
              ),
            },
          ]
        : []),
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
    // const news = await fetchNewsByTitleMovie(data?.original_title);

    if (resources.videos?.results?.length > 0) {
      return {
        ...data,
        // news: news || null,
        credits: resources.credits,
        videos: resources.videos,
        images: resources.images,
        providers: resources.providers?.results?.["IT"],
        release: resources.release,
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
        release: resources.release,
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

export function filterLetterboxdMovies(data, valueYear, genreId) {
  try {
    const newResultByYear = data.filter((movie) => {
      const yearReleased = parseInt(movie?.release_date?.split("-")?.[0]);

      return yearReleased >= valueYear[0] && yearReleased <= valueYear[1];
    });

    const newResultByGenre =
      Array.isArray(genreId) && genreId.length > 0
        ? newResultByYear.filter((movie) => {
            return movie.genre_ids.some((id) => genreId.includes(id));
          })
        : newResultByYear;

    return newResultByGenre;
  } catch (err) {
    return data;
  }
}

export async function updateMovies() {
  const currentYear = new Date().getFullYear();

  try {
    const result = await fetchAllFlickMetrixMovies(currentYear);

    const moviesTable = supabase.from("flickmetrix-movies");

    if (Array.isArray(result)) {
      const createObjectInsert = result
        .map((movie) => {
          if (!movie?.ID || !movie.imdbID) return null;
          return {
            id: movie?.ID,
            imdbID: movie?.imdbID,
            year: movie?.Year,
            title: movie.Title,
            ratingLetterboxd: movie?.LetterboxdScore,
            ratingImdb: movie?.imdbRating,
            detail: movie,
          };
        })
        .filter(Boolean);

      const { error } = await moviesTable.upsert(createObjectInsert, {
        ignoreDuplicates: true,
      });
      if (error) {
        console.error(error);
      } else {
        console.log("Data saved successfully!");
      }
    } else {
      console.log("No movies found!");
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchAllFlickMetrixMovies(year) {
  const pageSize = 1000; // defaults to 20
  let movies = [];
  let page = 0;

  do {
    try {
      console.warn(`flickmetrix fetching page ${page}`);
      const res = await fetchFlickMetrixMovies({ page, pageSize, year });
      console.warn(`flickmetrix received page ${page} => ${res.length} movies`);
      if (!res.length) {
        break;
      }

      movies = movies.concat(res);
    } catch (err) {
      console.error("flickmetrix error", err.toString());
      break;
    }

    ++page;
  } while (true);

  return movies;
}

async function fetchFlickMetrixMovies({ page = 0, pageSize = 20, year }) {
  const currentPage = page;

  const searchParams = new URLSearchParams({
    amazonRegion: "us",
    cast: "",
    comboScoreMax: "100",
    comboScoreMin: "0",
    countryCode: "it",
    criticRatingMax: "100",
    criticRatingMin: "0",
    criticReviewsMax: "100000",
    criticReviewsMin: "0",
    currentPage: `${currentPage}`,
    deviceID: "1",
    director: "",
    format: "movies",
    genreAND: "false",
    imdbRatingMax: "10",
    imdbRatingMin: "0",
    imdbVotesMax: "10000000",
    imdbVotesMin: "0",
    inCinemas: "true",
    includeDismissed: "false",
    includeSeen: "false",
    includeWantToWatch: "true",
    isCastSearch: "false",
    isDirectorSearch: "false",
    isPersonSearch: "false",
    language: "all",
    letterboxdScoreMax: "100",
    letterboxdScoreMin: "0",
    letterboxdVotesMax: "1200000",
    letterboxdVotesMin: "0",
    metacriticRatingMax: "100",
    metacriticRatingMin: "0",
    metacriticReviewsMax: "100",
    metacriticReviewsMin: "0",
    onAmazonPrime: "false",
    onAmazonVideo: "false",
    onDVD: "false",
    onNetflix: "false",
    pageSize: `${pageSize}`,
    path: "/",
    person: "",
    plot: "",
    queryType: "GetFilmsToSieve",
    searchTerm: "",
    sharedUser: "",
    sortOrder: "comboScoreDesc",
    title: "",
    token: "",
    watchedRating: "0",
    writer: "",
    yearMax: year,
    yearMin: year,
  });

  const url = `https://flickmetrix.com/api2/values/getFilms?${searchParams.toString()}`;
  const res = await useProxy(url, true);

  if (res) {
    return res;
  }

  return [];
}

export async function fetchTrailersMovies(page) {
  const baseUrl = "https://api.themoviedb.org/3";
  const trendingMoviesUrl = `${baseUrl}/trending/movie/day?api_key=${API_KEY}&page=${page}&${CURRENT_LANGUAGE}`;

  try {
    const response = await fetchPromise(trendingMoviesUrl);

    const hasNext = page <= response.total_pages;

    const trendingMovies = response.results;

    if (!trendingMovies.length > 0) {
      return {
        results: [],
        nextPage: hasNext ? page + 1 : 1,
        previousPage: page > 1 ? page - 1 : undefined,
      };
    }

    const trailerPromises = trendingMovies?.map(async (movie) => {
      const videosUrl = `${baseUrl}/movie/${movie.id}/videos?api_key=${API_KEY}&${CURRENT_LANGUAGE}`;
      const videoResponse = await fetchPromise(videosUrl);
      const trailers = videoResponse.results;

      const italianTrailers = trailers.filter(
        (trailer) => trailer.iso_639_1 === "it"
      );

      if (italianTrailers.length > 0) {
        if (italianTrailers?.[0]?.key) {
          const exist = await ytExists(italianTrailers?.[0]?.key);
          if (exist && italianTrailers?.[0]?.key) {
            return {
              movie,
              ytID: italianTrailers?.[0]?.key,
            };
          } else {
            return null;
          }
        }

        return null;
      } else {
        return null;
      }
    });
    const trailerResults = await Promise.all(trailerPromises);

    const moviesWithItalianTrailers = trailerResults.filter(
      (result) => result !== null
    );

    if (!moviesWithItalianTrailers.length > 0) {
      fetchTrailersMovies(page + 1);
    }
    return {
      results: moviesWithItalianTrailers,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };
  } catch (error) {
    console.error("Errore nella richiesta:", error);
  }
}

async function ytExists(videoID) {
  const theURL = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoID}&format=json`;

  try {
    const response = await fetch(theURL);
    if (response.ok) {
      await response.json();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function updateNews(executionAt) {
  const url =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8888/.netlify/functions/news-movie?executionat=${executionAt}`
      : `https://cinematicmatch.netlify.app/.netlify/functions/news-movie?executionat=${executionAt}`;

  try {
    const response = await fetch(url);

    const responseJson = await response.json();

    const result = responseJson?.result;

    const articleTables = supabase.from("articles");

    if (Array.isArray(result) && result.length > 0) {
      const createObjectInsert = result
        .slice(0, 190)
        .map((article, i) => {
          if (!article?.articleID) return null;
          if (!article?.titleMovie) return null;

          return {
            id: 10718 + i,
            articleID: article?.articleID,
            bgImage: article?.bgImage,
            articleTitle: article?.articleTitle,
            articleDescription: article.articleDescription,
            articleReview: article?.articleReview,
            articleDataFromatting: article?.articleDataFromatting,
            articleDate: article?.articleDate,
            articleType: article?.articleType,
            titleMovie: article?.titleMovie,
          };
        })
        .filter(Boolean);

      const { error } = await articleTables.upsert(createObjectInsert, {
        ignoreDuplicates: true,
      });
      if (error) {
        console.error(error);
      } else {
        console.log("Data news saved successfully!");
      }
    } else {
      console.log("No news found!");
    }
  } catch (err) {
    console.error(err);
  }
}

export async function fetchProfileData(user) {
  if (!user) {
    return {};
  }

  const { data, error } = await supabase
    .from("profile")
    .select("movie,tv")
    .eq("id", user?.id)
    .limit(1);

  if (error) {
    return {};
  }

  if (!data?.length > 0) {
    const profileTables = supabase.from("profile");
    const objectInsert = {
      id: user?.id,
      movie: {
        seen: [],
        favorite: [],
        watchlist: [],
        notifications: [],
      },
      tv: {
        seen: [],
        favorite: [],
        watchlist: [],
        notifications: [],
      },
    };
    const { data: newData, error: newError } = await profileTables
      .insert(objectInsert)
      .select("movie,tv");

    if (newError) {
      return {};
    }

    return newData[0];
  }

  return data[0];
}

export async function addItemInProfile(type, field, userID, item, cb) {
  const { poster_path, title, id, vote_average } = item;

  const { data, error } = await supabase
    .from("profile")
    .select(`${type}`)
    .eq("id", userID)
    .limit(1);

  if (error) {
    if (typeof cb === "function") {
      return cb("error");
    }
  }

  const result = data[0];

  const objectInsert = {
    poster_path,
    title,
    id,
    vote_average,
  };

  const { error: newError } = await supabase
    .from("profile")
    .update({
      [type]: {
        ...result[type],
        [field]: [...result[type][field], objectInsert],
      },
    })
    .eq("id", userID);

  if (newError) {
    if (typeof cb === "function") {
      return cb("error");
    }
  }

  if (typeof cb === "function") {
    return cb(null);
  }
}

export async function removeItemInProfile(type, field, userID, itemID, cb) {
  const { data, error } = await supabase
    .from("profile")
    .select(`${type}`)
    .eq("id", userID)
    .limit(1);

  if (error) {
    if (typeof cb === "function") {
      return cb("error");
    }
  }

  const result = data[0];

  const { error: newError } = await supabase
    .from("profile")
    .update({
      [type]: {
        ...result[type],
        [field]: [...result[type][field]].filter((item) => item.id !== itemID),
      },
    })
    .eq("id", userID);

  if (newError) {
    if (typeof cb === "function") {
      return cb("error");
    }
  }

  if (typeof cb === "function") {
    return cb(null);
  }
}

export async function fetchProfileDataChecking(userID, type) {
  const { data, error } = await supabase
    .from("profile")
    .select(`${type}`)
    .eq("id", userID)
    .limit(1);

  if (error) {
    return {};
  }

  return data[0];
}
