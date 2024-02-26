import { configureStore } from "@reduxjs/toolkit";
import movieQueryReducer from "./movieQuery";
import profileQueryReducer from "./profileQuery";

export const store = configureStore({
  reducer: {
    movieQuery: movieQueryReducer,
    profileQuery: profileQueryReducer,
  },
});
