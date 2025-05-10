import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function WishlistScreen() {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const user = useSelector((state) => state.user.user);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetch('http://192.168.1.3:3000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, [isFocused]);

  const renderWishlistItem = ({ item }) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;
    return (
      <TouchableOpacity
        style={styles.wishlistItem}
        onPress={() => navigation.navigate('ProductDetail', { product })}
      >
        <Image source={{ uri: product.image }} style={styles.wishlistItemImage} />
        <View style={styles.wishlistItemDetails}>
          <Text style={styles.wishlistItemTitle}>{product.title}</Text>
          <Text style={styles.wishlistItemPrice}>${product.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>
      {wishlistItems.filter((item) => item.userId === user.id).length === 0 ? (
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
      ) : (
        <FlatList
          data={wishlistItems.filter((item) => item.userId === user.id)}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.productId.toString()}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  wishlistItem: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  wishlistItemImage: { width: 80, height: 80, borderRadius: 5 },
  wishlistItemDetails: { flex: 1, marginLeft: 10 },
  wishlistItemTitle: { fontSize: 16, fontWeight: 'bold' },
  wishlistItemPrice: { fontSize: 16, color: '#6B48FF', marginTop: 5 },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: 'gray' },
});