import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
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
    upsertSeenTvEpisode: (state, action) => {
      const { itemID, seasonID, value } = action.payload;

      const complete = state.tv.seen.every((item) => {
        return Object.entries(item?.seasons_seen || {}).every(
          ([_, value]) => value.complete
        );
      });

      const newItems = state.tv.seen.map((ele) => {
        if (ele.id === itemID) {
          return {
            ...item,
            complete,
            seasons_seen: {
              ...(item?.seasons_seen || {}),
              [seasonID]: {
                ...value,
              },
            },
          };
        }

        return ele;
      });

      return { ...state, tv: { ...state.tv, seen: newItems } };
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
} = profileQuerySlice.actions;

export default profileQuerySlice.reducer;
