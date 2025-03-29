import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, action: "increase" | "decrease") => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const API_URL = "http://192.168.1.131:3000/cart"; // Đổi URL theo server của bạn

  // 🟢 1. Lấy giỏ hàng từ database khi mở app
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(API_URL);
        setCart(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };
    fetchCart();
  }, []);

  // 🟢 2. Thêm sản phẩm vào giỏ hàng trong database
  const addToCart = async (item: CartItem) => {
    try {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);
      let newCart;

      if (existingItem) {
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + item.quantity };
        await axios.patch(`${API_URL}/${item.id}`, updatedItem);
        newCart = cart.map((cartItem) => (cartItem.id === item.id ? updatedItem : cartItem));
      } else {
        await axios.post(API_URL, item);
        newCart = [...cart, item];
      }

      setCart(newCart);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  // 🟢 3. Cập nhật số lượng sản phẩm
  const updateQuantity = async (id: string, action: "increase" | "decrease") => {
    try {
      const item = cart.find((cartItem) => cartItem.id === id);
      if (!item) return;

      const newQuantity = action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      const updatedItem = { ...item, quantity: newQuantity };

      await axios.patch(`${API_URL}/${id}`, updatedItem);
      setCart(cart.map((cartItem) => (cartItem.id === id ? updatedItem : cartItem)));
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  // 🟢 4. Xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCart(cart.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  // 🟢 5. Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      await axios.delete(API_URL); // API này cần hỗ trợ xóa toàn bộ giỏ hàng
      setCart([]);
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
