"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getallcategory = createAsyncThunk(
  "category/getall",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/category?limit=200`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("category fetched:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("category fetched Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);

const initialState = {
  category: [], // corrected key name
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getallcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallcategory.fulfilled, (state, action) => {
        state.loading = false;
        // Replace entire category array with fetched data
        // Assuming action.payload = { data: [...] }
        state.category = action.payload.data || [];
      })
      .addCase(getallcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      });
  },
});

export default categorySlice.reducer;
