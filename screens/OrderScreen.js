import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function OrderScreen() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }

    fetch('http://192.168.1.3:3000/orders')
      .then((res) => res.json())
      .then((data) => {
        const userOrders = data.filter((order) => order.userId === user.id);
        setOrders(userOrders);
      })
      .catch((error) => console.error('Error fetching orders:', error));

    fetch('http://192.168.1.3:3000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, [user, navigation, isFocused]);

  const renderOrderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => navigation.navigate('OrderDetail', { order: item })}
      >
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderTotal}>Total: ${item.total}</Text>
        <FlatList
          data={item.products}
          keyExtractor={(product) => product.productId.toString()}
          renderItem={({ item: product }) => {
            const productDetails = products.find((p) => p.id === product.productId);
            if (!productDetails) return null;
            return (
              <View style={styles.productItem}>
                <Text style={styles.productTitle}>{productDetails.title}</Text>
                <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
              </View>
            );
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="gray" />
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
  orderItem: {
    margin: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  orderDate: { fontSize: 14, color: 'gray', marginVertical: 5 },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#6B48FF', marginBottom: 10 },
  productItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  productTitle: { fontSize: 14 },
  productQuantity: { fontSize: 14, color: 'gray' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: 'gray', marginTop: 10 },
});