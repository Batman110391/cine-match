import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Grow from "@mui/material/Grow ";
import {
  Avatar,
  Box,
  Chip,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Switch,
  useMediaQuery,
} from "@mui/material";
import SearchPeriods from "./SearchPeriods";
import { useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import TypographyAnimated from "./TypographyAnimated";
import { motion } from "framer-motion";
import { Stack } from "@mui/system";
import ListGenresSetting from "./ListGenresSetting";
import AutocompleteCastSetting from "./AutocompleteCastSetting";
import { useTheme } from "@emotion/react";

const ORDERS = [
  { name: "Popolarità", label: "popularity.desc" },
  { name: "Recente", label: "release_date.desc" },
  { name: "Voto", label: "vote_average.desc" },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function DialogSettingMovies({ open, setOpen }) {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };

  const theme = useTheme();

  const periodsQuery = useSelector((state) => state.movieQuery.rangeDate);
  const genresQuery = useSelector((state) => state.movieQuery.genres);
  const sortQuery = useSelector((state) => state.movieQuery.sort);

  const [periods, setPeriods] = useState(periodsQuery);
  const [sort, setSort] = useState(sortQuery);
  const [exactSearch, setExactSearch] = React.useState(false);

  const [selectedItemsGenres, setSelectedItemsGenres] = useState(genresQuery);

  const onSelectPeriod = (data) => {
    setPeriods({
      from: dayjs(data.from).format("DD/MM/YYYY"),
      to: dayjs(data.to).format("DD/MM/YYYY"),
      error: data.error,
    });
  };

  const handleChangeExactSearch = (event) => {
    setExactSearch(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //option ricerca ESATTA

  //data

  //01/01/2000
  //14/03/2023

  //YYYY-MM-DD // &release_date.gte=PRIMA &release_date.lte=DOPO

  //sort

  //  popularity.desc, POPOLARITA
  //  release_date.desc, RECENTI
  //  vote_average.desc, MIGLIOR VOTI

  //generi  ...

  //cast ...

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
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent
          component={motion.div}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible,
          }}
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
            <SearchPeriods onSelectPeriod={onSelectPeriod} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Ordinamento
            </Typography>
            <Stack flexDirection={"row"} gap={3}>
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
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="button" gutterBottom>
              Cast
            </Typography>
            <AutocompleteCastSetting />
          </Box>
          <Divider sx={{ my: 2 }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
