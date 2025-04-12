import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string; // address là tùy chọn vì dữ liệu hiện tại không có
  avatar: string;
}

// Lấy thông tin người dùng từ API
export const fetchUser = createAsyncThunk("user/fetchUser", async (userId: string) => {
  const response = await fetch(`http://10.24.31.23:3000/users/${userId}`);
  if (!response.ok) {
    throw new Error("Lấy thông tin người dùng thất bại");
  }
  return await response.json();
});

// Cập nhật thông tin người dùng qua API
export const updateUser = createAsyncThunk("user/updateUser", async (user: User) => {
  const response = await fetch(`http://10.24.31.23:3000/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Cập nhật thông tin người dùng thất bại");
  }
  return await response.json();
});

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi không xác định";
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi không xác định";
      });
  },
});

export default userSlice.reducer;