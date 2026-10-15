"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createresourcePdf = createAsyncThunk(
  "resourcePdf/create",
  async (payload, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `
        ${API_BASE_URL}/api/admin/resourcePdf`,
        payload,
        {
          headers: {
            Authorization: ` Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("resourcePdf Created:", data);
      return data;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("resourcePdf Create Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
export const getallresourcePdf = createAsyncThunk(
  "resourcePdf/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `
        ${API_BASE_URL}/api/admin/resourcePdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );
      // console.log("resourcePdf fetched:", data);
      return data;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      toast.error("resourcePdf fetched Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);

export const deleteresourcePdf = createAsyncThunk(
  "resourcePdf/delete",
  async (id, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.delete(
        `
        ${API_BASE_URL}/api/admin/resourcePdf/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("resourcePdf deleetd:", data);
      return data;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("resourcePdf deleetd Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
export const getresourcePdfbyId = createAsyncThunk(
  "resourcePdf/getbyId",
  async (resourceId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `
        ${API_BASE_URL}/api/admin/resourcePdf/${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("resourcePdf fetchedbyId:", data);
      return data;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("resourcePdf deleetd Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);

export const updateresourcePdfbyId = createAsyncThunk(
  "resourcePdf/updatebyId",
  async ({ id, data }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/resourcePdf/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      // console.log("resourcePdf updated:", responseData);
      return responseData;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("resourcePdf update error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);

const initialState = {
  newsletters: [],
  loading: false,
  error: null,
};

const bookandnewslatterSlice = createSlice({
  name: "resourcePdf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Newsletter
      .addCase(createresourcePdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createresourcePdf.fulfilled, (state, action) => {
        state.loading = false;
        state.newsletters.push(action.payload);
      })
      .addCase(createresourcePdf.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create createresourcePdf";
      });
  },
});

export default bookandnewslatterSlice.reducer;
