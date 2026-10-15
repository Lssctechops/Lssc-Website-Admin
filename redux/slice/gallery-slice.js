"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const creategallery = createAsyncThunk(
  "gallery/create",
  async (formData, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/admin/gallery`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("course Created:", data);
      return data;
    } catch (error) {
      toast.error(error.message);

      return rejectWithValue(errRes);
    }
  }
);
export const getallgallery = createAsyncThunk(
  "gallery/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/gallery`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filter,
      });
      // console.log("gallery Fetched:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("gallery Fetch Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
export const deletegallery = createAsyncThunk(
  "gallery/delete",
  async (id, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/admin/gallery/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("gallery deleted:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("gallery deleting Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);

const initialState = {
  course: [],
  loading: false,
  error: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Newsletter
      .addCase(creategallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(creategallery.fulfilled, (state, action) => {
        state.loading = false;
        // state.newsletters.push(action.payload);
      })
      .addCase(creategallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create newsletter";
      });
  },
});

export default gallerySlice.reducer;
