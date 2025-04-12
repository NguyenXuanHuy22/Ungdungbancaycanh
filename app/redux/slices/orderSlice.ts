// redux/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Order {
  id: string;
  date: string;
  status: string;
  statusColor: string;
  products: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  customer: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  shippingMethod: {
    type: string;
    fee: number;
    estimate: string;
  };
  paymentMethod: string;
  total: number;
}

// Lấy danh sách đơn hàng của người dùng
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://10.24.31.23:3000/users/${userId}`);
      if (!response.ok) {
        throw new Error("Lấy đơn hàng thất bại");
      }
      const user = await response.json();
      return user.orders || [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);

// Thêm đơn hàng mới (để đồng bộ với các màn hình khác)
export const addOrder = createAsyncThunk(
  "order/addOrder",
  async ({ userId, order }: { userId: string; order: Order }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://10.24.31.23:3000/users/${userId}`);
      if (!response.ok) {
        throw new Error("Lấy thông tin người dùng thất bại");
      }
      const user = await response.json();
      const updatedOrders = user.orders ? [...user.orders, order] : [order];

      const updateResponse = await fetch(`http://10.24.31.23:3000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, orders: updatedOrders }),
      });
      if (!updateResponse.ok) {
        throw new Error("Thêm đơn hàng thất bại");
      }
      return updatedOrders;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;