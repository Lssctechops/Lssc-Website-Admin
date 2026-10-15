"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getalltrainersreports = createAsyncThunk(
  "trainerreport/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `
        ${API_BASE_URL}/api/admin/reports/trainer-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );
      return data;
    } catch (error) {
      console.error("trainerreportt fetched Error:", error);
      return rejectWithValue(error);
    }
  }
);
export const getallassesorreports = createAsyncThunk(
  "assesorreport/getall",
  async ({ filter } = {}, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `
        ${API_BASE_URL}/api/admin/reports/assessor-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );
      return data;
    } catch (error) {
      console.error("trainerreportt fetched Error:", error);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  reports: {},
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Newsletter
      .addCase(getalltrainersreports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getalltrainersreports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getalltrainersreports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create createbanner";
      })
      .addCase(getallassesorreports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallassesorreports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getallassesorreports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create createbanner";
      });
  },
});

export default reportsSlice.reducer;
