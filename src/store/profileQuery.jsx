import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  error: false,
  userID: null,
  tv: {
    watchlist: [],
    seen: [],
    favorite: [],
    notification: [],
  },
  movie: {
    watchlist: [],
    seen: [],
    favorite: [],
    notification: [],
  },
};

export const profileQuerySlice = createSlice({
  name: "profileQuery",
  initialState,
  reducers: {
    setLoadingProfile: (state, action) => {
      const { loading } = action.payload;
      return { ...state, loading };
    },
    initializeProfileState: (state, action) => {
      return { loading: state.loading, ...action.payload };
    },
    resetProfileState: () => {
      return initialState;
    },
    addItem: (state, action) => {
      const { field, value, type } = action.payload;

      return {
        ...state,
        [type]: { ...state[type], [field]: [...state[type][field], value] },
      };
    },
    removeItem: (state, action) => {
      const { itemID, field, type } = action.payload;

      return {
        ...state,
        [type]: {
          ...state[type],
          [field]: state[type][field].filter((item) => item.id !== itemID),
        },
      };
    },
    updateProfileError: (state, action) => {
      return { error: true, ...action.payload };
    },
    upsertSeenTvEpisode: (state, action) => {
      const { itemID, seasonID, infoTv, value } = action.payload;

      const newItems = state.tv.seen.find((tv) => tv.id === itemID)
        ? state.tv.seen.map((ele) => {
            if (ele.id === itemID) {
              return {
                ...ele,
                seasons_seen: {
                  ...(ele?.seasons_seen || {}),
                  [seasonID]: {
                    ...value,
                  },
                },
              };
            }

            return ele;
          })
        : [
            ...state.tv.seen,
            {
              ...infoTv,
              seasons_seen: {
                [seasonID]: {
                  ...value,
                },
              },
            },
          ];

      return {
        ...state,
        error: false,
        loading: false,
        tv: { ...state.tv, seen: newItems },
      };
    },
  },
});

export const {
  initializeProfileState,
  resetProfileState,
  addItem,
  removeItem,
  upsertSeenTvEpisode,
  setLoadingProfile,
  updateProfileError,
} = profileQuerySlice.actions;

export default profileQuerySlice.reducer;
