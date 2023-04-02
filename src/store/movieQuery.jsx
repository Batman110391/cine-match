import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export const initialState = {
  exactQuery: false,
  genres: [],
  cast: [],
  sort: "popularity.desc",
  rangeDate: JSON.stringify({
    from: dayjs("1975/01/01"),
    to: new Date(),
    error: false,
  }),
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
