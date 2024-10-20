import { useTheme } from "@emotion/react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CarouselDiscover from "../components/CarouselDiscover";
import { DialogMovieDetailContext } from "../components/DialogMovieDetailProvider";
import LoadingPage from "../components/LoadingPage";
import AuthContext from "../context/authentication";
import { HEIGHT_NAVIGATION_MOBILE } from "../utils/constant";

export default function ProfilePage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user, login, logout, authReady } = React.useContext(AuthContext);
  const { openDialogMovieDetail } = React.useContext(DialogMovieDetailContext);
  const data = useSelector((state) => state.profileQuery) || {};

  const { tv, movie, loading: isLoading } = data;

  const userInfo = React.useMemo(() => {
    return user
      ? {
          image: user?.user_metadata?.avatar_url,
          name: user?.user_metadata?.full_name,
        }
      : null;
  }, [user]);

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleClickItem = (movieID, type) => {
    openDialogMovieDetail(movieID, type);
  };

  const flattenDataMovie = React.useMemo(() => {
    if (movie) {
      return Object.values(movie);
    }

    return [];
  }, [movie]);

  const flattenDataTv = React.useMemo(() => {
    if (tv) {
      return Object.values(tv);
    }

    return [];
  }, [tv]);

  return (
    <Box
      sx={{
        height: isDesktop
          ? "100vh"
          : `calc(100vh - ${HEIGHT_NAVIGATION_MOBILE}px)`,
      }}
    >
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
                  slides={flattenDataMovie}
                  titleDiscover={"FILM"}
                  path={flattenDataMovie?.length > 0 ? "/movielist" : null}
                  isLoading={isLoading}
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
                  slides={flattenDataTv}
                  titleDiscover={"SERIE TV"}
                  path={flattenDataTv?.length > 0 ? "/tvlist" : null}
                  isLoading={isLoading}
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
