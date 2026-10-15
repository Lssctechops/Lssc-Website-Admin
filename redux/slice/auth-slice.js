"use client";
import {
  createAsyncThunk,
  createSlice,
  rejectWithValue,
} from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// console.log(NEXT_PUBLIC_API_URL);

// OTP Send Thunk
// export const Otpsend = createAsyncThunk(
//   "auth/otpsend",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post(
//         `${NEXT_PUBLIC_API_URL}/api/auth/otp`,
//         formData
//       );
//       // console.log(data);
//       return data;
//     } catch (error) {
//       // console.log(error);
//       return rejectWithValue(
//         error.response?.data?.message || "Otp sent failed"
//       );
//     }
//   }
// );

// Login Thunk
export const loginuser = createAsyncThunk(
  "auth/loginuser",
  async (obj, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/auth/login`,
        obj
      );
      // console.log(data);

      const role = data?.user?.role;
      const token = data.token;
      // console.log(token);
      if (role !== "admin") {
        return rejectWithValue("Only admin can login in this panel.");
      }

      Cookies.set("token", token, { expires: 6 });
      return data;
    } catch (error) {
      // console.log(error);
      return rejectWithValue(error.response?.data || "user login failed");
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
