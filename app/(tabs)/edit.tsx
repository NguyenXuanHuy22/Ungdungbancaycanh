import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchUser, updateUser } from "../redux/slices/userSlice";
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';


export default function EditProfileScreen() {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);


  const router = useRouter();


  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const [avatar, setAvatar] = useState<string>("https://i.imgur.com/6Vxi5Kz.png");


  // State cho form nhập liệu
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const pickImage = async () => {
    // Yêu cầu quyền truy cập ảnh
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Quyền bị từ chối", "Bạn cần cho phép truy cập ảnh để thay đổi avatar.");
      return;
    }

    // Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // avatar thường là hình vuông
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setAvatar(selectedAsset.uri);  // cập nhật ảnh hiển thị luôn
    }
  };


  // Lấy thông tin người dùng khi màn hình mount
  useEffect(() => {
    const userId = "b806"; // Thay bằng logic lấy userId thực tế (ví dụ: từ auth)
    dispatch(fetchUser(userId));
  }, [dispatch]);

  // Cập nhật state khi user từ Redux thay đổi
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "https://i.imgur.com/6Vxi5Kz.png");
    }
  }, [user]);

  // Xử lý lưu thông tin
  const handleSave = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const updatedUser = {
      id: user?.id || "b806", // Thay bằng logic lấy userId thực tế
      name,
      email,
      phone,
      address,
      avatar,
    };

    try {
      await dispatch(updateUser(updatedUser)).unwrap();
      Alert.alert("Thành công", "Thông tin đã được cập nhật!", [
        { text: "OK", onPress: () => router.push("/(tabs)/profile") },
      ]);
    } catch (err) {
      Alert.alert("Lỗi", "Cập nhật thông tin thất bại.");
      console.error(err);
    }
  };

  // Hiển thị loading khi đang fetch hoặc update
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  // Hiển thị lỗi nếu có
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
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/profile")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>CHỈNH SỬA THÔNG TIN</Text>

      {/* Avatar */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
      </TouchableOpacity>


      {/* Mô tả */}
      <Text style={styles.description}>
        Thông tin sẽ được lưu cho lần mua kế tiếp. Bấm vào thông tin chi tiết để chỉnh sửa.
      </Text>

      {/* Form nhập liệu */}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tên"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Địa chỉ"
      />
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Số điện thoại"
      />

      {/* Nút lưu thông tin */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>LƯU THÔNG TIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 1 },
  header: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignSelf: "center", marginVertical: 15 },
  description: { textAlign: "center", color: "gray", marginBottom: 20 },
  input: { backgroundColor: "#F3F3F3", padding: 12, borderRadius: 8, marginBottom: 10 },
  saveButton: { backgroundColor: "#888", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorText: { color: "red", textAlign: "center", fontSize: 16 },
});