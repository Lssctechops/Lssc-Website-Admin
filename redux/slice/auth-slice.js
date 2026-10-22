"use client";
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// API address built directly into the code (no env var needed)
const NEXT_PUBLIC_API_URL = "https://lssc-api.onrender.com";

// Login Thunk
export const loginuser = createAsyncThunk(
  "auth/loginuser",
  async (obj, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/auth/login`,
        obj
      );

      const role = data?.user?.role;
      const token = data.token;

      if (role !== "admin") {
        return rejectWithValue("Only admin can login in this panel.");
      }

      Cookies.set("token", token, { expires: 6 });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "user login failed"
      );
    }
  }
);

const token = Cookies.get("token");

const initialState = {
  user: {},
  token: token || null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("token");
      toast.success("user logout successfully");
      state.user = {};
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginuser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(loginuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
