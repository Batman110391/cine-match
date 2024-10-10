import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY;
const PROTECT_KEY = process.env.VITE_API_KEY;

const supabaseUrl = "https://ylvejqwugamkxvcrbbjv.supabase.co";
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { token } = JSON.parse(event.body);
    console.log("token", token);

    if (JSON.stringify(token) !== JSON.stringify(PROTECT_KEY)) {
      return {
        statusCode: 500,
        body: "Incorrect access key",
      };
    }

    if (event.httpMethod.toUpperCase() !== "POST") {
      return {
        statusCode: 500,
        body: "not a POST call",
      };
    }

    const res = await updateMovies(event);

    return {
      statusCode: 200,
      body: JSON.stringify("Ok"),
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};

// //updateMovies
async function updateMovies(event) {
  const currentYear = new Date().getFullYear();

  try {
    const result = await fetchAllFlickMetrixMovies(currentYear, event);

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

// //fetch
async function fetchAllFlickMetrixMovies(year, event) {
  const pageSize = 1000; // defaults to 20
  let movies = [];
  let page = 0;

  do {
    try {
      console.warn(`flickmetrix fetching page ${page}`);
      const res = await fetchFlickMetrixMovies({ page, pageSize, year, event });
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

// //details
async function fetchFlickMetrixMovies({
  page = 0,
  pageSize = 20,
  year,
  event,
}) {
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
    googleScoreMax: "100",
    googleScoreMin: "0",
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

  var cookie_string = event.headers.cookie || "";
  var useragent = event.headers["user-agent"] || "";

  var header_to_send = {
    Cookie: cookie_string,
    "User-Agent": useragent,
    "content-type": "application/json",
    accept: "*/*",
    host: "flickmetrix.com",
  };

  var options = {
    method: "GET",
    headers: header_to_send,
  };

  const url = `https://flickmetrix.com/api2/values/getFilms?${searchParams.toString()}`;

  const res = await axios.get(url, options).then((content) => content.data);

  const json = convertJson(res);

  if (json) {
    return json;
  }

  return [];
}

function convertJson(obj) {
  let json;

  while (
    typeof obj === "string" &&
    (obj.startsWith("{") || obj.startsWith("["))
  ) {
    try {
      json = JSON.parse(obj); // Prova a fare il parsing dell'oggetto
      obj = json; // Se ha successo, l'oggetto diventa il JSON parsato
    } catch (e) {
      break; // Se fallisce, esce dal ciclo
    }
  }

  return obj; // Restituisci l'ultimo oggetto che non è più JSON
}
