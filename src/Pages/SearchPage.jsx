import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CssBaseline,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useContext, useState, Fragment } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { DATA_TOMORROW, fetchMoviesDiscover } from "../api/tmdbApis";
import CarouselDiscover from "../components/CarouselDiscover";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import SearchPageDialog from "../components/SearchPageDialog";
import { setQuery } from "../store/movieQuery";
import {
  HEIGHT_NAVIGATION_MOBILE,
  KEYWORDS_SEARCH_MOVIE,
} from "../utils/constant";

export default function SearchPage() {
  const { openDialogMovieDetail } = useContext(DialogMovieDetailContext);

  const dispatch = useDispatch();
  const theme = useTheme();

  const [openSearchMovie, setOpenSearchMovie] = useState(false);
  const { isLoading, error, data } = useQuery(["discoverPage"], () =>
    fetchMoviesDiscover()
  );

  const handleClickItem = (movieID, type) => {
    openDialogMovieDetail(movieID, type);
  };

  const handleSeeAllMovie = () => {
    dispatch(
      setQuery({
        currentRoute: 1,
        querySearch: {
          from: "1970-01-01",
          to: dayjs(new Date()).format("YYYY-MM-DD"),
          order_by: "popularity.desc",
          with_genres: [],
          with_ott_providers: [],
          exact_search: false,
        },
      })
    );
  };
  const handleSeeAllPopularTv = () => {
    dispatch(
      setQuery({
        currentRoute: 2,
        querySearchTv: {
          from: "1970-01-01",
          to: dayjs(new Date()).format("YYYY-MM-DD"),
          order_by: "popularity.desc",
          with_genres: [],
          with_ott_providers: [],
          exact_search: false,
        },
      })
    );
  };

  const handleSeeAllIncomingMovie = () => {
    dispatch(
      setQuery({
        currentRoute: 1,
        querySearch: {
          from: DATA_TOMORROW,
          to: dayjs(new Date()).add(6, "month").format("YYYY-MM-DD"),
          order_by: "popularity.desc",
          with_genres: [],
          with_ott_providers: [],
          exact_search: false,
          with_release_type: "3|4",
        },
      })
    );
  };

  const handleSeeAllMovieItaian = () => {
    dispatch(
      setQuery({
        currentRoute: 1,
        querySearch: {
          from: "1970-01-01",
          to: dayjs(new Date()).format("YYYY-MM-DD"),
          order_by: "popularity.desc",
          with_genres: [],
          with_ott_providers: [],
          exact_search: false,
          with_original_language: "it",
        },
      })
    );
  };

  const handleSeeAllMovieKeywords = (keyword) => {
    dispatch(
      setQuery({
        currentRoute: 1,
        querySearch: {
          from: "1970-01-01",
          to: dayjs(new Date()).format("YYYY-MM-DD"),
          order_by: "popularity.desc",
          with_genres: [],
          with_ott_providers: [],
          exact_search: false,
          with_keywords: keyword,
        },
      })
    );
  };

  const popularMovies = data?.trending_movie?.results || [];

  const popularTv = data?.trending_tv?.results || [];

  const incomingMovie = data?.incoming_movie?.results || [];

  const italianMovie = data?.italian_movie?.results || [];

  const keywordsMovie = KEYWORDS_SEARCH_MOVIE.reduce((prevKsm, currKsm) => {
    return {
      ...prevKsm,
      [currKsm.type]: data?.[currKsm.type]?.results || [],
    };
  }, {});

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box sx={{ p: 2, height: "100%" }}>
      <Box>
        <Button
          sx={{
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            width: "100%",
            maxWidth: "500px",
            mx: "auto",
            mt: { xs: 0, sm: 1 },
            bgcolor: "background.paper",
            borderRadius: { xs: 0, sm: 2 },
          }}
          onClick={() => setOpenSearchMovie(true)}
        >
          <Stack flexDirection={"row"} gap={2}>
            <SearchIcon />
            <Typography variant="button">Cerca</Typography>
          </Stack>
        </Button>
        <SearchPageDialog open={openSearchMovie} setOpen={setOpenSearchMovie} />
      </Box>
      <Box sx={{ width: "100%", height: "100%" }}>
        <CarouselDiscover
          slides={popularMovies}
          titleDiscover={"Film di tendenza"}
          isLoading={isLoading}
          path={"/movies"}
          onAction={handleSeeAllMovie}
          handleClickItem={handleClickItem}
          isDesktop={isDesktop}
          type={"movie"}
        />
        <CarouselDiscover
          slides={popularTv}
          titleDiscover={"Serie TV di tendenza"}
          isLoading={isLoading}
          path={"/showtv"}
          onAction={handleSeeAllPopularTv}
          handleClickItem={handleClickItem}
          isDesktop={isDesktop}
          type={"tv"}
        />
        <CarouselDiscover
          slides={incomingMovie}
          titleDiscover={"Film in arrivo"}
          isLoading={isLoading}
          path={"/movies"}
          onAction={handleSeeAllIncomingMovie}
          handleClickItem={handleClickItem}
          isDesktop={isDesktop}
          type={"movie"}
        />
        <CarouselDiscover
          slides={italianMovie}
          titleDiscover={"Film italiani"}
          isLoading={isLoading}
          path={"/movies"}
          onAction={handleSeeAllMovieItaian}
          handleClickItem={handleClickItem}
          isDesktop={isDesktop}
          type={"movie"}
        />
        <CarouselDiscover
          slides={italianMovie}
          titleDiscover={"Film italiani"}
          isLoading={isLoading}
          path={"/movies"}
          onAction={handleSeeAllMovieItaian}
          handleClickItem={handleClickItem}
          isDesktop={isDesktop}
          type={"movie"}
        />
        {KEYWORDS_SEARCH_MOVIE.map(({ id, name, type }) => (
          <Fragment key={type}>
            <CarouselDiscover
              slides={keywordsMovie[type]}
              titleDiscover={name}
              isLoading={isLoading}
              path={"/movies"}
              onAction={() => handleSeeAllMovieItaian(id)}
              handleClickItem={handleClickItem}
              isDesktop={isDesktop}
              type={"movie"}
            />
          </Fragment>
        ))}
      </Box>

      {!isDesktop && <Box sx={{ height: `${HEIGHT_NAVIGATION_MOBILE}px` }} />}
    </Box>
  );
}
