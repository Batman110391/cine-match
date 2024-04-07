import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import BoxLayout from "./components/BoxLayout";
import LoadingPage from "./components/LoadingPage";
import { routes } from "./routes";
import { setQuery } from "./store/movieQuery";
import ErrorBoundary from "./utils/ErrorBoundary";
import { useSessionStorage } from "./utils/useSessionStorage";
import { updateMovies, updateNews } from "./api/tmdbApis";
import { supabase } from "./supabaseClient";
import { useSnackbar } from "notistack";

export default function App() {
  const { pathname, search } = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const initialStateStore = useSelector((state) => state.movieQuery);
  const error = useSelector((state) => state.profileQuery.error) || false;

  const [initialLoading, setInitialLoading] = useState(true);

  const [configCineMatch, setConfigCineMatch] = useSessionStorage(
    "configCineMatch",
    initialStateStore
  );

  const fetchLastExecutionDate = async () => {
    try {
      const { data, error } = await supabase
        .from("execution-dates")
        .select("date")
        .eq("id", 1);

      if (error) {
        console.error(
          "Errore durante il recupero della data dell'ultima esecuzione:",
          error
        );
        return;
      }
      // await updateNews();

      if (data.length > 0) {
        const timestampStr = data[0].date;
        const timestamp = parseInt(timestampStr, 10);

        const currentDate = Date.now();
        const executionAt = new Date(timestamp).getTime();
        const differenceInDays = Math.floor(
          (currentDate - executionAt) / (24 * 60 * 60 * 1000)
        );

        if (differenceInDays > 1) {
          await updateMovies();
          // await updateNews();
          const { error } = await supabase
            .from("execution-dates")
            .upsert([{ id: 1, date: currentDate }]);

          if (error) {
            console.error(
              "Errore durante l'aggiornamento della data dell'ultima esecuzione:",
              error
            );
            return;
          }
        }
      } else {
        await updateMovies();
        // await updateNews();
        const currentDate = Date.now();
        const { error } = await supabase
          .from("execution-dates")
          .upsert([{ id: 1, date: currentDate }]);

        if (error) {
          console.error(
            "Errore durante l'aggiornamento della data dell'ultima esecuzione:",
            error
          );
          return;
        }
      }
    } catch (error) {
      console.error(
        "Errore durante il recupero della data dell'ultima esecuzione:",
        error
      );
    }
  };

  useEffect(() => {
    if (configCineMatch) {
      dispatch(setQuery(configCineMatch));
    }

    fetchLastExecutionDate();

    setInitialLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    setConfigCineMatch(initialStateStore);
  }, [initialStateStore]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar("Errore imprevisto, riprova pià tardi.", {
        variant: "error",
      });
    }
  }, [error]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      return (
        <Route
          key={route.key}
          exact={route?.exact || true}
          path={route.route}
          element={
            <ErrorBoundary fallback={<div>Error...</div>}>
              <Suspense fallback={<LoadingPage />}>
                <BoxLayout
                  withNavigation={route.navbar}
                  sx={
                    route.key === "trailermovies" || route.key === "player"
                      ? { bgcolor: "black" }
                      : {}
                  }
                >
                  {route.component}
                </BoxLayout>
              </Suspense>
            </ErrorBoundary>
          }
        />
      );
    });

  return (
    <AnimatePresence mode="wait">
      {initialLoading ? (
        <LoadingPage />
      ) : (
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      )}
    </AnimatePresence>
  );
}
