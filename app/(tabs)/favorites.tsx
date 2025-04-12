import { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const products = [
  { id: '1', name: 'Cây kim ngân', type: 'Hybrid', price: 250000, stock: 156, image: 'https://i.pinimg.com/474x/1b/94/e2/1b94e2b1b028825741000e24363695c4.jpg' },
  { id: '2', name: 'Sen đá', type: 'Indoor', price: 200000, stock: 100, image: 'https://i.pinimg.com/736x/79/ba/70/79ba707732de608751ef345050b413ee.jpg' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TÌM KIẾM</Text>
      </View>

      {/* Ô nhập tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập từ khóa..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
      </View>

      {/* Danh sách kết quả tìm kiếm */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem}//  onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name} | {item.type}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
              <Text style={styles.productStock}>Còn {item.stock} sp</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
  searchInput: { flex: 1, height: 40, fontSize: 16 },
  searchIcon: { marginLeft: 10 },
  productItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10 },
  productImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productPrice: { fontSize: 14, color: 'green', fontWeight: 'bold' },
  productStock: { fontSize: 12, color: 'gray' },
});
