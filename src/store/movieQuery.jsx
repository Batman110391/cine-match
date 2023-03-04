import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genres: [],
  actors: [],
  directors: [],
  rangeDate: "",
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
