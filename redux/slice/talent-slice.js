"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAlltalentform = createAsyncThunk(
  "talentform/getAll",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/talentForm`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filter,
      });
      return data;
    } catch (error) {
      console.error("Get Candidates Error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch candidates" }
      );
    }
  }
);

export const getAlltalentformid = createAsyncThunk(
  "candidate/getAll",
  async (talentId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/talentForm/${talentId}`,
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

export const updatetalentform = createAsyncThunk(
  "candidate/updateTalentForm",
  async ({ talentId, status }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/admin/talentForm/${talentId}`,
        { status }, // ✅ status payload भेजना जरूरी है
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Update TalentForm Error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update talent form" }
      );
    }
  }
);

const initialState = {
  talent: [], // better: list of candidates
  loading: false,
  error: null,
};

const talentSlice = createSlice({
  name: "talent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAlltalentform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlltalentform.fulfilled, (state, action) => {
        state.loading = false;
        state.talent = action.payload; // assuming payload is array
      })
      .addCase(getAlltalentform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch candidates";
      });
  },
});

export default talentSlice.reducer;
