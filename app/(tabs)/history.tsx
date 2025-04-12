import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

type ProductItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type OrderItem = {
  id: string;
  date: string;
  status: string;
  statusColor: string;
  products: ProductItem[];
  total: number;
};

const OrderHistoryScreen = () => {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);
  
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Hàm lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://10.24.31.23:3000/orders");
      console.log("Order Data:", response.data);

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error("Lỗi: API trả về dữ liệu không đúng định dạng");
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử mua hàng:", error);
      Alert.alert("Lỗi", "Không thể tải lịch sử mua hàng!");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm làm mới danh sách khi kéo xuống
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, []);

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderDate}>📅 Ngày mua: {item.date}</Text>
      <Text style={[styles.orderStatus, { color: item.statusColor }]}>
        ✅ {item.status}
      </Text>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={item.products}
        keyExtractor={(product) => product.id}
        nestedScrollEnabled
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                {Number(item.price).toLocaleString()}đ x {item.quantity}
              </Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.totalPrice}>
        💰 Tổng tiền: {Number(item.total).toLocaleString()}đ
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Lịch sử mua hàng</Text>

      {/* Kiểm tra nếu không có đơn hàng */}
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào!</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={<View style={{ height: 20 }} />} // Tạo khoảng trống cuối danh sách
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  emptyText: { textAlign: "center", color: "gray", marginTop: 50 },
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderDate: { fontSize: 14, color: "gray", marginBottom: 5 },
  orderStatus: { fontSize: 16, fontWeight: "bold" },
  productItem: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  productImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  productDetails: { flex: 1 },
  productName: { fontSize: 14, fontWeight: "500" },
  productPrice: { fontSize: 14, color: "#555" },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 10,
  },
});

export default OrderHistoryScreen;
