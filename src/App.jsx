import { Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import BoxLayout from "./components/BoxLayout";
import ErrorBoundary from "./utils/ErrorBoundary";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { routes } from "./routes";
import LoadingPage from "./components/LoadingPage";
import { useLocalStorage } from "./utils/useLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "./store/movieQuery";

export default function App() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const initialStateStore = useSelector((state) => state.movieQuery);

  const [configCineMatch, setConfigCineMatch] = useLocalStorage(
    "configCineMatch",
    initialStateStore
  );

  useEffect(() => {
    if (configCineMatch) {
      dispatch(setQuery(configCineMatch));
    }
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    setConfigCineMatch(initialStateStore);
  }, [pathname, initialStateStore]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      return (
        <Route
          key={route.key}
          exact
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
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BoxLayout>
    </AnimatePresence>
  );
}
