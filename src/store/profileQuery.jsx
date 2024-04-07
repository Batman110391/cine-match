import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  error: false,
  userID: null,
  premium: false,
  tv: {},
  movie: {},
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
      return { ...state, ...action.payload };
    },
    resetProfileState: () => {
      return initialState;
    },
    addItem: (state, action) => {
      const { type, value, itemID } = action.payload;

      return {
        ...state,
        [type]: {
          ...state[type],
          [itemID]: {
            ...value,
          },
        },
      };
    },
    removeItem: (state, action) => {
      const { itemID, type } = action.payload;

      const newTypeList = Object.entries(state[type]).reduce(
        (prev, [key, value]) => {
          if (key != itemID) {
            return {
              ...prev,
              [key]: value,
            };
          }

          return prev;
        },
        {}
      );

      return {
        ...state,
        [type]: newTypeList,
      };
    },
    updateItem: (state, action) => {
      const { itemID, type, value } = action.payload;

      return {
        ...state,
        [type]: {
          ...state[type],
          [itemID]: {
            ...state[type][itemID],
            ...value,
          },
        },
      };
    },
    updateProfileError: (state, action) => {
      return { ...state, error: true, loading: false, ...action.payload };
    },
    upsertSeenTvEpisode: (state, action) => {
      const { itemID, seasonID, infoTv, value } = action.payload;

      const newItems = state.tv?.[itemID]
        ? {
            ...state.tv,
            [itemID]: {
              ...state.tv[itemID],
              seasons_seen: {
                ...(state.tv[itemID]?.seasons_seen || {}),
                [seasonID]: {
                  ...value,
                },
              },
            },
          }
        : {
            ...state.tv,
            [itemID]: {
              ...infoTv,
              seasons_seen: {
                [seasonID]: {
                  ...value,
                },
              },
            },
          };

      return {
        ...state,
        error: false,
        loading: false,
        tv: newItems,
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
  updateItem,
} = profileQuerySlice.actions;

export default profileQuerySlice.reducer;
