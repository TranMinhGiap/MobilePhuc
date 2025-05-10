import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../redux/userSlice';
import { clearCart } from '../redux/cartSlice';
import { setWishlist } from '../redux/wishlistSlice'; // Thay clearWishlist thành setWishlist

export default function SimpleProfileScreen() {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState(null);
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (user) {
      fetch(`http://192.168.1.3:3000/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((error) => console.error('Error fetching user:', error));

      fetch(`http://192.168.1.3:3000/orders?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrders(sortedOrders);
        })
        .catch((error) => console.error('Error fetching orders:', error));
    }
  }, [user, isFocused]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(setWishlist([])); 
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  const handleAddAddress = () => {
    navigation.navigate('Address');
  };

  const avatarSource = userData?.avatar
    ? { uri: userData.avatar }
    : { uri: 'https://via.placeholder.com/100' };

  const recentOrders = orders.slice(0, 4);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Order #{item.id}</Text>
      <Text style={styles.orderDate}>Date: {item.date}</Text>
      <Text style={styles.orderTotal}>Total: ${item.total}</Text>
    </View>
  );

  const windowHeight = Dimensions.get('window').height;
  const headerHeight = 60; 
  const profileHeight = 120; 
  const addressHeight = userData?.address ? 120 : 80; 
  const ordersHeaderHeight = 50; 
  const logoutButtonHeight = 70; 
  const paddingAndMargins = 60; 
  const flatListHeight = windowHeight - (headerHeight + profileHeight + addressHeight + ordersHeaderHeight + logoutButtonHeight + paddingAndMargins);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={avatarSource}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userData?.fullName || 'User'}</Text>
          <Text style={styles.profileOrders}>
            Verified profile • {orders.length} Orders
          </Text>
        </View>
      </View>
      <View style={styles.addressContainer}>
        <View style={styles.addressHeader}>
          <Ionicons name="information-circle-outline" size={24} color="#6B48FF" />
          <Text style={styles.sectionTitle}>Thông tin chung</Text>
        </View>
        {userData?.address ? (
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>Name: {userData.address.name}</Text>
            <Text style={styles.addressText}>
              Address: {userData.address.addressDetail}, {userData.address.city}, {userData.address.country}
            </Text>
            <Text style={styles.addressText}>Phone: {userData.address.phone}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.addAddressButton} onPress={handleAddAddress}>
            <Ionicons name="add-circle-outline" size={20} color="#FF4D4D" />
            <Text style={styles.addAddressText}>Thêm thông tin</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.ordersContainer}>
        <View style={styles.ordersHeader}>
          <Ionicons name="cart-outline" size={24} color="#6B48FF" />
          <Text style={styles.sectionTitle}>Recent Orders</Text>
        </View>
        {recentOrders.length > 0 ? (
          <FlatList
            data={recentOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            style={[styles.orderList, { height: flatListHeight }]}
            showsVerticalScrollIndicator={true}
          />
        ) : (
          <Text style={styles.noOrdersText}>No recent orders</Text>
        )}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6B48FF' },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  profileOrders: { fontSize: 14, color: 'gray' },
  addressContainer: { marginBottom: 30 },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B48FF',
    marginLeft: 10,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  addressText: { fontSize: 16, color: '#333', marginBottom: 5 },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF4D4D',
    borderRadius: 10,
    padding: 10,
    marginLeft: 34,
  },
  addAddressText: { fontSize: 16, color: '#FF4D4D', marginLeft: 5 },
  ordersContainer: { flex: 1, marginBottom: 20 },
  ordersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderList: { 
    flexGrow: 0, 
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
  },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  orderDate: { fontSize: 14, color: 'gray', marginVertical: 5 },
  orderTotal: { fontSize: 14, color: '#6B48FF' },
  noOrdersText: { fontSize: 16, color: 'gray', marginLeft: 34 },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});