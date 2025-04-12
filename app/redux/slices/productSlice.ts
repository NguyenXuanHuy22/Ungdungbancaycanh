import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Product {
  id: string; // Sửa thành string để khớp database
  name: string;
  price: number;
  size: string;
  origin: string;
  stock: string;
  image: string;
}

// API endpoint
const API_URL = "http://10.24.31.23:3000/products";

// Fetch danh sách sản phẩm
export const fetchProducts = createAsyncThunk("product/fetch", async () => {
  const response = await fetch(API_URL);
  return await response.json();
});

// Thêm sản phẩm
export const addProduct = createAsyncThunk("product/add", async (newProduct: Omit<Product, "id">) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });
  return await response.json();
});

// Xóa sản phẩm
export const deleteProduct = createAsyncThunk("product/delete", async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Xóa sản phẩm thất bại");
  }
  return id; // Trả về id để Redux cập nhật state
});

// Sửa sản phẩm
export const updateProduct = createAsyncThunk("product/update", async (updatedProduct: Product) => {
  const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct),
  });
  if (!response.ok) {
    throw new Error("Cập nhật sản phẩm thất bại");
  }
  return updatedProduct;
});

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [] as Product[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload); // Lọc sản phẩm theo id
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;