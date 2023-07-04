import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import {
  createFromattingMoviesData,
  filterLetterboxdMovies,
  poll,
} from "../api/tmdbApis";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import { supabase } from "../supabaseClient";
import { areEqual } from "../utils/areEqual";
import { Virtuoso } from "react-virtuoso";
import {
  MOVIE_PAGE_CARD_HEIGHT,
  MOVIE_PAGE_CARD_HEIGTH_MOBILE,
  MOVIE_PAGE_CARD_WIDTH,
  MOVIE_PAGE_CARD_WIDTH_MOBILE,
} from "../utils/constant";
import MovieCardDetail from "../components/MovieCardDetail";
import FilterLetterboxd from "../components/FilterLetterboxd";

const Row = React.memo(({ index, data }) => {
  const { movies, handleClickItem, isDesktop } = data;

  const movie = movies[index];
  return (
    <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
      <MovieCardDetail
        movie={movie}
        w={isDesktop ? MOVIE_PAGE_CARD_WIDTH : MOVIE_PAGE_CARD_WIDTH_MOBILE}
        h={isDesktop ? MOVIE_PAGE_CARD_HEIGHT : MOVIE_PAGE_CARD_HEIGTH_MOBILE}
        mediaType={"movie"}
        onClick={() => handleClickItem(movie.id)}
        voteAverage={movie?.predicted_rating}
      />
    </Box>
  );
}, areEqual);

export default function LetterboxdRaccomendations() {
  const [loadingModel, setLoadingModel] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [initialResult, setInitialResult] = React.useState(null);
  const [messageError, setErrorMessage] = React.useState(null);

  const { openDialogMovieDetail } = React.useContext(DialogMovieDetailContext);

  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const formattingUsername = username && username.toString().toLowerCase();

  React.useEffect(() => {
    (async () => {
      const data = await getDataByUsers("default");
      if (data.length > 0) {
        const parseJsonData = JSON.parse(data);
        setResult(parseJsonData);
      }
      setLoadingModel(false);
    })();
  }, []);

  React.useEffect(() => {
    if (initialResult) {
      (async () => {
        const formattingData = await createFromattingMoviesData(initialResult);
        await insertMoviesInDB(formattingData);

        setResult(formattingData);
        setLoadingModel(false);
      })();
    }
  }, [initialResult]);

  const insertMoviesInDB = async (movies) => {
    const objectJson = {
      username: formattingUsername,
      movies: JSON.stringify(movies),
      created_at: new Date(),
    };

    const { error } = await supabase.from("letterboxd-user").upsert(objectJson);

    console.log(error);
  };

  const getDataByUsers = async (defaultUsername) => {
    const { data, error } = await supabase
      .from("letterboxd-user")
      .select("username, movies, created_at")
      .eq("username", defaultUsername ? defaultUsername : formattingUsername);

    if (error) {
      return null;
    }

    const currentDate = Date.now();
    const createdAt = new Date(data?.[0]?.created_at).getTime();

    const differenceInDays = Math.floor(
      (currentDate - createdAt) / (24 * 60 * 60 * 1000)
    );

    if (differenceInDays > 15) {
      return [];
    }

    return data?.[0]?.movies || [];
  };

  const handleClick = async () => {
    setLoadingModel(true);
    setErrorMessage(null);

    const data = await getDataByUsers(formattingUsername);

    if (data.length > 0) {
      const parseJsonData = JSON.parse(data);
      setResult(parseJsonData);

      setLoadingModel(false);
    } else {
      poll({ username, interval: 1000, maxAttempts: 300 })
        .then((response) => {
          if (response) {
            setInitialResult(response);
          } else {
            setErrorMessage(
              "L'utente non è presente nei registri di Letterboxd"
            );
            setLoadingModel(false);
          }
        })
        .catch((error) => {
          // Replace task list with error message
          console.log("error", error);
          setLoadingModel(false);
        });
    }
  };

  const handleClickItem = (movieID) => {
    openDialogMovieDetail(movieID, "movie");
  };

  const handleApplyFilter = (valueYear, genreId) => {
    setLoadingModel(true);
    const newDataMovies = filterLetterboxdMovies(result, valueYear, genreId);
    setResult(newDataMovies);
    setLoadingModel(false);
  };

  return (
    <Box sx={{ p: 2, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 3,
          mb: 5,
        }}
      >
        <Typography variant="h4">I Film raccomandati da Letterboxd</Typography>
        <TextField
          id="username"
          error={messageError}
          value={username}
          disabled={loadingModel}
          onChange={(event) => {
            setErrorMessage(null);
            setUsername(event.target.value);
          }}
          label="Username"
          variant="outlined"
          helperText={
            username && messageError
              ? messageError
              : "inserisci il tuo username di letterboxd per una ricerca più accurata"
          }
        />
        <Button
          onClick={handleClick}
          disabled={!username || loadingModel}
          variant="contained"
        >
          Scopri
        </Button>
      </Box>
      <Divider />
      <Box sx={{ my: 5 }}>
        <FilterLetterboxd
          onApplyFilter={handleApplyFilter}
          loading={loadingModel}
        />
      </Box>
      <Divider />
      {loadingModel && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
          {username && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mt: 4,
              }}
            >
              <Typography variant="h6">
                Caricamento modello dati per {username}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={8}
                  height={8}
                  sx={{ mt: 1 }}
                />
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={8}
                  height={8}
                  sx={{ mt: 1 }}
                />
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={8}
                  height={8}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
      {!loadingModel && result && result?.length > 0 ? (
        <Box sx={{ height: "100%", width: "100%", mt: 5 }}>
          <Virtuoso
            style={{ height: "100%", width: "100%" }}
            useWindowScroll
            totalCount={result.length}
            overscan={100}
            itemContent={(index) => (
              <Row
                index={index}
                data={{
                  movies: result,
                  handleClickItem,
                  isDesktop,
                }}
              />
            )}
          />
        </Box>
      ) : (
        !loadingModel && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              width: "100%",
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {`Nessun risultato trovato.`}
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
}
