"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createbatch = createAsyncThunk(
  "create/batch",
  async (payload, { rejectWithValue }) => {
    // payload pass karen yahan se
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/trainer/batch`,
        payload, // batch data yahan bhejna hai
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("batch created:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error?.response?.data?.message || "Failed to fetch",
      });
    }
  }
);

export const getallbatch = createAsyncThunk(
  "batch/getall",
  async ({ filter } = {}, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/trainer/batch`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filter,
      });
      console.log("batch fetched:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error?.response?.data?.message || "Failed to fetch",
      });
    }
  }
);

const initialState = {
  batches: [],
  loading: false,
  error: null,
};

const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getallbatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallbatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload?.data || [];
      })
      .addCase(getallbatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      });
  },
});

export default batchSlice.reducer;
