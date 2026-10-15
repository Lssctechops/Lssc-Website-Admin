"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getallstatscard = createAsyncThunk(
  "getallstatscard/getall",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `
        ${API_BASE_URL}/api/admin/reports/trainer-stats
`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("llstatscard fetched Error:", error);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  reports: {},
  loading: false,
  error: null,
};

const trainerdashboardSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Newsletter
      .addCase(getallstatscard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallstatscard.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getallstatscard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create createbanner";
      });
  },
});

export default trainerdashboardSlice.reducer;
