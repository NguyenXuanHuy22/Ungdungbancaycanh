import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const apiUrl = "http://192.168.1.131:3000/users"; // Thay URL API đúng với backend

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Đăng ký tài khoản
  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return;
    }
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
  
      const text = await response.text(); // Lấy dữ liệu trả về dưới dạng text
  
      try {
        const result = JSON.parse(text); // Thử chuyển đổi sang JSON
        if (response.ok) {
          Alert.alert("Thành công", "Đăng ký thành công!", [
            { text: "OK", onPress: () => router.push('/explore') },
          ]);
        } else {
          Alert.alert("Lỗi", result.message || "Đăng ký thất bại, vui lòng thử lại!");
        }
      } catch (jsonError) {
        console.error("Lỗi parse JSON:", jsonError);
        console.error("Phản hồi từ server:", text);
        Alert.alert("Lỗi", "Phản hồi từ server không đúng định dạng JSON!");
      }
  
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ!");
      console.error("Lỗi đăng ký:", error);
    }
  };
  

  return (
    <ImageBackground 
      source={{ uri: 'https://i.pinimg.com/736x/f5/d1/af/f5d1af51f4ac4cf35a739d42bc3d4e19.jpg' }}
      style={{ flex: 1, justifyContent: 'center' }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Đăng ký</Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray', marginBottom: 20 }}>Tạo tài khoản</Text>

        <TextInput style={styles.input} placeholder="Họ tên" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Đăng ký</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginVertical: 10 }}>Hoặc</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          <TouchableOpacity>
            <Image source={{ uri: 'https://i.pinimg.com/474x/5b/b0/f7/5bb0f73a7b3e0f976acad614a42e5040.jpg' }} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={{ uri: 'https://i.pinimg.com/474x/60/41/99/604199df880fb029291ddd7c382e828b.jpg' }} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/explore')} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            Tôi đã có tài khoản. <Text style={{ color: 'blue', fontWeight: 'bold' }}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default RegisterScreen;
