import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params || {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Kiểm tra xem product có tồn tại và có các thuộc tính cần thiết không
  if (!product || !product.id) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : 'Black'
  );
  const [quantity, setQuantity] = useState(1);

  const isInWishlist = wishlistItems.some(
    (item) => item.userId === user?.id && item.productId === product.id
  );

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please sign in to add items to wishlist');
      navigation.navigate('SignIn');
      return;
    }
    dispatch(toggleWishlist({ userId: user.id, productId: product.id }));
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Please sign in to add items to cart');
      navigation.navigate('SignIn');
      return;
    }
    dispatch(
      addToCart({
        userId: user.id,
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
    );
    navigation.navigate('Home', {
      screen: 'DrawerHome',
      params: { screen: 'CartTab' },
    });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Detail</Text>
        <TouchableOpacity onPress={handleWishlistToggle}>
          <Ionicons
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={isInWishlist ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/300' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title || 'Unknown Product'}</Text>
          <Text style={styles.productPrice}>${product.price || 0}</Text>
          <Text style={styles.productDescription}>
            {product.description || 'No description available.'}
          </Text>
          <View style={styles.sizeContainer}>
            <Text style={styles.label}>Size</Text>
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeButton, selectedSize === size && styles.selectedSizeButton]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={styles.sizeText}>{size}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noOptionsText}>No sizes available</Text>
            )}
          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.label}>Color</Text>
            {product.colors && product.colors.length > 0 ? (
              product.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorButton, selectedColor === color && styles.selectedColorButton]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={styles.colorText}>{color}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noOptionsText}>No colors available</Text>
            )}
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity onPress={() => handleQuantityChange(-1)}>
                <Ionicons name="remove-circle" size={24} color="gray" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantityChange(1)}>
                <Ionicons name="add-circle" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  productImage: { width: '100%', height: 300, resizeMode: 'cover' },
  productInfo: { padding: 20 },
  productTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  productPrice: { fontSize: 20, color: '#6B48FF', marginBottom: 10 },
  productDescription: { fontSize: 16, color: 'gray', marginBottom: 20 },
  sizeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  colorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  selectedSizeButton: { backgroundColor: '#6B48FF', borderColor: '#6B48FF' },
  sizeText: { fontSize: 16 },
  colorButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  selectedColorButton: { backgroundColor: '#6B48FF', borderColor: '#6B48FF' },
  colorText: { fontSize: 16 },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { fontSize: 16, marginHorizontal: 10 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: '#6B48FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
  noOptionsText: { fontSize: 14, color: 'gray' },
});