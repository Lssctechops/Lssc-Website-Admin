"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createuser = createAsyncThunk(
  "user/create",
  async (formData, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/admin/users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("user Created:", data);
      return data;
    } catch (error) {
      console.error("user Create Error:", error);
      return rejectWithValue(error);
    }
  }
);
export const getuserbyId = createAsyncThunk(
  "user/getById",
  async (id, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data; // user data
    } catch (error) {
      console.error("user Fetch Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getalltrainers = createAsyncThunk(
  "trainer/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/users?role=trainer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );
      // console.log("trainers:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("trainer Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);

export const getallassessors = createAsyncThunk(
  "assessors/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/users?role=assessor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );
      // console.log("assesors:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("assessors Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);

export const getalladmin = createAsyncThunk(
  "admin/getall",
  async ({ filter }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: filter,
      });
      // console.log("Admin:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("Admin Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);

export const getloginuser = createAsyncThunk(
  "getloginuser/get",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log("loginuser", data);
      return data;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("loginuser Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);

export const updateloginuser = createAsyncThunk(
  "putloginuser/put",
  async (formData, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("loginuser update", data);
      return data;
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("loginuser update Error:", error);
      return rejectWithValue(error);
    }
  }
);
export const deleteuserbyId = createAsyncThunk(
  "user/deleteuser",
  async (userid, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token)
      return rejectWithValue({ message: "Unauthorized: No token found" });
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/admin/users/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("user deleted successfully", data);
      return data; // Return the ID to filter it from the store
    } catch (error) {
      // console.log("Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getallunapprovedassessors = createAsyncThunk(
  "assessors/getall",
  async ({ filter } = {}, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/users?role=assessor&isApproved=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: filter,
        }
      );
      // console.log("assesors:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("assessors Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);

export const updateuserstatus = createAsyncThunk(
  "user/put",
  async ({ userId, ...payload }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateunapprovedassessors = createAsyncThunk(
  "assessors/updateStatus",
  async ({ id, isApproved = true }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/admin/users/${id}?role=assessor`, // 👈 correct endpoint for approval
        { isApproved }, // 👈 pass the new status
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data; // server should return updated user
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("Approval Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
export const getallunapprovedtrainers = createAsyncThunk(
  "assessors/getall",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/users?role=trainer&isApproved=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("assesors:", data);
      return data; // assume data = { data: [...] }
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("assessors Fetch Error:", error);
      return rejectWithValue(error);
    }
  }
);
export const updateunapprovedtrainers = createAsyncThunk(
  "assessors/updateStatus",
  async ({ id, isApproved = true }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/admin/users/${id}?role=trainer`, //  correct endpoint for approval
        { isApproved }, //  pass the new status
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data; // server should return updated user
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("Approval Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
export const updatestatusofuser = createAsyncThunk(
  "user/updateStatus",
  async ({ id, isApproved, isVerified }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue({ message: "Unauthorized: No token found" });
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/admin/users/${id}`,
        { isApproved, isVerified }, // 🔷 note: correct spelling of isVerified here
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data; // this should be the updated user object
    } catch (error) {
      const errRes = error.response?.data || { message: error.message };
      console.error("Update Status Error:", errRes);
      return rejectWithValue(errRes);
    }
  }
);
// export const logoutuser = createAsyncThunk(
//   "user/logout",
//   async (token, { rejectWithValue }) => {
//     if (!token) {
//       return rejectWithValue({ message: "Unauthorized: No token found" });
//     }

//     try {
//       const { data } = await axios.post(
//         `${API_BASE_URL}/api/auth/logout`,
//         {}, // <-- empty body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return data;
//     } catch (error) {
//       const errRes = error.response?.data || { message: error.message };
//       console.error("Logout Error:", errRes);
//       return rejectWithValue(errRes);
//     }
//   }
// );

const initialState = {
  user: {},
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "createuser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Newsletter
      .addCase(createuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createuser.fulfilled, (state, action) => {
        state.loading = false;
        // state.newsletters(action.payload);
      })
      .addCase(createuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create";
      })
      .addCase(getloginuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getloginuser.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getloginuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export default userSlice.reducer;
