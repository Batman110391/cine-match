import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genres: [],
  cast: [],
  similarMovies: [],
  prevExcludeItems: [],
  rangeDate: { from: null, to: null },
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
