import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  actionChange: false,
};

export const profileQuerySlice = createSlice({
  name: "profileQuery",
  initialState,
  reducers: {
    setActionChange: (state) => {
      return { actionChange: !state.actionChange };
    },
  },
});

export const { setActionChange } = profileQuerySlice.actions;

export default profileQuerySlice.reducer;
