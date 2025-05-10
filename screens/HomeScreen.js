import React, { useEffect, useState, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }

    const fetchData = async () => {
      try {
        setError(null);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('http://192.168.1.3:3000/products'),
          fetch('http://192.168.1.3:3000/categories'),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load data. Please check your network and try again.');
      }
    };

    fetchData();
  }, [dispatch, user, navigation, isFocused]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    let filtered = products;
    if (query.trim() !== '') {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    setFilteredProducts(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    let filtered = products;
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  };

  const handleWishlistToggle = (productId) => {
    if (!user) {
      alert('Please sign in to add items to wishlist');
      navigation.navigate('SignIn');
      return;
    }
    dispatch(toggleWishlist({ userId: user.id, productId }));
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please sign in to add items to cart');
      navigation.navigate('SignIn');
      return;
    }
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Black';
    dispatch(addToCart({ userId: user.id, productId: product.id, size: defaultSize, color: defaultColor, quantity: 1 }));
  };

  const ProductItem = memo(
    ({ item }) => {
      if (!user || !item) return null;
      const isInWishlist = wishlistItems.some(
        (w) => w.userId === user.id && w.productId === item.id
      );
      return (
        <TouchableOpacity
          style={styles.productItem}
          onPress={() => {
            if (!item.id || !item.title || !item.image) {
              alert('Invalid product data');
              return;
            }
            navigation.navigate('ProductDetail', { product: item });
          }}
        >
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/150' }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title || 'Unknown Product'}
            </Text>
            <Text style={styles.productPrice}>${item.price || 0}</Text>
          </View>
          <TouchableOpacity
            style={styles.wishlistIcon}
            onPress={() => handleWishlistToggle(item.id)}
          >
            <Ionicons
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={24}
              color={isInWishlist ? 'red' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addToCartIcon}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="cart-outline" size={24} color="gray" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
  );

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hello {user?.fullName}, Welcome to Laza.</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'DrawerHome',
              params: { screen: 'CartTab' },
            })
          }
        >
          <Ionicons name="cart-outline" size={30} color="black" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Choose Brand</Text>
      </View>
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && styles.categoryButtonSelected,
                ]}
                onPress={() => handleCategoryFilter(category.name)}
              >
                <Image source={{ uri: category.logo }} style={styles.categoryLogo} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No brands available</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.newArrivalContainer}>
        <Text style={styles.sectionTitle}>New Arrival</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => handleCategoryFilter(null)}
        >
          <Text style={styles.viewAllButtonText}>View All</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="red" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              fetchData();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="gray" />
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginLeft: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: { marginLeft: 10 },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAllButton: { padding: 5 },
  viewAllButtonText: { fontSize: 16, color: '#6B48FF' },
  categoryWrapper: {
    height: 60,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryButton: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 80,
    height: 35,
  },
  categoryButtonSelected: { backgroundColor: '#e0e0e0' },
  categoryLogo: { width: 60, height: 30, resizeMode: 'contain' },
  newArrivalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  columnWrapper: { justifyContent: 'space-between' },
  productItem: {
    flex: 1,
    margin: 5,
    maxWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: { width: '100%', height: 200, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  productInfo: { padding: 10, height: 80 },
  productTitle: { fontSize: 14, marginBottom: 5, height: 40 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#6B48FF' },
  wishlistIcon: { position: 'absolute', top: 10, right: 10 },
  addToCartIcon: { position: 'absolute', bottom: 10, right: 10 },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#6B48FF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { color: '#fff', fontSize: 12 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: 'gray', marginTop: 10 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  errorText: { fontSize: 16, color: 'red', marginTop: 10, textAlign: 'center' },
  retryButton: {
    backgroundColor: '#6B48FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  retryButtonText: { color: '#fff', fontSize: 16 },
});