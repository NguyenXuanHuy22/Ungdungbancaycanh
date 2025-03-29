import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "./Context/CartContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useMemo } from "react";
import Toast from "react-native-toast-message";

export default function CartScreen() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Chọn/Bỏ chọn sản phẩm
  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];

      console.log("Selected Items:", newSelected);
      return newSelected;
    });
  };

  // Lọc danh sách sản phẩm đã chọn
  const selectedProducts = useMemo(
    () => cart.filter((item) => selectedItems.includes(item.id)),
    [cart, selectedItems]
  );

  // Tính tổng tiền
  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, id) => {
      const product = cart.find((item) => item.id === id);
      return product ? sum + Math.round(Number(product.price) * product.quantity) : sum;
    }, 0);
  }, [selectedItems, cart]);
  
  
  

  // Chuyển sang màn hình thanh toán
  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
  
    router.push({
      pathname: "/CheckoutScreen",
      params: { selectedProducts: JSON.stringify(selectedProducts) },
    });
  };
  

  // Hiển thị thông báo khi có sản phẩm trong giỏ hàng
  useEffect(() => {
    if (cart.length > 0) {
      Toast.show({
        type: "success",
        text1: "Sản phẩm đã được thêm vào giỏ hàng!",
      });
    }
  }, [cart.length]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        extraData={selectedItems} // Cập nhật UI khi chọn sản phẩm
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <TouchableOpacity onPress={() => toggleSelect(item.id)}>
              <Ionicons
                name={selectedItems.includes(item.id) ? "checkbox" : "square-outline"}
                size={24}
                color={selectedItems.includes(item.id) ? "green" : "black"}
              />
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, "decrease")}>
                  <Ionicons name="remove-circle-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, "increase")}>
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyCart}>Giỏ hàng của bạn đang trống!</Text>}
      />

      {/* Tổng tiền & Nút thanh toán */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>{totalPrice.toLocaleString("vi-VN")} đ</Text>

        </View>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            selectedProducts.length === 0 && { backgroundColor: "gray" },
          ]}
          onPress={handleCheckout}
          disabled={selectedProducts.length === 0}
        >
          <Text style={styles.checkoutText}>Thanh toán ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị thông báo */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", flex: 1, textAlign: "center" },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productImage: { width: 60, height: 60, borderRadius: 10, marginHorizontal: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { fontSize: 14, color: "green", fontWeight: "bold" },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  quantityText: { marginHorizontal: 10, fontSize: 16, fontWeight: "bold" },
  emptyCart: { textAlign: "center", fontSize: 16, marginTop: 20, color: "gray" },
  footer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  totalText: { fontSize: 16, fontWeight: "bold" },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "green" },
  checkoutButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 15,
  },
  checkoutText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
