"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createNewsletter = createAsyncThunk(
  "newsletter/create",
  async (formData, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/admin/newsLetter`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Newsletter Created:", data);
      return data;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("Newsletter Create Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
export const getallnewslatter = createAsyncThunk(
  "newslatter/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/newsLetter`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filter,
      });
      // console.log("blog newslatter:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("blog Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);
export const deletnewslatter = createAsyncThunk(
  "newslatter/delete",
  async (id, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/admin/newsLetter/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("newslatter deleted successfully", data);
      return id; // Return the ID to filter it from the store
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
export const newsgetbyid = createAsyncThunk(
  "news/getbyid",
  async (newsId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/newsLetter/${newsId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("news getbyId successfully", data);
      return data; // Return the ID to filter it from the store
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
export const updatenewslatter = createAsyncThunk(
  "newslatter/updatenewslatter",
  async ({ newsId, formdata }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    // console.log(newsId);
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      // Optionally add thumbnail here if needed, for now just send data as is
      const payload = {
        ...formdata,
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/admin/newsLetter/${newsId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("news updated successfully", response.data);
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
  newsletters: [],
  loading: false,
  error: null,
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Newsletter
      .addCase(createNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.newsletters.push(action.payload);
      })
      .addCase(createNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create newsletter";
      });
  },
});

export default newsletterSlice.reducer;
