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

export default function App() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const initialStateStore = useSelector((state) => state.movieQuery);

  const [initialLoading, setInitialLoading] = useState(true);

  const [configCineMatch, setConfigCineMatch] = useSessionStorage(
    "configCineMatch",
    initialStateStore
  );

  useEffect(() => {
    if (configCineMatch) {
      dispatch(setQuery(configCineMatch));
    }

    setInitialLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    setConfigCineMatch(initialStateStore);
  }, [initialStateStore]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      return (
        <Route
          key={route.key}
          exact={route?.exact || true}
          path={route.route}
          element={
            <ErrorBoundary fallback={<div>Error...</div>}>
              <Suspense fallback={<LoadingPage />}>{route.component}</Suspense>
            </ErrorBoundary>
          }
        />
      );
    });

  return (
    <AnimatePresence mode="wait">
      <BoxLayout>
        {initialLoading ? (
          <LoadingPage />
        ) : (
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        )}
      </BoxLayout>
    </AnimatePresence>
  );
}
