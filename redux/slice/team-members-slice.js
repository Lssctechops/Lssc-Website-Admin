import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const authHeader = () => {
  const token = Cookies.get("token");
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// The API stores images as thumbnail.url and order as position.
// The admin UI uses `image` and `order`. These map between them.
const fromApi = (m) => ({
  ...m,
  image: m?.thumbnail?.url || "",
  order: m?.position ?? 0,
});
const toApi = (p) => ({
  name: p.name,
  designation: p.designation,
  email: p.email || "",
  mobile: p.mobile || "",
  linkedin: p.linkedin || "",
  thumbnail: { url: p.image || "", publicId: p.publicId || "" },
  position: p.order ?? 0,
  isCeo: p.isCeo ?? false,
  isActive: p.isActive ?? true,
});

// GET all team members (public read)
export const fetchTeamMembers = createAsyncThunk(
  "teamMembers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/public/teamMember?limit=500`);
      const list = res.data?.data || [];
      return list.map(fromApi);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// CREATE team member (admin write)
export const createTeamMember = createAsyncThunk(
  "teamMembers/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/teamMember`,
        toApi(payload),
        authHeader()
      );
      return fromApi(res.data?.data || res.data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// UPDATE team member (admin write)
export const updateTeamMember = createAsyncThunk(
  "teamMembers/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/teamMember/${id}`,
        toApi(payload),
        authHeader()
      );
      return fromApi(res.data?.data || res.data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// DELETE team member (admin write)
export const deleteTeamMember = createAsyncThunk(
  "teamMembers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/teamMember/${id}`, authHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

const teamMembersSlice = createSlice({
  name: "teamMembers",
  initialState: { members: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load members";
      })
      .addCase(createTeamMember.pending, (state) => {
        state.saving = true;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.members.push(action.payload);
      })
      .addCase(createTeamMember.rejected, (state) => {
        state.saving = false;
      })
      .addCase(updateTeamMember.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const idx = state.members.findIndex(
          (m) => (m._id || m.id) === (updated?._id || updated?.id)
        );
        if (idx !== -1) state.members[idx] = updated;
      })
      .addCase(updateTeamMember.rejected, (state) => {
        state.saving = false;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (m) => (m._id || m.id) !== action.payload
        );
      });
  },
});

export default teamMembersSlice.reducer;