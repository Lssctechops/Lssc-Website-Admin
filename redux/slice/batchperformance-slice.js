"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createbatchperformance = createAsyncThunk(
  "batch/getall",
  async (dataform, { rejectWithValue }) => {
    const token = Cookies.get("token");
    console.log(token);
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/trainer/batchPerformance`,
        dataform,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("batch performance:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error?.response?.data?.message || "Failed to create",
      });
    }
  }
);
export const getallbatchperformance = createAsyncThunk(
  "batchperformance/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/trainer/batchPerformance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );
      console.log("batchperformance fetched:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error?.response?.data?.message || "Failed to fetch",
      });
    }
  }
);

export const deleteperformance = createAsyncThunk(
  "notice/deleteperformance",
  async (id, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/trainer/batchPerformance/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Notice deleted successfully", data);
      return noticeid; // Return the ID to filter it from the store
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getallbatchperformanceBYiD = createAsyncThunk(
  "batchperformance/getall",
  async (reportId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/trainer/batchPerformance/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("batchperformanceByid fetched:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error?.response?.data?.message || "Failed to fetch",
      });
    }
  }
);

export const updatebatchperformanceBYiD = createAsyncThunk(
  "batchperformance/put",
  async ({ reportId, dataform }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/trainer/batchPerformance/${reportId}`,
        dataform,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("batchperformance updateById :", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error?.response?.data?.message || "Failed to update",
      });
    }
  }
);

const initialState = {
  batches: [],
  loading: false,
  error: null,
};

const batchperformanceSlice = createSlice({
  name: "batchperformance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createbatchperformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createbatchperformance.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload?.data || [];
      })
      .addCase(createbatchperformance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to crete createbatchperformance ";
      })

      .addCase(updatebatchperformanceBYiD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatebatchperformanceBYiD.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload?.data || [];
      })
      .addCase(updatebatchperformanceBYiD.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to crete createbatchperformance ";
      });
  },
});

export default batchperformanceSlice.reducer;
