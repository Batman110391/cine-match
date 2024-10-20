import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { fetchPersonDetailById } from "../api/tmdbApis";
import {
  DEPARTMENT_PERSONS,
  MOVIE_CARD_HEIGTH_MOBILE,
  MOVIE_CARD_WIDTH_MOBILE,
  MOVIE_PAGE_CARD_HEIGTH_MOBILE,
  MOVIE_PAGE_CARD_WIDTH_MOBILE,
  PERSON_DETAIL_HEIGHT,
  PERSON_DETAIL_HEIGHT_MOBILE,
  PERSON_DETAIL_WIDTH,
  PERSON_DETAIL_WIDTH_MOBILE,
} from "../utils/constant";
import CastsCard from "./CastsCard";
import DataGridListCreditsPerson from "./DataGridListCreditsPerson";
import DialogWrapperResponsivness from "./DialogWrapperResponsivness";
import GridListImageVisualizations from "./GridListImageVisualizations";
import MovieCard from "./MovieCard";
import SubHeader from "./SubHeader";
import { uniqueArray } from "../utils/uniqueArray";

export default function DialogPersonDetail({
  open,
  handleClose,
  personID,
  subItemClick,
}) {
  const theme = useTheme();

  const { isLoading, error, data } = useQuery(["personDetail", personID], () =>
    fetchPersonDetailById(personID)
  );

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const knownForDepartment = useMemo(() => {
    const currDepartment = data && data?.["known_for_department"];

    if (!currDepartment) {
      return null;
    }

    return DEPARTMENT_PERSONS[currDepartment];
  }, [data]);

  const personalInformation = [
    { key: "name", info: "Nome:" },
    { key: "deathday", info: "Morto il:" },
    { key: "birthday", info: "Nato il:" },
    {
      key: "known_for_department",
      value: DEPARTMENT_PERSONS,
      info: "Conosciuto per:",
    },
    { key: "place_of_birth", info: "Nato a:" },
  ];

  const actorsMovies = useMemo(() => {
    return normalizeMovie(data, "cast");
  }, [data]);

  const directorsMovies = useMemo(() => {
    return normalizeMovie(data, "crew", "Directing");
  }, [data]);

  const productorsMovies = useMemo(() => {
    return normalizeMovie(data, "crew", "Production");
  }, [data]);

  const wrtiterMovies = useMemo(() => {
    return normalizeMovie(data, "crew", "Writing");
  }, [data]);

  const aggregateCredits = useMemo(() => {
    return [
      { type: "Recitazione", data: actorsMovies },
      { type: "Direzione", data: directorsMovies },
      { type: "Produzione", data: productorsMovies },
      { type: "Scrittura", data: wrtiterMovies },
    ].sort((a, b) => {
      if (knownForDepartment && a.type === knownForDepartment) {
        return -1;
      } else if (knownForDepartment && b.type === knownForDepartment) {
        return 1;
      }

      return 0;
    });
  }, [
    knownForDepartment,
    actorsMovies,
    directorsMovies,
    productorsMovies,
    wrtiterMovies,
  ]);

  return (
    <DialogWrapperResponsivness
      open={open}
      onClose={handleClose}
      isDesktop={isDesktop}
      maxWidth={"xl"}
      PaperProps={{
        sx: {
          height: "100%",
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar sx={{ position: "relative" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {isLoading && !error ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : error ? (
        <h1>{JSON.stringify(error)}</h1>
      ) : (
        <DialogContent
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{ paddingX: 1.5 }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack flexDirection={"row"} justifyContent={"center"} gap={2.5}>
                <CastsCard
                  name={data?.name}
                  bg={data?.profile_path}
                  w={
                    isDesktop ? PERSON_DETAIL_WIDTH : PERSON_DETAIL_WIDTH_MOBILE
                  }
                  h={
                    isDesktop
                      ? PERSON_DETAIL_HEIGHT
                      : PERSON_DETAIL_HEIGHT_MOBILE
                  }
                  badge={false}
                  text={false}
                  noMotion={true}
                  noAction={true}
                />
                {personalInformation && personalInformation?.length > 0 && (
                  <Stack gap={1}>
                    {personalInformation.map(({ key, info, value }) => {
                      if (!data?.[key]) {
                        return null;
                      }

                      const translate = value ? value[data[key]] : data[key];

                      return (
                        <Stack
                          flexDirection={"row"}
                          flexWrap={"wrap"}
                          key={"infoPerson" + key}
                        >
                          <Typography
                            sx={{ mr: 1.2 }}
                            fontWeight={"bold"}
                            fontSize={"0.8rem"}
                          >
                            {info}
                          </Typography>
                          <Typography fontSize={"0.75rem"}>
                            {translate}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            </Grid>

            {aggregateCredits?.map(({ type, data }) => {
              if (data.length > 0) {
                return (
                  <Grid key={type} item xs={12}>
                    <SubHeader title={type}>
                      <GridListImageVisualizations
                        w={
                          isDesktop
                            ? MOVIE_PAGE_CARD_WIDTH_MOBILE
                            : MOVIE_CARD_WIDTH_MOBILE
                        }
                        gap={16}
                      >
                        {data.map(
                          ({ id, title, name, poster_path, media_type }) => (
                            <React.Fragment key={type + id}>
                              <MovieCard
                                title={title || name}
                                bg={poster_path}
                                isDesktop={isDesktop}
                                w={
                                  isDesktop
                                    ? MOVIE_PAGE_CARD_WIDTH_MOBILE
                                    : MOVIE_CARD_WIDTH_MOBILE
                                }
                                h={
                                  isDesktop
                                    ? MOVIE_PAGE_CARD_HEIGTH_MOBILE
                                    : MOVIE_CARD_HEIGTH_MOBILE
                                }
                                onClick={() => subItemClick(id, media_type)}
                              />
                            </React.Fragment>
                          )
                        )}
                      </GridListImageVisualizations>
                    </SubHeader>
                  </Grid>
                );
              }
            })}

            {isDesktop && (
              <Grid item xs={12}>
                <SubHeader title={"Tabella informativa"}>
                  <DataGridListCreditsPerson
                    data={[...(data?.cast || []), ...(data?.crew || [])]}
                    subItemClick={subItemClick}
                  />
                </SubHeader>
              </Grid>
            )}
            {data?.biography && (
              <Grid item xs={12}>
                <SubHeader title={"Biografia"}>
                  <Typography fontWeight={200} sx={{ mt: 3 }} variant={"body2"}>
                    {data?.biography}
                  </Typography>
                </SubHeader>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      )}
    </DialogWrapperResponsivness>
  );
}

function normalizeMovie(
  movies,
  field,
  filterField = null,
  sortingFields = ["popularity", "vote_count"],
  orderBy = "desc"
) {
  if (!movies || !movies?.[field]) {
    return null;
  }

  const withFilters = filterField
    ? movies[field].filter((dMovie) => dMovie?.department === filterField)
    : movies[field];

  const uniqueMoviesList = uniqueArray(withFilters);

  return uniqueMoviesList?.sort((a, b) =>
    sortByField(a, b, sortingFields, orderBy)
  );
}

function sortByField(a, b, sortingFields, orderBy) {
  const flatSortingNumberA = sortingFields?.reduce((prevFields, currField) => {
    return prevFields + (a[currField] || 0);
  }, 0);

  const flatSortingNumberB = sortingFields?.reduce((prevFields, currField) => {
    return prevFields + (b[currField] || 0);
  }, 0);

  if (flatSortingNumberA && flatSortingNumberB && orderBy === "desc") {
    return flatSortingNumberB - flatSortingNumberA;
  }

  if (flatSortingNumberA && flatSortingNumberB && orderBy === "asc") {
    return flatSortingNumberB - flatSortingNumberA;
  }

  if (flatSortingNumberA) {
    return -1;
  }

  if (flatSortingNumberB) {
    return 1;
  }

  return 0;
}
