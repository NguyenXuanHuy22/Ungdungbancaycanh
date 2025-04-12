import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function CheckoutScreen() {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const products: { id: string; name: string; image: string; price: number; quantity: number }[] =
    params.selectedProducts ? JSON.parse(params.selectedProducts as string) : [];

  // Tính tổng tiền sản phẩm
  const subtotal = products.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  // State lưu thông tin khách hàng
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  // State chọn phương thức vận chuyển
  const [shippingMethod, setShippingMethod] = useState({
    type: "express",
    fee: 15000,
    estimate: "5-7 ngày",
  });

  // State chọn phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("visa");

  // Tổng tiền bao gồm phí vận chuyển
  const total = subtotal + (shippingMethod.fee || 0);

  const handleCheckout = async () => {
    if (!customer.name || !customer.address || !customer.phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin khách hàng.");
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("vi-VN"),
      status: "Đặt hàng thành công",
      statusColor: "green",
      products,
      customer,
      shippingMethod,
      paymentMethod,
      total,
    };

    try {
      const response = await fetch("http://10.24.31.23:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu đơn hàng");
      }

      Alert.alert("Thành công", "Đơn hàng đã được đặt!", [
        { text: "OK", onPress: () => router.push("/(tabs)/history") },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu đơn hàng.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THANH TOÁN</Text>
      </View>

      {/* Nội dung cuộn */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Danh sách sản phẩm đã chọn */}
        <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
        {products.length > 0 ? (
          products.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  {item.price !== undefined ? item.price.toLocaleString("vi-VN") : "0"}đ x {item.quantity}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Không có sản phẩm nào được chọn.</Text>
        )}

        {/* Thông tin khách hàng */}
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên khách hàng"
          value={customer.name}
          onChangeText={(text) => setCustomer({ ...customer, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={customer.email}
          onChangeText={(text) => setCustomer({ ...customer, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={customer.address}
          onChangeText={(text) => setCustomer({ ...customer, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType="numeric"
          value={customer.phone}
          onChangeText={(text) => setCustomer({ ...customer, phone: text })}
        />

        {/* Phương thức vận chuyển */}
        <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
        <TouchableOpacity
          style={[
            styles.option,
            shippingMethod.type === "express" && styles.selectedOption,
          ]}
          onPress={() =>
            setShippingMethod({ type: "express", fee: 15000, estimate: "5-7 ngày" })
          }
        >
          <Text style={styles.optionText}>Giao hàng Nhanh - 15.000đ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            shippingMethod.type === "cod" && styles.selectedOption,
          ]}
          onPress={() =>
            setShippingMethod({ type: "cod", fee: 50000, estimate: "4-6 ngày" })
          }
        >
          <Text style={styles.optionText}>Giao hàng hỏa tốc - 50.000đ</Text>
        </TouchableOpacity>

        {/* Hình thức thanh toán */}
        <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
        <TouchableOpacity
          style={[styles.option, paymentMethod === "visa" && styles.selectedOption]}
          onPress={() => setPaymentMethod("visa")}
        >
          <Text style={styles.optionText}>Thẻ VISA/MASTERCARD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, paymentMethod === "atm" && styles.selectedOption]}
          onPress={() => setPaymentMethod("atm")}
        >
          <Text style={styles.optionText}>Sau khi nhận hàng</Text>
        </TouchableOpacity>

        {/* Tổng tiền */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Tạm tính</Text>
          <Text style={styles.summaryAmount}>
            {subtotal !== undefined ? subtotal.toLocaleString("vi-VN") : "0"}đ
          </Text>
        </View>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Phí vận chuyển</Text>
          <Text style={styles.summaryAmount}>
            {shippingMethod.fee !== undefined ? shippingMethod.fee.toLocaleString("vi-VN") : "0"}đ
          </Text>
        </View>
        <View style={styles.summary}>
          <Text style={styles.totalText}>Tổng cộng</Text>
          <Text style={styles.totalAmount}>
            {total !== undefined ? total.toLocaleString("vi-VN") : "0"}đ
          </Text>
        </View>

        {/* Nút "Tiếp tục" */}
        <TouchableOpacity style={styles.continueButton} onPress={handleCheckout}>
          <Text style={styles.continueText}>Thanh toán</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 15, paddingBottom: 30 }, // Đệm dưới để nút "Thanh toán" không bị che
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  productItem: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  productImage: { width: 80, height: 80, borderRadius: 5, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { fontSize: 14, color: "#555" },
  emptyText: { fontSize: 14, color: "#555", marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginTop: 10 },
  option: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 15, marginTop: 10 },
  selectedOption: { borderColor: "green", backgroundColor: "#e6f9e6" },
  optionText: { fontSize: 14, fontWeight: "bold" },
  summary: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  summaryText: { fontSize: 16, color: "#555" },
  summaryAmount: { fontSize: 16, fontWeight: "bold", color: "#333" },
  totalText: { fontSize: 18, fontWeight: "bold" },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "green" },
  continueButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  continueText: { color: "white", fontSize: 18, fontWeight: "bold" },
});