import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function EditAddressScreen() {
  const route = useRoute();
  const { address } = route.params || {};
  const [name, setName] = useState(address?.name || '');
  const [country, setCountry] = useState(address?.country || '');
  const [city, setCity] = useState(address?.city || '');
  const [phone, setPhone] = useState(address?.phone || '');
  const [addressDetail, setAddressDetail] = useState(address?.addressDetail || '');
  const [isPrimary, setIsPrimary] = useState(address?.isPrimary || false);
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  const handleSaveAddress = async () => {
    if (!name || !country || !city || !phone || !addressDetail) {
      alert('Please fill in all fields');
      return;
    }

    const updatedAddress = {
      name,
      country,
      city,
      phone,
      addressDetail,
      isPrimary,
    };

    try {
      const response = await fetch(`http://192.168.1.3:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: updatedAddress }),
      });
      if (response.ok) {
        alert('Address updated successfully');
        navigation.navigate('Home', {
          screen: 'DrawerHome',
          params: { screen: 'CartTab' },
        });
      } else {
        alert('Error updating address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('An error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Address</Text>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter country"
            value={country}
            onChangeText={setCountry}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
          />
        </View>
      </View>
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={addressDetail}
        onChangeText={setAddressDetail}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Save as primary address</Text>
        <Switch
          value={isPrimary}
          onValueChange={setIsPrimary}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isPrimary ? '#6B48FF' : '#f4f3f4'}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
        <Text style={styles.saveButtonText}>Save Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  column: { flex: 1, marginRight: 10 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  switchLabel: { fontSize: 16, color: 'gray' },
  saveButton: {
    backgroundColor: '#6B48FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});