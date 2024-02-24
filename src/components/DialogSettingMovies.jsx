import { useTheme } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Switch,
  useMediaQuery,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";
import AutocompleteSearchKeywords from "./AutocompleteSearchKeywords";
import CountrySelect from "./CountrySelect";
import DialogWrapperResponsivness from "./DialogWrapperResponsivness";
import ListGenresSetting from "./ListGenresSetting";
import ListProviderSettng from "./ListProviderSettng";
import SearchPeriods from "./SearchPeriods";

export default function DialogSettingMovies({
  open,
  setOpen,
  changeFilters,
  setChangeFilters,
  refetchPagination,
  movieQueryType,
}) {
  const theme = useTheme();

  const dispatch = useDispatch();

  const popertiesDispatch =
    movieQueryType === "movie" ? "querySearch" : "querySearchTv";

  const ordersType = React.useMemo(() => {
    return [
      { name: "Popolari", label: "popularity.desc" },
      { name: "Più Votati", label: "vote_average.desc" },
      {
        name: "Più recenti",
        label:
          movieQueryType === "movie"
            ? "primary_release_date.desc"
            : "first_air_date.desc",
      },
    ];
  }, [movieQueryType]);

  const fromPrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.from
  );
  const toPrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.to
  );
  const orderPrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.order_by
  );
  const exactPrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.exact_search
  );
  const genresPrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.with_genres
  );
  const providerPrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.with_ott_providers
  );
  const languagePrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.with_original_language
  );
  const keywordsPrev = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]?.with_keywords
  );

  const restQuery = useSelector(
    (state) => state.movieQuery?.[popertiesDispatch]
  );

  const [periods, setPeriods] = useState({
    from: fromPrev,
    to: toPrev,
  });
  const [sort, setSort] = useState(orderPrev);
  const [exactSearch, setExactSearch] = useState(exactPrev);
  const [selectedItemsGenres, setSelectedItemsGenres] = useState(genresPrev);
  const [providerSearch, setProviderSearch] = useState(providerPrev);
  const [languageMovie, setLanguageMovie] = useState(languagePrev);
  const [selectedKeywords, setSelectedKeywords] = useState(keywordsPrev);

  const disableSaveAction =
    fromPrev === periods.from &&
    toPrev === periods.to &&
    sort === orderPrev &&
    exactSearch === exactPrev &&
    selectedItemsGenres === genresPrev &&
    providerSearch === providerPrev &&
    languageMovie === languagePrev &&
    selectedKeywords === keywordsPrev;

  useEffect(() => {
    setPeriods({
      from: fromPrev,
      to: toPrev,
    });
    setSort(orderPrev);
    setExactSearch(exactPrev);
    setSelectedItemsGenres(genresPrev);
    setProviderSearch(providerPrev);
    setLanguageMovie(languagePrev);
    setSelectedKeywords(keywordsPrev);
  }, [
    fromPrev,
    toPrev,
    orderPrev,
    exactPrev,
    genresPrev,
    providerPrev,
    languagePrev,
    keywordsPrev,
    open,
  ]);

  const onSelectPeriod = (data) => {
    setPeriods({
      from: dayjs(data.from).format("YYYY-MM-DD"),
      to: dayjs(data.to).format("YYYY-MM-DD"),
      error: data.error,
    });
  };

  const handleChangeExactSearch = (event) => {
    setExactSearch(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveSetting = () => {
    dispatch(
      setQuery({
        [popertiesDispatch]: {
          ...restQuery,
          from: periods.from,
          to: periods.to,
          order_by: sort,
          with_genres: selectedItemsGenres,
          with_ott_providers: providerSearch,
          exact_search: exactSearch,
          with_original_language: languageMovie,
          with_keywords: selectedKeywords,
        },
      })
    );

    if (refetchPagination) {
      refetchPagination({ pageParam: 1 });
    }

    setChangeFilters(!changeFilters);

    handleClose();
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div>
      <DialogWrapperResponsivness
        open={open}
        onClose={handleClose}
        isDesktop={isDesktop}
        maxWidth={"lg"}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              component="div"
            ></Typography>
            <Button
              disabled={disableSaveAction}
              autoFocus
              color="inherit"
              onClick={handleSaveSetting}
            >
              Salva
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Metodi di ricerca
            </Typography>
            <FormControlLabel
              sx={{ maxWidth: "180px" }}
              control={
                <Switch
                  checked={exactSearch}
                  onChange={handleChangeExactSearch}
                />
              }
              label="Ricerca esatta"
            />
            <FormHelperText>
              Selezionare se si intende eseguire la ricerca con tutti i
              parametri presenti
            </FormHelperText>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Data
            </Typography>
            <SearchPeriods periods={periods} onSelectPeriod={onSelectPeriod} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Ordinamento
            </Typography>
            <Stack flexDirection={"row"} gap={2} flexWrap={"wrap"}>
              {ordersType.map((order) => (
                <Chip
                  key={order.label}
                  label={order.name}
                  onClick={() => setSort(order.label)}
                  color={sort === order.label ? "secondary" : "default"}
                />
              ))}
            </Stack>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Generi
            </Typography>
            <ListGenresSetting
              selectedItemsGenres={selectedItemsGenres}
              setSelectedItemsGenres={setSelectedItemsGenres}
              type={movieQueryType}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Servizi
            </Typography>
            <ListProviderSettng
              selectedItemsProviders={providerSearch}
              setSelectedItemsProviders={setProviderSearch}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Lingua
            </Typography>
            <CountrySelect
              languageMovie={languageMovie}
              setLanguageMovie={setLanguageMovie}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Parole chiavi
            </Typography>
            <AutocompleteSearchKeywords
              selectedKeywords={selectedKeywords}
              setSelectedKeywords={setSelectedKeywords}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
        </DialogContent>
      </DialogWrapperResponsivness>
    </div>
  );
}
