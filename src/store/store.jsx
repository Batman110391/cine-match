import { configureStore } from "@reduxjs/toolkit";
import movieQueryReducer from "./movieQuery";
import profileQueryReducer, { updateProfileError } from "./profileQuery";
import { updateItemInProfile } from "../api/tmdbApis";

const UPDATE_DB_VALID_ACTIONS = [
  "profileQuery/upsertSeenTvEpisode",
  "profileQuery/addItem",
  "profileQuery/removeItem",
  "profileQuery/upsertSeenTvEpisode",
  "profileQuery/updateProfileError",
  "profileQuery/updateItem",
];

const customMiddleware = (store) => (next) => (action) => {
  const { profileQuery: profileQueryPrev = {} } = store?.getState() || {};

  const result = next(action);

  if (UPDATE_DB_VALID_ACTIONS.includes(action.type)) {
    const { profileQuery: profileQueryNew = {} } = store?.getState() || {};

    const { tv: newTvState, movie: newMovieState, userID } = profileQueryNew;

    const newObject = {
      tv: newTvState,
      movie: newMovieState,
    };

    updateItemInProfile(newObject, userID, (error) => {
      if (error) {
        console.error("Update erroring", error);
        return store.dispatch(updateProfileError(profileQueryPrev));
      }

      console.info("Update Succesfull");
    });
  }

  return result;
};

export const store = configureStore({
  reducer: {
    movieQuery: movieQueryReducer,
    profileQuery: profileQueryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(customMiddleware),
});
