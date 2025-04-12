import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const addToCart = createAsyncThunk("cart/addToCart", async (cartItem: CartItem) => {
  const response = await fetch("http://10.24.31.23:3000/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cartItem),
  });
  if (!response.ok) {
    throw new Error("Thêm vào giỏ hàng thất bại");
  }
  return await response.json();
});

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await fetch("http://10.24.31.23:3000/cart");
  if (!response.ok) {
    throw new Error("Lấy giỏ hàng thất bại");
  }
  return await response.json();
});

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (id: string) => {
  const response = await fetch(`http://10.24.31.23:3000/cart/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Xóa sản phẩm thất bại");
  }
  return id;
});

export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, quantity }: { id: string; quantity: number }) => {
    const response = await fetch(`http://10.24.31.23:3000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error("Cập nhật số lượng thất bại");
    }
    return { id, quantity };
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [] as CartItem[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find((item) => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity; // Tăng số lượng nếu sản phẩm đã tồn tại
        } else {
          state.items.push(action.payload); // Thêm mới nếu chưa có
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      });
  },
});

export default cartSlice.reducer;