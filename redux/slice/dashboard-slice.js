"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// LOCAL DEV — no backend. Return empty stats instead of fetching.
export const getalldata = createAsyncThunk(
  "course/getall",
  async () => {
    return { data: [] };
  }
);

const initialState = {
  course: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getalldata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getalldata.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload?.data || [];
      })
      .addCase(getalldata.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch dashboard data";
      });
  },
});

export default dashboardSlice.reducer;