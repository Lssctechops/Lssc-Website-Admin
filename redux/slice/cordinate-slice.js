"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create a new course
export const Addcordinate = createAsyncThunk(
  "course/create",
  async (payload, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/admin/map`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const getallcordinate = createAsyncThunk(
  "map/getall",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/map`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const deletecordinatebyid = createAsyncThunk(
  "map/getall",
  async (toDeleteId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/admin/map/${toDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const getcordinatebyid = createAsyncThunk(
  "map/get",
  async (MapId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/map/${MapId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const updatecordinatebyId = createAsyncThunk(
  "map/get",
  async ({ MapId, payload }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/admin/map/${MapId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  cordinate: {},
  loading: false,
  error: null,
};

// Slice
const cordinateSlice = createSlice({
  name: "cordinate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getallcordinate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallcordinate.fulfilled, (state, action) => {
        state.loading = false;
        state.cordinate = action.payload;
      })
      .addCase(getallcordinate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create course";
      });
  },
});

export default cordinateSlice.reducer;
