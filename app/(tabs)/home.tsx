import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../redux/slices/productSlice';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

interface Product {
  id: string; // Sửa thành string để khớp database
  name: string;
  price: number;
  size: string;
  origin: string;
  stock: string;
  image: string;
}

const HomeScreen: React.FC = () => {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.product);

  // State cho modal thêm/sửa
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [origin, setOrigin] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');

  // Lấy danh sách sản phẩm khi component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Mở modal để thêm sản phẩm
  const openAddModal = () => {
    setIsEditing(false);
    setName('');
    setPrice('');
    setSize('');
    setOrigin('');
    setStock('');
    setImage('');
    setModalVisible(true);
  };

  // Mở modal để sửa sản phẩm
  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setSize(product.size);
    setOrigin(product.origin);
    setStock(product.stock);
    setImage(product.image);
    setModalVisible(true);
  };

  // Xử lý thêm hoặc sửa sản phẩm
  const handleSaveProduct = async () => {
    if (!name || !price || !size || !origin || !stock || !image) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const productData = {
      name,
      price: parseFloat(price),
      size,
      origin,
      stock,
      image,
    };

    try {
      if (isEditing && currentProduct) {
        await dispatch(updateProduct({ ...productData, id: currentProduct.id })).unwrap();
        Alert.alert('Thành công', 'Sản phẩm đã được cập nhật!');
      } else {
        await dispatch(addProduct(productData)).unwrap();
        Alert.alert('Thành công', 'Sản phẩm đã được thêm!');
      }
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm!');
    }
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (id: string) => { // Sửa id thành string
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteProduct(id)).unwrap();
            Alert.alert('Thành công', 'Sản phẩm đã được xóa!');
          } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            Alert.alert('Lỗi', 'Không thể xóa sản phẩm!');
          }
        },
      },
    ]);
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setPrice('');
    setSize('');
    setOrigin('');
    setStock('');
    setImage('');
    setCurrentProduct(null);
  };

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
        <Image
          source={{ uri: 'https://i.pinimg.com/474x/9b/5e/03/9b5e03f0cb09cdb277f2c7ec994fe6db.jpg' }}
          style={styles.bannerImage}
        />
        <TouchableOpacity>
          <Text style={styles.bannerLink}>Xem hàng mới về →</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cây trồng</Text>
        <TouchableOpacity onPress={openAddModal}>
          <Ionicons name="add-circle" size={28} color="green" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id} // Không cần .toString() vì id đã là string
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <TouchableOpacity
                onPress={() => router.push(`/(tabs)/ProductDetailScreen?id=${item.id}`)}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
              </TouchableOpacity>
              <View style={styles.productActions}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Ionicons name="pencil" size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có sản phẩm nào!</Text>}
        />
      )}

      {/* Modal thêm/sửa sản phẩm */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên sản phẩm"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá (VND)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Kích cỡ"
              value={size}
              onChangeText={setSize}
            />
            <TextInput
              style={styles.input}
              placeholder="Xuất xứ"
              value={origin}
              onChangeText={setOrigin}
            />
            <TextInput
              style={styles.input}
              placeholder="Số lượng tồn kho"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="URL hình ảnh"
              value={image}
              onChangeText={setImage}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    <Ionicons name={icon} size={28} color={isActive ? '#27AE60' : 'gray'} />
    <Text style={[styles.navText, isActive && { color: '#27AE60' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  banner: { alignItems: 'center', marginBottom: 15 },
  bannerImage: { width: '100%', height: 150, borderRadius: 10 },
  bannerLink: { color: 'green', marginTop: 10, fontWeight: 'bold' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  flatListContent: { paddingBottom: 80 },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },
  productName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  productPrice: { fontSize: 14, color: 'green', fontWeight: 'bold' },
  productDetail: { fontSize: 12, color: 'gray', marginTop: 2 },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 5,
  },
  emptyText: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 3,
  },
});

export default HomeScreen;