import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genres: [],
  cast: [],
  sort: "popularity.desc",
  prevExcludeItems: [],
  rangeDate: { from: null, to: null, error: false },
  watch: [],
};

export const movieQuerySlice = createSlice({
  name: "movieQuery",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setQuery } = movieQuerySlice.actions;

export default movieQuerySlice.reducer;
