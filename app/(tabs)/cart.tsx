import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchCart, removeFromCart, updateCartQuantity } from "../redux/slices/cartSlice";
import Toast from "react-native-toast-message";
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';




const CartScreen: React.FC = () => {

    const navigation = useNavigation();
  
    useLayoutEffect(() => {
      navigation.setOptions({
        tabBarStyle: { display: 'none' },
      });
    }, [navigation]);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cartState = useSelector((state: RootState) => state.cart);
  const cart = cartState?.items || [];
  const loading = cartState?.loading || false;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Debug dữ liệu cart
  useEffect(() => {
    console.log("Cart Data:", cart);
  }, [cart]);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectedProducts = useMemo(
    () => cart.filter((item) => selectedItems.includes(item.id)),
    [cart, selectedItems]
  );

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, id) => {
      const product = cart.find((item) => item.id === id);
      // Kiểm tra product và price có tồn tại không
      return product && product.price !== undefined ? sum + Math.round(Number(product.price) * product.quantity) : sum;
    }, 0);
  }, [selectedItems, cart]);

  const updateQuantity = (id: string, type: "increase" | "decrease") => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newQuantity =
      type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    dispatch(updateCartQuantity({ id, quantity: newQuantity }));
  };

  const removeItem = (id: string) => {
    dispatch(removeFromCart(id))
      .unwrap()
      .then(() => Toast.show({ type: "success", text1: "Đã xóa sản phẩm khỏi giỏ hàng!" }))
      .catch((error) => Toast.show({ type: "error", text1: "Xóa thất bại!", text2: error.message }));
  };

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

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="green" style={styles.loading} />
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            extraData={selectedItems}
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
                  <Text style={styles.productPrice}>
                    {item.price !== undefined ? item.price.toLocaleString("vi-VN") : "N/A"}đ
                  </Text>
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
            contentContainerStyle={styles.flatListContent}
          />
        )}

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>
              {totalPrice !== undefined ? totalPrice.toLocaleString("vi-VN") : "0"} đ
            </Text>
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

        <View style={styles.bottomNav}>
          <NavItem icon="home" label="Trang chủ" onPress={() => router.push("/(tabs)/home")} />
          <NavItem icon="cart-outline" label="Giỏ hàng" onPress={() => router.push("/cart")} isActive />
          <NavItem icon="person-outline" label="Hồ sơ" onPress={() => router.push("/profile")} />
        </View>

        <Toast />
      </View>
    </SafeAreaView>
  );
};

const NavItem = ({
  icon,
  label,
  onPress,
  isActive = false,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <Ionicons name={icon} size={28} color={isActive ? "#27AE60" : "gray"} />
    <Text style={[styles.navText, isActive && { color: "#27AE60" }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 15 },
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
  flatListContent: { flexGrow: 1, paddingBottom: 20 },
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "gray", marginTop: 3 },
  loading: { flex: 1, justifyContent: "center" },
});

export default CartScreen;