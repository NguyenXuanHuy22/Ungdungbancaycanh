import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

// Hàm kiểm tra định dạng email
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    let errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Vui lòng nhập email!";
    } else if (!validateEmail(email)) {
      errors.email = "Email không đúng định dạng!";
    }

    if (!password.trim()) {
      errors.password = "Vui lòng nhập mật khẩu!";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.131:3000/users?email=${email}&password=${password}`);
      const users = await response.json();

      if (users.length > 0) {
        Alert.alert("Đăng nhập thành công!");
        router.replace("/home");
      } else {
        setErrorMessage({ password: "Email hoặc mật khẩu không đúng!" });
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ!");
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/f5/d1/af/f5d1af51f4ac4cf35a739d42bc3d4e19.jpg' }}
      style={{ flex: 1, justifyContent: 'center' }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Chào mừng bạn</Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray', marginBottom: 20 }}>Đăng nhập tài khoản</Text>

        <TextInput
          style={[styles.input, errorMessage.email && styles.inputError]}
          placeholder="Nhập email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage({ ...errorMessage, email: "" });
          }}
        />
        {errorMessage.email && <Text style={styles.errorText}>{errorMessage.email}</Text>}

        <TextInput
          style={[styles.input, errorMessage.password && styles.inputError]}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage({ ...errorMessage, password: "" });
          }}
        />
        {errorMessage.password && <Text style={styles.errorText}>{errorMessage.password}</Text>}

        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
          <Text style={{ color: 'green' }}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Đăng nhập</Text>
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
            Bạn chưa có tài khoản? <Text style={{ color: 'blue', fontWeight: 'bold' }}>Tạo tài khoản</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
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

export default LoginScreen;
