import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('Nguyễn Xuân Huy');
  const [email, setEmail] = useState('huynxph52088@gmail.com');
  const [address, setAddress] = useState('Mỹ Đình, Hà Nội');
  const [phone, setPhone] = useState('0123456789');

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>CHỈNH SỬA THÔNG TIN</Text>

      {/* Avatar */}
      <Image source={{ uri: 'https://i.imgur.com/6Vxi5Kz.png' }} style={styles.avatar} />

      {/* Mô tả */}
      <Text style={styles.description}>
        Thông tin sẽ được lưu cho lần mua kế tiếp. Bấm vào thông tin chi tiết để chỉnh sửa.
      </Text>

      {/* Form nhập liệu */}
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      {/* Nút lưu thông tin */}
      <TouchableOpacity style={styles.saveButton} onPress={() => console.log('Lưu thông tin')}>
        <Text style={styles.saveText}>LƯU THÔNG TIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
  header: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignSelf: 'center', marginVertical: 15 },
  description: { textAlign: 'center', color: 'gray', marginBottom: 20 },
  input: { backgroundColor: '#F3F3F3', padding: 12, borderRadius: 8, marginBottom: 10 },
  saveButton: { backgroundColor: '#888', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
