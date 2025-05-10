import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function OrderConfirmationScreen({ route }) {
  const { orderId } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'DrawerHome',
              params: { screen: 'MainHome' },
            })
          }
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmed</Text>
      </View>
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://tse2.mm.bing.net/th/id/OIP.RIq-gv6pJbvLEc4vCjLS6wHaEX?pid=ImgDet&w=185&h=108&c=7&dpr=1.3' }}
          style={styles.phoneImage}
        />
        <View style={styles.checkIcon}>
          <Ionicons name="checkmark-circle" size={60} color="#6B48FF" />
        </View>
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your order has been confirmed, we will send you confirmation email shortly.
        </Text>
        <Text style={styles.orderIdLabel}>Order ID</Text>
        <Text style={styles.orderId}>{orderId}</Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'DrawerHome',
              params: { screen: 'MainHome' },
            })
          }
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
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
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  phoneImage: { width: 150, height: 300, resizeMode: 'contain' },
  checkIcon: { position: 'absolute', top: '40%' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 20 },
  orderIdLabel: { fontSize: 16, color: 'gray' },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  continueButton: {
    backgroundColor: '#6B48FF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});