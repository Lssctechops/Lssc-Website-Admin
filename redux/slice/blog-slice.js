"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createblog = createAsyncThunk(
  "blog/create",
  async (formdata, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/admin/blog`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("course Created:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const getallblog = createAsyncThunk(
  "blog/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filter,
      });
      // console.log("blog Fetched:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("blog Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);
export const deleteblog = createAsyncThunk(
  "blog/delete",
  async (blogid, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/admin/blog/${blogid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("blog deleted successfully", data);
      return blogid; // Return the ID to filter it from the store
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
export const bloggetbyid = createAsyncThunk(
  "blog/delete",
  async (blogid, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/blog/${blogid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("blog getbyId successfully", data);
      return data; // Return the ID to filter it from the store
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
export const updateblog = createAsyncThunk(
  "blog/updatenotice",
  async ({ blogId, formdata }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    // console.log(blogId);
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      // Optionally add thumbnail here if needed, for now just send data as is
      const payload = {
        ...formdata,
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/admin/blog/${blogId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("blog updated successfully", response.data);
      return response.data; // Return the updated notice object
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const initialState = {
  course: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Newsletter
      .addCase(createblog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createblog.fulfilled, (state, action) => {
        state.loading = false;
        // state.newsletters.push(action.payload);
      })
      .addCase(createblog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create newsletter";
      })
      .addCase(bloggetbyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bloggetbyid.fulfilled, (state, action) => {
        state.loading = false;
        state.blogDetail = action.payload;
      })
      .addCase(bloggetbyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog by ID";
      });
  },
});

export default blogSlice.reducer;
