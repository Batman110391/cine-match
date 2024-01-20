import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useState, Fragment } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import {
  CURRENT_DATE_FORMATTING,
  DATA_TOMORROW,
  DATE_SIX_MONTHS_LATER,
  fetchMoviesDiscover,
} from "../api/tmdbApis";
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
          to: CURRENT_DATE_FORMATTING,
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
          to: CURRENT_DATE_FORMATTING,
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
          to: DATE_SIX_MONTHS_LATER,
          order_by: "popularity.desc",
          with_genres: [],
          with_ott_providers: [],
          exact_search: false,
          with_release_type: "3",
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
          to: CURRENT_DATE_FORMATTING,
          order_by: "popularity.desc",
          with_genres: [],
          with_ott_providers: [],
          exact_search: false,
          with_original_language: "it",
          region: "IT",
          watch_region: "IT",
          with_release_type: "4|5|6",
          vote_count: "30",
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
          to: CURRENT_DATE_FORMATTING,
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
      [currKsm.name]: data?.[currKsm.name]?.results || [],
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
          invertBg={true}
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
          invertBg={true}
        />

        {KEYWORDS_SEARCH_MOVIE.map((ksm, i) => (
          <Fragment key={ksm.name}>
            <CarouselDiscover
              slides={keywordsMovie[ksm.name]}
              titleDiscover={ksm.label}
              isLoading={isLoading}
              path={"/movies"}
              onAction={() => handleSeeAllMovieKeywords(ksm.queries)}
              handleClickItem={handleClickItem}
              isDesktop={isDesktop}
              type={"movie"}
              invertBg={i % 2 !== 0}
            />
          </Fragment>
        ))}
      </Box>

      {!isDesktop && <Box sx={{ height: `${HEIGHT_NAVIGATION_MOBILE}px` }} />}
    </Box>
  );
}
