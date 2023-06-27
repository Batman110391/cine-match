import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useScroll, useSpring } from "framer-motion";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { createFromattingMoviesData, poll } from "../api/tmdbApis";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import RenderRow from "../components/RenderRow";
import { supabase } from "../supabaseClient";
import { areEqual } from "../utils/areEqual";

const MAX_ITEMS = 20;

export default function LetterboxdRaccomendations() {
  const [loadingModel, setLoadingModel] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [movies, setMovies] = React.useState(null);
  const [initialIndices, setInitialIndices] = React.useState(MAX_ITEMS);
  const [initialResult, setInitialResult] = React.useState(null);
  const [messageError, setErrorMessage] = React.useState(null);
  const [viewGrid, setViewGrid] = React.useState("compact");
  const [hasMore, setHasMore] = React.useState(true);

  const { openDialogMovieDetail } = React.useContext(DialogMovieDetailContext);

  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    (async () => {
      const data = await getDataByUsers("default");

      if (data.length > 0) {
        const parseJsonData = JSON.parse(data);
        setResult(parseJsonData);
        const initMovies = parseJsonData?.slice(0, initialIndices);
        setMovies(initMovies);
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
        const initMovies = formattingData?.slice(0, initialIndices);
        setMovies(initMovies);
        setLoadingModel(false);
      })();
    }
  }, [initialResult]);

  const insertMoviesInDB = async (movies) => {
    const objectJson = { username, movies: JSON.stringify(movies) };

    const { error } = await supabase.from("letterboxd-user").upsert(objectJson);

    console.log(error);
  };

  const getDataByUsers = async (defaultUsername) => {
    const { data, error } = await supabase
      .from("letterboxd-user")
      .select("username, movies, created_at")
      .eq("username", defaultUsername ? defaultUsername : username);

    if (error) {
      return null;
    }

    return data?.[0]?.movies || [];
  };

  const handleClick = async () => {
    setLoadingModel(true);
    setErrorMessage(null);

    const data = await getDataByUsers();

    if (data.length > 0) {
      const parseJsonData = JSON.parse(data);
      setResult(parseJsonData);
      const initMovies = formattingData?.slice(0, initialIndices);
      setMovies(initMovies);
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
          }
        })
        .catch((error) => {
          // Replace task list with error message
          console.log("error", error);
          setLoadingModel(false);
        })
        .finally(() => {
          // Re-enable submit button
          console.log("finally");
        });
    }
  };

  const handleClickItem = (movieID) => {
    openDialogMovieDetail(movieID, typeSearch);
  };

  const handleViewGrid = (event, newValue) => {
    if (newValue !== null) {
      setViewGrid(newValue);
    }
  };

  const fetchMoreData = () => {
    if (movies?.length >= result?.length) {
      setHasMore(false);
      return;
    }

    const otherMovies = result?.slice(
      initialIndices,
      initialIndices + MAX_ITEMS
    );

    setInitialIndices(initialIndices + MAX_ITEMS);

    setMovies(movies?.concat(otherMovies));
  };

  console.log("letterboxdraccomendations result", result);

  return (
    <Box sx={{ p: 2, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 3,
          mb: 10,
        }}
      >
        <Typography variant="h4">I Film raccomandati da Letterboxd</Typography>
        <TextField
          id="username"
          error={messageError}
          value={username}
          onChange={(event) => {
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
        <Button onClick={handleClick} disabled={!username} variant="contained">
          Scopri
        </Button>
      </Box>
      {loadingModel && <div> loadingModel...</div>}
      {!loadingModel && result && result?.length > 0 ? (
        <Box sx={{ position: "relative", height: "100%" }}>
          <Box sx={{ overflow: "hidden", pb: 5 }}>
            <InfiniteScroll
              style={{ overflow: "hidden" }}
              dataLength={movies?.length || 0}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              }
            >
              <ItemRow
                itemData={movies}
                typeView={"detail"}
                handleClickItem={handleClickItem}
                isDesktop={isDesktop}
                mediaType={"movie"}
              />
            </InfiniteScroll>
          </Box>
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

const ItemRow = React.memo(RenderRow, areEqual);
