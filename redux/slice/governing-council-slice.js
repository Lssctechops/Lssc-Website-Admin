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
  company: p.company,
  thumbnail: { url: p.image || "", publicId: p.publicId || "" },
  position: p.order ?? 0,
  isChairman: p.isChairman ?? false,
  isActive: p.isActive ?? true,
});

// GET all members (public read)
export const fetchCouncilMembers = createAsyncThunk(
  "governingCouncil/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/public/governingCouncil?limit=500`);
      const list = res.data?.data || [];
      return list.map(fromApi);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// CREATE member (admin write)
export const createCouncilMember = createAsyncThunk(
  "governingCouncil/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/governingCouncil`,
        toApi(payload),
        authHeader()
      );
      return fromApi(res.data?.data || res.data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// UPDATE member (admin write)
export const updateCouncilMember = createAsyncThunk(
  "governingCouncil/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/governingCouncil/${id}`,
        toApi(payload),
        authHeader()
      );
      return fromApi(res.data?.data || res.data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

// DELETE member (admin write)
export const deleteCouncilMember = createAsyncThunk(
  "governingCouncil/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/admin/governingCouncil/${id}`,
        authHeader()
      );
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

const governingCouncilSlice = createSlice({
  name: "governingCouncil",
  initialState: { members: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCouncilMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouncilMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCouncilMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load members";
      })
      .addCase(createCouncilMember.pending, (state) => {
        state.saving = true;
      })
      .addCase(createCouncilMember.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.members.push(action.payload);
      })
      .addCase(createCouncilMember.rejected, (state) => {
        state.saving = false;
      })
      .addCase(updateCouncilMember.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateCouncilMember.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const idx = state.members.findIndex(
          (m) => (m._id || m.id) === (updated?._id || updated?.id)
        );
        if (idx !== -1) state.members[idx] = updated;
      })
      .addCase(updateCouncilMember.rejected, (state) => {
        state.saving = false;
      })
      .addCase(deleteCouncilMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (m) => (m._id || m.id) !== action.payload
        );
      });
  },
});

export default governingCouncilSlice.reducer;