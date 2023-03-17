import { Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import BoxLayout from "./components/BoxLayout";
import ErrorBoundary from "./utils/ErrorBoundary";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { routes } from "./routes";
import LoadingPage from "./components/LoadingPage";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

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
