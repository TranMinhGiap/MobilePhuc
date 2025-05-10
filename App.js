import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import store from './redux/store';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import WishlistScreen from './screens/WishlistScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderScreen from './screens/OrderScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import AddressScreen from './screens/AddressScreen';
import EditAddressScreen from './screens/EditAddressScreen';
import SimpleProfileScreen from './screens/SimpleProfileScreen';
import EditCartItemScreen from './screens/EditCartItemScreen';
import { useSelector } from 'react-redux';

enableScreens();

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'MainHome') iconName = 'home';
          else if (route.name === 'WishlistTab') iconName = 'heart';
          else if (route.name === 'CartTab') iconName = 'cart';
          else if (route.name === 'SimpleProfile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6B48FF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="MainHome" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScreen}
        options={{
          title: 'Wishlist',
          tabBarBadge: wishlistItems.length > 0 ? wishlistItems.length : null,
          tabBarBadgeStyle: { backgroundColor: '#6B48FF', color: 'white' },
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : null,
          tabBarBadgeStyle: { backgroundColor: '#6B48FF', color: 'white' },
        }}
      />
      <Tab.Screen name="SimpleProfile" component={SimpleProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <ProfileScreen {...props} />}>
      <Drawer.Screen
        name="DrawerHome"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={DrawerNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
          <Stack.Screen name="Address" component={AddressScreen} />
          <Stack.Screen name="EditAddress" component={EditAddressScreen} />
          <Stack.Screen name="EditCartItem" component={EditCartItemScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}