import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Alert } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';

// Hàm kiểm tra định dạng email (pure function)
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<{ email?: string; password?: string }>({});

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  const handleLogin = async () => {
    let errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Vui lòng nhập email!';
    } else if (!validateEmail(email)) {
      errors.email = 'Email không đúng định dạng!';
    }

    if (!password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu!';
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      const response = await fetch(`http://10.24.31.23:3000/users?email=${email}&password=${password}`);
      const users = await response.json();

      if (users.length > 0) {
        Alert.alert('Đăng nhập thành công!');
        router.replace('/home'); // Điều hướng sang Home
      } else {
        setErrorMessage({ password: 'Email hoặc mật khẩu không đúng!' });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ!');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/f5/d1/af/f5d1af51f4ac4cf35a739d42bc3d4e19.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Chào mừng bạn</Text>
        <Text style={styles.subtitle}>Đăng nhập tài khoản</Text>

        <TextInput
          style={[styles.input, errorMessage.email && styles.inputError]}
          placeholder="Nhập email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage((prev) => ({ ...prev, email: '' }));
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
            setErrorMessage((prev) => ({ ...prev, password: '' }));
          }}
        />
        {errorMessage.password && <Text style={styles.errorText}>{errorMessage.password}</Text>}

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Hoặc</Text>

        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Image source={{ uri: 'https://i.pinimg.com/474x/5b/b0/f7/5bb0f73a7b3e0f976acad614a42e5040.jpg' }} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={{ uri: 'https://i.pinimg.com/474x/60/41/99/604199df880fb029291ddd7c382e828b.jpg' }} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.registerLink}>
          <Text style={styles.registerText}>
            Bạn chưa có tài khoản? <Text style={styles.registerTextBold}>Tạo tài khoản</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: 'green',
  },
  loginButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    textAlign: 'center',
  },
  registerTextBold: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
