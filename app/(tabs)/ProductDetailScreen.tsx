import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://192.168.1.131:3000/products/${id}`);
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
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 🟢 Hàm thêm sản phẩm vào giỏ hàng trong database
  const handleAddToCart = async () => {
    try {
      const response = await axios.post("http://192.168.1.131:3000/cart", {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });

      if (response.status === 201) {
        Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
        router.push("/cart");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{product.name}</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: product.image }} style={styles.productImage} />

      <Text style={styles.price}>{product.price.toLocaleString()}đ</Text>
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
        <Text style={styles.totalPrice}>{(product.price * quantity).toLocaleString()}đ</Text>
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
