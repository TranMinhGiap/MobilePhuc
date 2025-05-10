import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';

export default function ProfileScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const stackNavigation = useNavigation();

  useEffect(() => {
    if (user) {
      fetch('http://192.168.1.3:3000/orders')
        .then((res) => res.json())
        .then((data) => {
          const userOrders = data.filter((order) => order.userId === user.id);
          setOrderCount(userOrders.length);
        })
        .catch((error) => console.error('Error fetching orders:', error));
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    stackNavigation.navigate('SignIn');
    navigation.closeDrawer(); // Use navigation prop for drawer
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Account Information', screen: 'AccountInfo' },
    { icon: 'lock-closed-outline', title: 'Password', screen: 'Password' },
    { icon: 'cart-outline', title: 'Order', screen: 'Order' },
    { icon: 'card-outline', title: 'My Cards', screen: 'MyCards' },
    { icon: 'heart-outline', title: 'Wishlist', screen: 'Wishlist' },
    { icon: 'settings-outline', title: 'Settings', screen: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {user?.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={60}
            color="#ccc"
            style={styles.avatarIcon}
          />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.fullName || 'Guest'}</Text>
          <Text style={styles.userStatus}>
            Verified profile • {orderCount} Order{orderCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Ionicons name="moon-outline" size={24} color="black" />
          <Text style={styles.menuText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            style={styles.switch}
          />
        </View>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.menuItem}
            onPress={() => stackNavigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={24} color="black" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={24} color="gray" style={styles.arrow} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  avatarIcon: {
    marginRight: 15,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  userStatus: { fontSize: 14, color: 'gray' },
  menu: { padding: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 10 },
  switch: { marginLeft: 10 },
  arrow: { marginLeft: 10 },
  logoutButton: {
    margin: 20,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: 'red' },
});