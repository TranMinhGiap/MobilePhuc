import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem } from '../redux/cartSlice';

export default function EditCartItemScreen({ route }) {
  const { cartItem, product } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [selectedSize, setSelectedSize] = useState(cartItem.size);
  const [selectedColor, setSelectedColor] = useState(cartItem.color);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const handleUpdateCart = () => {
    if (quantity > product.quantity) {
      alert('Quantity exceeds available stock!');
      return;
    }
    dispatch(updateCartItem({
      userId: user.id,
      productId: product.id,
      oldSize: cartItem.size, // Giá trị size ban đầu
      oldColor: cartItem.color, // Giá trị color ban đầu
      size: selectedSize, // Giá trị size mới
      color: selectedColor, // Giá trị color mới
      quantity,
    }));
    navigation.navigate('Home', {
      screen: 'DrawerHome',
      params: { screen: 'CartTab' },
    });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    if (newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    } else {
      alert('Quantity exceeds available stock!');
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Cart Item</Text>
      </View>
      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>${product.price} x {quantity} = ${totalPrice.toFixed(2)}</Text>
          <View style={styles.sizeContainer}>
            <Text style={styles.label}>Size</Text>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeButton, selectedSize === size && styles.selectedSizeButton]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={styles.sizeText}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.label}>Color</Text>
            {product.colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, selectedColor === color && styles.selectedColorButton]}
                onPress={() => setSelectedColor(color)}
              >
                <Text style={styles.colorText}>{color}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.label}>Quantity (Available: {product.quantity})</Text>
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
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateCart}>
          <Text style={styles.updateButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
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
  productImage: { width: '100%', height: 300, resizeMode: 'cover' },
  productInfo: { padding: 20 },
  productTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  productPrice: { fontSize: 20, color: '#6B48FF', marginBottom: 20 },
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
  updateButton: {
    backgroundColor: '#6B48FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});