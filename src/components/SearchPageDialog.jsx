import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grow,
  IconButton,
  InputBase,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { alpha, styled } from "@mui/material/styles";
import * as React from "react";

import { useTheme } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";
import { green, grey, orange, purple } from "@mui/material/colors";
import { useQuery } from "react-query";
import { fetchMoviesByKeywords } from "../api/tmdbApis";
import CastsCard from "../components/CastsCard";
import MovieCard from "../components/MovieCard";
import { useDebounce } from "../utils/useDebounce";
import { CircularProgressWithLabel } from "./ChartCompatibility";
import { DialogMovieDetailContext } from "./DialogMovieDetailProvider";
import {
  MINI_MOVIE_CARD_HEIGTH,
  MINI_MOVIE_CARD_WIDTH,
  MOVIE_CARD_HEIGTH_MOBILE,
  MOVIE_CARD_WIDTH_MOBILE,
} from "../utils/constant";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.07),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },

  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const SEARCH_TYPE = [
  {
    label: "Film",
    type: "movie",
    color: orange[600],
  },
  {
    label: "Serie TV",
    type: "tv",
    color: green[600],
  },
  {
    label: "Cast",
    type: "person",
    color: purple[600],
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function SearchPageDialog({ open, setOpen }) {
  const { openDialogMovieDetail, openDialogPersonDetail } = React.useContext(
    DialogMovieDetailContext
  );

  const [typeQuery, setTypeQuery] = React.useState("movie");
  const [searchInput, setSearchInput] = React.useState("");

  const theme = useTheme();

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const { isLoading, error, data } = useQuery(
    ["searchKeyword", debouncedSearchTerm, typeQuery],
    () => fetchMoviesByKeywords(debouncedSearchTerm, typeQuery)
  );

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const handleClickChip = (type) => {
    if (typeQuery !== type) {
      setTypeQuery(type);
    }
  };

  const redirectMovie = (movieId, type) => {
    if (movieId) {
      openDialogMovieDetail(movieId, type);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Dialog
      fullScreen={isDesktop ? false : true}
      fullWidth={true}
      maxWidth={"md"}
      open={open}
      scroll={"paper"}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ bgcolor: "background.paper", p: 2, pb: 0 }}>
        <Box sx={{ width: "90%" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Cerca film, serie tv, cast..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Search>
        </Box>
        <Box sx={{ py: 2 }}>
          <Stack direction="row" spacing={1}>
            {SEARCH_TYPE.map(({ label, type, color }) => (
              <Chip
                key={type}
                onClick={() => handleClickChip(type)}
                label={label}
                sx={{
                  bgcolor: typeQuery === type ? color : "transparent",
                }}
                variant={typeQuery === type ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          bgcolor: "background.paper",
          overflow: { xs: "hidden", sm: "auto" },
          p: { xs: 0, sm: 2 },
        }}
        dividers
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "80vh",
            overflowX: "hidden",
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.07),
            mb: 2,
          }}
        >
          {isLoading && <LinearProgress />}
          {data && data.length > 0 && (
            <List disablePadding>
              {data?.map((curMovie, i) => {
                const percentRating =
                  curMovie.vote_average &&
                  (curMovie.vote_average.toFixed(1) * 100) / 10;

                const secondaryAction = percentRating ? (
                  <Box>
                    <CircularProgressWithLabel
                      to={percentRating}
                      size={isDesktop ? 35 : 30}
                      labelSize={isDesktop ? 11 : 10}
                      durationAnimate={0}
                    />
                  </Box>
                ) : null;

                if (typeQuery === "movie" || typeQuery === "tv") {
                  return (
                    <React.Fragment key={typeQuery + i}>
                      <ListItem
                        disablePadding
                        sx={{
                          position: "relative",
                          "& .MuiListItemSecondaryAction-root": {
                            top: 30,
                            right: 10,
                          },
                        }}
                        secondaryAction={secondaryAction}
                      >
                        <ListItemButton
                          alignItems="flex-start"
                          sx={{ gap: 2 }}
                          onClick={() => redirectMovie(curMovie?.id, typeQuery)}
                          key={i + "movieSearchs"}
                        >
                          <ListItemAvatar>
                            <MovieCard
                              title={curMovie?.title || curMovie?.name}
                              bg={curMovie?.poster_path}
                              w={MOVIE_CARD_WIDTH_MOBILE}
                              h={MOVIE_CARD_HEIGTH_MOBILE}
                              isDesktop={false}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ fontSize: "1rem" }}
                                variant={"h6"}
                              >
                                {curMovie?.title || curMovie?.name}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  sx={{ fontSize: "0.7rem" }}
                                  variant={"button"}
                                >
                                  {curMovie?.release_date ||
                                    curMovie?.first_air_date}
                                </Typography>
                                <Typography
                                  component="span"
                                  fontWeight={300}
                                  sx={{
                                    mt: 1,
                                    fontSize: "0.8rem",
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 4,
                                  }}
                                  variant={"body2"}
                                >
                                  {curMovie?.overview}
                                </Typography>
                              </>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={"personSearchQuery" + i}>
                      <ListItem disablePadding sx={{ position: "relative" }}>
                        <ListItemButton
                          alignItems="flex-start"
                          sx={{ gap: 2, flexGrow: 0 }}
                          onClick={() => openDialogPersonDetail(curMovie?.id)}
                        >
                          <ListItemAvatar>
                            <CastsCard
                              known_for_department={
                                curMovie?.known_for_department
                              }
                              name={curMovie?.name}
                              bg={curMovie?.profile_path}
                              noMotion
                              text={false}
                              badge={false}
                              w={MOVIE_CARD_WIDTH_MOBILE}
                              h={MOVIE_CARD_HEIGTH_MOBILE}
                              isDesktop={false}
                            />
                          </ListItemAvatar>
                        </ListItemButton>
                        <ListItemText
                          sx={{ pl: 1 }}
                          primary={
                            <Typography
                              sx={{ fontSize: "1rem", pl: 1 }}
                              variant={"h6"}
                            >
                              {curMovie?.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                sx={{
                                  pl: 1,
                                  fontSize: "0.7rem",
                                  color: "text.secondary",
                                }}
                                variant={"button"}
                              >
                                {curMovie?.known_for_department === "Acting"
                                  ? "Attore"
                                  : "Regista"}
                              </Typography>
                              <Stack
                                component={"span"}
                                flexDirection={"row"}
                                gap={1}
                                sx={{ mt: 1 }}
                              >
                                {curMovie?.known_for &&
                                  curMovie?.known_for?.map((movie, index) => (
                                    <React.Fragment key={movie?.id + index}>
                                      <Tooltip
                                        title={movie?.title || movie?.name}
                                      >
                                        <Button>
                                          <MovieCard
                                            title={movie?.title || movie?.name}
                                            bg={movie?.poster_path}
                                            w={MINI_MOVIE_CARD_WIDTH}
                                            h={MINI_MOVIE_CARD_HEIGTH}
                                            isDesktop={false}
                                            onClick={() =>
                                              redirectMovie(
                                                movie?.id,
                                                movie?.media_type
                                              )
                                            }
                                          />
                                        </Button>
                                      </Tooltip>
                                    </React.Fragment>
                                  ))}
                              </Stack>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  );
                }
              })}
            </List>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
