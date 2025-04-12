import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addToCart } from "../redux/slices/cartSlice";
import axios from "axios";
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  origin: string;
  stock: number;
}

const ProductDetailScreen: React.FC = () => {


  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);
  
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      setQuantity(1);
      return () => {
        setQuantity(1);
      };
    }, [])
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://10.24.31.23:3000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm!</Text>
      </View>
    );
  }

  const changeQuantity = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    };

    try {
      await dispatch(addToCart(cartItem)).unwrap();
      Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
      router.push("/cart");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chi tiết sản phẩm</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>{product.price.toLocaleString("vi-VN")}đ</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Kích cỡ:</Text>
        <Text style={styles.value}>{product.size}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Xuất xứ:</Text>
        <Text style={styles.value}>{product.origin}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Tình trạng:</Text>
        <Text style={[styles.value, { color: product.stock > 0 ? "green" : "red" }]}>
          {product.stock > 0 ? `Còn ${product.stock} sp` : "Hết hàng"}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <Text style={styles.label}>Số lượng:</Text>
        <View style={styles.quantityBox}>
          <TouchableOpacity onPress={() => changeQuantity("decrease")} style={styles.quantityButton}>
            <Ionicons name="remove-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => changeQuantity("increase")} style={styles.quantityButton}>
            <Ionicons name="add-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalPrice}>{(product.price * quantity).toLocaleString("vi-VN")}đ</Text>
      </View>

      <TouchableOpacity style={styles.buyButton} onPress={handleAddToCart}>
        <Text style={styles.buyButtonText}>CHỌN MUA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  headerText: { fontSize: 20, fontWeight: "bold" },
  productImage: { width: "100%", height: 250, borderRadius: 10, marginBottom: 15 },
  price: { fontSize: 24, fontWeight: "bold", color: "green", marginBottom: 10 },
  productName: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { fontSize: 16, fontWeight: "bold" },
  value: { fontSize: 16 },
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  quantityBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", paddingHorizontal: 15, borderRadius: 8 },
  quantityButton: { padding: 10 },
  quantityText: { fontSize: 18, fontWeight: "bold", marginHorizontal: 10 },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "green" },
  buyButton: { backgroundColor: "green", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  buyButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red" },
});

export default ProductDetailScreen;