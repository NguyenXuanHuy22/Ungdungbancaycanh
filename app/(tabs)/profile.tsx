import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>PROFILE</Text>

      {/* Thông tin người dùng */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://i.imgur.com/6Vxi5Kz.png' }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>Nguyễn Xuân Huy</Text>
          <Text style={styles.userEmail}>Huynxph52088@gmail.com</Text>
        </View>
      </View>

      {/* Danh sách chức năng */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Chung</Text>
        <MenuItem title="Chỉnh sửa thông tin" onPress={() => router.push('/edit')} />
        <MenuItem title="Cẩm nang trồng cây" onPress={() => router.push('/guide')} />
        <MenuItem title="Lịch sử giao dịch" onPress={() => router.push('/history')} />
        <MenuItem title="Q & A" onPress={() => router.push('/qa')} />

        <Text style={styles.sectionTitle}>Bảo mật và Điều khoản</Text>
        <MenuItem title="Điều khoản và điều kiện" onPress={() => router.push('/terms')} />
        <MenuItem title="Chính sách quyền riêng tư" onPress={() => router.push('/privacy')} />

        <TouchableOpacity onPress={() => console.log('Đăng xuất')} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Trang chủ" onPress={() => router.push('/home')} />
        <NavItem icon="cart-outline" label="Giỏ hàng" onPress={() => router.push('/cart')} />
        <NavItem icon="person" label="Hồ sơ" onPress={() => router.push('/profile')} isActive />
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
const NavItem = ({ icon, label, onPress, isActive = false }: { icon: any; label: string; onPress: () => void; isActive?: boolean }) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <Ionicons name={icon} size={28} color={isActive ? '#27AE60' : 'gray'} />
    <Text style={[styles.navText, isActive && { color: '#27AE60' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  profileContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: 'gray' },
  menuContainer: { marginTop: 10, flex: 1 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: 'gray', marginTop: 15, marginBottom: 5 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 16 },
  logoutButton: { marginTop: 20 },
  logoutText: { fontSize: 16, color: 'red', fontWeight: 'bold' },
  
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
    elevation: 5, // Hiệu ứng nổi
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: 'gray', marginTop: 3 },
});
