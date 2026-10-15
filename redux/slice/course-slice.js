"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create a new course
export const createcourse = createAsyncThunk(
  "course/create",
  async (formdata, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/admin/courses`,
        formdata,
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

// Get all courses
export const getallcourse = createAsyncThunk(
  "course/getall",
  async ({ filter } = {}, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filter,
      });
      // console.log("Courses Fetched:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("Courses Fetch Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);

export const getallcoursesegment = createAsyncThunk(
  "course/getall",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/courseSegment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Courses Fetched:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("Courses Fetch Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
export const deletecourse = createAsyncThunk(
  "course/deletecourse",
  async (courseid, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/admin/courses/${courseid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("course deleted successfully", data);
      return courseid; // Return the ID to filter it from the store
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const coursegetbyid = createAsyncThunk(
  "course/getbyid",
  async (courseId, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("course getbyId successfully", data);
      return data; // Return the ID to filter it from the store
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updatecourse = createAsyncThunk(
  "course/update",
  async ({ courseId, formdata }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    // console.log(courseId);
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      // Optionally add thumbnail here if needed, for now just send data as is
      const payload = {
        ...formdata,
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/admin/courses/${courseId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("course updated successfully", response.data);
      return response.data; // Return the updated notice object
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Initial state
const initialState = {
  course: [],
  loading: false,
  error: null,
};

// Slice
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Course
      .addCase(createcourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createcourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course.push(action.payload); // Add new course to array
      })
      .addCase(createcourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create course";
      })

      // Get All Courses
      .addCase(getallcourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallcourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload?.data || []; // Assuming response is { data: [...] }
      })
      .addCase(getallcourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch courses";
      });
  },
});

export default courseSlice.reducer;
