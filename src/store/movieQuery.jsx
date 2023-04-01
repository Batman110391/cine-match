import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  exactQuery: false,
  genres: [],
  cast: [],
  sort: "popularity.desc",
  prevExcludeItems: [],
  rangeDate: {
    from: dayjs(new Date()).subtract(25, "year"),
    to: new Date(),
    error: false,
  },
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
