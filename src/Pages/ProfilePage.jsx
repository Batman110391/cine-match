import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import AuthContext from "../context/authentication";
import LoadingPage from "../components/LoadingPage";
import { deepOrange } from "@mui/material/colors";
import { useQuery } from "react-query";
import { CURRENT_DATE_FORMATTING, fetchProfileData } from "../api/tmdbApis";
import CarouselDiscover from "../components/CarouselDiscover";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import { Link } from "react-router-dom";
import { uniqueArray } from "../utils/uniqueArray";

export default function ProfilePage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user, login, logout, authReady } = React.useContext(AuthContext);
  const { openDialogMovieDetail } = React.useContext(DialogMovieDetailContext);
  const actionChange = useSelector((state) => state.profileQuery.actionChange);

  const {
    isLoading,
    error,
    data = {},
  } = useQuery(["profile", user, actionChange], () => fetchProfileData(user));

  const { tv, movie } = data;

  const userInfo = React.useMemo(() => {
    return user
      ? {
          image: user?.user_metadata?.avatar_url,
          name: user?.user_metadata?.full_name,
        }
      : null;
  }, [user]);

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

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

  const flattenDataMovie = React.useMemo(() => {
    if (movie) {
      return Object.keys(movie)?.reduce((prev, key) => {
        return [...prev, ...movie[key]];
      }, []);
    }

    return [];
  }, [movie]);

  const flattenDataTv = React.useMemo(() => {
    if (tv) {
      return Object.keys(tv)?.reduce((prev, key) => {
        return [...prev, ...tv[key]];
      }, []);
    }

    return [];
  }, [tv]);

  const allUniqueMovie = uniqueArray(flattenDataMovie);
  const allUniqueTv = uniqueArray(flattenDataTv);

  return (
    <Box sx={{ height: "100vh" }}>
      {authReady ? (
        <>
          {!user ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 3,
              }}
            >
              <Button variant="contained" size="large" onClick={login}>
                Accedi
              </Button>
              <Typography
                variant="caption"
                sx={{ maxWidth: 550, px: 5, textAlign: "center" }}
                color="silver"
              >
                {
                  "Accedi per un'esperienza cinematografica personalizzata: tieni traccia dei film e delle serie Tv, ricevi notifiche esclusive e molto altro"
                }
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  height: 150,
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  //   borderBottom: "1px solid silver",
                  backgroundImage: `linear-gradient(-180deg, rgba(54,54,54,0.5), rgba(32,32,32,0.7)), url(/images/bg/bg-profile.jpg)`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top",
                  objectFit: "cover",
                  backgroundSize: "cover",
                }}
              >
                {userInfo?.image ? (
                  <Avatar
                    sx={{ width: 56, height: 56 }}
                    alt={userInfo?.name}
                    src={userInfo?.image}
                  />
                ) : (
                  <Avatar
                    sx={{ width: 56, height: 56, bgcolor: deepOrange[300] }}
                  >
                    {userInfo?.name[0]}
                  </Avatar>
                )}

                <Button variant="contained" color="error" onClick={logout}>
                  Esci
                </Button>
              </Box>
              <Divider />
              <Box sx={{ width: "100%", height: "100%", px: 2 }}>
                <CarouselDiscover
                  slides={allUniqueMovie}
                  titleDiscover={"FILM"}
                  isLoading={isLoading}
                  path={"/movies"}
                  onAction={
                    allUniqueMovie?.length > 0 ? handleSeeAllMovie : null
                  }
                  handleClickItem={handleClickItem}
                  isDesktop={isDesktop}
                  type={"movie"}
                  nobg
                  FallbackComponent={() => (
                    <Box
                      sx={{
                        height: 100,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography variant="caption">
                        {"Nessun film presente"}
                      </Typography>
                      <Button
                        LinkComponent={Link}
                        to={"/movies"}
                        size="small"
                        variant="contained"
                      >
                        Aggiungi
                      </Button>
                    </Box>
                  )}
                />

                <CarouselDiscover
                  slides={allUniqueTv}
                  titleDiscover={"SERIE TV"}
                  isLoading={isLoading}
                  path={"/tv"}
                  onAction={
                    allUniqueTv?.length > 0 ? handleSeeAllPopularTv : null
                  }
                  handleClickItem={handleClickItem}
                  isDesktop={isDesktop}
                  type={"tv"}
                  nobg
                  FallbackComponent={() => (
                    <Box
                      sx={{
                        height: 100,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography variant="caption">
                        {"Nessuna Serie Tv presente"}
                      </Typography>
                      <Button
                        LinkComponent={Link}
                        to={"/showtv"}
                        size="small"
                        variant="contained"
                      >
                        Aggiungi
                      </Button>
                    </Box>
                  )}
                />
              </Box>
            </Box>
          )}
        </>
      ) : (
        <LoadingPage />
      )}
    </Box>
  );
}
