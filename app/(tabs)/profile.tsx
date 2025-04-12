import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../redux/store";
import { fetchUser } from "../redux/slices/userSlice";

import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';




export default function ProfileScreen() {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);


  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);

  // Lấy thông tin người dùng khi màn hình mount
  useEffect(() => {
    const userId = "b806"; // Thay bằng logic lấy userId thực tế
    dispatch(fetchUser(userId));
  }, [dispatch]);

  // Hiển thị loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>PROFILE</Text>

      {/* Thông tin người dùng */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: user?.avatar || "https://i.imgur.com/6Vxi5Kz.png" }} style={styles.avatar} />
        <View>
          
          <Text style={styles.userName}>{user?.name || "Chưa có thông tin"}</Text>
          <Text style={styles.userEmail}>{user?.email || "Chưa có thông tin"}</Text>
        </View>
      </View>

      {/* Danh sách chức năng */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Chung</Text>
        <MenuItem title="Chỉnh sửa thông tin" onPress={() => router.push("/edit")} />
        <MenuItem title="Cẩm nang trồng cây" onPress={() => router.push("/guide")} />
        <MenuItem title="Lịch sử giao dịch" onPress={() => router.push("/history")} />
        <MenuItem title="Q & A" onPress={() => router.push("/qa")} />

        <Text style={styles.sectionTitle}>Bảo mật và Điều khoản</Text>
        <MenuItem title="Điều khoản và điều kiện" onPress={() => router.push("/terms")} />
        <MenuItem title="Chính sách quyền riêng tư" onPress={() => router.push("/privacy")} />

        <TouchableOpacity onPress={() => router.push("/explore")} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Trang chủ" onPress={() => router.push("/home")} />
        <NavItem icon="cart-outline" label="Giỏ hàng" onPress={() => router.push("/cart")} />
        <NavItem icon="person" label="Hồ sơ" onPress={() => router.push("/profile")} isActive />
      </View>
    </View>
  );
}

// Component Menu Item
const MenuItem = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={18} color="gray" />
  </TouchableOpacity>
);

// Component Nav Item
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
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  profileContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "gray" },
  menuContainer: { marginTop: 10, flex: 1 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "gray", marginTop: 15, marginBottom: 5 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 16 },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "white", fontSize: 16, fontWeight: "bold" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "gray", marginTop: 2 },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
});
