"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllCandidates = createAsyncThunk(
  "candidate/getAll",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/candidateRegistration`,
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
      console.error("Get Candidates Error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch candidates" }
      );
    }
  }
);

export const getAllCandidatebyid = createAsyncThunk(
  "candidate/getAll",
  async (candidateId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/candidateRegistration/${candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Get Candidates Error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch candidates" }
      );
    }
  }
);

const initialState = {
  candidates: [], // better: list of candidates
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload; // assuming payload is array
      })
      .addCase(getAllCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch candidates";
      });
  },
});

export default candidateSlice.reducer;
