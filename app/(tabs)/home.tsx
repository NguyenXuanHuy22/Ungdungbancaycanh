import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const apiUrl = "http://192.168.1.131:3000/products";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await axios.get<Product[]>(apiUrl);
        setList(res.data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    getList();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Planta - tỏa sáng không gian nhà bạn</Text>
        <TouchableOpacity onPress={() => router.push('/favorites')}>
          <Ionicons name="search" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Image source={{ uri: 'https://i.pinimg.com/474x/9b/5e/03/9b5e03f0cb09cdb277f2c7ec994fe6db.jpg' }} style={styles.bannerImage} />
        <TouchableOpacity>
          <Text style={styles.bannerLink}>Xem hàng mới về →</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <Text style={styles.sectionTitle}>Cây trồng</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.productCard} 
              onPress={() => router.push(`/(tabs)/ProductDetailScreen?id=${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price} đ</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Trang chủ" onPress={() => router.push('/home')} isActive />
        <NavItem icon="cart-outline" label="Giỏ hàng" onPress={() => router.push('/cart')} />
        <NavItem icon="person-outline" label="Hồ sơ" onPress={() => router.push('/profile')} />
      </View>
    </View>
  );
};

// Component Nav Item
const NavItem = ({ icon, label, onPress, isActive = false }: { icon: any; label: string; onPress: () => void; isActive?: boolean }) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <Ionicons name={icon} size={28} color={isActive ? '#27AE60' : 'gray'} />
    <Text style={[styles.navText, isActive && { color: '#27AE60' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerText: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  banner: { alignItems: 'center', marginBottom: 15 },
  bannerImage: { width: '100%', height: 150, borderRadius: 10 },
  bannerLink: { color: 'green', marginTop: 10, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  productCard: { flex: 1, margin: 5, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, alignItems: 'center' },
  productImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productPrice: { fontSize: 14, color: 'green', fontWeight: 'bold' },

  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: 'gray', marginTop: 3 },
});

export default HomeScreen;
