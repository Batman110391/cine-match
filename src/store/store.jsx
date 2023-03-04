import { configureStore } from "@reduxjs/toolkit";
import movieQueryReducer from "./movieQuery";

export const store = configureStore({
  reducer: {
    movieQuery: movieQueryReducer,
  },
});
