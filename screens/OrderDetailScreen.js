import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function OrderDetailScreen() {
  const route = useRoute();
  const { order } = route.params || {};
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    fetch('http://192.168.1.3:3000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));

    if (user) {
      fetch(`http://192.168.1.3:3000/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((error) => console.error('Error fetching user:', error));
    }
  }, [user]);

  const renderProductItem = ({ item }) => {
    if (!item || !item.productId) return null;
    const productDetails = products.find((p) => p.id === item.productId);
    if (!productDetails) return null;
    return (
      <View style={styles.productItem}>
        <Image
          source={{ uri: productDetails.image }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{productDetails.title}</Text>
          <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
          <Text style={styles.productPrice}>${productDetails.price * item.quantity}</Text>
        </View>
      </View>
    );
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order.id} Details</Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={styles.orderLabel}>Order Date:</Text>
        <Text style={styles.orderValue}>{order.date}</Text>
        <Text style={styles.orderLabel}>Total:</Text>
        <Text style={styles.orderValue}>${order.total}</Text>
        <Text style={styles.orderLabel}>Delivery Address:</Text>
        {userData?.address ? (
          <>
            <Text style={styles.orderValue}>Name: {userData.address.name}</Text>
            <Text style={styles.orderValue}>
              Address: {userData.address.addressDetail}, {userData.address.city}, {userData.address.country}
            </Text>
            <Text style={styles.orderValue}>Phone: {userData.address.phone}</Text>
          </>
        ) : (
          <Text style={styles.orderValue}>N/A</Text>
        )}
      </View>
      <Text style={styles.sectionTitle}>Products</Text>
      <FlatList
        data={order.products || []}
        renderItem={renderProductItem}
        keyExtractor={(item) => item?.productId?.toString() || Math.random().toString()}
        style={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  orderInfo: { padding: 20 },
  orderLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  orderValue: { fontSize: 16, color: 'gray', marginBottom: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, marginTop: 10 },
  productList: { padding: 20 },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  productImage: { width: 80, height: 80, borderRadius: 5 },
  productInfo: { flex: 1, marginLeft: 10 },
  productTitle: { fontSize: 16, fontWeight: 'bold' },
  productQuantity: { fontSize: 14, color: 'gray', marginVertical: 5 },
  productPrice: { fontSize: 16, color: '#6B48FF' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red' },
});