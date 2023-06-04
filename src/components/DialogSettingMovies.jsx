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
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Grow from "@mui/material/Grow ";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { motion } from "framer-motion";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";
import ListGenresSetting from "./ListGenresSetting";
import SearchPeriods from "./SearchPeriods";
import dayjs from "dayjs";
import ListProviderSettng from "./ListProviderSettng";

const ORDERS = [
  { name: "Popolarità Decrescente", label: "popularity.desc" },
  { name: "Popolarità Crescente", label: "popularity.asc" },
  { name: "Valutazione Decrescente", label: "vote_average.desc" },
  { name: "Valutazione Crescente", label: "vote_average.asc" },
  { name: "Data Rilascio Crescente", label: "primary_release_date.asc" },
  { name: "Titolo (A-Z)", label: "title.asc" },
  { name: "Data Rilascio Decrescente", label: "primary_release_date.desc" },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function DialogSettingMovies({
  open,
  setOpen,
  changeFilters,
  setChangeFilters,
  refetchPagination,
}) {
  const theme = useTheme();

  const dispatch = useDispatch();

  const fromPrev = useSelector((state) => state.movieQuery.querySearch?.from);
  const toPrev = useSelector((state) => state.movieQuery.querySearch?.to);
  const orderPrev = useSelector(
    (state) => state.movieQuery.querySearch?.order_by
  );
  const exactPrev = useSelector(
    (state) => state.movieQuery.querySearch?.exact_search
  );
  const genresPrev = useSelector(
    (state) => state.movieQuery.querySearch?.with_genres
  );
  const providerPrev = useSelector(
    (state) => state.movieQuery.querySearch?.with_ott_providers
  );

  const [periods, setPeriods] = useState({
    from: fromPrev,
    to: toPrev,
  });
  const [sort, setSort] = useState(orderPrev);
  const [exactSearch, setExactSearch] = useState(exactPrev);
  const [selectedItemsGenres, setSelectedItemsGenres] = useState(genresPrev);
  const [providerSearch, setProviderSearch] = useState(providerPrev);

  const disableSaveAction =
    sort === orderPrev &&
    exactSearch === exactPrev &&
    selectedItemsGenres === genresPrev &&
    providerSearch === providerPrev;

  useEffect(() => {
    setPeriods({
      from: fromPrev,
      to: toPrev,
    });
    setSort(orderPrev);
    setExactSearch(exactPrev);
    setSelectedItemsGenres(genresPrev);
    setProviderSearch(providerPrev);
  }, [fromPrev, toPrev, orderPrev, exactPrev, genresPrev, providerPrev, open]);

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
        querySearch: {
          from: periods.from,
          to: periods.to,
          order_by: sort,
          with_genres: selectedItemsGenres,
          with_ott_providers: providerSearch,
          exact_search: exactSearch,
        },
      })
    );

    if (refetchPagination) {
      refetchPagination({ pageParam: 1 });
    }

    setChangeFilters(!changeFilters);

    handleClose();
  };

  return (
    <div>
      <Dialog
        fullScreen={useMediaQuery(theme.breakpoints.up("sm")) ? false : true}
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
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
              {ORDERS.map((order) => (
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
              type={"movie"}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
