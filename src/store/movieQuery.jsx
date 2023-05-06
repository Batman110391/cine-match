import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export const initialState = {
  querySearch: {
    from: "1975-01-01",
    to: dayjs(new Date()).format("YYYY-MM-DD"),
    order_by: "popularity.desc",
    with_genres: [],
    with_ott_providers: [],
    exact_search: false,
  },
  querySearchTv: {
    from: "1975-01-01",
    to: dayjs(new Date()).format("YYYY-MM-DD"),
    order_by: "popularity.desc",
    with_genres: [],
    with_ott_providers: [],
    exact_search: false,
  },
  currentRoute: 0,
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
