import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { darkTheme } from "./context/theme";
import { store } from "./store/store";
import DialogMovieDetailProvider from "./components/DialogMovieDetailProvider";
import { AuthContextProvider } from "./context/authentication";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <BrowserRouter>
      <Provider store={store}>
        <AuthContextProvider>
          <QueryClientProvider client={queryClient}>
            <DialogMovieDetailProvider>
              <App />
            </DialogMovieDetailProvider>
          </QueryClientProvider>
        </AuthContextProvider>
      </Provider>
    </BrowserRouter>
  </ThemeProvider>
);
