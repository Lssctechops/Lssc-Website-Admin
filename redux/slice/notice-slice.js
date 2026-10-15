"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log(NEXT_PUBLIC_API_URL);

// Create Notice
export const createnotice = createAsyncThunk(
  "notice/createnotice",
  async (formdata, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      const payload = {
        ...formdata,
        thumbnail: {
          url: "https://res.cloudinary.com/dgfvnmlkd/image/upload/v1748309427/zljtqlpuzbt2ocsmkibd.jpg",
          publicId: "zljtqlpuzbt2ocsmkibd",
        },
      };

      const { data } = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/admin/notice`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Notice Created:", data);
      return data;
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Get Notices
export const getnotices = createAsyncThunk(
  "notice/getnotice",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      const { data } = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/admin/notice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );

      // console.log("Notices fetched successfully", data);
      return data;
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Delete Notice
export const deletenotice = createAsyncThunk(
  "notice/deletenotice",
  async (noticeid, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      const { data } = await axios.delete(
        `${NEXT_PUBLIC_API_URL}/api/admin/notice/${noticeid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Notice deleted successfully", data);
      return noticeid; // Return the ID to filter it from the store
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Update Notice
export const updatenotice = createAsyncThunk(
  "notice/updatenotice",
  async ({ id, data }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      const response = await axios.put(
        `${NEXT_PUBLIC_API_URL}/api/admin/notice/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getnoticebyId = createAsyncThunk(
  "notice/getnotice",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });

    try {
      const { data } = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/admin/notice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );

      // console.log("Notices fetched successfully", data);
      return data;
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
  notices: [],
  loading: false,
  error: null,
};

export const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Notices
      .addCase(getnotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(getnotices.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.notices = action.payload;
      // })
      .addCase(getnotices.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure payload is an array
        state.notices = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(getnotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notices";
      })

      // Create Notice
      .addCase(createnotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(createnotice.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.notices.push(action.payload);
      // })
      .addCase(createnotice.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.notices)) {
          state.notices.push(action.payload);
        } else {
          state.notices = [action.payload];
        }
      })

      .addCase(createnotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create notice";
      })

      // Delete Notice
      .addCase(deletenotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletenotice.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = state.notices.filter((n) => n._id !== action.payload);
      })
      .addCase(deletenotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete notice";
      })

      // Update Notice
      .addCase(updatenotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatenotice.fulfilled, (state, action) => {
        state.loading = false;
        // Replace the updated notice with new data
        const index = state.notices.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
      })
      .addCase(updatenotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update notice";
      });
  },
});

export default noticeSlice.reducer;
